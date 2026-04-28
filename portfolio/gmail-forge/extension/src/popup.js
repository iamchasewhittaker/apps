/**
 * Gmail Forge — Popup Settings
 */

var ALL_TABS = [
  'Inbox', 'To Reply', 'Newsletter', 'Calendar', 'Receipt',
  'Notification', 'Marketing', 'Cold Email', 'Security', 'Personal',
];

document.addEventListener('DOMContentLoaded', function () {
  var tabListEl = document.getElementById('tabList');
  var geminiApiKeyEl = document.getElementById('geminiApiKey');
  var classifierModeEl = document.getElementById('classifierMode');
  var webAppUrlEl = document.getElementById('webAppUrl');
  var triggerTokenEl = document.getElementById('triggerToken');
  var saveBtnEl = document.getElementById('saveBtn');
  var statusEl = document.getElementById('status');

  chrome.storage.sync.get(['geminiApiKey', 'classifierMode', 'visibleTabs', 'webAppUrl', 'triggerToken'], function (data) {
    if (data.geminiApiKey) {
      geminiApiKeyEl.value = data.geminiApiKey;
    }
    classifierModeEl.value = data.classifierMode || 'GEMINI';
    if (data.webAppUrl) webAppUrlEl.value = data.webAppUrl;
    if (data.triggerToken) triggerTokenEl.value = data.triggerToken;

    var visible = data.visibleTabs || ALL_TABS;

    ALL_TABS.forEach(function (tab) {
      var label = document.createElement('label');
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = tab;
      checkbox.checked = visible.indexOf(tab) !== -1;

      var span = document.createElement('span');
      span.textContent = tab;

      label.appendChild(checkbox);
      label.appendChild(span);
      tabListEl.appendChild(label);
    });
  });

  saveBtnEl.addEventListener('click', function () {
    var visibleTabs = [];
    tabListEl.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      if (cb.checked) visibleTabs.push(cb.value);
    });

    chrome.storage.sync.set({
      geminiApiKey: geminiApiKeyEl.value.trim(),
      classifierMode: classifierModeEl.value,
      visibleTabs: visibleTabs,
      webAppUrl: webAppUrlEl.value.trim(),
      triggerToken: triggerTokenEl.value.trim(),
    }, function () {
      statusEl.style.display = 'block';
      setTimeout(function () { statusEl.style.display = 'none'; }, 2000);
    });
  });
});
