// console.js - نسخة مبسطة بدون أخطاء
(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsole);
  } else {
    initConsole();
  }

  function initConsole() {
    // إنشاء اللوحة
    const div = document.createElement('div');
    div.id = 'console-log';
    div.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0; max-height: 40vh;
      background: #000; color: #00ff00; font-family: monospace;
      font-size: 12px; padding: 10px; overflow-y: auto; z-index: 9999;
      border-top: 3px solid #2E7D32; direction: ltr; text-align: left;
    `;

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <b style="color:#4CAF50">DEBUG CONSOLE</b>
        <button onclick="document.getElementById('console-log').remove()"
          style="background:red;color:white;border:none;padding:4px 10px;border-radius:5px">X</button>
      </div>
      <div id="console-content"></div>
    `;

    document.body.appendChild(div);
    const consoleContent = document.getElementById('console-content');

    // نعيد تعريف console
    const oldLog = console.log;
    const oldError = console.error;
    const oldWarn = console.warn;

    function print(type, args) {
      const msg = Array.from(args).map(a => {
        try { return typeof a === 'object'? JSON.stringify(a) : String(a); }
        catch(e) { return String(a); }
      }).join(' ');

      const color = type === 'error'? '#ff5555' : type === 'warn'? '#ffaa00' : '#00ff00';
      consoleContent.innerHTML += `<div style="color:${color};margin:3px 0">[${type}] ${msg}</div>`;
      consoleContent.scrollTop = consoleContent.scrollHeight;
    }

    console.log = function(...args) { oldLog(...args); print('log', args); }
    console.error = function(...args) { oldError(...args); print('error', args); }
    console.warn = function(...args) { oldWarn(...args); print('warn', args); }

    console.log('Console جاهز...');
  }
})();
