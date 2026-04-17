# Senders Spend Clarity Needs Filtered

> Generated from Spend Clarity's parser targets and reference repos. Add any missing entries to `gmail-filters.xml` as **Receipt** filters so Spend Clarity can query `label:Receipt` cleanly.

## Already covered by Inbox Zero

| Sender | Domain/Address | Inbox Zero Label | Status |
|---|---|---|---|
| Venmo | venmo@venmo.com | Receipt | ✅ |
| Privacy.com | support@privacy.com | Receipt | ✅ |
| Anthropic | mail.anthropic.com | Receipt | ✅ |
| Citi | citi.com | Receipt | ✅ |
| Safeco | safeco.com | Receipt | ✅ |
| Amazon (orders + shipping) | amazon.com | Notification | ✅ (see note) |

> **Note on Amazon:** Inbox Zero labels Amazon as Notification (covers orders, shipping, and account alerts). Spend Clarity can query `from:amazon.com label:Notification subject:(order OR shipped)` to isolate receipt-relevant emails without needing a separate Receipt filter.

## Recommended additions to Inbox Zero

These senders are parsed by Spend Clarity or its reference repos. Adding them to `gmail-filters.xml` as **Receipt** will pre-label them for Spend Clarity's `label:Receipt` query.

| Sender | Domain/Address | Filter Value | Why |
|---|---|---|---|
| Apple | no-reply@email.apple.com | `email.apple.com` | Apple receipt parser target — App Store, subscriptions, hardware |
| PayPal | service@paypal.com | `paypal.com` | Transaction confirmations — common YNAB match target |
| Costco | Costco@online.costco.com | `online.costco.com` | Warehouse receipts — itemized email receipts |
| Target | orders@target.com | `target.com` | Order confirmations |
| Uber / Uber Eats | noreply@uber.com | `uber.com` | Trip and delivery receipts — useful for transport category |
| DoorDash | no-reply@doordash.com | `doordash.com` | Delivery receipts — food category |
| Spotify | no-reply@spotify.com | `spotify.com` | Subscription renewal confirmations |
| Google Play / Google One | googleplay-noreply@google.com | `googleplay-noreply@google.com` | Digital subscription receipts |

## How to add these

For each row above, add an entry to the Receipt section of `gmail-filters.xml`:

```xml
<entry>
  <category term='filter'></category>
  <title>Receipt - [Sender Name]</title>
  <apps:property name='from' value='[filter value]'/>
  <apps:property name='shouldArchive' value='true'/>
  <apps:property name='shouldNeverSpam' value='true'/>
  <apps:property name='label' value='Receipt'/>
</entry>
```

Then update filter counts in `claude.md` and `roadmap/roadmap.md`, and reimport into Gmail.

## Integration architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Inbox Zero    │         │  Spend Clarity   │
│                 │         │                  │
│  Gmail filter   │ labels  │  gmail_client.py │
│  gmail-filters  │───────►│  query:          │
│  .xml           │ Receipt │  label:Receipt   │
│                 │         │                  │
│  Leaker report  │◄───────│  New senders     │
│  (daily Claude) │ feedback│  discovered in   │
│                 │         │  YNAB matching   │
└─────────────────┘         └──────────────────┘
```

When Spend Clarity discovers a new receipt sender during YNAB matching that isn't already labeled, it should log the sender domain — Chase can then add it to Inbox Zero during the daily report.
