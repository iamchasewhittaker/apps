"""
gmail_client.py — Gmail API authentication and email fetching.

Requires config/gmail_credentials.json (downloaded from Google Cloud Console).
Stores OAuth token at config/gmail_token.json after first auth.

Receipt fetches use ``label:Receipt`` so they align with the sibling **Inbox Zero**
project (portfolio/inbox-zero), which labels transactional mail before Spend Clarity runs.
"""

import base64
import logging
from datetime import date
from typing import Optional

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

log = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


class GmailClient:
    def __init__(self, credentials_file: str, token_file: str, login_hint: str = ""):
        self.credentials_file = credentials_file
        self.token_file = token_file
        self.login_hint = login_hint
        self._service = None

    def authenticate(self):
        """Run OAuth flow if needed, load saved token otherwise."""
        creds = None
        try:
            creds = Credentials.from_authorized_user_file(self.token_file, SCOPES)
        except (FileNotFoundError, ValueError):
            pass

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                log.info("Gmail token refreshed")
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_file, SCOPES)
                extra = {}
                if self.login_hint:
                    extra["login_hint"] = self.login_hint
                creds = flow.run_local_server(port=0, **extra)
                log.info("Gmail OAuth flow completed")

            with open(self.token_file, "w") as f:
                f.write(creds.to_json())

        self._service = build("gmail", "v1", credentials=creds)

    def search_emails(self, sender: str, since_date: date) -> list[dict]:
        """
        Search Gmail for emails from `sender` since `since_date`.
        Returns list of raw email dicts with id, subject, date, body_html, body_text.
        """
        if not self._service:
            raise RuntimeError("Call authenticate() first")

        since_str = since_date.strftime("%Y/%m/%d")
        query = f"label:Receipt from:{sender} after:{since_str}"
        log.debug(f"Gmail query: {query}")
        return self.search_query(query=query)

    def search_query(self, query: str, max_results: int = 500) -> list[dict]:
        """
        Search Gmail using a raw query string.
        Returns list of raw email dicts with id, subject, date, body_html, body_text.
        """
        if not self._service:
            raise RuntimeError("Call authenticate() first")

        message_ids = self.search_query_ids(query=query, max_results=max_results)
        return [self._fetch_email(m_id) for m_id in message_ids]

    def search_query_ids(self, query: str, max_results: int = 500) -> list[str]:
        """
        Search Gmail using a raw query string.
        Returns only message IDs (faster than fetching full payloads).
        """
        if not self._service:
            raise RuntimeError("Call authenticate() first")

        messages = []
        page_token = None

        while True:
            kwargs = {"userId": "me", "q": query, "maxResults": max_results}
            if page_token:
                kwargs["pageToken"] = page_token

            result = self._service.users().messages().list(**kwargs).execute()
            batch = result.get("messages", [])
            messages.extend(batch)

            page_token = result.get("nextPageToken")
            if not page_token:
                break

        message_ids = [m["id"] for m in messages]
        log.debug(f"Gmail query returned {len(message_ids)} IDs: {query}")
        return message_ids

    @staticmethod
    def build_label_query(label: str, since_date: date, extra_terms: str = "") -> str:
        """
        Build a label-based Gmail query with an after-date clause.
        Example:
          label:Receipt after:2026/04/14
          label:Notification after:2026/04/14 from:amazon.com subject:(order OR shipped)
        """
        since_str = since_date.strftime("%Y/%m/%d")
        query = f"label:{label} after:{since_str}"
        extra_terms = extra_terms.strip()
        if extra_terms:
            query = f"{query} {extra_terms}"
        return query

    def _fetch_email(self, message_id: str) -> dict:
        msg = self._service.users().messages().get(
            userId="me", id=message_id, format="full"
        ).execute()

        headers = {h["name"].lower(): h["value"] for h in msg["payload"].get("headers", [])}
        body_html, body_text = self._extract_body(msg["payload"])

        return {
            "id": message_id,
            "subject": headers.get("subject", ""),
            "date": headers.get("date", ""),
            "from": headers.get("from", ""),
            "body_html": body_html,
            "body_text": body_text,
        }

    def _extract_body(self, payload: dict) -> tuple[Optional[str], Optional[str]]:
        html, text = None, None

        def _walk(part):
            nonlocal html, text
            mime = part.get("mimeType", "")
            data = part.get("body", {}).get("data")

            if mime == "text/html" and data and not html:
                html = base64.urlsafe_b64decode(data).decode("utf-8", errors="replace")
            elif mime == "text/plain" and data and not text:
                text = base64.urlsafe_b64decode(data).decode("utf-8", errors="replace")

            for sub in part.get("parts", []):
                _walk(sub)

        _walk(payload)
        return html, text
