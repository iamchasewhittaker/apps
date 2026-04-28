/**
 * Gmail Forge — Content Script
 *
 * Injected into Gmail. Renders a label tab bar at the top of the inbox
 * and adds a "Sort" button to the toolbar for AI classification.
 *
 * Uses InboxSDK for stable Gmail DOM integration.
 */

(function () {
  'use strict';

  var LABEL_TABS = [
    { name: 'Inbox', query: 'in:inbox', icon: '📬' },
    { name: 'To Reply', query: 'label:To-Reply', icon: '💬' },
    { name: 'Newsletter', query: 'label:Newsletter', icon: '📰' },
    { name: 'Calendar', query: 'label:Calendar', icon: '📅' },
    { name: 'Receipt', query: 'label:Receipt', icon: '🧾' },
    { name: 'Notification', query: 'label:Notification', icon: '🔔' },
    { name: 'Marketing', query: 'label:Marketing', icon: '📣' },
    { name: 'Cold Email', query: 'label:Cold-Email', icon: '❄️' },
    { name: 'Security', query: 'label:Security', icon: '🔐' },
    { name: 'Personal', query: 'label:Personal', icon: '👤' },
  ];

  var activeTab = 'Inbox';
  var tabBarEl = null;
  var unsortedBadgeEl = null;
  var unsortedInterval = null;

  // ---------------------------------------------------------------------------
  // Extension context guard
  // ---------------------------------------------------------------------------

  function isContextAlive() {
    try { return !!chrome.runtime.id; } catch (e) { return false; }
  }

  function onContextDead() {
    if (unsortedInterval) { clearInterval(unsortedInterval); unsortedInterval = null; }
    var bar = document.getElementById('iz-tab-bar');
    if (bar) bar.remove();
    showToast('Gmail Forge: extension reloaded — refresh this tab to reconnect.');
  }

  function safeStorageGet(keys, callback) {
    if (!isContextAlive()) { onContextDead(); return; }
    try {
      chrome.storage.sync.get(keys, function (data) {
        if (chrome.runtime.lastError) { onContextDead(); return; }
        callback(data || {});
      });
    } catch (e) { onContextDead(); }
  }

  function safeSendMessage(msg, callback) {
    if (!isContextAlive()) { onContextDead(); return; }
    try {
      chrome.runtime.sendMessage(msg, function (response) {
        if (chrome.runtime.lastError) {
          if (/invalidated|disconnected/i.test(chrome.runtime.lastError.message || '')) onContextDead();
          return;
        }
        if (callback) callback(response);
      });
    } catch (e) { onContextDead(); }
  }

  function init() {
    safeStorageGet(['geminiApiKey', 'classifierMode', 'visibleTabs'], function (settings) {
      var visibleTabs = settings.visibleTabs || LABEL_TABS.map(function (t) { return t.name; });
      var tabs = LABEL_TABS.filter(function (t) { return visibleTabs.indexOf(t.name) !== -1; });

      waitForGmail(function () {
        injectTabBar(tabs, settings);
        updateUnsortedCount();
        unsortedInterval = setInterval(function () {
          if (!isContextAlive()) { onContextDead(); return; }
          updateUnsortedCount();
        }, 60000);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Wait for Gmail to fully load
  // ---------------------------------------------------------------------------

  function waitForGmail(callback) {
    var attempts = 0;
    var check = setInterval(function () {
      var header = document.querySelector('[role="banner"]');
      var main = document.querySelector('[role="main"]');
      attempts++;
      if ((header && main) || attempts > 100) {
        clearInterval(check);
        if (header && main) callback();
      }
    }, 200);
  }

  // ---------------------------------------------------------------------------
  // Tab Bar
  // ---------------------------------------------------------------------------

  function injectTabBar(tabs, settings) {
    if (document.getElementById('iz-tab-bar')) return;

    tabBarEl = document.createElement('div');
    tabBarEl.id = 'iz-tab-bar';

    tabs.forEach(function (tab) {
      var btn = document.createElement('button');
      btn.className = 'iz-tab' + (tab.name === activeTab ? ' iz-tab--active' : '');
      btn.dataset.name = tab.name;
      btn.innerHTML = '<span class="iz-tab-icon">' + tab.icon + '</span>' +
        '<span class="iz-tab-label">' + tab.name + '</span>' +
        '<span class="iz-tab-count" id="iz-count-' + tab.name.replace(/ /g, '-') + '"></span>';

      btn.addEventListener('click', function () {
        activeTab = tab.name;
        updateActiveTab();
        navigateToSearch(tab.query);
      });

      tabBarEl.appendChild(btn);
    });

    unsortedBadgeEl = document.createElement('div');
    unsortedBadgeEl.id = 'iz-unsorted-badge';
    unsortedBadgeEl.title = 'Unsorted emails in inbox';
    tabBarEl.appendChild(unsortedBadgeEl);

    var sortBtn = document.createElement('div');
    sortBtn.id = 'iz-sort-btn';
    sortBtn.className = 'iz-sort-button';
    sortBtn.innerHTML = '🏷️ Sort';
    sortBtn.title = 'Classify selected emails with AI';
    sortBtn.addEventListener('click', function () {
      sortSelectedEmails(settings);
    });
    tabBarEl.appendChild(sortBtn);

    var guideBtn = document.createElement('div');
    guideBtn.id = 'iz-guide-btn';
    guideBtn.className = 'iz-guide-button';
    guideBtn.innerHTML = '?';
    guideBtn.title = 'How Gmail Forge works';
    guideBtn.addEventListener('click', showGuideModal);
    tabBarEl.appendChild(guideBtn);

    var target = document.querySelector('[role="banner"]');
    if (target && target.parentNode) {
      target.parentNode.insertBefore(tabBarEl, target.nextSibling);
    }

    observeUrlChanges();
  }

  function updateActiveTab() {
    if (!tabBarEl) return;
    var buttons = tabBarEl.querySelectorAll('.iz-tab');
    buttons.forEach(function (btn) {
      btn.classList.toggle('iz-tab--active', btn.dataset.name === activeTab);
    });
  }

  function navigateToSearch(query) {
    var searchHash = '#search/' + encodeURIComponent(query);
    if (query === 'in:inbox') searchHash = '#inbox';
    window.location.hash = searchHash;
  }

  function observeUrlChanges() {
    var lastHash = window.location.hash;
    setInterval(function () {
      if (window.location.hash !== lastHash) {
        lastHash = window.location.hash;
        syncActiveTabFromUrl(lastHash);
      }
    }, 500);
  }

  function syncActiveTabFromUrl(hash) {
    var decoded = decodeURIComponent(hash);
    if (decoded.indexOf('#inbox') === 0) {
      activeTab = 'Inbox';
    } else {
      LABEL_TABS.forEach(function (tab) {
        if (decoded.indexOf(tab.query) !== -1) {
          activeTab = tab.name;
        }
      });
    }
    updateActiveTab();
  }

  // ---------------------------------------------------------------------------
  // Sort Button
  // ---------------------------------------------------------------------------

  function sortSelectedEmails(settings) {
    var checkboxes = document.querySelectorAll('[role="main"] tr.x7 input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
      showToast('Select emails first, then click Sort');
      return;
    }

    var rows = [];
    checkboxes.forEach(function (cb) {
      var row = cb.closest('tr');
      if (row) {
        var sender = (row.querySelector('[email]') || {}).getAttribute('email') || '';
        var subjectEl = row.querySelector('.bog') || row.querySelector('.y6');
        var subject = subjectEl ? subjectEl.textContent : '';
        var snippetEl = row.querySelector('.y2');
        var snippet = snippetEl ? snippetEl.textContent : '';
        var messageId = row.getAttribute('data-legacy-message-id') || row.getAttribute('data-message-id') || '';
        rows.push({ sender: sender, subject: subject, snippet: snippet, messageId: messageId, row: row });
      }
    });

    if (rows.length === 0) {
      showToast('Could not extract email info from selection');
      return;
    }

    showToast('Classifying ' + rows.length + ' email(s)...');

    safeSendMessage(
      { type: 'CLASSIFY', emails: rows.map(function (r) { return { sender: r.sender, subject: r.subject, snippet: r.snippet, messageId: r.messageId }; }) },
      function (response) {
        if (response && response.results) {
          applyLabels(response.results);
        } else if (response && response.error) {
          showToast('Error: ' + response.error);
        }
      }
    );
  }

  function applyLabels(results) {
    safeStorageGet(['webAppUrl', 'triggerToken'], function (cfg) {
      if (!cfg.webAppUrl || !cfg.triggerToken) {
        showToast('Sort: set Web App URL + Token in extension settings');
        return;
      }

      var applications = results
        .filter(function (r) { return r.label && r.messageId; })
        .map(function (r) { return { messageId: r.messageId, label: r.label }; });

      if (applications.length === 0) {
        showToast('No labels to apply (missing message IDs)');
        return;
      }

      fetch(cfg.webAppUrl, {
        method: 'POST',
        body: JSON.stringify({ token: cfg.triggerToken, applications: applications }),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var ok = (data.results || []).filter(function (r) { return r.ok; }).length;
          showToast('Labeled ' + ok + ' email(s)');
        })
        .catch(function (err) { showToast('Apply failed: ' + err.message); });
    });
  }

  function showGuideModal() {
    var existing = document.getElementById('iz-guide-modal');
    if (existing) { existing.remove(); return; }

    var overlay = document.createElement('div');
    overlay.id = 'iz-guide-modal';
    overlay.innerHTML = [
      '<div class="iz-guide-inner">',
      '  <div class="iz-guide-header">',
      '    <span class="iz-guide-logo">Gmail Forge</span>',
      '    <button class="iz-guide-close" id="iz-guide-close">✕</button>',
      '  </div>',
      '  <div class="iz-guide-body">',

      '  <section>',
      '    <h2>Toolbar</h2>',
      '    <dl>',
      '      <dt>📬 Label tabs</dt>',
      '      <dd>Click any tab to jump to that label\'s email view — Inbox, To Reply, Newsletter, Calendar, Receipt, Notification, Marketing, Cold Email, Security, Personal.</dd>',
      '      <dt>🔴 Unsorted badge</dt>',
      '      <dd>Shows how many inbox emails have no label yet. Disappears when your inbox is clean. Updates every 60 seconds.</dd>',
      '      <dt>🏷️ Sort</dt>',
      '      <dd>Select one or more emails (tick the checkboxes), then click Sort. Gmail Forge classifies each email and applies the right label via Apps Script. Toast confirms how many were labeled.</dd>',
      '      <dt>? Guide</dt>',
      '      <dd>This panel.</dd>',
      '    </dl>',
      '  </section>',

      '  <section>',
      '    <h2>How Sort works</h2>',
      '    <ol>',
      '      <li>Tick the checkboxes on emails you want to sort.</li>',
      '      <li>Click <strong>🏷️ Sort</strong>.</li>',
      '      <li>The extension reads sender, subject, and snippet.</li>',
      '      <li>Classifies each email — keyword rules first, Gemini AI as fallback (if configured).</li>',
      '      <li>POSTs results to the Apps Script web app, which applies Gmail labels.</li>',
      '      <li>Toast shows <em>Labeled X email(s)</em>.</li>',
      '    </ol>',
      '    <p class="iz-guide-note">Sort only labels — it never archives. The 5-minute auto-sorter (Layer 2) handles archiving.</p>',
      '  </section>',

      '  <section>',
      '    <h2>Label guide</h2>',
      '    <dl>',
      '      <dt>📰 Newsletter</dt><dd>Substack, blogs, digests, recurring content.</dd>',
      '      <dt>🔔 Notification</dt><dd>App alerts, shipping updates, service messages.</dd>',
      '      <dt>🧾 Receipt</dt><dd>Purchases, payments, invoices, billing.</dd>',
      '      <dt>📅 Calendar</dt><dd>Appointment reminders, event invitations.</dd>',
      '      <dt>📣 Marketing</dt><dd>Promotions, sales, brand emails.</dd>',
      '      <dt>❄️ Cold Email</dt><dd>Unsolicited outreach, sales pitches.</dd>',
      '      <dt>🔐 Security</dt><dd>Password resets, 2FA codes, account alerts.</dd>',
      '      <dt>👤 Personal</dt><dd>Real person, personal conversation. Never archived.</dd>',
      '      <dt>💬 To Reply</dt><dd>Manual — requires your response.</dd>',
      '      <dt>ℹ️ FYI</dt><dd>Info-only, no action needed.</dd>',
      '    </dl>',
      '  </section>',

      '  <section>',
      '    <h2>Three-layer architecture</h2>',
      '    <dl>',
      '      <dt>Layer 1 — XML filters (instant)</dt>',
      '      <dd>69 server-side Gmail filters. Known senders are labeled the moment mail arrives. No compute cost.</dd>',
      '      <dt>Layer 2 — Apps Script (every 5 min)</dt>',
      '      <dd>Sweeps unlabeled inbox mail, matches against the same 69 JS rules, and calls Gemini for unknowns. Applies label + archives. Logs new senders to the Review Queue sheet.</dd>',
      '      <dt>Layer 3 — This extension (manual)</dt>',
      '      <dd>Tab bar for quick navigation. Sort button for on-demand classification of selected emails.</dd>',
      '    </dl>',
      '  </section>',

      '  <section>',
      '    <h2>Settings (extension popup)</h2>',
      '    <dl>',
      '      <dt>Classifier Mode</dt><dd><strong>Gemini</strong> — uses AI for unknown senders. <strong>Rules Only</strong> — keyword regex only, no API calls.</dd>',
      '      <dt>Gemini API Key</dt><dd>From <em>aistudio.google.com</em>. Required only in Gemini mode.</dd>',
      '      <dt>Web App URL</dt><dd>The Apps Script deployment URL. Required for Sort to apply labels.</dd>',
      '      <dt>Trigger Token</dt><dd>Must match the <code>TRIGGER_TOKEN</code> Script Property. Authorises label-apply requests.</dd>',
      '      <dt>Visible Tabs</dt><dd>Toggle which label tabs appear in the bar.</dd>',
      '    </dl>',
      '  </section>',

      '  </div>',
      '</div>',
    ].join('\n');

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });
    document.getElementById('iz-guide-close').addEventListener('click', function () {
      overlay.remove();
    });
  }

  // ---------------------------------------------------------------------------
  // Unsorted count badge
  // ---------------------------------------------------------------------------

  function updateUnsortedCount() {
    if (!unsortedBadgeEl) return;

    safeSendMessage({ type: 'GET_UNSORTED_COUNT' }, function (response) {
      if (response && response.count > 0) {
        unsortedBadgeEl.textContent = response.count + ' unsorted';
        unsortedBadgeEl.style.display = 'flex';
      } else {
        unsortedBadgeEl.style.display = 'none';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Toast notification
  // ---------------------------------------------------------------------------

  function showToast(message) {
    var existing = document.getElementById('iz-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'iz-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () { toast.classList.add('iz-toast--visible'); }, 10);
    setTimeout(function () {
      toast.classList.remove('iz-toast--visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------

  init();
})();
