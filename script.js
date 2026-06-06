const grid = document.getElementById('grid');
const filters = document.querySelectorAll('.filters button');
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allFiles = [];

// تنظيف اسم الملف: logo-green-apple.png → logo green apple
function cleanName(filename) {
    return filename
        .replace(/\.[^/.]+$/, "") // احذف الامتداد .png
        .replace(/[-_]/g, ' ') // استبدل - و _ بمسافة
        .replace(/\b\w/g, l => l.toUpperCase()); // اول حرف كابتل
}

// تحديد التصنيف من اسم الملف
function getCategory(filename) {
    const name = filename.toLowerCase();
    if(name.includes('logo')) return 'logo';
    if(name.includes('banner')) return 'banner';
    if(name.includes('poster')) return 'poster';
    return 'other';
}

function renderWorks(filter = 'all') {
    grid.innerHTML = '';
    
    const filtered = allFiles.filter(file => {
        if (filter === 'all') return true;
        return getCategory(file.name) === filter;
    });

    if(filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#aaa; padding:40px">لا توجد أعمال في هذا القسم بعد</p>';
        return;
    }

    filtered.forEach((file, index) => {
        if(!file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return;
        
        const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
        const nameClean = cleanName(file.name);
        const category = getCategory(file.name);
        
        grid.innerHTML += `
            <div class="card" data-url="${data.publicUrl}">
                <img src="${data.publicUrl}" alt="${nameClean} - GREEN APPLE DESIGN" loading="lazy">
                <div class="info">
                    <div class="name">${nameClean}</div>
                    <div class="cat">${category.toUpperCase()}</div>
                </div>
            </div>
        `;

        // انيميشن الظهور المتتابع
        setTimeout(() => {
            const cards = grid.querySelectorAll('.card');
            if(cards[index]) cards[index].classList.add('show');
        }, index * 80);
    });

    // تفعيل lightbox تكبير الصورة
    activateLightbox();
}

// lightbox احترافي
function activateLightbox() {
    let lightbox = document.getElementById('lightbox');
    
    // انشاء lightbox لو مو موجود
    if(!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<span class="close">&times;</span><img src="">';
        document.body.appendChild(lightbox);
        
        lightbox.querySelector('.close').onclick = () => lightbox.style.display = 'none';
        lightbox.onclick = (e) => { if(e.target === lightbox) lightbox.style.display = 'none'; }
        
        // اغلاق بـ ESC
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') lightbox.style.display = 'none';
        });
    }

    document.querySelectorAll('.card').forEach(card => {
        card.onclick = () => {
            const url = card.dataset.url;
            lightbox.querySelector('img').src = url;
            lightbox.style.display = 'flex';
        };
    });
}

async function loadWorks() {
    grid.innerHTML = '<div class="loading">🍏 جاري تحميل الأعمال...</div>';
    
    try {
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list();
        
        if(error) throw error;
        
        if(!files || files.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#aaa; padding:40px">البكت فاضي، ارفع صورك في Supabase</p>';
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
        grid.innerHTML = `<p style="color:red; text-align:center; padding:60px">❌ خطأ في التحميل: ${err.message}</p>`;
    }
}

// شغل عند فتح الصفحة
loadWorks();
