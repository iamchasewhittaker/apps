import { push, pull, auth, APP_KEY } from './sync.js';

const STORE_KEY = 'chase_roller_task_v1';

let tasks = [];
let cash = 1000;
let hasLoaded = false;
let appStarted = false;

const msgs = [
  'A visitor just loved your park!',
  'New coaster design approved!',
  'Guest satisfaction is up!',
  'The maintenance crew got to work!',
  'Park inspector gave you a thumbs up!',
  'Ride queue is getting shorter!',
  "Peep: 'This park is AMAZING!'",
];

const badMsgs = [
  'Task removed from park plans.',
  'Blueprint discarded.',
  'Maintenance request cancelled.',
];

function defaultState() {
  return { tasks: [], cash: 1000, _syncAt: 0 };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw);
    return {
      tasks: Array.isArray(p.tasks) ? p.tasks : [],
      cash: typeof p.cash === 'number' ? p.cash : 1000,
      _syncAt: typeof p._syncAt === 'number' ? p._syncAt : 0,
    };
  } catch {
    return defaultState();
  }
}

function persistToStorage() {
  const blob = { tasks, cash, _syncAt: Date.now() };
  localStorage.setItem(STORE_KEY, JSON.stringify(blob));
}

function saveState() {
  persistToStorage();
  if (!hasLoaded) return;
  const blob = JSON.parse(localStorage.getItem(STORE_KEY));
  push(APP_KEY, blob);
}

function applyBlob(blob) {
  tasks = Array.isArray(blob.tasks) ? blob.tasks : [];
  cash = typeof blob.cash === 'number' ? blob.cash : 1000;
}

function getRating(total, done) {
  if (total === 0) return { label: '--', emoji: '🎠' };
  const pct = done / total;
  if (pct === 1) return { label: 'Tycoon!', emoji: '🏆' };
  if (pct >= 0.75) return { label: 'Excellent', emoji: '⭐⭐⭐' };
  if (pct >= 0.5) return { label: 'Good', emoji: '⭐⭐' };
  if (pct >= 0.25) return { label: 'Average', emoji: '⭐' };
  return { label: 'Poor', emoji: '😰' };
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statDone').textContent = done;
  const r = getRating(total, done);
  document.getElementById('statRating').textContent = `${r.label} ${r.emoji}`;
  document.getElementById('statCash').textContent = cash.toLocaleString();
  document.getElementById('statusCount').textContent = `${done}/${total} complete`;

  const statusMsg = document.getElementById('statusMsg');
  if (total === 0) {
    statusMsg.textContent = 'Park open — waiting for visitors';
  } else if (done === total) {
    statusMsg.textContent = '🏆 All tasks complete! TYCOON STATUS!';
  } else {
    statusMsg.textContent = `${total - done} task(s) remaining in park`;
  }
}

function renderList() {
  const list = document.getElementById('todoList');
  const empty = document.getElementById('emptyState');

  list.querySelectorAll('.todo-item, .list-section-header').forEach((el) => el.remove());

  if (tasks.length === 0) {
    empty.style.display = 'block';
    updateStats();
    return;
  }

  empty.style.display = 'none';

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  if (pending.length > 0) {
    const h = document.createElement('div');
    h.className = 'list-section-header';
    h.textContent = '📋 OPEN WORK ORDERS';
    list.appendChild(h);
    pending.forEach((t) => list.appendChild(makeItem(t)));
  }

  if (done.length > 0) {
    const h = document.createElement('div');
    h.className = 'list-section-header';
    h.textContent = '✅ COMPLETED';
    list.appendChild(h);
    done.forEach((t) => list.appendChild(makeItem(t)));
  }

  updateStats();
}

function makeItem(task) {
  const div = document.createElement('div');
  div.className = `todo-item${task.done ? ' done' : ''}`;
  div.dataset.id = task.id;

  div.innerHTML = `
      <div class="checkbox">${task.done ? '✓' : ''}</div>
      <span class="item-text">${escapeHtml(task.text)}</span>
      <span class="item-delete" title="Delete" data-id="${escapeHtml(task.id)}">✕</span>
    `;

  div.addEventListener('click', (e) => {
    if (e.target.classList.contains('item-delete')) return;
    toggleTask(task.id);
  });

  div.querySelector('.item-delete').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  return div;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  const task = { id: Date.now().toString(), text, done: false };
  tasks.unshift(task);
  input.value = '';
  renderList();
  saveState();
  notify(`🔨 ${text}`, 'New work order added!');
  input.focus();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;

  if (task.done) {
    cash += 250;
    notify(`✅ ${task.text}`, msgs[Math.floor(Math.random() * msgs.length)]);
  }

  renderList();
  saveState();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderList();
  saveState();
  notify('🗑️', badMsgs[Math.floor(Math.random() * badMsgs.length)]);
}

