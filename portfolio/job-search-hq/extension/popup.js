/* global chrome */

function setStatus(text, ok) {
  const el = document.getElementById("status");
  el.textContent = text || "";
  el.className = "status" + (ok ? " ok" : "");
}

async function loadOrigin() {
  const { hqOrigin } = await chrome.storage.local.get(["hqOrigin"]);
  const input = document.getElementById("origin");
  input.value = hqOrigin || "";
  const link = document.getElementById("openApp");
  link.href = (hqOrigin && hqOrigin.trim()) || "https://job-search-hq.vercel.app";
}

document.getElementById("btnSaveOrigin").addEventListener("click", async () => {
  const v = document.getElementById("origin").value.trim().replace(/\/$/, "");
  if (v) await chrome.storage.local.set({ hqOrigin: v });
  else await chrome.storage.local.remove("hqOrigin");
  setStatus("Saved.", true);
  await loadOrigin();
});

document.getElementById("btnProfile").addEventListener("click", async () => {
  setStatus("Working…");
  document.getElementById("btnProfile").disabled = true;
  document.getElementById("btnJob").disabled = true;
  try {
    const res = await chrome.runtime.sendMessage({ type: "IMPORT_PROFILE" });
    if (res?.ok) setStatus("Opened Job Search HQ with contact import.", true);
    else setStatus(res?.error || "Failed.", false);
  } catch (e) {
    setStatus(e.message || "Failed.", false);
  }
  document.getElementById("btnProfile").disabled = false;
  document.getElementById("btnJob").disabled = false;
});

document.getElementById("btnJob").addEventListener("click", async () => {
  setStatus("Working…");
  document.getElementById("btnProfile").disabled = true;
  document.getElementById("btnJob").disabled = true;
  try {
    const res = await chrome.runtime.sendMessage({ type: "IMPORT_JOB" });
    if (res?.ok) setStatus("Opened Job Search HQ with application import.", true);
    else setStatus(res?.error || "Failed.", false);
  } catch (e) {
    setStatus(e.message || "Failed.", false);
  }
  document.getElementById("btnProfile").disabled = false;
  document.getElementById("btnJob").disabled = false;
});

loadOrigin();
