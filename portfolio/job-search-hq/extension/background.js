/* global chrome */
const DEFAULT_ORIGIN = "https://job-search-hq.vercel.app";

function scrapeProfilePage() {
  try {
    const name =
      document.querySelector('[data-anonymize="person-name"]')?.textContent?.trim() ||
      document.querySelector(".profile-topcard-person-entity__name")?.textContent?.trim() ||
      "";
    const role =
      document.querySelector('[data-anonymize="title"]')?.textContent?.trim() ||
      document.querySelector(".profile-topcard__summary-position")?.textContent?.trim() ||
      "";
    const company =
      document.querySelector('[data-anonymize="company-name"]')?.textContent?.trim() ||
      document.querySelector(".profile-topcard__summary-company")?.textContent?.trim() ||
      "";
    const linkedin = window.location.href.split("?")[0];
    let industry = "";
    let companySize = "";
    document.querySelectorAll(".profile-topcard__summary-industry,.topcard-condensed__summary-item").forEach((el) => {
      const t = el.textContent.trim();
      if (t.match(/\d+[-\u2013]\d+|employees/i)) companySize = t;
      else if (!industry) industry = t;
    });
    const isHiring = /hiring|open role|we're growing|job opening/i.test(document.body.innerText || "");
    return { ok: true, name, role, company, linkedin, companySize, industry, isHiring };
  } catch (e) {
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

function scrapeJobPage() {
  try {
    const url = window.location.href.split("?")[0];
    const titleEl =
      document.querySelector(".jobs-unified-top-card__job-title") ||
      document.querySelector("h1[class*='job-title']") ||
      document.querySelector("h1");
    const title = titleEl?.textContent?.trim() || "";
    const companyEl =
      document.querySelector(".jobs-unified-top-card__company-name a") ||
      document.querySelector(".jobs-unified-top-card__company-name") ||
      document.querySelector("[data-test-job-card-company-name]");
    const company = companyEl?.textContent?.trim() || "";
    const desc =
      document.querySelector(".jobs-description-content__text")?.innerText?.trim() ||
      document.querySelector(".jobs-box__html-content")?.innerText?.trim() ||
      "";
    return { ok: !!(title || company), title, company, url, jobDescription: desc };
  } catch (e) {
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getAppOrigin() {
  const { hqOrigin } = await chrome.storage.local.get(["hqOrigin"]);
  return (typeof hqOrigin === "string" && hqOrigin.trim()) ? hqOrigin.trim().replace(/\/$/, "") : DEFAULT_ORIGIN;
}

async function handleImport(kind) {
  const origin = await getAppOrigin();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { ok: false, error: "No active tab." };
  const tabUrl = tab.url || "";
  if (!tabUrl.includes("linkedin.com")) {
    return { ok: false, error: "Open a LinkedIn profile or job tab first." };
  }

  const func = kind === "profile" ? scrapeProfilePage : scrapeJobPage;
  const injected = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func,
  });
  const result = injected?.[0]?.result;

  if (kind === "profile") {
    if (!result || (!result.name && !result.company && !result.linkedin)) {
      return { ok: false, error: "Could not read this page as a profile. Try a standard LinkedIn profile or Sales Navigator view." };
    }
    const p = new URLSearchParams({
      importContact: "1",
      source: "chrome_extension",
      name: result.name || "",
      role: result.role || "",
      company: result.company || "",
      linkedin: result.linkedin || "",
      companySize: result.companySize || "",
      industry: result.industry || "",
      isHiring: result.isHiring ? "true" : "false",
    });
    await chrome.tabs.create({ url: `${origin}/?${p.toString()}` });
    return { ok: true };
  }

  if (!result || (!result.title && !result.company)) {
    return { ok: false, error: "Could not read this page as a job posting. Open a full LinkedIn job view (not search-only cards)." };
  }
  const payload = JSON.stringify({
    title: result.title || "",
    company: result.company || "",
    url: result.url || "",
    jobDescription: result.jobDescription || "",
  });
  const useHash = payload.length > 3500;
  if (useHash) {
    await chrome.tabs.create({ url: `${origin}/#importJob=${encodeURIComponent(payload)}` });
  } else {
    const p = new URLSearchParams({
      importJob: "1",
      title: result.title || "",
      company: result.company || "",
      url: result.url || "",
      jobDescription: result.jobDescription || "",
    });
    await chrome.tabs.create({ url: `${origin}/?${p.toString()}` });
  }
  return { ok: true };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "SET_BADGE") {
    const c = Math.max(0, Math.min(99, Number(msg.count) || 0));
    chrome.action.setBadgeText({ text: c > 0 ? String(c) : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    return false;
  }
  if (msg.type === "IMPORT_PROFILE" || msg.type === "IMPORT_JOB") {
    handleImport(msg.type === "IMPORT_PROFILE" ? "profile" : "job")
      .then((r) => sendResponse(r))
      .catch((e) => sendResponse({ ok: false, error: e.message || String(e) }));
    return true;
  }
  return false;
});
