// ========================================
// فاحص أخطاء aamal.html سطر بسطر
// ========================================
(function() {
  console.log('=== 🔍 فاحص الكود بدأ ===')

  const loadingEl = document.getElementById('loading-text')

  function showError(msg, fix) {
    console.error('❌', msg)
    if (loadingEl) {
      loadingEl.innerHTML = `❌ <b>${msg}</b><br><small style="color:#333">${fix}</small>`
      loadingEl.style.cssText = 'background:#ffebee;color:#c62828;padding:20px;border-radius:10px;margin:20px;border:2px solid #c62828;font-size:16px;text-align:right;direction:rtl'
    }
  }

  setTimeout(() => {
    console.log('فحص 1: هل المتغيرات موجودة؟')
    
    // فحص supabaseUrl
    if (typeof supabaseUrl === 'undefined') {
      showError('المتغير supabaseUrl غير موجود', 
      'روح aamal.html سطر 53 واكتب: const supabaseUrl = https://رابطك.supabase.co')
      return
    }
    
    // فحص اذا فيه ' او " "
    if (typeof supabaseUrl === 'string' && supabaseUrl.trim() === '') {
      showError('supabaseUrl فاضي فيه \'\' ', 
      'احذف \'\' وحط الرابط مباشرة بدون أي علامات')
      return
    }
    
    if (supabaseUrl.includes("'") || supabaseUrl.includes('"')) {
      showError('supabaseUrl فيه علامات \' او " ', 
      'احذف كل \' و " من بداية ونهاية الرابط')
      return
    }

    // فحص supabaseKey
    if (typeof supabaseKey === 'undefined' || supabaseKey.trim() === '') {
      showError('supabaseKey فاضي او غير موجود', 
      'روح aamal.html سطر 54 وانسخ anon key من Supabase بدون \'\'')
      return
    }

    if (supabaseKey.includes("'") || supabaseKey.includes('"')) {
      showError('supabaseKey فيه علامات \' او "', 
      'احذف \' من بداية المفتاح')
      return
    }

    // فحص const
    console.log('فحص 2: فحص كلمة const')
    const scripts = document.querySelectorAll('script')
    let codeText = ''
    scripts.forEach(s => codeText += s.innerText)
    
    if (codeText.includes('onst ')) {
      showError('خطأ إملائي: كتبت onst بدل const', 
      'روح aamal.html ودور كلمة onst وعدلها لـ const. عندك 7 أماكن تقريباً')
      return
    }

    // فحص sync بدل async
    if (codeText.includes('sync function')) {
      showError('خطأ إملائي: كتبت sync بدل async', 
      'سطر 62 عدله من sync function لـ async function')
      return
    }

    // فحص let
    if (codeText.includes('et ')) {
      showError('خطأ إملائي: كتبت et بدل let', 
      'سطر 58 و 59 عدل et لـ let')
      return
    }

    console.log('✅ كل الفحوصات الأولية نجحت')
    loadingEl.innerText = '✅ الكود سليم، جاري الاتصال...'
    loadingEl.style.color = 'green'

    // فحص الاتصال
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey)
      client.from('works').select('id').limit(1).then(({data, error}) => {
        if (error) {
          showError('خطأ Supabase: ' + error.message, 'Code: ' + error.code + ' - صور لي هذا')
        } else {
          loadingEl.innerText = '✅ نجح! وجدنا ' + data.length + ' عمل. المشكلة انتهت'
          loadingEl.style.color = 'green'
        }
      })
    } catch(e) {
      showError('فشل إنشاء العميل', e.message)
    }

  }, 2000)
})()
