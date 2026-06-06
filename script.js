const grid = document.getElementById('grid');
const filters = document.querySelectorAll('.filters button');
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// هل احنا في الصفحة الرئيسية؟
const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';

let allFiles = [];

// تنظيف اسم الملف
function cleanName(filename) {
    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// تحديد التصنيف
function getCategory(filename) {
    const name = filename.toLowerCase();
    if(name.includes('logo')) return 'logo';
    if(name.includes('banner')) return 'banner';
    if(name.includes('poster') || name.includes('تصميم')) return 'poster';
    return 'other';
}

function renderWorks(filter = 'all') {
    grid.innerHTML = '';
    
    let filtered = allFiles.filter(file => {
        if (filter === 'all') return true;
        return getCategory(file.name) === filter;
    });

    // في الرئيسية نعرض 6 بس
    if(isHomePage) {
        filtered = filtered.slice(0, 6);
    }

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
                <img src="${data.publicUrl}" alt="${nameClean} - تصميم GREEN APPLE DESIGN" loading="lazy">
                <div class="info">
                    <div class="name">${nameClean}</div>
                    <div class="cat">${category.toUpperCase()}</div>
                </div>
            </div>
        `;

        // انيميشن الظهور
        setTimeout(() => {
            const cards = grid.querySelectorAll('.card');
            if(cards[index]) cards[index].classList.add('show');
        }, index * 80);
    });

    activateLightbox();
}

// lightbox تكبير الصورة
function activateLightbox() {
    let lightbox = document.getElementById('lightbox');
    
    if(!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<span class="close">&times;</span><img src="" alt="">';
        document.body.appendChild(lightbox);
        
        lightbox.querySelector('.close').onclick = () => lightbox.style.display = 'none';
        lightbox.onclick = (e) => { if(e.target === lightbox) lightbox.style.display = 'none'; }
        
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

        // اخفي الازرار لو في الرئيسية عشان ما تلخبط
        if(!isHomePage) {
            filters.forEach(btn => {
                btn.addEventListener('click', () => {
                    filters.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderWorks(btn.dataset.cat);
                });
            });
        } else {
            // في الرئيسية اخفي الفلاتر لو موجودة
            const filterDiv = document.querySelector('.filters');
            if(filterDiv) filterDiv.style.display = 'none';
        }

    } catch(err) {
        grid.innerHTML = `<p style="color:red; text-align:center; padding:60px">❌ خطأ: ${err.message}</p>`;
        console.error(err);
    }
}

loadWorks();
