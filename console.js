// ========== CONSOLE DEBUG TOOL v2.1 by Meta AI ==========
// ملف واحد يشغل الكونسول في أي صفحة

(function() {
  // منع التكرار لو الملف اتنده مرتين
  if (window.debugConsoleLoaded) return;
  window.debugConsoleLoaded = true;

  // 1. نحقن الـ CSS بتاع الكونسول أوتوماتيك
  const style = document.createElement('style');
  style.textContent = `
    #debug-console { 
      position: fixed; bottom: 0; left: 0; right: 0; 
      height: 200px; background: #0a0a0a; color: #00ff00; 
      font-family: 'Courier New', monospace; font-size: 13px;
      border-top: 3px solid #00ff00; z-index: 99999;
      display: flex; flex-direction: column;
      box-shadow: 0 -5px 20px rgba(0,255,0,0.3);
    }
    #debug-console.hidden { height: 38px !important; }
    #debug-console.hidden #debug-console-content { display: none; }
    #debug-console-header { 
      background: #1a1a1a; padding: 6px 10px; 
      border-bottom: 1px solid #00ff00; display: flex; 
      justify-content: space-between; align-items: center;
      user-select: none;
    }
    #debug-console-header span { font-weight: bold; }
    #debug-console-header button {
      background: #00ff00; color: #000; border: none;
      padding: 4px 10px; border-radius: 4px; cursor: pointer;
      margin-left: 5px; font-size: 12px; font-weight: bold;
    }
    #debug-console-header button:hover { background: #44ff44; }
    #debug-resize-handle {
      height: 8px; background: #00ff00; cursor: row-resize;
      opacity: 0.7; transition: opacity 0.2s;
    }
    #debug-resize-handle:hover { opacity: 1; }
    #debug-console-content { 
      padding: 8px 10px; overflow-y: auto; flex-grow: 1; 
      line-height: 1.6;
    }
    .log-info { color: #00ff00; }
    .log-warn { color: #ffaa00; font-weight: bold; }
    .log-error { color: #ff4444; font-weight: bold; }
    .log-success { color: #00ffaa; }
  `;
  document.head.appendChild(style);

  // 2. نعمل HTML الكونسول أوتوماتيك
  const consoleHTML = `
    <div id="debug-resize-handle"></div>
    <div id="debug-console-header">
      <span>>> DEBUG CONSOLE v2.1</span>
      <div>
        <button onclick="clearDebugLog()">🗑️ مسح</button>
        <button onclick="toggleDebugConsole()">👁️ إخفاء</button>
      </div>
    </div>
    <div id="debug-console-content"><span class="log-info">>> الكونسول جاهز...</span><br></div>
  `;
  const consoleDiv = document.createElement('div');
  consoleDiv.id = 'debug-console';
  consoleDiv.innerHTML = consoleHTML;
  document.body.appendChild(consoleDiv);

  const consoleContent = document.getElementById('debug-console-content');

  // 3. دالة الطباعة
  window.cLog = function(msg, type = 'info') {
    const colors = {info: '#00ff00', warn: '#ffaa00', error: '#ff4444', success: '#00ffaa'};
    const icons = {info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅'};
    const time = new Date().toLocaleTimeString('ar-EG');
    consoleContent.innerHTML += `<span style="color:${colors[type]}">[${time}] ${icons[type]} ${msg}</span><br>`;
    consoleContent.scrollTop = consoleContent.scrollHeight;
  };

  // 4. نمسك console.log الأصلي
  const oldLog = console.log;
  console.log = function(...args) {
    oldLog(...args);
    cLog(args.join(' '), 'info');
  };

  // 5. مصيدة الأخطاء
  window.onerror = function(message, source, lineno, colno, error) {
    cLog(`خطأ: ${message} | السطر: ${lineno}`, 'error');
    return true;
  };

  // 6. دوال الأزرار
  window.clearDebugLog = function() {
    consoleContent.innerHTML = '<span style="color:#00ff00">>> تم مسح السجل</span><br>';
  };
  window.toggleDebugConsole = function() {
    document.getElementById('debug-console').classList.toggle('hidden');
  };

  // 7. كود السحب بالماوس
  let isResizing = false;
  document.getElementById('debug-resize-handle').onmousedown = () => isResizing = true;
  document.onmouseup = () => isResizing = false;
  document.onmousemove = (e) => {
    if(!isResizing) return;
    const newHeight = window.innerHeight - e.clientY;
    if(newHeight > 40 && newHeight < window.innerHeight - 100) {
      document.getElementById('debug-console').style.height = newHeight + 'px';
    }
  };

  cLog('الكونسول اتحمل بنجاح ✅', 'success');
})();
