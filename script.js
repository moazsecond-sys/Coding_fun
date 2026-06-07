// ربط Supabase مرة وحدة
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة جلب وعرض الصور
async function loadImages(category = 'all') {
  const grid = document.getElementById('grid');
  if (!grid) return;
  
  grid.innerHTML = '<div class="loading">جاري تحميل الأعمال...</div>';
  
  try {
    const { data, error } = await supabaseClient.storage.from(BUCKET).list('', {
      limit: 100,
      offset: 0
    });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      grid.innerHTML = '<p class="no-posts">لا توجد صور في البكت</p>';
      return;
    }
    
    let images = data.filter(file => file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i));
    
    // فلترة حسب التصنيف
    if (category !== 'all') {
      images = images.filter(file => file.name.toLowerCase().includes(category.toLowerCase()));
    }
    
    // في الصفحة الرئيسية نعرض 6 بس
    const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    if (isHome) images = images.slice(0, 6);
    
    if (images.length === 0) {
      grid.innerHTML = '<p class="no-posts">لا توجد أعمال في هذا التصنيف</p>';
      return;
    }
    
    let html = '';
    images.forEach(file => {
      const { data: urlData } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
      html += `
        <div class="card" data-cat="${file.name.toLowerCase()}">
          <img src="${urlData.publicUrl}" alt="${file.name}" loading="lazy">
        </div>
      `;
    });
    
    grid.innerHTML = html;
  } catch (err) {
    grid.innerHTML = '<p class="no-posts" style="color:red">خطأ في تحميل الصور</p>';
    console.error(err);
  }
}

// دالة جلب المقالات - للصفحة الرئيسية فقط
async function loadPosts() {
  const postsGrid = document.getElementById('postsGrid');
  if (!postsGrid) return;
  
  try {
    const { data, error } = await supabaseClient.from('posts').select('*').order('created_at', { ascending: false }).limit(6);
    if (error) throw error;
    
    if (!data || data.length === 0) {
      postsGrid.innerHTML = '<p class="no-posts">لا توجد مقالات بعد. تابعنا قريباً 🔥</p>';
      return;
    }
    
    let html = '';
    data.forEach(p => {
      const date = new Date(p.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
      html += `
        <div class="post-card">
          <h3>${p.title}</h3>
          <p>${p.content.substring(0, 150)}${p.content.length > 150 ? '...' : ''}</p>
          <div class="post-date">📅 ${date}</div>
        </div>
      `;
    });
    postsGrid.innerHTML = html;
  } catch (err) {
    postsGrid.innerHTML = '<p class="no-posts" style="color:red">خطأ في تحميل المقالات</p>';
    console.error(err);
  }
}

// ارسال رسالة التواصل
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const btn = e.target.querySelector('button');
    
    btn.disabled = true;
    btn.textContent = 'جاري الإرسال...';
    
    const { error } = await supabaseClient.from('messages').insert([{
      name: document.getElementById('name').value,
      whatsapp: document.getElementById('whatsapp').value,
      message: document.getElementById('message').value
    }]);
    
    if (error) {
      msg.style.display = 'block';
      msg.style.color = 'red';
      msg.textContent = 'خطأ في الإرسال: ' + error.message;
    } else {
      msg.style.display = 'block';
      msg.style.color = '#4ade80';
      msg.textContent = 'تم إرسال طلبك بنجاح! راح نتواصل معك قريباً ✅';
      form.reset();
    }
    
    btn.disabled = false;
    btn.textContent = 'إرسال الطلب 🚀';
    setTimeout(() => msg.style.display = 'none', 5000);
  });
}

// ازرار الفلترة
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filters button');
  if (filterBtns.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadImages(btn.dataset.cat);
    });
  });
}

// شاشة التحميل
function setupLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  if (sessionStorage.getItem('visited') !== 'yes') {
    sessionStorage.setItem('visited', 'yes');
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.style.opacity = '0';
        setTimeout(function () { loader.style.display = 'none' }, 500);
      }, 1500);
    });
  } else {
    loader.style.display = 'none';
  }
}

// تشغيل الكل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  setupLoader();
  loadImages('all');
  loadPosts();
  setupContactForm();
  setupFilters();
  
  // تحديث لحظي للمقالات
  supabaseClient.channel('posts-public').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts).subscribe();
});
