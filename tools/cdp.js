// cdp.js — 通过 WebView2 调试端口（9222）检查新界面：node tools/cdp.js <截图输出目录> ["要在页面里执行的 JS"] [截图名]
// 先用 tools/run-debug.ps1 启动调试版。环境变量 WAIT=毫秒 控制执行后等多久再截图（默认 600）。
const [, , outDir, expr, shot] = process.argv;
(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(p => p.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pending = new Map(); const logs = [];
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m); pending.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) logs.push(m.params.type.toUpperCase() + ' ' + m.params.args.map(a => a.value ?? a.description).join(' '));
  };
  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  // HARD=1：先清缓存再强制刷新。Debug 版普通 reload 有时会继续用旧的 css/js
  if (process.env.HARD) {
    await send('Network.clearBrowserCache');
    await send('Page.reload', { ignoreCache: true });
    await new Promise(r => setTimeout(r, 3500));
  }
  if (expr) {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    console.log(JSON.stringify(r.result?.value ?? r.exceptionDetails?.exception?.description ?? r, null, 1));
  }
  await new Promise(r => setTimeout(r, Number(process.env.WAIT || 600)));
  if (shot) {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    require('fs').writeFileSync(`${outDir}/${shot}.png`, Buffer.from(s.data, 'base64'));
    console.log('screenshot ' + shot);
  }
  if (logs.length) console.log(logs.join('\n'));
  ws.close();
})().catch(e => { console.error('CDP error', e.message); process.exit(1); });
