// script.js - كود Supabase الصح
const SUPABASE_URL = 'https://xxxxx.supabase.co' // غيره لرابط مشروعك
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' // المفتاح الجديد

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');

async function loadWorks() {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    grid.innerHTML = `<p class="empty">خطأ: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = data.map(w => `
    <div class="work-card" data-cat="${w.category}">
      <img src="${w.img_url}" alt="${w.title}" loading="lazy">
      <div class="work-card-content">
        <h3>${w.title || 'بدون عنوان'}</h3>
        <p class="desc">${w.description || ''}</p>
        <div class="meta">
          <span class="category">${w.category || 'عام'}</span>
          <span class="price">${w.price ? w.price + ' ريال' : 'تواصل'}</span>
        </div>
        <a href="https://wa.me/2126XXXXXXXX?text=مرحبا، مهتم بـ ${encodeURIComponent(w.title)}" 
           class="btn-whatsapp" target="_blank">💬 اطلب</a>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadWorks);
