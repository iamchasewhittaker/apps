#!/usr/bin/env python3
"""
import-kml.py — Parse docs/Sprinklers.kml, download all head photos at s1024,
and write docs/heads/sprinklers.json manifest.

Run from portfolio/fairway-ios/:
    python3 tools/import-kml.py

Stdlib only (no pip installs needed).

Overhead layout confirmed 2026-04-24:
  - ALL 6 numbered pins (1st–6th Sprinkler) = park strip heads
  - ALL 12 color-named pins = front yard heads
  - Zone 3 (red) = west side yard — "B bred" visible + 4 more off-frame north

Zone 2 assignment:
  - Z2-S1..S6 = the 6 numbered park-strip pins (matched by photo-2 visual context, not pin order)
  - Z2-S7..S18 = the 12 color-named front-yard pins (sorted N→S by latitude)

Zone 3 assignment:
  - H3-1..H3-5 = 5 red pins sorted N→S by latitude
"""

import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

SCRIPT_DIR = Path(__file__).parent
REPO_DIR = SCRIPT_DIR.parent
KML_PATH = REPO_DIR / "docs" / "Sprinklers.kml"
HEADS_DIR = REPO_DIR / "docs" / "heads"
MANIFEST_PATH = HEADS_DIR / "sprinklers.json"
PHOTO_SIZE = "1024"

KML_NS = "http://www.opengis.net/kml/2.2"
GX_NS = "http://www.google.com/kml/ext/2.2"
KML_ID_ATTR = f"{{{KML_NS}}}id"

ZONE3_COLOR = "d32f2f"
NUMBERED_RE = re.compile(r"^\d+(?:st|nd|rd|th) Sprinkler$", re.IGNORECASE)
COLOR_RE = re.compile(r"[?&]color=([0-9a-fA-F]+)")


def q(ns, tag):
    return f"{{{ns}}}{tag}"


def parse_color_from_href(href):
    m = COLOR_RE.search(href)
    return m.group(1).lower() if m else None


def build_style_tables(doc):
    """
    Returns:
      cascading: {style_id: color_hex}  — from gx:CascadingStyle
      style_maps: {style_map_id: normal_style_id}  — from StyleMap normal pairs
    """
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

        zone = 3 if color == ZONE3_COLOR else 2
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
    - Zone 3 (red): H3-1..H3-5, sorted N→S
    - Zone 2 color-named (front yard): Z2-S7..S18, sorted N→S
    - Zone 2 numbered (park strip): Z2-MATCH-1st etc. — need visual photo-2 matching
    """
    z3 = sorted(
        [p for p in placemarks if p["zone"] == 3],
        key=lambda p: -(p["lat"] or 0),
    )
    z2_color = sorted(
        [p for p in placemarks if p["zone"] == 2 and not p["is_numbered"]],
        key=lambda p: -(p["lat"] or 0),
    )
    z2_numbered = [p for p in placemarks if p["zone"] == 2 and p["is_numbered"]]

    labeled = []

    for i, p in enumerate(z3, 1):
        labeled.append({**p, "label": f"H3-{i}"})

    for i, p in enumerate(z2_color, 7):
        labeled.append({**p, "label": f"Z2-S{i}"})

    for p in z2_numbered:
        # Strip ordinal suffix to get a short slug (e.g. "1st Sprinkler" → "1st")
        slug = p["kml_name"].split()[0].lower()
        labeled.append({**p, "label": f"Z2-MATCH-{slug}"})

    return labeled


def download_photos(head):
    """Download all photos for a head into docs/heads/<label>/. Returns saved paths."""
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

    print(f"Parsing {KML_PATH.name} …")
    tree = ET.parse(KML_PATH)
    doc = tree.getroot()

    cascading, style_maps = build_style_tables(doc)
    print(f"  {len(cascading)} CascadingStyles, {len(style_maps)} StyleMaps resolved")

    placemarks = parse_placemarks(doc, cascading, style_maps)
    heads = assign_labels(placemarks)

    z2_color_ct = sum(1 for h in heads if h["zone"] == 2 and not h["is_numbered"])
    z2_num_ct = sum(1 for h in heads if h["zone"] == 2 and h["is_numbered"])
    z3_ct = sum(1 for h in heads if h["zone"] == 3)
    print(f"  {len(heads)} placemarks: Z2 front-yard={z2_color_ct}, Z2 park-strip={z2_num_ct}, Z3={z3_ct}")

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
        "source_kml": "docs/Sprinklers.kml",
        "photo_size": PHOTO_SIZE,
        "note": (
            "Z2-MATCH-* labels need visual matching via photo-2 placement shots. "
            "Z2-S7..S18 are front-yard heads sorted N→S. "
            "H3-1..H3-5 are west-side-yard heads sorted N→S."
        ),
        "heads": manifest_heads,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
    print(f"\nManifest written → {MANIFEST_PATH}")

    match_needed = [h["label"] for h in heads if h["label"].startswith("Z2-MATCH")]
    print(f"Park-strip pins needing visual match to Z2-S1..S6: {match_needed}")
    print("Open docs/heads/<Z2-MATCH-*>/photo-2.jpg for each and match to seed head descriptions.")


if __name__ == "__main__":
    main()
