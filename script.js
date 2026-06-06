const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const grid = document.getElementById('grid');

async function loadWorks() {
    grid.innerHTML = '<div class="loading">1. جاري الاتصال بـ Supabase...</div>';
    
    try {
        // فحص 1: هل config.js شغال؟
        if(!SUPABASE_URL || !SUPABASE_KEY || !BUCKET) {
            grid.innerHTML = '<p style="color:red; text-align:center; padding:20px">❌ خطأ: ملف config.js ناقص<br>تأكد من SUPABASE_URL و SUPABASE_KEY و BUCKET</p>';
            return;
        }

        grid.innerHTML = `<div class="loading">2. متصل... البكت: ${BUCKET}</div>`;

        // فحص 2: نجيب الملفات
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
        
        if(error) {
            grid.innerHTML = `<p style="color:red; text-align:center; padding:20px">❌ خطأ من Supabase<br><b>${error.message}</b><br>الكود: ${error.code}<br><br>الحلول:<br>1. تأكد اسم البكت = AAMAL-IMAGES<br>2. تأكد البكت Public<br>3. تأكد المفتاح anon public</p>`;
            return;
        }
        
        grid.innerHTML = `<div class="loading">3. لقيت ${files.length} ملف، جاري العرض...</div>`;

        if(!files || files.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:20px">البكت فاضي، ارفع صور png او jpg</p>';
            return;
        }

        // عرض الصور
        grid.innerHTML = '';
        let count = 0;
        files.forEach(file => {
            if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
            
            const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
            grid.innerHTML += `<div class="card"><img src="${data.publicUrl}" alt="${file.name}"><h3>${file.name}</h3></div>`;
            count++;
        });

        if(count === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:20px">لقيت ملفات بس مو صور. ارفع png/jpg بس</p>';
        }

    } catch(err) {
        grid.innerHTML = `<p style="color:red; text-align:center; padding:20px">❌ خطأ عام: ${err.message}</p>`;
    }
}

loadWorks();
