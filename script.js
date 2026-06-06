const grid = document.getElementById('grid');
const filters = document.querySelectorAll('.filters button');
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allFiles = [];

function renderWorks(filter = 'all') {
    grid.innerHTML = '';
    
    const filtered = allFiles.filter(file => {
        if (filter === 'all') return true;
        if (filter === 'logo') return file.name.toLowerCase().includes('logo');
        if (filter === 'banner') return file.name.toLowerCase().includes('banner');
        return true;
    });

    if(filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#aaa">لا توجد أعمال في هذا القسم بعد</p>';
        return;
    }

    filtered.forEach(file => {
        if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
        
        const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
        const nameClean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
        
        grid.innerHTML += `
            <div class="card" data-url="${data.publicUrl}">
                <img src="${data.publicUrl}" alt="${nameClean}" loading="lazy">
                <h3>${nameClean}</h3>
            </div>
        `;
    });

    // تفعيل تكبير الصورة
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const url = card.dataset.url;
            showModal(url);
        });
    });
}

function showModal(imgUrl) {
    let modal = document.getElementById('imgModal');
    if(!modal) {
        modal = document.createElement('div');
        modal.id = 'imgModal';
        modal.className = 'modal';
        modal.innerHTML = '<span class="close">&times;</span><img src="">';
        document.body.appendChild(modal);
        
        modal.querySelector('.close').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; }
    }
    modal.querySelector('img').src = imgUrl;
    modal.style.display = 'flex';
}

async function loadWorks() {
    try {
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
        
        if(error) throw error;
        allFiles = files;
        renderWorks();

        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderWorks(btn.dataset.cat);
            });
        });

    } catch(err) {
        grid.innerHTML = `<p style="color:red; text-align:center; padding:50px">خطأ في التحميل: ${err.message}</p>`;
    }
}

loadWorks();
