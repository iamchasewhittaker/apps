#!/usr/bin/env python3
"""
import-kml.py — Parse the Google Earth KML, download all head photos at s1024,
rename legacy H3-* photo folders to Z3-S* (preserving the 5 originals at their
new N→S positions Z3-S7..Z3-S11), and write docs/heads/sprinklers.json manifest.

Run from portfolio/fairway-ios/:
    python3 tools/import-kml.py

Stdlib only (no pip installs needed).

KML source (locked 2026-04-25):
    docs/Sprinklers Google Earth (1).kml — 41 placemarks
    (legacy 23-pin file at docs/Sprinklers.kml is kept for archival only)

Color → zone rule:
    d32f2f (red)        → Zone 3 (side yard)
    no/unknown color    → Zone 4 (back yard)
    everything else     → Zone 2 (front yard + park strip)

Label assignment:
    Z2 numbered park-strip pins  → Z2-MATCH-1st..6th
        (visual matching to the 6 seeded Z2-S1..Z2-S6 heads is still pending)
    Z2 color-named front pins    → Z2-S7..Z2-S18  (sorted N→S by lat)
    Z3 red side-yard pins (11)   → Z3-S1..Z3-S11  (sorted N→S by lat)
    Z4 white back-yard pins (12) → Z4-S1..Z4-S12  (sorted N→S by lat)

Legacy migration (one-time, idempotent):
    The original 5 red pins were labeled H3-1..H3-5. They are still present
    at the same lat/lon in the new KML — but renumbering N→S among 11 pins
    pushes them to Z3-S7..Z3-S11. Existing photo folders are renamed
    accordingly before fresh downloads run.
"""

import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

SCRIPT_DIR = Path(__file__).parent
REPO_DIR = SCRIPT_DIR.parent
KML_PATH = REPO_DIR / "docs" / "Sprinklers Google Earth (1).kml"
HEADS_DIR = REPO_DIR / "docs" / "heads"
MANIFEST_PATH = HEADS_DIR / "sprinklers.json"
PHOTO_SIZE = "1024"

KML_NS = "http://www.opengis.net/kml/2.2"
GX_NS = "http://www.google.com/kml/ext/2.2"
KML_ID_ATTR = f"{{{KML_NS}}}id"

ZONE3_COLOR = "d32f2f"
NUMBERED_RE = re.compile(r"^\d+(?:st|nd|rd|th) Sprinkler$", re.IGNORECASE)
COLOR_RE = re.compile(r"[?&]color=([0-9a-fA-F]+)")

# H3-N → Z3-S(N+6): the legacy 5 are the southernmost of the 11
LEGACY_H3_RENAMES = {f"H3-{i}": f"Z3-S{i + 6}" for i in range(1, 6)}


def q(ns, tag):
    return f"{{{ns}}}{tag}"


def parse_color_from_href(href):
    m = COLOR_RE.search(href)
    return m.group(1).lower() if m else None


def build_style_tables(doc):
    cascading = {}
    for cs in doc.iter(q(GX_NS, "CascadingStyle")):
        sid = cs.get(KML_ID_ATTR) or cs.get("id")
        if not sid:
            continue
        href_el = cs.find(f".//{q(KML_NS, 'Icon')}/{q(KML_NS, 'href')}")
        if href_el is not None and href_el.text:
            color = parse_color_from_href(href_el.text)
            if color:
                cascading[sid] = color

    style_maps = {}
    for sm in doc.iter(q(KML_NS, "StyleMap")):
        sid = sm.get("id")
        if not sid:
            continue
        for pair in sm.findall(q(KML_NS, "Pair")):
            key_el = pair.find(q(KML_NS, "key"))
            url_el = pair.find(q(KML_NS, "styleUrl"))
            if key_el is not None and key_el.text == "normal" and url_el is not None:
                style_maps[sid] = url_el.text.lstrip("#")
                break

    return cascading, style_maps


