const grid = document.getElementById('grid');
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadWorks() {
    grid.innerHTML = '<p style="color:yellow; padding:10px">جاري التحميل...</p>';
    
    try {
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
        
        if(error) {
            grid.innerHTML = `<p style="color:red; padding:20px">خطأ: ${error.message}</p>`;
            return;
        }

        if(!files || files.length === 0) {
            grid.innerHTML = '<p style="color:orange; padding:20px">البكت فاضي</p>';
            return;
        }

        grid.innerHTML = '';
        files.forEach(file => {
            if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
            
            const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
            const url = data.publicUrl;
            
            // كرت قوي وواضح عشان نشوفه
            grid.innerHTML += `
                <div style="border:2px solid #00ff88; margin:10px; padding:10px; background:#222; border-radius:10px">
                    <img src="${url}" style="width:100%; max-width:300px; display:block; border:2px solid red">
                    <p style="color:white; word-break:break-all; font-size:12px">${url}</p>
                    <p style="color:#00ff88">اسم الملف: ${file.name}</p>
                </div>
            `;
        });

    } catch(err) {
        grid.innerHTML = `<p style="color:red">خطأ: ${err.message}</p>`;
    }
}

loadWorks();
