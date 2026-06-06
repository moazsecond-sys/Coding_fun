// =================== الاتصال ===================
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// =================== العناصر ===================
const grid = document.getElementById('grid')
const empty = document.getElementById('empty')

// =================== تحميل الأعمال ===================
async function loadWorks() {
  grid.innerHTML = "<p style='text-align:center; padding:40px'>جاري التحميل...</p>"
  
  // يجيب كل الملفات من مجلد images داخل البكت aamal-images
  const { data, error } = await supabase.storage.from('aamal-images').list('images')
  
  if (error) {
    grid.innerHTML = `<p style="color:red; text-align:center; padding:40px">خطأ: ${error.message}</p>`
    console.error('خطأ Supabase:', error)
    return
  }
  
  console.log('الملفات اللي لقاها:', data) // للتشخيص، احذفه بعدين
  
  if (!data || data.length === 0) {
    grid.style.display = 'none'
    empty.style.display = 'block'
    return
  }
  
  // فلتر الصور بس
  const images = data.filter(f => f.name.match(/\.(png|jpg|jpeg|webp|gif)$/i))
  
  if (images.length === 0) {
    grid.style.display = 'none'
    empty.style.display = 'block'
    return
  }
  
  grid.style.display = 'grid'
  grid.innerHTML = ''
  
  // اعرض الكروت
  images.forEach(file => {
    // خلي Supabase يبني الرابط بنفسه + يشفر اسم الملف
    const { data: urlData } = supabase.storage.from('aamal-images').getPublicUrl(`images/${encodeURIComponent(file.name)}`)
    const imageUrl = urlData.publicUrl
    
    console.log('رابط الصورة:', imageUrl) // للتشخيص
    
    const category = file.name.toLowerCase().includes('logo') ? 'logo' : 'banner'
    
    grid.innerHTML += `
      <div class="work-card" data-cat="${category}">
        <img src="${imageUrl}" alt="${file.name}" loading="lazy">
        <h3>${file.name.replace(/\.[^/.]+$/, "")}</h3>
      </div>
    `
  })
}

// =================== الفلترة ===================
document.addEventListener('DOMContentLoaded', () => {
  loadWorks()
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      
      const cat = btn.dataset.cat
      document.querySelectorAll('.work-card').forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'block'
        } else {
          card.style.display = 'none'
        }
      })
    })
  })
})
