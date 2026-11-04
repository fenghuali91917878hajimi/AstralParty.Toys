// v2-settings.js — 新界面：设置页（界面、游戏目录、回放库、关于）
// 数据仍由原版保存：语言 / 动画（i18n、localStorage）、游戏目录（GameLibModule）、回放库设置（AppState.librarySettings）、版本（VersionModule）。
// 版本详情、更新日志两个弹窗沿用原版。
(function () {
  const G = { scan: null };   // 扫描状态：{ mode, running, message, current, candidates }
  const U = () => window.V2UI;
  const I = () => window.V2UI.ICON;
  const GL = () => window.GameLibModule;
  const LS = () => AppState.librarySettings || {};
  const profiles = () => AppState.gameProfiles?.profiles || GL()?.data?.profiles || [];
  const drives = () => GL()?.data?.drives || AppState.gameProfiles?.drives || [];
  const EDITIONS = [['cn', '国服'], ['global', '国际服'], ['taptap', 'TapTap'], ['custom', '自定义']];
  // 新界面的文字目前只写了简体中文，语言固定成简体中文（设置页里的下拉框是灰的）
  const DEFAULT_LANG = 'zh-Hans';
  function enforceLanguage() {
    if ((window.i18n?.lang || DEFAULT_LANG) === DEFAULT_LANG) return;
    window.i18n?.setLanguage(DEFAULT_LANG, true);
    post({ type: 'setLanguage', language: DEFAULT_LANG });   // 宿主也用它生成回放报告里的文字
  }
  const SOURCES = { steam: 'Steam 库', registry: '注册表', common: '常见位置', deep: '深度扫描' };
  const motionOn = () => { try { return localStorage.getItem('motionEnabled') !== 'false'; } catch { return true; } };
  const MIRRORS = [['direct', '直连 GitHub'], ['gh-proxy', 'GH-Proxy 镜像'], ['ghfast', 'GHFast 镜像'], ['custom', '自定义镜像']];

  // 回放库设置：宿主收到缺字段会当成「默认 / 关闭」，所以每次都把四个字段一起送
  function saveLibrary(patch) {
    const s = { libraryRoot: LS().libraryRoot || null, autoMaintain: !!LS().autoMaintain, keepInGame: LS().keepInGame || LS().capacity || 10,
      workshopUrl: LS().workshopUrl || null, ...patch };
    s.keepInGame = Math.min(Math.max(parseInt(s.keepInGame, 10) || 10, 1), LS().capacity || 10);
    post({ type: 'librarySaveSettings', ...s });
  }

  function scanHtml() {
    const sc = G.scan;
    if (!sc) return '';
    if (sc.running) return `<div class="v2-row"><span class="v"><b style="font-weight:500">${sc.mode === 'deep' ? '正在深度扫描' : '正在查找'}…</b>
      <br><span class="v2-muted">${esc(sc.message || '')}${sc.current ? `　<span style="font-family:var(--v2-mono);font-size:12px">${esc(sc.current)}</span>` : ''}</span></span>
      ${sc.mode === 'deep' ? '<button class="v2-btn ghost" data-v2g="scanCancel">取消</button>' : ''}</div>`;
    // 实测：快速扫描会把 Steam 库里别的 Unity 游戏也列出来（Malody、缺氧、RimWorld…），容易误加。
    // 吉星派对的主程序都叫 AstralParty*.exe，其余的折叠起来
    const all = sc.candidates || [];
    const isAP = c => /^AstralParty/i.test(c.exeName || '');
    const row = (c, i) => `<div class="v2-row">
        <span class="k"><span class="v2-tag">${esc(c.editionLabel || '')}</span></span>
        <span class="v" style="white-space:normal">${esc(c.exeName || '')} ${c.valid ? '' : '<span class="v2-badge warn" title="没检测到标准 Unity 结构">结构可疑</span>'}
          <span class="v2-muted">· ${SOURCES[c.source] || ''}</span><br><span class="v2-muted" style="font-family:var(--v2-mono);font-size:12px">${esc(c.directory)}</span></span>
        ${c.alreadyAdded ? '<span class="v2-muted">已添加</span>' : `<button class="v2-btn line" data-v2g-add="${i}">添加</button>`}</div>`;
    const main = all.map((c, i) => [c, i]).filter(([c]) => isAP(c)), others = all.map((c, i) => [c, i]).filter(([c]) => !isAP(c));
    return `<div class="v2-row"><span class="v"><b style="font-weight:500">${main.length ? `找到 ${main.length} 个吉星派对` : sc.mode === 'deep' ? '这个盘上没找到 AstralParty*.exe' : '快速扫描没找到吉星派对，可以对某个盘做深度扫描'}</b></span>
        <button class="v2-btn ghost" data-v2g="scanClose" title="关闭">${I().x}</button></div>
      ${main.map(([c, i]) => row(c, i)).join('')}
      ${others.length ? `<details class="v2-mini" style="margin:0 18px 10px"><summary>还找到 ${others.length} 个别的游戏（多半不是吉星派对）</summary>
        ${others.map(([c, i]) => row(c, i)).join('')}</details>` : ''}
      <div class="v2-row"><span class="v v2-muted">深度扫描会遍历整个盘，比较慢</span>
        <select id="v2gDrive" class="v2-select" style="min-width:90px">${drives().map(d => `<option>${esc(d)}</option>`).join('')}</select>
        <button class="v2-btn line" data-v2g="scanDeep" ${drives().length ? '' : 'disabled'}>深度扫描</button></div>`;
  }

  function html() {
    const cap = LS().capacity || 10, keep = LS().keepInGame || cap;
    const info = window.VersionModule?.info;
    const mirror = LS().githubMirrorType || 'gh-proxy';
    return `<div class="v2-page">
      <div class="v2-head"><h1>设置</h1></div>

      <div class="v2-card"><div class="v2-card-title"><span>界面</span></div>
        <div class="v2-row"><span class="k">语言</span><span class="v v2-muted">新界面目前只有简体中文，暂时不能切换</span>
          <select id="v2gLang" class="v2-select" disabled title="新界面目前只有简体中文"><option value="${DEFAULT_LANG}" selected>简体中文</option></select></div>
        <div class="v2-row"><span class="k">界面动画</span><span class="v v2-muted">关掉后切页、弹窗都没有过渡动画</span>
          <label class="v2-switch"><input type="checkbox" id="v2gMotion" ${motionOn() ? 'checked' : ''}><span></span></label></div>
      </div>

      <div class="v2-card"><div class="v2-card-title"><span>游戏目录 <span class="v2-muted" style="font-weight:400">${profiles().length} 个</span></span>
          <span><button class="v2-btn ghost" data-v2g="scanQuick" ${G.scan?.running ? 'disabled' : ''}>${I().search}扫描</button>
          <button class="v2-btn ghost" data-v2g="browse">${I().plus}添加</button></span></div>
        ${profiles().map(g => `<div class="v2-row">
          <span class="k"><span class="v2-tag">${esc(g.editionLabel || '')}</span> ${esc(g.label || '')}</span>
          <span class="v" style="white-space:normal"><span style="font-family:var(--v2-mono);font-size:13px">${esc(g.directory)}</span>
            ${g.directoryExists === false ? '<br><span style="color:var(--gp-gold);font-size:12px">目录不存在</span>' : g.valid === false ? '<br><span style="color:var(--gp-gold);font-size:12px">没找到游戏主程序</span>' : ''}</span>
          ${g.active ? '<span class="v2-badge pink">当前</span>' : `<button class="v2-btn ghost" data-v2g-active="${esc(g.id)}">设为当前</button>`}
          <button class="v2-icon-btn" data-v2g-menu="${esc(g.id)}" data-v2menu title="更多">${I().more}</button></div>`).join('')
          || '<div class="v2-empty">还没有添加游戏目录。用「扫描」自动找，或者「添加」手动选。</div>'}
        ${scanHtml()}
      </div>

      <div class="v2-card"><div class="v2-card-title"><span>回放库</span></div>
        <div class="v2-row"><span class="k">存放位置</span>
          <span class="v" style="font-family:var(--v2-mono);font-size:13px" title="${esc(LS().libraryRoot || LS().defaultLibraryRoot || '')}">${esc(LS().libraryRoot || LS().defaultLibraryRoot || '默认：文档\\AstralPartyReplays')}</span>
          <button class="v2-btn ghost" data-v2g="libBrowse">${I().folder}更改…</button>
          <button class="v2-btn ghost" data-v2g="libOpen">打开</button></div>
        <div class="v2-row"><span class="k">自动托管</span><span class="v v2-muted">每次打开 / 刷新时，把游戏内超出保留数的旧回放归档进库</span>
          <label class="v2-switch"><input type="checkbox" id="v2gAuto" ${LS().autoMaintain ? 'checked' : ''}><span></span></label></div>
        <div class="v2-row"><span class="k">游戏内保留</span><span class="v v2-muted">最近几局留在游戏里（1～${cap}）</span>
          <input id="v2gKeep" class="v2-num" type="number" min="1" max="${cap}" value="${keep}"></div>
        <div class="v2-row"><span class="k">立即整理</span><span class="v v2-muted">现在就按上面的保留局数归档一次</span>
          <button class="v2-btn line" data-v2g="maintainNow">整理</button></div>
      </div>

      <div class="v2-card"><div class="v2-card-title"><span>网络</span></div>
        <div class="v2-row"><span class="k">下载镜像</span><span class="v v2-muted" style="white-space:normal">从 GitHub 下载加载器时走哪条线路。镜像是第三方服务器，能直连 GitHub 就选直连</span>
          <select id="v2gMirror" class="v2-select">${MIRRORS.map(([k, l]) => `<option value="${k}" ${mirror === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        ${mirror === 'custom' ? `<div class="v2-row"><span class="k">镜像地址</span><span class="v v2-muted">留空就是直连</span>
          <input id="v2gMirrorUrl" class="v2-select" style="min-width:260px" placeholder="https://example.com/" value="${esc(LS().customGitHubMirrorUrl || '')}"></div>` : ''}
      </div>

      <div class="v2-card"><div class="v2-card-title"><span>关于</span></div>
        <div class="v2-row"><span class="k">版本</span>
          <span class="v">${info?.version ? `v${esc(info.version)}${info.isLocalBuild ? ' <span class="v2-tag">本地构建</span>' : ''}` : '<span class="v2-muted">读取中…</span>'}
            ${info?.commitFull ? `<span class="v2-tag" title="${esc(info.commitFull)}">${esc(String(info.commitFull).slice(0, 7))}</span>` : ''}</span>
          <button class="v2-btn ghost" data-v2g="versionDetail">详细信息</button>
          <button class="v2-btn ghost" data-v2g="changelog">更新日志</button></div>
        <div class="v2-row"><span class="k">运行环境</span><span class="v v2-muted">${esc([info?.runtime, info?.architecture].filter(Boolean).join(' · ') || '—')}</span></div>
        <div class="v2-row"><span class="k">内置加载器</span><span class="v v2-muted">${esc(info?.embeddedLoaderVersion ? 'CesiumLoader v' + String(info.embeddedLoaderVersion).replace(/^v/i, '') : '没有内嵌发布包')}</span></div>
        <div class="v2-row"><span class="k">说明</span><span class="v" style="white-space:normal">这是<b>修改版</b>（界面重做），基于原作者 higashitaniyume 的 AstralParty.Toys 修改，不是原作者发布的版本。
          <br><span class="v2-muted">原项目使用 AGPL-3.0 许可证；遇到问题请先在这个修改版里排查，不要直接找原作者。</span></span></div>
        <div class="v2-row"><span class="k">软件更新</span><span class="v v2-muted" style="white-space:normal">修改版不会自动更新：作者的更新包是原版界面，装上会盖掉新界面。作者出新版后，要把改动合并进来再重新打包。</span></div>
        <div class="v2-row"><span class="k">原项目主页</span><span class="v v2-muted">在顶栏右上角的「GitHub」</span></div>
      </div>
    </div>`;
  }

  function render() {
    const root = $('v2Settings'); if (!root) return;
    root.innerHTML = html();
  }

  function editProfile(g) {
    U().modalActions.v2gEditOk = () => {
      const label = ($('v2gLabel')?.value || '').trim();
      if (!label) { $('v2gEditErr').textContent = '请填写名称'; return; }
      U().closeModal();
      post({ type: 'gameProfileUpdate', id: g.id, label, edition: $('v2gEdition').value });
    };
    U().openModal(`
      <div class="v2-modal-head"><b>修改游戏目录</b><button class="v2-icon-btn" data-v2modal="close">${I().x}</button></div>
      <div style="padding:16px 18px">
        <p class="v2-muted" style="margin:0 0 12px;font-family:var(--v2-mono);font-size:12px">${esc(g.directory)}</p>
        <div class="v2-field"><label for="v2gLabel">名称</label><small>只用来区分多个游戏目录</small><input id="v2gLabel" value="${esc(g.label || '')}"></div>
        <div class="v2-field"><label for="v2gEdition">区服</label><small>决定按 ID 下载回放时默认用哪个服务器</small>
          <select id="v2gEdition" class="v2-select" style="width:100%">${EDITIONS.map(([v, l]) => `<option value="${v}" ${g.edition === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <p class="v2-err" id="v2gEditErr"></p></div>
      <div class="v2-modal-foot"><span class="v2-top-spacer"></span><button class="v2-btn ghost" data-v2modal="close">取消</button>
        <button class="v2-btn primary" data-v2modal="v2gEditOk">保存</button></div>`, 'narrow');
    $('v2gLabel')?.focus();
  }

  const actions = {
    scanQuick: () => { G.scan = { mode: 'quick', running: true, message: '正在查找…', candidates: [] }; post({ type: 'gameScanQuick' }); render(); },
    scanDeep: () => { const d = $('v2gDrive')?.value; if (!d) return; G.scan = { mode: 'deep', running: true, message: `正在扫描 ${d}`, candidates: [] }; post({ type: 'gameScanDeep', drive: d }); render(); },
    scanCancel: () => post({ type: 'gameScanCancel' }),
    scanClose: () => { G.scan = null; render(); },
    browse: () => post({ type: 'gameProfileBrowse' }),
    libBrowse: () => post({ type: 'libraryBrowseRoot' }),
    libOpen: () => post({ type: 'libraryOpenFolder' }),
    maintainNow: () => post({ type: 'libraryMaintain' }),
    versionDetail: () => window.VersionModule?.showDetails(),
    changelog: () => window.VersionModule?.requestChangelog('app'),
  };

  document.addEventListener('click', ev => {
    const t = ev.target;
    if (!t.closest?.('#v2Settings')) return;
    let el;
    if ((el = t.closest('[data-v2g]'))) { if (!el.disabled) actions[el.dataset.v2g]?.(el); return; }
    if ((el = t.closest('[data-v2g-active]'))) return post({ type: 'gameProfileSetActive', id: el.dataset.v2gActive });
    if ((el = t.closest('[data-v2g-add]'))) {
      const c = G.scan?.candidates?.[Number(el.dataset.v2gAdd)];
      if (c) post({ type: 'gameProfileAddPath', directory: c.directory, activate: !profiles().some(p => p.active) });
      return;
    }
    if ((el = t.closest('[data-v2g-menu]'))) {
      const g = profiles().find(p => p.id === el.dataset.v2gMenu); if (!g) return;
      U().openMenu(el, [
        { label: '在资源管理器中打开', icon: I().folder, fn: () => post({ type: 'gameProfileOpen', id: g.id }) },
        { label: '修改名称和区服…', icon: I().sliders, fn: () => editProfile(g) },
        '-',
        { label: '从列表移除…', icon: I().trash, disabled: g.active, fn: () => U().confirmDelete({
          title: `从列表移除「[${esc(g.editionLabel || '')}] ${esc(g.label || '')}」？`, ok: '移除',
          lines: ['只是从本工具的列表里去掉，<b>不会删除游戏文件</b>', '以后可以用「添加」或「扫描」重新加回来'],
          onOk: () => post({ type: 'gameProfileRemove', id: g.id }) }) },
      ]);
    }
  });
  document.addEventListener('change', ev => {
    const t = ev.target;
    if (!t.closest?.('#v2Settings')) return;
    if (t.id === 'v2gMotion') {
      document.body.classList.toggle('reduce-motion', !t.checked);
      try { localStorage.setItem('motionEnabled', String(t.checked)); } catch { /* 存不了也不影响本次 */ }
      const old = $('animToggle'); if (old) old.checked = t.checked;
      return toast(`界面动画已${t.checked ? '开启' : '关闭'}`);
    }
    if (t.id === 'v2gAuto') return saveLibrary({ autoMaintain: t.checked });
    if (t.id === 'v2gKeep') return saveLibrary({ keepInGame: t.value });
    if (t.id === 'v2gMirror') return saveLibrary({ githubMirrorType: t.value });
    if (t.id === 'v2gMirrorUrl') return saveLibrary({ customGitHubMirrorUrl: t.value.trim() });
  });

  // 原版这些数据回来时重画
  document.addEventListener('DOMContentLoaded', () => {
    const gl = GL();
    if (gl) {
      ['renderProfiles'].forEach(n => { const o = gl[n]; if (typeof o === 'function') gl[n] = function (...a) { const r = o.apply(this, a); render(); return r; }; });
      const op = gl.renderScanProgress, or = gl.renderScanResult;
      if (op) gl.renderScanProgress = function (p) { const r = op.call(this, p);
        G.scan = { ...(G.scan || {}), mode: p?.mode || G.scan?.mode, running: p?.mode === 'deep' ? !!p.running : true, message: p?.message, current: p?.current, candidates: G.scan?.candidates || [] };
        render(); return r; };
      if (or) gl.renderScanResult = function (p) { const r = or.call(this, p); G.scan = { mode: p?.mode, running: false, candidates: p?.candidates || [] }; render(); return r; };
    }
    const sm = window.SettingsModule;
    if (sm?.applyLibrarySettings) { const o = sm.applyLibrarySettings; sm.applyLibrarySettings = function (...a) { const r = o.apply(this, a); enforceLanguage(); render(); return r; }; }
    const vm = window.VersionModule;
    if (vm?.render) { const o = vm.render; vm.render = function (...a) { const r = o.apply(this, a); render(); return r; }; }
    // 加了游戏目录后，扫描结果里的「已添加」要跟着变
    window.chrome?.webview?.addEventListener('message', e => {
      if (e.data?.type !== 'gameProfiles' || !G.scan?.candidates) return;
      const dirs = new Set((e.data.payload?.profiles || []).map(p => String(p.directory).toLowerCase()));
      G.scan.candidates.forEach(c => { if (dirs.has(String(c.directory).toLowerCase())) c.alreadyAdded = true; });
      setTimeout(render);
    });
    enforceLanguage();
    render();
  });
})();
