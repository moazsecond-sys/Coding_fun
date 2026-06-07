const grid = document.getElementById('grid');
const filters = document.querySelectorAll('.filters button');

// استخدم SUPABASE_ANON_KEY من config.js
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// هل احنا في الصفحة الرئيسية؟
const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname.endsWith('/');

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

// عرض الأعمال
function renderWorks(filter = 'all') {
    if(!grid) return;
    
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
        
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.url = data.publicUrl;
        card.innerHTML = `
            <img src="${data.publicUrl}" alt="${nameClean} - تصميم GREEN APPLE DESIGN" loading="lazy">
            <div class="info">
                <div class="name">${nameClean}</div>
                <div class="cat">${category.toUpperCase()}</div>
            </div>
        `;
        grid.appendChild(card);

        // انيميشن الظهور
        setTimeout(() => {
            card.classList.add('show');
        }, index * 80);
    });

    activateLightbox();
}

// lightbox تكبير الصورة
function activateLightbox() {
    if(!grid) return;
    
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

// تحميل الأعمال
async function loadWorks() {
    if(!grid) return;
    
    grid.innerHTML = '<div class="loading">🍏 جاري تحميل الأعمال...</div>';
    
    try {
        const { data: files, error } = await supabaseClient.storage.from(BUCKET).list('', {limit: 100, sortBy: {column: 'created_at', order: 'desc'}});
        
        if(error) throw error;
        
        if(!files || files.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#aaa; padding:40px">البكت فاضي، ارفع صورك في Supabase</p>';
            return;
        }

        allFiles = files;
        renderWorks();

        // الفلاتر تشتغل بس في works.html
        if(!isHomePage && filters.length > 0) {
            filters.forEach(btn => {
                btn.addEventListener('click', () => {
                    filters.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderWorks(btn.dataset.cat);
                });
            });
        } else {
            // في الرئيسية اخفي الفلاتر
            const filterDiv = document.querySelector('.filters');
            if(filterDiv) filterDiv.style.display = 'none';
        }

    } catch(err) {
        grid.innerHTML = `<p style="color:red; text-align:center; padding:60px">❌ خطأ: ${err.message}</p>`;
        console.error(err);
    }
}

// فورم التواصل - ارسال الرسالة لـ Supabase
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if(!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const message = document.getElementById('message').value.trim();
        const msgBox = document.getElementById('formMsg');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        msgBox.style.display = 'block';
        msgBox.style.color = '#4ade80';
        msgBox.textContent = 'جاري الارسال...';
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الارسال...';
        
        try {
            const { error } = await supabaseClient.from('messages').insert([{
                name: name,
                whatsapp: whatsapp,
                message: message,
                created_at: new Date().toISOString()
            }]);
            
            if(error) throw error;
            
            msgBox.style.color = '#4ade80';
            msgBox.textContent = '✅ تم الارسال بنجاح! راح نتواصل معك قريب عبر الواتساب';
            contactForm.reset();
            
            setTimeout(() => {
                msgBox.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.textContent = 'إرسال الطلب 🚀';
            }, 4000);
            
        } catch(err) {
            msgBox.style.color = 'red';
            msgBox.textContent = '❌ خطأ: ' + err.message;
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال الطلب 🚀';
        }
    });
}

// شغل كل شي عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadWorks();
    initContactForm();
});