let notifTimeout;
function notify(icon, msg) {
  clearTimeout(notifTimeout);
  const area = document.getElementById('notificationArea');
  const safeIcon = escapeHtml(icon);
  const safeMsg = escapeHtml(msg);
  area.innerHTML = `
      <div class="notification">
        <span>${safeIcon}</span>
        <span style="font-size:15px;">${safeMsg}</span>
      </div>
    `;
  notifTimeout = setTimeout(() => {
    area.innerHTML = '';
  }, 3000);
}

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('clock').textContent = `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

async function runPullAfterLoad() {
  // Fresh read so _syncAt matches any saves that happened while the UI was up; avoids wrongly
  // treating remote as newer when local was already updated (stale snapshot from startApp).
  const snap = loadState();
  const localForPull = {
    tasks: snap.tasks.map((t) => ({ ...t })),
    cash: snap.cash,
    _syncAt: snap._syncAt,
  };
  const remote = await pull(APP_KEY, localForPull, localForPull._syncAt);
  if (remote !== localForPull) {
    applyBlob(remote);
    persistToStorage();
    renderList();
    push(APP_KEY, JSON.parse(localStorage.getItem(STORE_KEY)));
  }
}

function wireGameUi() {
  document.getElementById('addTaskBtn').addEventListener('click', addTask);
  document.getElementById('taskInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });
  document.getElementById('titleCloseBtn').addEventListener('click', () => {
    document.getElementById('mainWindow').style.opacity = '0.4';
  });

  if (auth) {
    document.getElementById('signOutWrap').style.display = 'block';
    document.getElementById('signOutBtn').addEventListener('click', async () => {
      await auth.signOut();
      window.location.reload();
    });
  }
}

async function startApp() {
  if (appStarted) return;
  appStarted = true;

  wireGameUi();

  const stored = loadState();
  applyBlob(stored);
  renderList();
  updateClock();
  setInterval(updateClock, 10000);

  await runPullAfterLoad();
  hasLoaded = true;
}

/* ── Auth gate (Wellness parity: email OTP for iOS home-screen PWA) ───────── */

function showAuthPhase(phase) {
  const gate = document.getElementById('authGate');
  const appRoot = document.getElementById('appRoot');
  const loadEl = document.getElementById('authLoading');
  const em = document.getElementById('authFormEmail');
  const otp = document.getElementById('authFormOtp');

  loadEl.style.display = 'none';
  em.style.display = 'none';
  otp.style.display = 'none';

  if (phase === 'hide') {
    gate.classList.add('is-hidden');
    appRoot.classList.remove('is-hidden');
    return;
  }

  gate.classList.remove('is-hidden');
  appRoot.classList.add('is-hidden');

  if (phase === 'loading') loadEl.style.display = 'block';
  if (phase === 'email') em.style.display = 'block';
  if (phase === 'otp') otp.style.display = 'block';
}

let resendSec = 0;
let resendTimer = null;

function tickResend() {
  const btn = document.getElementById('authResend');
  if (resendSec <= 0) {
    if (resendTimer) clearInterval(resendTimer);
    resendTimer = null;
    btn.disabled = false;
    btn.textContent = 'Resend';
    return;
  }
  resendSec -= 1;
  btn.disabled = true;
  btn.textContent = `Resend (${resendSec}s)`;
}

function startResendCooldown() {
  resendSec = 45;
  const btn = document.getElementById('authResend');
  btn.disabled = true;
  btn.textContent = `Resend (${resendSec}s)`;
  if (resendTimer) clearInterval(resendTimer);
  resendTimer = setInterval(tickResend, 1000);
}

function wireAuthUi() {
  const emailInput = document.getElementById('authEmail');
  const otpInput = document.getElementById('authOtp');
  const errEmail = document.getElementById('authErrorEmail');
  const errOtp = document.getElementById('authErrorOtp');

  const sendOtp = async () => {
    errEmail.style.display = 'none';
    const email = emailInput.value.trim();
    if (!email) return;
    const btn = document.getElementById('authSendOtp');
    btn.disabled = true;
    try {
      const { error: authErr } = await auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
        },
      });
      if (authErr) throw authErr;
      showAuthPhase('otp');
      startResendCooldown();
      otpInput.value = '';
      errOtp.style.display = 'none';
    } catch (err) {
      errEmail.textContent = err.message || 'Something went wrong.';
      errEmail.style.display = 'block';
    } finally {
      btn.disabled = false;
    }
  };

  document.getElementById('authSendOtp').addEventListener('click', sendOtp);

  document.getElementById('authVerify').addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const code = otpInput.value.replace(/\D/g, '').slice(0, 8);
    if (code.length < 6) return;
    errOtp.style.display = 'none';
    const btn = document.getElementById('authVerify');
    btn.disabled = true;
    try {
      const { error: authErr } = await auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });
      if (authErr) throw authErr;
    } catch (err) {
      errOtp.textContent = err.message || 'Invalid code. Try again.';
      errOtp.style.display = 'block';
    } finally {
      btn.disabled = otpInput.value.replace(/\D/g, '').length < 6;
    }
  });

  otpInput.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 8);
    document.getElementById('authVerify').disabled = otpInput.value.replace(/\D/g, '').length < 6;
  });

  document.getElementById('authChangeEmail').addEventListener('click', () => {
    showAuthPhase('email');
    otpInput.value = '';
    errOtp.style.display = 'none';
    if (resendTimer) clearInterval(resendTimer);
    resendTimer = null;
    resendSec = 0;
    document.getElementById('authResend').disabled = false;
    document.getElementById('authResend').textContent = 'Resend';
  });

  document.getElementById('authResend').addEventListener('click', async () => {
    if (resendSec > 0) return;
    otpInput.value = '';
    await sendOtp();
  });
}

async function initAuth() {
  if (!auth) {
    showAuthPhase('hide');
    await startApp();
    return;
  }

  wireAuthUi();
  showAuthPhase('loading');

  const hasCode =
    window.location.search.includes('code=') ||
    window.location.hash.includes('access_token=');

  // Subscribe before getSession (portfolio auth fix — PKCE / INITIAL_SESSION ordering)
  auth.onAuthStateChange((_event, session) => {
    if (session) {
      showAuthPhase('hide');
      void startApp();
    } else if (!hasCode && !appStarted) {
      showAuthPhase('email');
    }
  });

  const { data } = await auth.getSession();
  if (data.session) {
    showAuthPhase('hide');
    await startApp();
  } else if (!hasCode && !appStarted) {
    showAuthPhase('email');
  }
}

void initAuth();