def resolve_color(style_url, cascading, style_maps):
    sid = style_url.lstrip("#")
    if sid in cascading:
        return cascading[sid]
    if sid in style_maps:
        return cascading.get(style_maps[sid])
    return None


def parse_placemarks(doc, cascading, style_maps):
    results = []
    for pm in doc.iter(q(KML_NS, "Placemark")):
        name_el = pm.find(q(KML_NS, "name"))
        name = name_el.text.strip() if name_el is not None and name_el.text else "Unknown"

        style_url_el = pm.find(q(KML_NS, "styleUrl"))
        color = None
        if style_url_el is not None and style_url_el.text:
            color = resolve_color(style_url_el.text, cascading, style_maps)

        coords_el = pm.find(f".//{q(KML_NS, 'coordinates')}")
        lat = lon = alt = None
        if coords_el is not None and coords_el.text:
            parts = coords_el.text.strip().split(",")
            if len(parts) >= 2:
                try:
                    lon = float(parts[0])
                    lat = float(parts[1])
                    alt = float(parts[2]) if len(parts) > 2 else 0.0
                except ValueError:
                    pass

        photo_urls = []
        for img in pm.iter(q(GX_NS, "imageUrl")):
            if img.text:
                url = img.text.strip().replace("s{size}", f"s{PHOTO_SIZE}")
                photo_urls.append(url)

        if color == ZONE3_COLOR:
            zone = 3
        elif color is None:
            zone = 4
        else:
            zone = 2

        is_numbered = bool(NUMBERED_RE.match(name)) if zone == 2 else False

        results.append({
            "kml_name": name,
            "color": color or "unknown",
            "zone": zone,
            "is_numbered": is_numbered,
            "lat": lat,
            "lon": lon,
            "alt_m": alt,
            "photo_urls": photo_urls,
        })

    return results


def assign_labels(placemarks):
    """
    - Z2 numbered (park strip) → Z2-MATCH-<slug> (visual match still pending)
    - Z2 color-named (front yard) → Z2-S7..Z2-S18 sorted N→S
    - Z3 (red, side yard)        → Z3-S1..Z3-S11 sorted N→S
    - Z4 (no-color, back yard)   → Z4-S1..Z4-S12 sorted N→S
    """
    z2_color = sorted(
        [p for p in placemarks if p["zone"] == 2 and not p["is_numbered"]],
        key=lambda p: -(p["lat"] or 0),
    )
    z2_numbered = [p for p in placemarks if p["zone"] == 2 and p["is_numbered"]]
    z3 = sorted(
        [p for p in placemarks if p["zone"] == 3],
        key=lambda p: -(p["lat"] or 0),
    )
    z4 = sorted(
        [p for p in placemarks if p["zone"] == 4],
        key=lambda p: -(p["lat"] or 0),
    )

    labeled = []

    for i, p in enumerate(z2_color, 7):
        labeled.append({**p, "label": f"Z2-S{i}"})

    for p in z2_numbered:
        slug = p["kml_name"].split()[0].lower()
        labeled.append({**p, "label": f"Z2-MATCH-{slug}"})

    for i, p in enumerate(z3, 1):
        labeled.append({**p, "label": f"Z3-S{i}"})

    for i, p in enumerate(z4, 1):
        labeled.append({**p, "label": f"Z4-S{i}"})

    return labeled


def migrate_legacy_h3_folders():
    """Rename docs/heads/H3-{1..5} → docs/heads/Z3-S{7..11}. Idempotent."""
    moved = []
    for old_label, new_label in LEGACY_H3_RENAMES.items():
        src = HEADS_DIR / old_label
        dst = HEADS_DIR / new_label
        if src.exists() and not dst.exists():
            src.rename(dst)
            moved.append((old_label, new_label))
        elif src.exists() and dst.exists():
            print(f"  WARN: both {old_label} and {new_label} exist — leaving {old_label} in place; please resolve manually", file=sys.stderr)
    if moved:
        print(f"  Renamed {len(moved)} legacy H3-* folder(s) → Z3-S*:")
        for old, new in moved:
            print(f"    {old} → {new}")
    else:
        print("  No legacy H3-* folders to rename (already migrated or never created).")


