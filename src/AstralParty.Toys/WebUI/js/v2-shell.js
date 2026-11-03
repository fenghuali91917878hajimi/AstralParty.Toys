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

  /* ---------- 顶栏外部跳转（攻略 / GitHub） ----------
     第一次点：按钮下方提示「再次点击跳转页面」，3 秒内再点才打开；两次点击至少隔 0.5 秒。 */
  const JUMPS = {
    wiki: { name: 'BWiki 攻略', url: 'https://wiki.biligame.com/starengine/%E9%A6%96%E9%A1%B5' },
    github: { name: 'GitHub 仓库', url: 'https://github.com/higashitaniyume/AstralParty.Toys' },
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

  function mountTopbar() {
    const header = document.querySelector('.global-header');
    const chip = $('appVersionChip');
    if (!header || $('v2TopLinks')) return;
    const box = document.createElement('div');
    box.id = 'v2TopLinks';
    box.style.cssText = 'display:flex;align-items:center;gap:4px';
    box.innerHTML = `
      <div class="v2-jump"><button class="v2-tb-btn" data-v2jump="wiki">${ICON.book}攻略</button><div class="v2-jump-tip" role="status" aria-live="polite"></div></div>
      <div class="v2-jump"><button class="v2-tb-btn" data-v2jump="github">${ICON.ext}GitHub</button><div class="v2-jump-tip" role="status" aria-live="polite"></div></div>
      <div class="v2-tb-sep"></div>`;
    // 布局（仿 BazaarPlusPlus）：图标 名称 版本 …… 攻略 GitHub │ 最小化 最大化 关闭
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

  function renderHome() {
    const root = $('v2Home');
    if (!root) return;
    const g = activeGame();
    if (!g) {
      // 还没有游戏目录（完整引导页在后续阶段做；这里先给出两条路）
      root.innerHTML = `<div class="v2-page"><div class="v2-head"><h1>欢迎</h1></div>
        <div class="v2-card">
          <div class="v2-hero"><div class="v2-hero-art">★</div><div class="v2-hero-text">
            <div class="v2-hero-title">第一次安装需要游戏文件夹</div>
            <div class="v2-hero-sub">回放、模组、皮肤都要用到游戏目录。找到以后随时可以在设置里改。</div></div></div>
          <div class="v2-row" style="justify-content:flex-end;gap:8px">
            <button class="v2-btn ghost" data-v2="browseGame">${ICON.folder}手动选择文件夹…</button>
            <button class="v2-btn primary big" data-v2="scanQuick">${ICON.search}自动查找</button></div>
        </div></div>`;
      return;
    }
    const portrait = AppState.currentPortrait;
    const s = V2.modStatus;
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
      <div class="v2-card">
        <div class="v2-hero">
          <div class="v2-hero-art">${portrait?.url ? `<img src="${esc(portrait.url)}" alt="${esc(portrait.heroName || '')}">` : '★'}</div>
          <div class="v2-hero-text">
            <div class="v2-hero-title">吉星派对 <span class="v2-tag">${esc(g.editionLabel || '')}</span>
              ${gameRunning() ? '<span class="v2-badge pink">运行中</span>' : g.directoryExists === false ? '<span class="v2-badge warn">目录不存在</span>' : '<span class="v2-badge">就绪</span>'}</div>
            <div class="v2-hero-sub">${s ? esc(loaderText(s)) : '正在读取加载器状态…'}</div>
          </div>
          <div class="v2-split">
            <button class="v2-btn primary big" data-v2="launch" ${busy ? 'disabled' : ''}>${ICON.play}${busy ? '正在启动…' : '启动游戏'}</button>
            <button class="v2-btn primary big" data-v2="launchMenu" data-v2menu title="启动方式">${ICON.down}</button>
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
  };

  /* ---------- 市场占位 ---------- */
  function renderMarket() {
    const root = $('v2Market'); if (!root) return;
    root.innerHTML = `<div class="v2-page"><div class="v2-head"><h1>市场</h1></div>
      <div class="v2-card v2-coming">
        <div class="v2-coming-icon">${ICON.sparkles}</div>
        <h2>Coming soon</h2>
        <p>社区模组市场正在接入，暂时还不能在这里浏览和安装。</p>
        <p class="v2-muted">现在想装模组：下载好的 DLL / ZIP 用「模组 → 导入模组」装进来。</p>
        <button class="v2-btn line" data-v2page="mods" style="margin-top:10px">去模组页</button>
      </div></div>`;
  }

  // 给后面各页（v2-replays.js 等）用的公共件
  window.V2UI = { ICON, openMenu, closeMenu, openModal, closeModal, modalActions, armDanger, confirmDelete,
    setModalCancel: fn => { modalCancel = fn; } };

  /* ---------- 接线 ---------- */
  function onShowHome() {
    renderHome();
    // 概览要显示加载器和模组数：主动要一次（与模组页同一条消息，10 秒内不重复要）
    if (Date.now() - V2.lastModStatusAsk > 10000) { V2.lastModStatusAsk = Date.now(); post({ type: 'modStatus' }); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    mountTopbar();
    renderMarket();
    renderHome();

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
      case 'modStatus': V2.modStatus = msg.payload?.status ?? msg.payload; break;
      case 'skinsProfiles': V2.skins = msg.payload; break;
      case 'characterSkins': V2.chars = msg.payload; break;
      case 'gameProfiles': case 'replayLibrary': case 'homeData': case 'steamBypassSync': break;
      default: return;
    }
    if (AppState.currentPage === 'home') setTimeout(renderHome);   // 等原版处理完（比如头像、单选框）再画
  });
})();
