// ========== ERROR LOGGER v1.0 ==========
// شغلته الوحيدة: يخزن ويجيب ويمسح الأخطاء

const ErrorLogger = (function() {
  const STORAGE_KEY = 'errors.log';
  const MAX_ERRORS = 200; // يخزن آخر 200 خطأ بس عشان ميملاش المتصفح

  function getErrors() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveErrors(errors) {
    if(errors.length > MAX_ERRORS) errors = errors.slice(-MAX_ERRORS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(errors));
  }

  return {
    // 1. خزن خطأ جديد
    save: function(error) {
      const errors = getErrors();
      errors.push({
        time: new Date().toLocaleString('ar-EG'),
        type: error.type,
        msg: error.msg,
        line: error.line || '-',
        file: error.file || 'unknown'
      });
      saveErrors(errors);
    },

    // 2. جيب كل الأخطاء
    getAll: function() {
      return getErrors();
    },

    // 3. نزل ملف TXT
    download: function() {
      const errors = getErrors();
      if(errors.length === 0) {
        alert('مفيش أخطاء مسجلة ✅');
        return;
      }
      let text = errors.map(e => 
        `[${e.time}]
النوع: ${e.type}
الرسالة: ${e.msg}
المكان: ${e.file} السطر ${e.line}
------------------------`
      ).join('\n\n');
      
      const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'errors.log';
      a.click();
    },

    // 4. امسح الكل
    clear: function() {
      localStorage.removeItem(STORAGE_KEY);
    },

    // 5. عدد الأخطاء والتحذيرات
    getCount: function() {
      const errors = getErrors();
      return {
        error: errors.filter(e => e.type === 'error').length,
        warn: errors.filter(e => e.type === 'warn').length,
        total: errors.length
      };
    }
  };
})();
