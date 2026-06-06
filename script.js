const grid = document.getElementById('grid');

if(typeof window.supabase === 'undefined') {
    grid.innerHTML = '<p style="color:red; padding:20px">1. المكتبة ما تحملت</p>';
} else {
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    async function loadWorks() {
        grid.innerHTML = '<div class="loading">2. الكود بدأ...</div>';
        
        try {
            grid.innerHTML = '<div class="loading">3. بنجيب الملفات من البكت...</div>';
            
            const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
            
            grid.innerHTML = '<div class="loading">4. وصل الرد من Supabase!</div>';
            
            if(error) {
                grid.innerHTML = `<p style="color:red; padding:20px">5. خطأ: ${error.message}</p>`;
                return;
            }
            
            grid.innerHTML = `<div class="loading">6. لقيت ${files.length} ملفات، بعرضهم...</div>`;
            
            grid.innerHTML = '';
            files.forEach(file => {
                if(file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
                    const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
                    grid.innerHTML += `<div class="card"><img src="${data.publicUrl}"><h3>${file.name}</h3></div>`;
                }
            });

        } catch(err) {
            grid.innerHTML = `<p style="color:red; padding:20px">7. خطأ عام: ${err.message}</p>`;
        }
    }
    loadWorks();
}
