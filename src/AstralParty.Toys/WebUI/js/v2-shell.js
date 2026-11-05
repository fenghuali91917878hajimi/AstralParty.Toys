// v2-shell.js — 新界面第一阶段：顶栏外部跳转、概览页、市场占位
// 只加不删：原版大厅的 DOM 仍在 #homeView 里（隐藏），启动游戏 / 启动方式继续走 HomeModule，
// 这样「启动按钮锁 5 秒、启动方式锁 6 秒」等原版逻辑原样生效。
(function () {
  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    right: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    dot: '<svg viewBox="0 0 24 24"></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
  };

  // 宿主推来的数据（概览只读，不主动改任何东西）
  const V2 = { modStatus: null, skins: null, chars: null, lastModStatusAsk: 0 };

  /* ---------- 提示文字 ----------
     宿主的提示沿用原版文案（后端不动），有些写给开发者看，或者提到新界面没有的按钮。这里只改这些，别的原样显示。
     文字越长停留越久，免得还没看完就消失。 */
  const TOAST_REWRITES = [
    [/^加载器已安装到游戏目录[\s\S]*/, '加载器和内置模组装好了，启动游戏后生效。'],
    [/^加载器文件已写入游戏目录[\s\S]*/, '加载器和内置模组装好了，重启游戏后生效。'],
    [/这个目录里没有检测到游戏主程序[\s\S]*/, '这个文件夹里没找到游戏。请选择游戏 exe 所在的那个文件夹。'],
    [/这个目录已经不在了，或里面没有 AstralParty\*\.exe。/, '这个文件夹已经不在了，或者里面没有游戏。'],
    [/尚未选择有效的游戏目录，请先(在「模组管理」里选择|自动检测或手动选择)。/, '还没有可用的游戏目录，请先到「设置 → 游戏目录」里添加。'],
    [/未能识别游戏目录，请先在「模组管理」里选择游戏目录。/, '还没有可用的游戏目录，请先到「设置 → 游戏目录」里添加。'],
    [/自动检测未找到游戏目录，请点「选择…」手动指定。/, '自动检测没找到游戏目录，请到「设置 → 游戏目录」里添加。'],
    [/如确定要覆盖，请勾选「允许覆盖其它 version\.dll」。/, '如确定要覆盖，请用模组页「高级操作 → 覆盖安装」。'],
    [/如确定要降级，请勾选「允许降级安装较旧的加载器」；/, '如确定要降级，请到模组页「高级操作」里操作；'],
    [/如确认要删除请勾选「[^」]*」。?/, '如确认要删除，请用模组页「高级操作 → 强制卸载」。'],
  ];
  const originalToast = window.toast;
  window.toast = function (message) {
    const text = TOAST_REWRITES.reduce((s, [from, to]) => s.replace(from, to), String(message ?? ''));
    originalToast(text);
    clearTimeout(originalToast._timer);
    originalToast._timer = setTimeout(() => $('toast')?.classList.remove('show'), Math.min(10000, Math.max(3800, text.length * 90)));
  };

  /* ---------- 小工具 ---------- */
  let menuFns = [];
  function openMenu(anchor, items) {
    let m = $('v2Menu');
    if (!m) {
      m = document.createElement('div'); m.id = 'v2Menu'; m.className = 'v2-menu'; document.body.appendChild(m);
      m.addEventListener('click', e => {
        const b = e.target.closest('[data-mi]'); if (!b || b.disabled) return;
        closeMenu(); menuFns[b.dataset.mi]?.();
      });
    }
    menuFns = [];
    m.innerHTML = items.map((it, i) => {
      if (it === '-') return '<hr>';
      menuFns[i] = it.fn;
      return `<button data-mi="${i}" ${it.disabled ? 'disabled' : ''}>${it.icon || ICON.dot}${esc(it.label)}</button>`;
    }).join('');
    m.classList.add('show');
    const r = anchor.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
    m.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
    m.style.top = (r.bottom + h + 6 > innerHeight ? r.top - h - 6 : r.bottom + 6) + 'px';
  }
  function closeMenu() { $('v2Menu')?.classList.remove('show'); }
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest?.('#v2Menu') && !e.target.closest?.('[data-v2menu]')) closeMenu();
  });

  /* ---------- 弹窗 + 删除确认（新页面共用） ----------
     删除确认：说清删什么、留什么、能不能找回；「取消」默认获得焦点，危险按钮打开 0.5 秒后才能点。 */
  let modalCancel = null;
  function openModal(html, cls = '') {
    let m = $('v2Modal');
    if (!m) {
      m = document.createElement('div'); m.id = 'v2Modal'; m.className = 'v2-modal'; document.body.appendChild(m);
      m.addEventListener('click', e => {
        if (e.target === m) return (modalCancel || closeModal)();
        const b = e.target.closest('[data-v2modal]');
        if (b && !b.disabled) modalActions[b.dataset.v2modal]?.(b);
      });
    }
    modalCancel = null;
    m.innerHTML = `<div class="v2-modal-box ${cls}">${html}</div>`;
    m.classList.add('show');
    return m;
  }
  function closeModal() { modalCancel = null; $('v2Modal')?.classList.remove('show'); }
  // 弹窗里的按钮写 data-v2modal="名字"，由调用方注册处理函数
  const modalActions = { close: () => (modalCancel || closeModal)() };

  function armDanger(m) {
    m.querySelectorAll('.v2-btn.danger-fill, .v2-btn.danger').forEach(b => { b.disabled = true; setTimeout(() => { b.disabled = false; }, 500); });
  }
  function confirmDelete({ title, lines, ok = '删除', onOk, onCancel }) {
    modalActions.confirmYes = () => { closeModal(); onOk?.(); };
    const m = openModal(`
      <div class="v2-confirm"><div class="v2-confirm-icon">${ICON.trash}</div>
        <div><b class="v2-confirm-title">${title}</b><ul class="v2-confirm-lines">${lines.filter(Boolean).map(l => `<li>${l}</li>`).join('')}</ul></div></div>
      <div class="v2-modal-foot"><span class="v2-top-spacer"></span>
        <button class="v2-btn ghost" data-v2modal="close" id="v2ConfirmNo">取消</button>
        <button class="v2-btn danger-fill" data-v2modal="confirmYes">${ICON.trash}${ok}</button></div>`, 'narrow');
    modalCancel = onCancel || closeModal;
    armDanger(m);
    $('v2ConfirmNo')?.focus();
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('v2Modal')?.classList.contains('show')) (modalCancel || closeModal)();
  });

  /* ---------- 顶栏外部跳转（WIKI / GitHub） ----------
     第一次点：按钮下方提示「再次点击跳转页面」，3 秒内再点才打开；两次点击至少隔 0.5 秒。 */
  const JUMPS = {
    wiki: { name: 'BWiki', url: 'https://wiki.biligame.com/starengine/%E9%A6%96%E9%A1%B5' },
    github: { name: 'GitHub 仓库', url: 'https://github.com/fenghuali91917878hajimi/AstralParty.Toys' },   // 修改版的问题不要找原作者，原项目地址在设置 → 关于
  };
  const ARM_MS = 3000, GAP_MS = 500;
  const jumpSt = {}, jumpLast = {};

  function jumpTip(btn, html, ms, cls = '') {
    const tip = btn.nextElementSibling;
    tip.className = `v2-jump-tip show ${cls}`;
    tip.innerHTML = html + (ms ? `<i class="bar" style="animation-duration:${ms}ms"></i>` : '');
  }
  function jumpReset(key) {
    const st = jumpSt[key]; if (!st) return;
    clearTimeout(st.timer); delete jumpSt[key];
    const btn = document.querySelector(`[data-v2jump="${key}"]`);
    btn.classList.remove('armed', 'gap');
    btn.nextElementSibling.className = 'v2-jump-tip';
  }
  function jumpCancelArmed(except) {
    Object.keys(jumpSt).forEach(k => { if (k !== except && jumpSt[k].mode === 'armed') jumpReset(k); });
  }
  function jumpClick(btn) {
    const key = btn.dataset.v2jump, j = JUMPS[key], st = jumpSt[key], host = new URL(j.url).host;
    const now = Date.now();
    if (now - (jumpLast[key] || 0) < GAP_MS) return;
    jumpLast[key] = now;
    jumpCancelArmed(key);
    btn.classList.add('gap'); setTimeout(() => btn.classList.remove('gap'), GAP_MS);
    if (st?.mode !== 'armed') {
      if (st) jumpReset(key);
      btn.classList.add('armed');
      jumpTip(btn, `<b>再次点击跳转页面</b><span class="url">${host}</span>`, ARM_MS);
      jumpSt[key] = { mode: 'armed', timer: setTimeout(() => jumpReset(key), ARM_MS) };
      return;
    }
    clearTimeout(st.timer);
    btn.classList.remove('armed');
    post({ type: 'openBrowser', url: j.url });
    jumpTip(btn, `已在浏览器打开${j.name}<span class="url">${host}</span>`, 0, 'done');
    jumpSt[key] = { mode: 'done', timer: setTimeout(() => jumpReset(key), 1500) };
  }

  /* ---------- 检查更新 ----------
     启动时最多每天查一次修改版的发布列表，查不到不打扰；有新版本才在顶栏出现按钮，跳到发布页，不自动安装。
     不能用 GitHub 的 releases/latest：它不算预发布版，只有预发布版时返回 404。 */
  const RELEASES_API = 'https://api.github.com/repos/fenghuali91917878hajimi/AstralParty.Toys/releases?per_page=20';
  const RELEASES_PREFIX = 'https://github.com/fenghuali91917878hajimi/AstralParty.Toys/releases/';
  const UPDATE_KEY = 'v2UpdateCheck', UPDATE_EVERY = 24 * 3600 * 1000;
  const Update = { status: 'idle', available: false, latest: null, checkedAt: 0 };   // status: idle / checking / latest / available / failed

  // 1.4.0-mod.2 → [1, 4, 0, 2]；不是这种格式的标签不当作版本
  function parseVersion(text) {
    const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-mod\.(\d+))?(?:\+.*)?$/.exec(String(text || '').trim());
    return m ? [+m[1], +m[2], +m[3], +(m[4] || 0)] : null;
  }
  function isNewer(a, b) {
    for (let i = 0; i < 4; i++) if (a[i] !== b[i]) return a[i] > b[i];
    return false;
  }
  function pickNewest(releases) {
    let best = null;
    for (const r of Array.isArray(releases) ? releases : []) {
      const v = parseVersion(r?.tag_name);
      if (!v || r.draft || !String(r.html_url).startsWith(RELEASES_PREFIX)) continue;
      if (!best || isNewer(v, best.v)) best = { v, tag: r.tag_name, url: r.html_url };
    }
    return best && { tag: best.tag, url: best.url };
  }
  function applyUpdate(latest, checkedAt) {
    const cur = parseVersion(window.VersionModule?.info?.version), v = parseVersion(latest?.tag);
    const available = !!(cur && v && isNewer(v, cur));
    Object.assign(Update, { status: available ? 'available' : 'latest', available, latest: latest || null, checkedAt });
    drawUpdate();
  }
  function drawUpdate() {
    const box = $('v2UpdateJump');
    if (box) {
      const on = Update.available;   // 正在查或这次查失败时，上次查到的新版本仍然有效
      box.hidden = !on;
      if (on) {
        JUMPS.update = { name: '新版本发布页', url: Update.latest.url };
        box.querySelector('button').innerHTML = `${ICON.download}有新版本 ${esc(Update.latest.tag)}`;
      }
    }
    document.dispatchEvent(new Event('v2update'));
  }
  async function checkUpdate() {
    if (Update.status === 'checking') return;
    Update.status = 'checking'; drawUpdate();
    try {
      const res = await fetch(RELEASES_API, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const latest = pickNewest(await res.json()), now = Date.now();
      try { localStorage.setItem(UPDATE_KEY, JSON.stringify({ at: now, latest })); } catch { /* 存不了下次再查 */ }
      applyUpdate(latest, now);
    } catch {
      Update.status = 'failed'; drawUpdate();
    }
  }
  // 启动时：一天内查过就用上次的结果，否则查一次。版本号要等宿主发来才知道，所以挂在版本消息后面
  function autoCheckUpdate() {
    if (autoCheckUpdate.done) return; autoCheckUpdate.done = true;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(UPDATE_KEY) || 'null'); } catch { /* 当作没查过 */ }
    if (saved && Date.now() - saved.at < UPDATE_EVERY) applyUpdate(saved.latest, saved.at);
    else checkUpdate().then(() => { if (Update.status === 'failed') { Update.status = 'idle'; drawUpdate(); } });
  }

  function mountTopbar() {
    const header = document.querySelector('.global-header');
    const chip = $('appVersionChip');
    if (!header || $('v2TopLinks')) return;
    const box = document.createElement('div');
    box.id = 'v2TopLinks';
    box.style.cssText = 'display:flex;align-items:center;gap:4px';
    box.innerHTML = `
      <div class="v2-jump" id="v2UpdateJump" hidden><button class="v2-tb-btn v2-update-btn" data-v2jump="update"></button><div class="v2-jump-tip" role="status" aria-live="polite"></div></div>
      <div class="v2-jump"><button class="v2-tb-btn" data-v2jump="wiki">${ICON.book}WIKI</button><div class="v2-jump-tip" role="status" aria-live="polite"></div></div>
      <div class="v2-jump"><button class="v2-tb-btn" data-v2jump="github">${ICON.ext}GitHub</button><div class="v2-jump-tip" role="status" aria-live="polite"></div></div>
      <div class="v2-tb-sep"></div>`;
    // 布局（仿 BazaarPlusPlus）：图标 名称 版本 …… WIKI GitHub │ 最小化 最大化 关闭
    const brand = header.querySelector('.brand-section');
    if (brand && chip) brand.after(chip);
    const spacer = document.createElement('div'); spacer.className = 'v2-top-spacer';
    const win = document.createElement('div');
    win.className = 'v2-winbtns';
    win.innerHTML = `
      <button class="v2-win" data-v2win="windowMinimize" title="最小化" aria-label="最小化"><svg viewBox="0 0 10 10"><path d="M0 5h10"/></svg></button>
      <button class="v2-win" data-v2win="windowToggleMaximize" title="最大化" aria-label="最大化"><svg viewBox="0 0 10 10" class="max"><rect x="0.5" y="0.5" width="9" height="9"/></svg>
        <svg viewBox="0 0 10 10" class="restore"><path d="M2.5 2.5V0.5h7v7h-2"/><rect x="0.5" y="2.5" width="7" height="7"/></svg></button>
      <button class="v2-win close" data-v2win="windowClose" title="关闭" aria-label="关闭"><svg viewBox="0 0 10 10"><path d="M0 0l10 10M10 0L0 10"/></svg></button>`;
    header.append(spacer, box, win);
    box.addEventListener('click', e => { const b = e.target.closest('[data-v2jump]'); if (b) jumpClick(b); });
    win.addEventListener('click', e => { const b = e.target.closest('[data-v2win]'); if (b) post({ type: b.dataset.v2win }); });
    document.addEventListener('pointerdown', e => { if (!e.target.closest?.('.v2-jump')) jumpCancelArmed(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { jumpCancelArmed(); closeMenu(); } });

    // 拖动顶栏空白处移动窗口；双击最大化 / 还原。
    // 按下后宿主马上接管鼠标（系统的拖动循环），网页收不到 dblclick，所以自己按两次按下的间隔判断双击。
    let lastDown = 0, lastX = 0, lastY = 0;
    header.addEventListener('mousedown', e => {
      if (e.button !== 0 || e.target.closest('button, a, input, select, textarea, .v2-jump-tip')) return;
      const now = Date.now(), dbl = now - lastDown < 400 && Math.abs(e.screenX - lastX) < 6 && Math.abs(e.screenY - lastY) < 6;
      lastDown = dbl ? 0 : now; lastX = e.screenX; lastY = e.screenY;
      e.preventDefault();
      post({ type: dbl ? 'windowToggleMaximize' : 'windowDrag' });
    });
    post({ type: 'windowStateGet' });
  }

  /* ---------- 概览 ---------- */
  const profiles = () => AppState.gameProfiles?.profiles || [];
  const activeGame = () => profiles().find(p => p.active);
  const isBypass = () => !!$('launchBypassSteam')?.checked;
  const launchBusy = () => $('btnMenuLaunchGame')?.dataset.busy === '1';
  const modeLocked = () => !!$('launchViaSteam')?.disabled;
  const gameRunning = () => !!(V2.modStatus?.gameRunning ?? AppState.replayLibrary?.gameRunning);

  // 加载器状态 → 一句话（与原版 ModsModule.renderStatusHeader 的分支一致）
  function loaderText(s) {
    if (!s) return '';
    if (s.bundleLoaderPresent === false) return '加载器：缺少内置文件';
    if (s.loaderMissing) return s.loaderDisabled ? '加载器已停用' : '加载器 DLL 缺失';
    if (!s.installed) return '加载器未安装';
    if (!s.loaderManaged) return '加载器文件不属于本工具';
    const on = (s.mods || []).filter(m => m.enabled !== false).length;
    return `CesiumLoader ${s.installedVersion ? 'v' + s.installedVersion : ''} · ${on} 个模组已启用`;
  }

  function latestReplay() {
    const entries = (AppState.replayLibrary?.entries || []).slice().sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0));
    return entries[0];
  }

  /* ---------- 首次使用引导 ----------
     显示哪一步完全看真实状态（有没有游戏目录、加载器装没装），不记「看过引导」，两步都完成后卡片自动消失。
     只有「以后再说」记在 localStorage：不想用模组的人不用一直看到它。 */
  const Guide = { scan: null, autoScanned: false, drive: '', othersOpen: false, installing: false, justInstalled: false, installTimer: null };
  const GUIDE_SKIP_KEY = 'v2GuideSkipLoader';
  const guideSkipped = () => { try { return localStorage.getItem(GUIDE_SKIP_KEY) === '1'; } catch { return false; } };
  const isAstralExe = name => /^AstralParty/i.test(name || '');
  const SCAN_SOURCES = { steam: 'Steam 库', registry: '注册表', common: '常见位置', deep: '深度扫描' };

  function guideStartScan(mode, drive) {
    Guide.scan = { mode, running: true, message: mode === 'deep' ? `正在扫描 ${drive}` : '正在查找…', candidates: [] };
    post(mode === 'deep' ? { type: 'gameScanDeep', drive } : { type: 'gameScanQuick' });
  }

  function guideSteps(step) {
    const item = (n, label) => `<span class="v2-guide-step ${n === step ? 'on' : n < step ? 'done' : ''}"><i>${n < step ? ICON.check : n}</i>${label}</span>`;
    return `<div class="v2-guide-steps">${item(1, '找到游戏')}<span class="v2-guide-sep"></span>${item(2, '安装模组')}</div>`;
  }

  function guideScanRows(list, firstPrimary) {
    return list.map(([c, i], n) => `<div class="v2-row">
        <span class="k"><span class="v2-tag">${esc(c.editionLabel || '')}</span></span>
        <span class="v v2-guide-cand">${esc(c.exeName || '')} ${c.valid ? '' : '<span class="v2-badge warn" title="没检测到标准 Unity 结构">结构可疑</span>'}
          <span class="v2-muted">· ${SCAN_SOURCES[c.source] || ''}</span><br><span class="v2-muted mono">${esc(c.directory)}</span></span>
        <button class="v2-btn ${firstPrimary && n === 0 ? 'primary' : 'line'}" data-v2="guideUse" data-i="${i}">用这个</button></div>`).join('');
  }

  // 第 1 步：还没有游戏目录。启动时已经查过一遍 Steam，这里再查注册表和常见位置，都只读。
  function guideFindHtml() {
    const sc = Guide.scan;
    const hint = '<p class="v2-guide-hint">要找的是 <span class="mono">AstralParty</span> 开头的 exe 所在的文件夹。Steam 版通常在 <span class="mono">steamapps\\common\\Astral Party</span> 下面的子文件夹里。</p>';
    let body;
    if (!sc || sc.running) {
      body = `<div class="v2-guide-body"><b>${sc?.mode === 'deep' ? '正在深度扫描' : '正在查找吉星派对'}…</b>
        <p class="v2-muted">${esc(sc?.message || '正在读取游戏目录…')}${sc?.current ? `<br><span class="mono">${esc(sc.current)}</span>` : ''}</p>
        <div class="v2-guide-progress"><i></i></div>
        ${sc?.mode === 'deep' ? '<div class="v2-guide-actions"><button class="v2-btn ghost" data-v2="guideCancel">取消</button></div>' : ''}</div>`;
    } else {
      // 其他 Unity 游戏也可能被列出来，只把 AstralParty*.exe 放在前面（和设置页同样的处理）
      const all = (sc.candidates || []).map((c, i) => [c, i]);
      const main = all.filter(([c]) => isAstralExe(c.exeName)), others = all.filter(([c]) => !isAstralExe(c.exeName));
      const othersHtml = others.length ? `<details class="v2-mini v2-guide-others" id="v2GuideOthers" ${Guide.othersOpen ? 'open' : ''}>
          <summary>还找到 ${others.length} 个别的游戏（多半不是吉星派对）</summary>${guideScanRows(others, false)}</details>` : '';
      if (main.length) {
        body = `<div class="v2-guide-body"><b>${main.length === 1 ? '找到了吉星派对，确认一下目录对不对' : `找到 ${main.length} 个吉星派对，选一个作为当前游戏`}</b>
            ${main.length > 1 ? '<p class="v2-muted">另一个以后可以在「设置 → 游戏目录」里添加。</p>' : ''}</div>
          ${guideScanRows(main, true)}${othersHtml}
          <div class="v2-row v2-guide-foot"><span class="v v2-muted">都不对？</span>
            <button class="v2-btn ghost" data-v2="browseGame">${ICON.folder}手动选择…</button>
            <button class="v2-btn ghost" data-v2="guideRescan">${ICON.refresh}重新查找</button></div>`;
      } else {
        const drives = AppState.gameProfiles?.drives || [];
        // 取消或出错时宿主只给一句话（没有扫描结果），不能说成「没找到」
        body = `<div class="v2-guide-body"><b>${sc.message ? esc(sc.message) : sc.mode === 'deep' ? '这个盘上没找到吉星派对' : '常见位置没找到吉星派对'}</b>
            <p class="v2-muted">请先确认游戏已经安装。然后可以直接选择游戏文件夹，或者对某个盘做深度扫描（会慢一些）。</p>
            <div class="v2-guide-actions">
              <select id="v2GuideDrive" class="v2-select" style="min-width:90px">${drives.map(d => `<option ${d === Guide.drive ? 'selected' : ''}>${esc(d)}</option>`).join('')}</select>
              <button class="v2-btn line" data-v2="guideDeep" ${drives.length ? '' : 'disabled'}>${ICON.search}深度扫描</button>
              <button class="v2-btn ghost" data-v2="guideRescan">${ICON.refresh}重新查找</button>
              <span class="v2-top-spacer"></span>
              <button class="v2-btn primary" data-v2="browseGame">${ICON.folder}手动选择文件夹…</button></div></div>${othersHtml}`;
      }
    }
    return `<div class="v2-page"><div class="v2-head"><h1>开始使用</h1></div>
      <div class="v2-card v2-guide">${guideSteps(1)}${body}</div>${hint}</div>`;
  }

  // 第 2 步要不要显示、显示哪种。停用 / DLL 缺失不算第一次安装，交给模组页处理
  function guideLoaderState(g, s) {
    if (!s || !s.gameDirectory || g.directoryExists === false || s.loaderMissing) return null;
    if (s.installed) return s.loaderManaged ? null : 'foreign';
    return s.bundleLoaderPresent === false ? 'bundle' : 'install';
  }

  function guideInstallHtml(g, s, state) {
    if (Guide.justInstalled) {
      const on = (s?.mods || []).filter(m => m.enabled !== false).length;
      return `<div class="v2-card v2-guide">${guideSteps(3)}
        <div class="v2-guide-body"><b>模组装好了</b>
          <p class="v2-muted">${on} / ${(s?.mods || []).length} 个模组已启用，${s?.gameRunning ? '游戏正在运行，重启游戏后生效' : '启动游戏后生效'}。想开关或配置模组，去「模组」页。</p>
          <div class="v2-guide-actions"><span class="v2-top-spacer"></span>
            <button class="v2-btn ghost" data-v2page="mods">去模组页</button>
            <button class="v2-btn ghost" data-v2="guideDone">知道了</button></div></div></div>`;
    }
    if (!state || guideSkipped()) return '';
    const later = '<button class="v2-btn ghost" data-v2="guideSkip">以后再说</button>';
    let inner;
    if (state === 'foreign') {
      inner = `<b>游戏目录里已经有别的 version.dll</b>
        <p class="v2-muted">它不是本工具装的（可能是旧版变速器或第三方文件），所以不能直接安装。去模组页看处理办法。</p>
        <div class="v2-guide-actions"><span class="v2-top-spacer"></span>${later}
          <button class="v2-btn primary" data-v2page="mods">去模组页处理</button></div>`;
    } else if (state === 'bundle') {
      inner = `<b>现在没法安装模组</b>
        <p class="v2-muted">这个程序缺少内置的加载器文件，请换用完整发布包。</p>
        <div class="v2-guide-actions"><span class="v2-top-spacer"></span>${later}</div>`;
    } else {
      const count = (window.ModsModule?.builtInMods || []).length;
      inner = `<b>安装模组</b>
        <p class="v2-muted">模组要靠加载器 CesiumLoader 才能运行。点一下，就会把加载器${s.embeddedVersion ? ` v${esc(s.embeddedVersion)}` : ''}和${count ? ` ${count} 个` : ''}内置模组一起装进游戏目录。不需要联网，以后可以在「模组」页开关或卸载。</p>
        <p class="v2-muted">模组不是游戏官方提供的，在线使用可能违反游戏规则，风险自负。</p>
        ${s.gameRunning ? `<div class="v2-notice">${ICON.info}<span>游戏正在运行：可以安装，但要重启游戏才生效</span></div>` : ''}
        ${g.exeName && !isAstralExe(g.exeName) ? `<div class="v2-notice">${ICON.info}<span>这个目录的主程序是 ${esc(g.exeName)}，看起来不是吉星派对，请确认目录没选错</span></div>` : ''}
        <div class="v2-guide-target"><span class="v2-muted">装到</span><span class="mono" title="${esc(g.directory)}">${esc(g.directory)}</span>
          <button class="v2-btn ghost" data-v2="gameMenu" data-v2menu>换目录${ICON.down}</button></div>
        <div class="v2-guide-actions"><span class="v2-top-spacer"></span>${later}
          <button class="v2-btn primary big" data-v2="guideInstall" ${Guide.installing ? 'disabled' : ''}>${ICON.download}${Guide.installing ? '正在安装…' : '安装模组'}</button></div>`;
    }
    return `<div class="v2-card v2-guide">${guideSteps(2)}<div class="v2-guide-body">${inner}</div></div>`;
  }

  function guideInstallNow() {
    Guide.installing = true;
    clearTimeout(Guide.installTimer);
    // 宿主出错会发 error；万一什么都没回，两分钟后解锁按钮（和原版 setBusy 的兜底一样）
    Guide.installTimer = setTimeout(() => { Guide.installing = false; renderHome(); }, 120000);
    post({ type: 'modInstall', overwriteDll: false, allowDowngrade: false, includeSample: true });   // 和模组页的安装按钮同一条消息
    renderHome();
  }

  function renderHome() {
    const root = $('v2Home');
    if (!root) return;
    // 引导卡片里的下拉框和折叠区，重画后要保持用户刚才的选择
    const driveEl = $('v2GuideDrive'), othersEl = $('v2GuideOthers');
    if (driveEl) Guide.drive = driveEl.value;
    if (othersEl) Guide.othersOpen = othersEl.open;
    const g = activeGame();
    if (!g) {
      // 打开就自动查一次（只读）；要等游戏目录数据回来，才能确定是真的没有
      if (AppState.gameProfiles && !Guide.scan && !Guide.autoScanned) { Guide.autoScanned = true; guideStartScan('quick'); }
      root.innerHTML = guideFindHtml();
      return;
    }
    const s = V2.modStatus;
    const guideState = guideLoaderState(g, s);
    const guideHtml = guideInstallHtml(g, s, guideState);
    // 每页只有一个粉色主按钮：引导还没走完时，启动按钮让位
    const launchCls = guideHtml && !Guide.justInstalled && guideState !== 'bundle' ? 'line' : 'primary';
    const busy = launchBusy(), locked = modeLocked();
    const last = latestReplay();
    const cardSkin = V2.skins && (V2.skins.profiles || []).find(p => p.name?.toLowerCase() === (V2.skins.activeSkin || '').toLowerCase());
    const charScheme = V2.chars && (V2.chars.schemeProfiles || []).find(p => p.id === V2.chars.activeSchemeId);
    const activeSkin = V2.skins?.activeSkin || '';
    const cardName = cardSkin ? (cardSkin.displayName || cardSkin.name)
      : activeSkin === '__game_default__' ? '游戏默认' : activeSkin;
    const skinText = [V2.skins && cardName && `卡牌「${cardName}」`, V2.chars && `角色「${charScheme?.scheme?.name || '未启用'}」`]
      .filter(Boolean).join(' · ') || '卡牌、角色、音效、资源包';

    root.innerHTML = `<div class="v2-page">
      <div class="v2-head"><h1>概览</h1></div>
      ${guideHtml}
      <div class="v2-card">
        <div class="v2-hero">
          <div class="v2-hero-art game-icon"><img src="images/astralparty-game-icon.png" alt="吉星派对"></div>
          <div class="v2-hero-text">
            <div class="v2-hero-title">吉星派对 <span class="v2-tag">${esc(g.editionLabel || '')}</span>
              ${gameRunning() ? '<span class="v2-badge pink">运行中</span>' : g.directoryExists === false ? '<span class="v2-badge warn">目录不存在</span>' : '<span class="v2-badge">就绪</span>'}</div>
            <div class="v2-hero-sub">${s ? esc(loaderText(s)) : '正在读取加载器状态…'}</div>
          </div>
          <div class="v2-split">
            <button class="v2-btn ${launchCls} big" data-v2="launch" ${busy ? 'disabled' : ''}>${ICON.play}${busy ? '正在启动…' : '启动游戏'}</button>
            <button class="v2-btn ${launchCls} big" data-v2="launchMenu" data-v2menu title="启动方式">${ICON.down}</button>
          </div>
        </div>
        <div class="v2-row"><span class="k">游戏目录</span><span class="v mono" title="${esc(g.directory)}">${esc(g.directory)}</span>
          <button class="v2-icon-btn" data-v2="copyPath" title="复制路径">${ICON.copy}</button>
          <button class="v2-btn ghost" data-v2="gameMenu" data-v2menu>${ICON.folder}${esc(g.label || g.editionLabel || '切换')}${ICON.down}</button></div>
        <div class="v2-row"><span class="k">启动方式</span>
          <span class="v">${isBypass() ? '绕过 Steam 启动' : '从 Steam 启动'}${locked ? '　<span class="v2-muted">游戏启动中，稍后可切换</span>' : ''}</span></div>
      </div>

      <div class="v2-card">
        <div class="v2-row link" data-v2="openLast"><span class="k">最近对局</span>
          <span class="v">${last ? esc([last.finishText, last.mapName, last.roundCount ? last.roundCount + ' 回合' : ''].filter(v => v && v !== '—').join(' · ') || ('#' + last.replayId))
            : '<span class="v2-muted">还没有回放</span>'}</span>${ICON.right}</div>
        <div class="v2-row link" data-v2page="mods"><span class="k">模组</span>
          <span class="v">${s ? `${(s.mods || []).filter(m => m.enabled !== false).length} / ${(s.mods || []).length} 已启用` : '<span class="v2-muted">查看与配置模组</span>'}</span>${ICON.right}</div>
        <div class="v2-row link" data-v2page="skins"><span class="k">自定义</span>
          <span class="v">${esc(skinText)}</span>${ICON.right}</div>
      </div>

      <details class="v2-card">
        <summary><div class="t"><b>高级操作</b><small>扫描游戏目录、管理多个游戏版本</small></div>${ICON.down}</summary>
        <div class="v2-adv">
          <div class="v2-row"><span class="n">快速扫描</span><span class="d">在 Steam 库和常见位置查找游戏</span><button class="v2-btn line" data-v2="scanQuick">扫描</button></div>
          <div class="v2-row"><span class="n">管理游戏目录</span><span class="d">添加、改名、移除、深度扫描</span><button class="v2-btn line" data-v2page="settings">打开</button></div>
        </div>
      </details>
    </div>`;
  }

  // 用原版的单选框切换启动方式：触发它自己的 change 处理（记住选择 + setSteamBypass）
  function setLaunchMode(bypass) {
    const radio = $(bypass ? 'launchBypassSteam' : 'launchViaSteam');
    if (!radio || radio.disabled || radio.checked) return;
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));
    renderHome();
    toast(bypass ? '已切到绕过 Steam：不能用 Steam 大厅与邀请' : '已切到从 Steam 启动');
  }

  const actions = {
    launch: () => {
      if (launchBusy()) return;
      window.HomeModule?.launchGame();   // 原版：锁启动按钮 5 秒、启动方式 6 秒
      renderHome();
      setTimeout(renderHome, 5100); setTimeout(renderHome, 6100);
    },
    launchMenu: el => {
      const locked = modeLocked(), bypass = isBypass();
      openMenu(el, [
        { label: '从 Steam 启动', icon: bypass ? ICON.dot : ICON.check, disabled: locked, fn: () => setLaunchMode(false) },
        { label: '绕过 Steam 启动', icon: bypass ? ICON.check : ICON.dot, disabled: locked, fn: () => setLaunchMode(true) },
        ...(locked ? ['-', { label: '游戏启动中，稍后再切换', disabled: true }] : []),
      ]);
    },
    gameMenu: el => openMenu(el, [
      ...profiles().map(p => ({
        label: `[${p.editionLabel}] ${p.label}${p.directoryExists === false ? '（目录不存在）' : ''}`,
        icon: p.active ? ICON.check : ICON.dot,
        fn: () => { if (!p.active) post({ type: 'gameProfileSetActive', id: p.id }); },
      })),
      '-',
      { label: '添加游戏目录…', icon: ICON.plus, fn: () => post({ type: 'gameProfileBrowse' }) },
      { label: '管理游戏目录…', icon: ICON.sliders, fn: () => showPage('settings') },
    ]),
    copyPath: () => {
      const dir = activeGame()?.directory; if (!dir) return;
      Promise.resolve(navigator.clipboard?.writeText(dir)).then(() => toast('已复制路径'), () => toast('复制失败：' + dir));
    },
    openLast: () => {
      const last = latestReplay();
      if (!last) return showPage('tools');
      if (last.healthy === false) { toast('这局无法解析：' + (last.error || '')); return showPage('tools'); }
      post({ type: 'openRecentReplay', token: last.token });   // 宿主解析完会自己切到回放页
    },
    scanQuick: () => { showPage('settings'); window.GameLibModule?.startQuickScan?.(); },
    browseGame: () => post({ type: 'gameProfileBrowse' }),
    guideRescan: () => { guideStartScan('quick'); renderHome(); },
    guideDeep: () => { const d = $('v2GuideDrive')?.value; if (d) { Guide.drive = d; guideStartScan('deep', d); renderHome(); } },
    guideCancel: () => post({ type: 'gameScanCancel' }),
    guideUse: el => {
      const c = Guide.scan?.candidates?.[Number(el.dataset.i)];
      if (c) post({ type: 'gameProfileAddPath', directory: c.directory, activate: true });
    },
    guideInstall: () => {
      const g = activeGame();
      if (Guide.installing || !g) return;
      if (!g.exeName || isAstralExe(g.exeName)) return guideInstallNow();
      // 手动选的目录可能是别的 Unity 游戏：装之前再确认一次
      modalActions.confirmYes = () => { closeModal(); guideInstallNow(); };
      const m = openModal(`
        <div class="v2-confirm"><div class="v2-confirm-icon" style="background:rgba(250,204,21,.12);color:var(--gp-gold)">${ICON.download}</div>
          <div><b class="v2-confirm-title">这个目录看起来不是吉星派对，还要安装吗？</b>
            <ul class="v2-confirm-lines"><li>主程序是 <b>${esc(g.exeName)}</b>，不是 AstralParty 开头</li>
              <li>加载器会写进：${esc(g.directory)}</li>
              <li>只有渠道版改过主程序名才需要继续，否则请取消后换目录</li></ul></div></div>
        <div class="v2-modal-foot"><span class="v2-top-spacer"></span><button class="v2-btn ghost" data-v2modal="close" id="v2ConfirmNo">取消</button>
          <button class="v2-btn danger-fill" data-v2modal="confirmYes">仍然安装</button></div>`, 'narrow');
      armDanger(m); $('v2ConfirmNo')?.focus();
    },
    guideSkip: () => {
      try { localStorage.setItem(GUIDE_SKIP_KEY, '1'); } catch { /* 存不了就隐藏不了，不影响使用 */ }
      renderHome();
      toast('以后想装模组，去「模组」页点「安装加载器」');
    },
    guideDone: () => { Guide.justInstalled = false; renderHome(); },
  };

  // 给后面各页（v2-replays.js 等）用的公共件
  /* 搜索框：结果要重画页面，但输入法还在拼字时不能重画，否则拼音会被打断、叠在一起（实测：nihao 变成 nninihniha…）。
     所以拼字期间不搜索，选完字（compositionend）再搜；各页的 render() 开头用 isComposing() 挡住其他消息触发的重画。 */
  let composingBox = null;
  const isComposing = () => !!composingBox && composingBox === document.activeElement;
  function bindSearch(id, apply) {
    const box = $(id); if (!box) return;
    const run = () => {
      apply(box.value);
      const n = $(id);
      if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
    };
    box.oninput = e => { if (!e.isComposing) run(); };
    box.oncompositionstart = () => { composingBox = box; };
    box.oncompositionend = () => { composingBox = null; run(); };
  }

  window.V2UI = { Update, checkUpdate, ICON, openMenu, closeMenu, openModal, closeModal, modalActions, armDanger, confirmDelete, bindSearch, isComposing,
    setModalCancel: fn => { modalCancel = fn; } };

  /* ---------- 接线 ---------- */
  function onShowHome() {
    renderHome();
    // 概览要显示加载器和模组数：主动要一次（与模组页同一条消息，10 秒内不重复要）
    if (Date.now() - V2.lastModStatusAsk > 10000) { V2.lastModStatusAsk = Date.now(); post({ type: 'modStatus' }); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    mountTopbar();
    renderHome();

    // 收到版本号后才能比较新旧（包一层原版方法，不改它的行为）
    const vm = window.VersionModule;
    if (vm?.render) {
      const render = vm.render;
      vm.render = function (...args) { const r = render.apply(this, args); if (this.info?.version) autoCheckUpdate(); return r; };
      if (vm.info?.version) autoCheckUpdate();
    }

    // 游戏多开的删除确认换成统一的弹窗；真正删除的消息和原版一样
    if (window.AccountProfilesModule) AccountProfilesModule.confirmDelete = profile => confirmDelete({
      title: `删除账号档案「${esc(profile.name)}」？`,
      lines: ['这个档案的账号缓存、存档和回放会移进<b>回收站</b>，可以从回收站找回', '默认目录（游戏自己的目录）不受影响'],
      onOk: () => post({ type: 'accountProfileDelete', name: profile.name }),
    });

    document.addEventListener('click', e => {
      const a = e.target.closest('[data-v2]'), p = e.target.closest('[data-v2page]');
      if (a && !a.disabled) actions[a.dataset.v2]?.(a);
      if (p) showPage(p.dataset.v2page);
    });

    // 进入概览时刷新（包一层原版 showPage，不改它的行为）
    const originalShowPage = window.showPage;
    window.showPage = function (page, options) {
      originalShowPage(page, options);
      if (page === 'home') onShowHome();
    };
    onShowHome();
  });

  // 原版 core.js 已在处理这些消息；这里只是额外听一份，用来刷新概览
  window.chrome?.webview?.addEventListener('message', event => {
    const msg = event.data;
    if (!msg?.type) return;
    switch (msg.type) {
      case 'windowState': {
        // 最大化时按钮换成「还原」图标
        document.body.classList.toggle('v2-maximized', !!msg.maximized);
        const b = document.querySelector('[data-v2win="windowToggleMaximize"]');
        if (b) { b.title = msg.maximized ? '还原' : '最大化'; b.setAttribute('aria-label', b.title); }
        return;
      }
      case 'modStatus':
        V2.modStatus = msg.payload?.status ?? msg.payload;
        // 只有真的装好才算完成：安装前发出的状态请求也可能在这时才回来
        if (Guide.installing && V2.modStatus?.installed && V2.modStatus?.loaderManaged) {
          Guide.installing = false; Guide.justInstalled = true; clearTimeout(Guide.installTimer);
        }
        break;
      case 'error':
        if (!Guide.installing) return;
        Guide.installing = false; clearTimeout(Guide.installTimer);
        break;
      case 'gameScanProgress': {
        const p = msg.payload || {};
        Guide.scan = { mode: p.mode, running: !!p.running, message: p.message, current: p.current, candidates: Guide.scan?.candidates || [] };
        break;
      }
      case 'gameScanResult':
        Guide.scan = { mode: msg.payload?.mode, running: false, candidates: msg.payload?.candidates || [] };
        break;
      case 'skinsProfiles': V2.skins = msg.payload; break;
      case 'characterSkins': V2.chars = msg.payload; break;
      case 'gameProfiles':
        // 程序启动时，概览可能赶在自动添加游戏之前要过状态，那份没有游戏目录，这里补要一次
        if ((msg.payload?.profiles || []).some(p => p.active) && !V2.modStatus?.gameDirectory) {
          V2.lastModStatusAsk = Date.now(); post({ type: 'modStatus' });
        }
        break;
      case 'replayLibrary': case 'homeData': case 'steamBypassSync': break;
      default: return;
    }
    if (AppState.currentPage === 'home') setTimeout(renderHome);   // 等原版处理完（比如头像、单选框）再画
  });
})();
