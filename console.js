// ========================================
// ملف فحص أخطاء Supabase - نسخة قوية
// ========================================
(function() {
  console.log('=== 🔍 فحص Supabase بدأ ===')

  const loadingEl = document.getElementById('loading-text')
  const gridEl = document.getElementById('works-grid')

  // دالة طباعة الخطأ في الصفحة + Console
  function showError(msg, detail = '') {
    console.error('❌', msg, detail)
    if (loadingEl) {
      loadingEl.innerHTML = `❌ <b>خطأ:</b> ${msg}<br><small>${detail}</small>`
      loadingEl.style.color = 'red'
      loadingEl.style.background = '#ffe0e0'
      loadingEl.style.padding = '15px'
      loadingEl.style.borderRadius = '8px'
      loadingEl.style.margin = '20px'
    }
  }

  // دالة طباعة النجاح
  function showSuccess(msg) {
    console.log('✅', msg)
    if (loadingEl) {
      loadingEl.innerText = '✅ ' + msg
      loadingEl.style.color = 'green'
    }
  }

  // انتظر 2 ثانية عشان aamal.html يعرف المتغيرات
  setTimeout(async () => {

    // === فحص 1: مكتبة Supabase ===
    console.log('فحص 1: هل مكتبة Supabase محملة؟')
    if (typeof window.supabase === 'undefined') {
      showError('مكتبة Supabase ما انحملت', 'تأكد من سطر: script src=https://unpkg.com/@supabase/supabase-js@2')
      return
    }
    console.log('✅ مكتبة Supabase موجودة')

    // === فحص 2: المتغيرات ===
    console.log('فحص 2: هل supabaseUrl و supabaseKey معرفين؟')

    if (typeof supabaseUrl === 'undefined' ||!supabaseUrl || supabaseUrl.trim() === '') {
      showError('supabaseUrl فاضي', 'روح aamal.html سطر 35 وحط رابط المشروع كامل')
      return
    }
    if (!supabaseUrl.startsWith('https://') ||!supabaseUrl.includes('.supabase.co')) {
      showError('supabaseUrl غلط', 'لازم يبدأ بـ https:// وينتهي بـ.supabase.co')
      return
    }
    console.log('✅ URL:', supabaseUrl)

    if (typeof supabaseKey === 'undefined' ||!supabaseKey || supabaseKey.trim() === '') {
      showError('supabaseKey فاضي', 'روح aamal.html سطر 36 وحط anon public key')
      return
    }
    if (supabaseKey.length < 100) {
      showError('supabaseKey قصير جداً', 'انسخ المفتاح كامل من Supabase > Project Settings > API')
      return
    }
    if (supabaseKey.includes('service_role')) {
      showError('تحذير: انت حاط service_role', 'لازم تستخدم anon public key مو service_role')
    }
    console.log('✅ Key: ' + supabaseKey.substring(0,30) + '...')

    // === فحص 3: إنشاء العميل ===
    console.log('فحص 3: إنشاء عميل Supabase...')
    let client
    try {
      client = window.supabase.createClient(supabaseUrl, supabaseKey)
      console.log('✅ العميل انشئ بنجاح')
    } catch (e) {
      showError('فشل إنشاء العميل', e.message)
      return
    }

    // === فحص 4: الاتصال + جلب البيانات ===
    console.log('فحص 4: جاري الاتصال بجدول works...')
    showSuccess('جاري الاتصال بـ Supabase...')

    try {
      const { data, error, status, statusText } = await client
       .from('works')
       .select('*')
       .order('created_at', { ascending: false })
       .limit(10)

      console.log('Status:', status, statusText)

      if (error) {
        console.error('تفاصيل الخطأ الكاملة:', error)

        // ترجمة الأخطاء الشائعة
        if (error.code === 'PGRST116') {
          showError('الجدول works غير موجود', 'روح Supabase > Table Editor وتأكد اسم الجدول works حروف صغيرة')
        } else if (error.code === '42501' || error.message.includes('permission')) {
          showError('ممنوع الوصول RLS', 'سياسة RLS غلط. شغل الكود SQL اللي أرسلته لك كامل')
        } else if (error.code === '22P02') {
          showError('نوع البيانات غلط', 'عمود price لازم يكون numeric مو text')
        } else if (error.message.includes('Invalid API key')) {
          showError('المفتاح غلط', 'انسخ anon public key من جديد')
        } else {
          showError('خطأ Supabase: ' + error.message, 'Code: ' + error.code)
        }
        return
      }

      // === فحص 5: البيانات ===
      console.log('فحص 5: البيانات اللي رجعت:', data)

      if (!data || data.length === 0) {
        showError('الجدول فاضي', 'ما فيه أي أعمال. ضيف داتا تجريبية من SQL')
        return
      }

      showSuccess('تم تحميل ' + data.length + ' عمل بنجاح!')
      console.log('✅ كل الفحوصات نجحت! المشكلة الحين في عرض الكروت فقط')

      // اطبع أول صف عشان نشوف الأعمدة
      console.log('أعمدة أول صف:', Object.keys(data[0]))

    } catch (e) {
      showError('خطأ فادح في الاتصال', e.message)
      console.error('Stack:', e.stack)
    }

  }, 2000)

})()
