const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const grid = document.getElementById('grid');

async function loadWorks() {
    grid.innerHTML = '<div class="loading">جاري التحميل... انتظر</div>';
    
    console.log('1. الرابط:', SUPABASE_URL);
    console.log('2. البكت:', BUCKET);
    
    try {
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
        
        if(error) {
            grid.innerHTML = `<p style="color:red; text-align:center">❌ خطأ Supabase<br>${error.message}<br>Code: ${error.code}</p>`;
            console.error('خطأ Supabase:', error);
            return;
        }
        
        console.log('3. الملفات اللي لقيتها:', files);
        
        if(!files || files.length === 0) {
            grid.innerHTML = '<p style="text-align:center">البكت فاضي، ارفع صور png</p>';
            return;
        }

        grid.innerHTML = '';
        files.forEach(file => {
            if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
            
            const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
            grid.innerHTML += `<div class="card"><img src="${data.publicUrl}"><h3>${file.name}</h3></div>`;
        });

    } catch(err) {
        grid.innerHTML = `<p style="color:red">❌ خطأ عام: ${err.message}</p>`;
        console.error(err);
    }
}

loadWorks();
