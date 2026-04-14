/* Runs on Job Search HQ — reports Action Queue size for toolbar badge. */
(function () {
  const STORAGE_KEY = "chase_job_search_v1";

  function prepHasContent(app) {
    if (app.prepNotes && String(app.prepNotes).trim()) return true;
    const s = app.prepSections;
    if (!s || typeof s !== "object") return false;
    return ["companyResearch", "roleAnalysis", "starStories", "questionsToAsk"].some((k) =>
      String(s[k] || "").trim()
    );
  }

  function buildQueueCount(applications, contacts) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let n = 0;

    (applications || [])
      .filter((a) => a.nextStepDate && !["Rejected", "Withdrawn"].includes(a.stage))
      .forEach((app) => {
        const due = new Date(app.nextStepDate + "T00:00:00");
        const diff = Math.round((due - today) / 86400000);
        if (diff <= 0) n += 1;
      });

    (applications || [])
      .filter((a) => ["Phone Screen", "Interview", "Final Round"].includes(a.stage) && !prepHasContent(a))
      .forEach(() => {
        n += 1;
      });

    (contacts || [])
      .filter((c) => c.outreachStatus === "replied")
      .forEach(() => {
        n += 1;
      });

    (contacts || [])
      .filter((c) => c.outreachStatus === "sent" && c.outreachDate)
      .forEach((contact) => {
        const sent = new Date(contact.outreachDate + "T00:00:00");
        const days = Math.round((today - sent) / 86400000);
        if (days >= 5) n += 1;
      });

    (applications || [])
      .filter((a) => a.stage === "Applied" && a.appliedDate)
      .forEach((app) => {
        const applied = new Date(app.appliedDate + "T00:00:00");
        const days = Math.round((today - applied) / 86400000);
        if (days >= 14) n += 1;
      });

    return n;
  }

  function reportBadge() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        try { chrome.runtime.sendMessage({ type: "SET_BADGE", count: 0 }); } catch (_) {}
        return;
      }
      const parsed = JSON.parse(raw);
      const count = buildQueueCount(parsed.applications || [], parsed.contacts || []);
      try { chrome.runtime.sendMessage({ type: "SET_BADGE", count }); } catch (_) {}
    } catch {
      try { chrome.runtime.sendMessage({ type: "SET_BADGE", count: 0 }); } catch (_) {}
    }
  }

  reportBadge();
  setInterval(reportBadge, 45000);
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY || e.key === null) reportBadge();
  });
})();