def download_photos(head):
    label = head["label"]
    folder = HEADS_DIR / label
    folder.mkdir(parents=True, exist_ok=True)

    saved = []
    for i, url in enumerate(head["photo_urls"], 1):
        dest = folder / f"photo-{i}.jpg"
        rel = str(dest.relative_to(REPO_DIR / "docs"))

        if dest.exists():
            print(f"    [skip] {label}/photo-{i}.jpg already exists")
            saved.append(rel)
            continue

        print(f"    Downloading {label}/photo-{i}.jpg …", end=" ", flush=True)
        try:
            result = subprocess.run(
                ["curl", "-s", "-L", "--output", str(dest), url],
                capture_output=True,
                timeout=60,
            )
            if result.returncode != 0 or not dest.exists() or dest.stat().st_size < 1024:
                if dest.exists():
                    dest.unlink()
                print(f"ERROR (curl exit {result.returncode})", file=sys.stderr)
            else:
                print(f"{dest.stat().st_size // 1024} KB")
                saved.append(rel)
        except Exception as exc:
            print(f"ERROR: {exc}", file=sys.stderr)

    return saved


def main():
    HEADS_DIR.mkdir(parents=True, exist_ok=True)

    print("Migrating legacy H3-* folders …")
    migrate_legacy_h3_folders()

    print(f"\nParsing {KML_PATH.name} …")
    tree = ET.parse(KML_PATH)
    doc = tree.getroot()

    cascading, style_maps = build_style_tables(doc)
    print(f"  {len(cascading)} CascadingStyles, {len(style_maps)} StyleMaps resolved")

    placemarks = parse_placemarks(doc, cascading, style_maps)
    heads = assign_labels(placemarks)

    z2_color_ct = sum(1 for h in heads if h["zone"] == 2 and not h["is_numbered"])
    z2_num_ct = sum(1 for h in heads if h["zone"] == 2 and h["is_numbered"])
    z3_ct = sum(1 for h in heads if h["zone"] == 3)
    z4_ct = sum(1 for h in heads if h["zone"] == 4)
    print(f"  {len(heads)} placemarks: Z2 front-yard={z2_color_ct}, Z2 park-strip={z2_num_ct}, Z3={z3_ct}, Z4={z4_ct}")

    manifest_heads = []
    for h in heads:
        print(f"\n[{h['label']}] '{h['kml_name']}' color={h['color']} lat={h['lat']:.7f}")
        saved = download_photos(h)
        manifest_heads.append({
            "label": h["label"],
            "kml_name": h["kml_name"],
            "kml_color": h["color"],
            "zone": h["zone"],
            "is_numbered_pin": h["is_numbered"],
            "lat": h["lat"],
            "lon": h["lon"],
            "alt_m": h["alt_m"],
            "photo_paths": saved,
            "photo_source_urls": h["photo_urls"],
        })

    manifest = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "source_kml": "docs/Sprinklers Google Earth (1).kml",
        "photo_size": PHOTO_SIZE,
        "note": (
            "Z2-MATCH-* labels need visual matching via photo-2 placement shots. "
            "Z2-S7..Z2-S18 are front-yard color-named pins sorted N→S. "
            "Z3-S1..Z3-S11 are side-yard red pins sorted N→S "
            "(legacy H3-1..H3-5 → Z3-S7..Z3-S11). "
            "Z4-S1..Z4-S12 are back-yard no-color pins sorted N→S."
        ),
        "heads": manifest_heads,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
    print(f"\nManifest written → {MANIFEST_PATH}")

    match_needed = [h["label"] for h in heads if h["label"].startswith("Z2-MATCH")]
    print(f"Park-strip pins needing visual match to Z2-S1..Z2-S6: {match_needed}")
    print("Open docs/heads/<Z2-MATCH-*>/photo-2.jpg for each and match to seed head descriptions.")


if __name__ == "__main__":
    main()
