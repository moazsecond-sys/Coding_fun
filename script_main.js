const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const grid = document.getElementById('works-grid');
let allWorks = [];

// نجيب كل الصور من البكت
async function loadWorks() {
  try {
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });

    if(error) throw error;

    // فلتر الصور بس + نحدد التصنيف من الاسم
    allWorks = data.filter(f => f.name.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)).map(f => {
      const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f.name}`;
      const nameLower = f.name.toLowerCase();
      const cat = nameLower.includes('banner') ? 'banner' : 'logo';
      const cleanName = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      return { url, name: cleanName, cat };
    });

    renderWorks('all');
  } catch(err) {
    grid.innerHTML = `<div class="loading">خطأ في التحميل: ${err.message}<br>تأكد من المفتاح والبكت PUBLIC</div>`;
  }
}

// نعرض الصور حسب الفلتر
function renderWorks(cat) {
  const filtered = cat === 'all' ? allWorks : allWorks.filter(w => w.cat === cat);
  
  if(filtered.length === 0) {
    grid.innerHTML = '<div class="loading">مافي أعمال في هذا التصنيف</div>';
    return;
  }

  grid.innerHTML = filtered.map((w,i) => `
    <div class="card" style="transition-delay:${i*0.05}s" data-cat="${w.cat}">
      <img src="${w.url}" loading="lazy" alt="${w.name}">
      <div class="info">
        <div class="name">${w.name}</div>
        <div class="cat">${w.cat === 'logo' ? 'لوجو' : 'بنر'}</div>
      </div>
    </div>
  `).join('');

  // انيميشن الظهور
  setTimeout(() => document.querySelectorAll('.card').forEach(c => c.classList.add('show')), 50);

  // تفعيل التكبير
  document.querySelectorAll('.card img').forEach(img => {
    img.onclick = () => {
      document.getElementById('lightbox').style.display = 'flex';
      document.getElementById('lightbox').querySelector('img').src = img.src;
    }
  });
}

// ازرار الفلترة
document.querySelectorAll('.filters button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderWorks(btn.dataset.cat);
  }
});

// اغلاق اللايت بوكس
document.getElementById('lightbox').onclick = (e) => {
  if(e.target.id === 'lightbox' || e.target.className === 'close') {
    document.getElementById('lightbox').style.display = 'none';
  }
}

// شغل اول ما تفتح الصفحة
loadWorks();
