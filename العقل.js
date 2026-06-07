// ===== ملف العقل - GREEN APPLE DESIGN =====
console.log('العقل.js loaded ✅');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready, starting app...');
  setupLoader();
  loadImages('all');
  loadPosts();
  setupContactForm();
  setupFilters();
});

// عرض الصور
async function loadImages(category = 'all') {
  const grid = document.getElementById('grid');
  if (!grid) return;
  
  console.log(`Loading images for category: ${category}`);
  grid.innerHTML = '<div class="loading">جاري تحميل الأعمال...</div>';
  
  try {
    const images = await getImages(category);
    console.log(`Found ${images.length} images`);
    
    if (images.length === 0) {
      grid.innerHTML = '<p class="no-posts">لا توجد أعمال بعد</p>';
      return;
    }
    
    // الصفحة الرئيسية 6 بس، صفحة الأعمال الكل
    const isHome = window.location.pathname.includes('الواجهة.html') || window.location.pathname === '/' || window.location.pathname === '';
    const displayImages = isHome ? images.slice(0, 6) : images;
    
    grid.innerHTML = '';
    
    displayImages.forEach((file, index) => {
      const { data: urlData } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name, {
        transform: { width: 600, quality: 75 } // اخف واسرع للجوال
      });
      
      setTimeout(() => {
        const card = document.createElement('div');
        card.className = 'card show';
        card.innerHTML = `<img src="${urlData.publicUrl}" alt="${file.name}" loading="lazy">`;
        card.onclick = () => openLightbox(urlData.publicUrl);
        grid.appendChild(card);
      }, index * 80);
    });
    
  } catch (err) {
    console.error('Error in loadImages:', err);
    grid.innerHTML = '<p class="no-posts">خطأ في تحميل الأعمال</p>';
  }
}

// عرض المقالات
async function loadPosts() {
  const postsGrid = document.getElementById('postsGrid');
  if (!postsGrid) return;
  
  const posts = await getPosts();
  
  if (posts.length === 0) {
    postsGrid.innerHTML = '<p class="no-posts">لا توجد مقالات بعد. تابعنا قريباً 🔥</p>';
    return;
  }
  
  postsGrid.innerHTML = posts.map(p => {
    const date = new Date(p.created_at).toLocaleDateString('ar-EG', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    return `
      <div class="post-card">
        <h3>${p.title}</h3>
        <p>${p.content.substring(0, 150)}${p.content.length > 150 ? '...' : ''}</p>
        <div class="post-date">📅 ${date}</div>
      </div>
    `;
  }).join('');
}

// لايت بوكس
function openLightbox(src) {
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <span class="close">&times;</span>
      <img src="${src}" alt="صورة مكبرة">
    `;
    document.body.appendChild(lightbox);
    lightbox.querySelector('.close').onclick = () => lightbox.style.display = 'none';
    lightbox.onclick = (e) => e.target === lightbox && (lightbox.style.display = 'none');
  }
  lightbox.querySelector('img').src = src;
  lightbox.style.display = 'flex';
}

// الفورم
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const btn = e.target.querySelector('button');
    
    btn.disabled = true;
    btn.textContent = 'جاري الإرسال...';
    
    const result = await sendMessage(
      document.getElementById('name').value.trim(),
      document.getElementById('whatsapp').value.trim(),
      document.getElementById('message').value.trim()
    );
    
    msg.style.display = 'block';
    msg.style.color = result.success ? '#4ade80' : 'red';
    msg.textContent = result.success ? 'تم إرسال طلبك بنجاح! ✅' : 'خطأ: ' + (result.error?.message || 'حاول مرة ثانية');
    
    if (result.success) form.reset();
    btn.disabled = false;
    btn.textContent = 'إرسال الطلب 🚀';
    setTimeout(() => msg.style.display = 'none', 5000);
  });
}

// الفلاتر
function setupFilters() {
  const buttons = document.querySelectorAll('.filters button');
  if (!buttons.length) return;
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadImages(btn.dataset.cat);
    });
  });
}

// اللودر
function setupLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  if (!sessionStorage.getItem('visited')) {
    sessionStorage.setItem('visited', 'yes');
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
      }, 1200);
    });
  } else {
    loader.style.display = 'none';
  }
}
