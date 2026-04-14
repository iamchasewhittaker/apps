from datetime import date, datetime, timedelta, timezone
import sys
import types
from pathlib import Path


def _install_google_stubs():
    if "google.auth.transport.requests" in sys.modules:
        return

    google_mod = types.ModuleType("google")
    auth_mod = types.ModuleType("google.auth")
    transport_mod = types.ModuleType("google.auth.transport")
    google_requests_mod = types.ModuleType("google.auth.transport.requests")
    google_requests_mod.Request = object

    oauth2_mod = types.ModuleType("google.oauth2")
    credentials_mod = types.ModuleType("google.oauth2.credentials")
    credentials_mod.Credentials = type("Credentials", (), {"from_authorized_user_file": staticmethod(lambda *_: None)})

    oauthlib_mod = types.ModuleType("google_auth_oauthlib")
    flow_mod = types.ModuleType("google_auth_oauthlib.flow")
    flow_mod.InstalledAppFlow = type("InstalledAppFlow", (), {"from_client_secrets_file": staticmethod(lambda *_: None)})

    googleapiclient_mod = types.ModuleType("googleapiclient")
    discovery_mod = types.ModuleType("googleapiclient.discovery")
    discovery_mod.build = lambda *args, **kwargs: None
    dotenv_mod = types.ModuleType("dotenv")
    dotenv_mod.load_dotenv = lambda *args, **kwargs: None
    http_requests_mod = types.ModuleType("requests")
    http_requests_mod.get = lambda *args, **kwargs: None
    http_requests_mod.post = lambda *args, **kwargs: None

    sys.modules["google"] = google_mod
    sys.modules["google.auth"] = auth_mod
    sys.modules["google.auth.transport"] = transport_mod
    sys.modules["google.auth.transport.requests"] = google_requests_mod
    sys.modules["google.oauth2"] = oauth2_mod
    sys.modules["google.oauth2.credentials"] = credentials_mod
    sys.modules["google_auth_oauthlib"] = oauthlib_mod
    sys.modules["google_auth_oauthlib.flow"] = flow_mod
    sys.modules["googleapiclient"] = googleapiclient_mod
    sys.modules["googleapiclient.discovery"] = discovery_mod
    sys.modules["dotenv"] = dotenv_mod
    sys.modules["requests"] = http_requests_mod


_install_google_stubs()

SRC_DIR = Path(__file__).resolve().parents[1] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from gmail_client import GmailClient
from main import _collect_pipeline_receipts
from pipeline_state import PipelineState
from receipt_parser import ParsedReceipt


def test_build_label_query():
    since = date(2026, 4, 14)
    assert GmailClient.build_label_query("Receipt", since) == "label:Receipt after:2026/04/14"
    assert (
        GmailClient.build_label_query("Notification", since, "from:amazon.com subject:(order OR shipped)")
        == "label:Notification after:2026/04/14 from:amazon.com subject:(order OR shipped)"
    )


def test_pipeline_state_round_trip_and_prune(tmp_path):
    path = tmp_path / "pipeline_state.json"
    state = PipelineState.load(path, retention_days=1, max_ids=2)
    assert state.last_success_at is None
    assert state.processed_ids == {}

    old = datetime.now(timezone.utc) - timedelta(days=3)
    state.mark_processed("old-id", processed_at=old)
    state.mark_processed("new-1")
    state.mark_processed("new-2")
    state.record_success()
    state.save()

    reloaded = PipelineState.load(path, retention_days=1, max_ids=2)
    # old-id should be pruned by retention_days
    assert "old-id" not in reloaded.processed_ids
    # bounded by max_ids
    assert len(reloaded.processed_ids) <= 2
    assert reloaded.last_success_at is not None


def test_collect_pipeline_receipts_skips_processed_ids(monkeypatch, tmp_path):
    class FakeGmail:
        def search_query(self, query):
            if "label:Receipt" in query:
                return [
                    {
                        "id": "m1",
                        "from": "Ship Confirm <ship-confirm@amazon.com>",
                        "subject": "Your Amazon order",
                        "date": "Mon, 14 Apr 2026 10:00:00 -0700",
                        "body_html": "<html></html>",
                        "body_text": "Order #123",
                    },
                    {
                        "id": "m2",
                        "from": "Apple <no_reply@email.apple.com>",
                        "subject": "Your receipt from Apple",
                        "date": "Mon, 14 Apr 2026 10:30:00 -0700",
                        "body_html": "<html></html>",
                        "body_text": "Receipt",
                    },
                ]
            if "label:Notification" in query:
                return [
                    {
                        "id": "m3",
                        "from": "Amazon <auto-confirm@amazon.com>",
                        "subject": "Order shipped",
                        "date": "Mon, 14 Apr 2026 11:00:00 -0700",
                        "body_html": "<html></html>",
                        "body_text": "Shipped",
                    }
                ]
            return []

    def fake_parse_receipt(email, merchant):
        return ParsedReceipt(
            order_id=f"ord-{email['id']}",
            date=date(2026, 4, 14),
            amount=10.00,
            items=[merchant],
        )

    monkeypatch.setattr("main.parse_receipt", fake_parse_receipt)

    state = PipelineState.load(tmp_path / "state.json")
    state.mark_processed("m1")  # should be skipped by dedupe

    receipts, summary = _collect_pipeline_receipts(
        gmail=FakeGmail(),
        since_date=date(2026, 4, 14),
        active_merchants=["amazon", "apple"],
        state=state,
    )

    # m1 dedupe-skipped, m2 + m3 parsed.
    assert summary["dedupe_skipped"] == 1
    assert summary["new_messages"] == 2
    assert summary["parsed_receipts"] == 2
    assert {r.order_id for r in receipts} == {"ord-m2", "ord-m3"}
