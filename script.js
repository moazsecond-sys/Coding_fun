// ====== 1. انشاء عميل Supabase ======
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ====== 2. نجيب الديف ======
const grid = document.getElementById('grid');

// ====== 3. نجيب الصور ونعرضها ======
async function loadWorks() {
    grid.innerHTML = '<div class="loading">جاري تحميل الأعمال...</div>';
    
    try {
        // فحص سريع
        if(!SUPABASE_URL || !SUPABASE_KEY) {
            grid.innerHTML = '<p style="color:red">❌ config.js فاضي او مو مربوط</p>';
            return;
        }

        // نجيب الملفات من البكت
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
        
        if(error) {
            grid.innerHTML = `<p style="color:red">❌ خطأ: ${error.message}</p>`;
            return;
        }

        if(!files || files.length === 0) {
            grid.innerHTML = '<p>البكت فاضي</p>';
            return;
        }

        // نعرض الصور
        grid.innerHTML = '';
        files.forEach(file => {
            if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
            
            const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
            
            grid.innerHTML += `
                <div class="card">
                    <img src="${data.publicUrl}" alt="${file.name}">
                    <h3>${file.name.replace('.png','')}</h3>
                </div>
            `;
        });

    } catch(err) {
        grid.innerHTML = `<p style="color:red">❌ خطأ عام: ${err.message}</p>`;
    }
}

// شغل اول ما تفتح الصفحة
loadWorks();
