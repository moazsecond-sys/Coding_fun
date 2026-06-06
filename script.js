// =================== الاتصال ===================
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// =================== العناصر ===================
const grid = document.getElementById('grid')
const empty = document.getElementById('empty')

// =================== تحميل الأعمال ===================
async function loadWorks() {
  if(!grid) return
  grid.innerHTML = "<p style='text-align:center; padding:40px'>جاري التحميل...</p>"
  
  try {
    // نجيب كل الملفات من البكت مباشرة بدون مجلد
    const { data, error } = await supabase.storage.from('aamal-images').list('', { limit: 100 })
    
    if (error) throw error
    
    console.log('الملفات اللي لقاها:', data)
    
    if (!data || data.length === 0) {
      grid.style.display = 'none'
      if(empty) empty.style.display = 'block'
      return
    }
    
    // فلتر الصور بس
    const images = data.filter(f => f.name && f.name.match(/\.(png|jpg|jpeg|webp|gif)$/i))
    
    if (images.length === 0) {
      grid.style.display = 'none'
      if(empty) empty.style.display = 'block'
      return
    }
    
    grid.style.display = 'grid'
    grid.innerHTML = ''
    
    // اعرض الكروت
    images.forEach(file => {
      const { data: urlData } = supabase.storage.from('aamal-images').getPublicUrl(file.name)
      const imageUrl = urlData.publicUrl
      
      console.log('رابط الصورة:', imageUrl)
      
      const category = file.name.toLowerCase().includes('logo') ? 'logo' : 'banner'
      
      grid.innerHTML += `
        <div class="work-card" data-cat="${category}">
          <img src="${imageUrl}" alt="${file.name}" loading="lazy">
          <h3>${file.name.replace(/\.[^/.]+$/, "")}</h3>
        </div>
      `
    })
    
  } catch(e) {
    grid.innerHTML = `<p style="color:red; text-align:center; padding:40px">خطأ: ${e.message}</p>`
    console.error('خطأ فادح:', e)
  }
}

// =================== التشغيل ===================
document.addEventListener('DOMContentLoaded', () => {
  loadWorks()
})
