// ===== ملف الواجهة والعرض =====

// عرض الصور
async function loadImages(category = 'all') {
  const grid = document.getElementById('grid');
  if (!grid) return;
  
  grid.innerHTML = '<div class="loading">جاري تحميل الأعمال...</div>';
  
  const images = await getImages(category);
  
  if (images.length === 0) {
    grid.innerHTML = '<p class="no-posts">لا توجد أعمال بعد</p>';
    return;
  }
  
  // في الصفحة الرئيسية 6 بس
  const isHome = window.location.pathname.includes('index.html') || window.location.pathname === '/';
  const displayImages = isHome ? images.slice(0, 6) : images;
  
  let html = '';
  displayImages.forEach((file, index) => {
    const { data: urlData } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
    
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'card show';
      card.innerHTML = `<img src="${urlData.publicUrl}" alt="${file.name}" loading="lazy">`;
      card.onclick = () => openLightbox(urlData.publicUrl);
      grid.appendChild(card);
    }, index * 100); // تأثير ظهور تدريجي
  });
  
  grid.innerHTML = '';
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
  
  let html = '';
  posts.forEach(p => {
    const date = new Date(p.created_at).toLocaleDateString('ar-EG', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    html += `
      <div class="post-card">
        <h3>${p.title}</h3>
        <p>${p.content.substring(0, 150)}${p.content.length > 150 ? '...' : ''}</p>
        <div class="post-date">📅 ${date}</div>
      </div>
    `;
  });
  postsGrid.innerHTML = html;
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
      <img src="${src}">
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
      document.getElementById('name').value,
      document.getElementById('whatsapp').value,
      document.getElementById('message').value
    );
    
    if (result.success) {
      msg.style.display = 'block';
      msg.style.color = '#4ade80';
      msg.textContent = 'تم إرسال طلبك بنجاح! ✅';
      form.reset();
    } else {
      msg.style.display = 'block';
      msg.style.color = 'red';
      msg.textContent = 'خطأ: ' + result.error.message;
    }
    
    btn.disabled = false;
    btn.textContent = 'إرسال الطلب 🚀';
    setTimeout(() => msg.style.display = 'none', 5000);
  });
}

// الفلاتر
function setupFilters() {
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
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
      }, 1500);
    });
  } else {
    loader.style.display = 'none';
  }
}

// التشغيل
document.addEventListener('DOMContentLoaded', () => {
  setupLoader();
  loadImages('all');
  loadPosts();
  setupContactForm();
  setupFilters();
});
