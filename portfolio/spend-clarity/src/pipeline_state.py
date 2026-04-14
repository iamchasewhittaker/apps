"""
pipeline_state.py — persistent state and dedupe for full-auto receipt pipeline.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

log = logging.getLogger(__name__)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _to_iso(ts: datetime) -> str:
    return ts.astimezone(timezone.utc).isoformat()


def _from_iso(value: str) -> datetime:
    return datetime.fromisoformat(value).astimezone(timezone.utc)


@dataclass
class PipelineState:
    state_path: Path
    retention_days: int = 30
    max_ids: int = 10000
    last_success_at: datetime | None = None
    processed_ids: dict[str, str] = field(default_factory=dict)

    @classmethod
    def load(
        cls,
        state_path: str | Path,
        retention_days: int = 30,
        max_ids: int = 10000,
    ) -> "PipelineState":
        path = Path(state_path)
        obj = cls(state_path=path, retention_days=retention_days, max_ids=max_ids)

        if not path.exists():
            return obj

        try:
            data = json.loads(path.read_text())
            last = data.get("last_success_at")
            if last:
                obj.last_success_at = _from_iso(last)
            obj.processed_ids = dict(data.get("processed_ids", {}))
            obj.prune()
            return obj
        except Exception as exc:
            log.warning("Failed to load pipeline state (%s). Starting fresh.", exc)
            return obj

    def save(self) -> None:
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.prune()
        payload = {
            "version": 1,
            "last_success_at": _to_iso(self.last_success_at) if self.last_success_at else None,
            "processed_ids": self.processed_ids,
        }
        self.state_path.write_text(json.dumps(payload, indent=2, sort_keys=True))

    def get_since_date(self, default_lookback_days: int = 7, overlap_minutes: int = 120) -> date:
        """
        Return a safe since-date for Gmail queries.
        Adds overlap window to protect against clock drift / delayed delivery.
        """
        if not self.last_success_at:
            return (_utcnow() - timedelta(days=default_lookback_days)).date()
        since = self.last_success_at - timedelta(minutes=overlap_minutes)
        return since.date()

    def is_processed(self, message_id: str) -> bool:
        return message_id in self.processed_ids

    def mark_processed(self, message_id: str, processed_at: datetime | None = None) -> None:
        ts = processed_at or _utcnow()
        self.processed_ids[message_id] = _to_iso(ts)

    def mark_many_processed(self, message_ids: list[str], processed_at: datetime | None = None) -> None:
        ts = processed_at or _utcnow()
        iso = _to_iso(ts)
        for message_id in message_ids:
            self.processed_ids[message_id] = iso

    def record_success(self, finished_at: datetime | None = None) -> None:
        self.last_success_at = finished_at or _utcnow()

    def prune(self) -> None:
        """
        Keep dedupe dictionary bounded by age and count.
        """
        cutoff = _utcnow() - timedelta(days=self.retention_days)
        kept: dict[str, str] = {}

        for message_id, iso in self.processed_ids.items():
            try:
                if _from_iso(iso) >= cutoff:
                    kept[message_id] = iso
            except Exception:
                continue

        if len(kept) > self.max_ids:
            ordered = sorted(kept.items(), key=lambda item: item[1], reverse=True)
            kept = dict(ordered[: self.max_ids])

        self.processed_ids = kept
