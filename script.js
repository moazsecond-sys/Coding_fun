const grid = document.getElementById('grid');

// فحص قوي: هل المكتبة موجودة؟
if(typeof window.supabase === 'undefined') {
    grid.innerHTML = '<p style="color:red; text-align:center; padding:30px">❌ الكارثة: مكتبة Supabase ما تحملت<br>السبب: ترتيب السكربتات غلط في works.html<br>الحل: انسخ works.html الجديد اللي ارسلته لك</p>';
} 
else if(!SUPABASE_URL || !SUPABASE_KEY) {
    grid.innerHTML = '<p style="color:red; text-align:center; padding:30px">❌ ملف config.js فاضي او مو مربوط</p>';
}
else {
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    async function loadWorks() {
        grid.innerHTML = '<div class="loading">جاري تحميل الصور...</div>';
        
        try {
            const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
            
            if(error) {
                grid.innerHTML = `<p style="color:red; text-align:center; padding:20px">❌ خطأ Supabase: ${error.message}</p>`;
                return;
            }

            grid.innerHTML = '';
            files.forEach(file => {
                if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
                const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
                grid.innerHTML += `<div class="card"><img src="${data.publicUrl}"><h3>${file.name}</h3></div>`;
            });

        } catch(err) {
            grid.innerHTML = `<p style="color:red; text-align:center; padding:20px">❌ خطأ: ${err.message}</p>`;
        }
    }
    loadWorks();
}
