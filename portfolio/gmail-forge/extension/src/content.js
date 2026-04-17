/**
 * Inbox Zero — Content Script
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

  function init() {
    loadSettings(function (settings) {
      var visibleTabs = settings.visibleTabs || LABEL_TABS.map(function (t) { return t.name; });
      var tabs = LABEL_TABS.filter(function (t) { return visibleTabs.indexOf(t.name) !== -1; });

      waitForGmail(function () {
        injectTabBar(tabs);
        injectSortButton(settings);
        updateUnsortedCount();
        setInterval(updateUnsortedCount, 60000);
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

  function injectTabBar(tabs) {
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

  function injectSortButton(settings) {
    var observer = new MutationObserver(function () {
      var toolbar = document.querySelector('[gh="mtb"]');
      if (toolbar && !document.getElementById('iz-sort-btn')) {
        var btn = document.createElement('div');
        btn.id = 'iz-sort-btn';
        btn.className = 'iz-sort-button';
        btn.innerHTML = '🏷️ Sort';
        btn.title = 'Classify selected emails with AI';
        btn.addEventListener('click', function () {
          sortSelectedEmails(settings);
        });
        toolbar.appendChild(btn);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

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
        rows.push({ sender: sender, subject: subject, snippet: snippet, row: row });
      }
    });

    if (rows.length === 0) {
      showToast('Could not extract email info from selection');
      return;
    }

    showToast('Classifying ' + rows.length + ' email(s)...');

    chrome.runtime.sendMessage(
      { type: 'CLASSIFY', emails: rows.map(function (r) { return { sender: r.sender, subject: r.subject, snippet: r.snippet }; }) },
      function (response) {
        if (response && response.results) {
          showToast('Sorted ' + response.results.length + ' email(s)');
        } else if (response && response.error) {
          showToast('Error: ' + response.error);
        }
      }
    );
  }

  // ---------------------------------------------------------------------------
  // Unsorted count badge
  // ---------------------------------------------------------------------------

  function updateUnsortedCount() {
    if (!unsortedBadgeEl) return;

    chrome.runtime.sendMessage({ type: 'GET_UNSORTED_COUNT' }, function (response) {
      if (chrome.runtime.lastError) return;
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
  // Settings
  // ---------------------------------------------------------------------------

  function loadSettings(callback) {
    chrome.storage.sync.get(['geminiApiKey', 'classifierMode', 'visibleTabs'], function (data) {
      callback(data || {});
    });
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------

  init();
})();
