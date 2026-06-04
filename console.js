// ========== CONSOLE DEBUG TOOL v3.0 by Meta AI ==========
// ملف العرض - لازم error.js يتحمل قبله

(function() {
  if (window.debugConsoleLoaded) return;
  window.debugConsoleLoaded = true;

  // 1. CSS + عداد الأخطاء
  const style = document.createElement('style');
  style.textContent = `
    #debug-console { position: fixed; bottom: 0; left: 0; right: 0; 
      height: 200px; background: #0a0a0a; color: #00ff00; 
      font-family: 'Courier New', monospace; font-size: 13px;
      border-top: 3px solid #00ff00; z-index: 99999;
      display: flex; flex-direction: column;
      box-shadow: 0 -5px 20px rgba(0,255,0,0.3);
    }
    #debug-console.hidden { height: 38px !important; }
    #debug-console.hidden #debug-console-content { display: none; }
    #debug-console-header { background: #1a1a1a; padding: 6px 10px; 
      border-bottom: 1px solid #00ff00; display: flex; 
      justify-content: space-between; align-items: center;
      user-select: none;
    }
    #debug-counter { color: #ff4444; font-weight: bold; margin-left: 10px; }
    #debug-console-header button {
      background: #00ff00; color: #000; border: none;
      padding: 4px 8px; border-radius: 4px; cursor: pointer;
      margin-left: 4px; font-size: 12px; font-weight: bold;
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
    .copy-btn {
      opacity: 0.3; cursor: pointer; margin-left: 5px;
      font-size: 11px;
    }
    .log-line:hover .copy-btn { opacity: 1; }
  `;
  document.head.appendChild(style);

  // 2. HTML + أزرار جديدة
  const consoleHTML = `
    <div id="debug-resize-handle"></div>
    <div id="debug-console-header">
      <div>
        <span>>> DEBUG CONSOLE v3.0</span>
        <span id="debug-counter">0 خطأ</span>
      </div>
      <div>
        <button onclick="filterDebug('all')">الكل</button>
        <button onclick="filterDebug('error')">أخطاء</button>
        <button onclick="filterDebug('warn')">تحذيرات</button>
        <button onclick="ErrorLogger.download()">تحميل TXT</button>
        <button onclick="clearDebugLog()">🗑️ مسح</button>
        <button onclick="toggleDebugConsole()">👁️</button>
      </div>
    </div>
    <div id="debug-console-content"><span class="log-info">>> الكونسول جاهز...</span><br></div>
  `;
  const consoleDiv = document.createElement('div');
  consoleDiv.id = 'debug-console';
  consoleDiv.innerHTML = consoleHTML;
  document.body.appendChild(consoleDiv);

  const consoleContent = document.getElementById('debug-console-content');
  const counter = document.getElementById('debug-counter');
  let currentFilter = 'all';

  // 3. تحديث العداد
  function updateCounter() {
    const count = ErrorLogger.getCount();
    counter.textContent = `${count.error} خطأ | ${count.warn} تحذير`;
    counter.style.color = count.error > 0 ? '#ff4444' : '#00ff00';
  }

  // 4. دالة الطباعة + النسخ + التخزين
  window.cLog = function(msg, type = 'info', line = '-', file = 'unknown') {
    const colors = {info: '#00ff00', warn: '#ffaa00', error: '#ff4444', success: '#00ffaa'};
    const icons = {info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅'};
    const time = new Date().toLocaleTimeString('ar-EG');
    
    const lineId = 'log-' + Date.now();
    const logLine = `<div class="log-line log-${type}" data-type="${type}" id="${lineId}">
      <span style="color:${colors[type]}">[${time}] ${icons[type]} ${msg}</span>
      <span class="copy-btn" onclick="copyLog('${lineId}')">📋</span>
    </div>`;
    
    consoleContent.innerHTML += logLine;
    consoleContent.scrollTop = consoleContent.scrollHeight;

    // خزن لو خطأ أو تحذير
    if(type === 'error' || type === 'warn') {
      ErrorLogger.save({msg, type, line, file});
      updateCounter();
    }

    // طبق الفلتر الحالي
    filterDebug(currentFilter, false);
  };

  // 5. فلتر سريع
  window.filterDebug = function(type, update = true) {
    currentFilter = type;
    if(update) document.querySelectorAll('#debug-console-header button')[0].focus();
    document.querySelectorAll('.log-line').forEach(line => {
      line.style.display = (type === 'all' || line.dataset.type === type) ? 'block' : 'none';
    });
  };

  // 6. نسخ السطر
  window.copyLog = function(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text);
    cLog('تم نسخ السطر 📋', 'success');
  };

  // 7. مصيدة الأخطاء الكاملة
  window.onerror = function(message, source, lineno, colno, error) {
    cLog(`خطأ: ${message}`, 'error', lineno, source);
    return true;
  };

  window.addEventListener('unhandledrejection', function(e) {
    cLog(`Promise فشل: ${e.reason}`, 'error');
  });

  // 8. دوال الأزرار
  window.clearDebugLog = function() {
    if(confirm('تمسح كل الأخطاء من الدفتر كمان؟')) {
      ErrorLogger.clear();
    }
    consoleContent.innerHTML = '<span style="color:#00ff00">>> تم مسح السجل</span><br>';
    updateCounter();
  };

  window.toggleDebugConsole = function() {
    document.getElementById('debug-console').classList.toggle('hidden');
  };

  // 9. اختصار كيبورد Ctrl+Shift+D
  document.addEventListener('keydown', function(e) {
    if(e.ctrlKey && e.shiftKey && e.key === 'D') {
      toggleDebugConsole();
    }
  });

  // 10. كود السحب
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

  updateCounter();
  cLog('الكونسول v3.0 اتحمل بنجاح ✅', 'success');
})();
