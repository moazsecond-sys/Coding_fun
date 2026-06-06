const grid = document.getElementById('grid');
const filters = document.querySelectorAll('.filters button');
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allFiles = [];

function renderWorks(filter = 'all') {
    grid.innerHTML = '';
    
    const filtered = allFiles.filter(file => {
        if (filter === 'all') return true;
        return file.name.toLowerCase().includes(filter.toLowerCase());
    });

    if(filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#aaa">لا توجد أعمال في هذا القسم</p>';
        return;
    }

    filtered.forEach(file => {
        if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
        
        const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
        
        grid.innerHTML += `
            <div class="card">
                <img src="${data.publicUrl}" alt="${file.name}" loading="lazy">
                <h3>${file.name.replace(/\.[^/.]+$/, "")}</h3>
            </div>
        `;
    });
}

async function loadWorks() {
    grid.innerHTML = '<div class="loading">جاري تحميل الأعمال...</div>';
    
    try {
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
        
        if(error) {
            grid.innerHTML = `<p style="color:red; text-align:center">خطأ: ${error.message}</p>`;
            return;
        }

        allFiles = files;
        renderWorks();

        // تفعيل الازرار
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderWorks(btn.dataset.cat);
            });
        });

    } catch(err) {
        grid.innerHTML = `<p style="color:red; text-align:center">خطأ: ${err.message}</p>`;
    }
}

loadWorks();
