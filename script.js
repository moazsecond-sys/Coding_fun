const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const grid = document.getElementById('grid')
const empty = document.getElementById('empty')

async function loadWorks() {
  if(!grid) return
  grid.innerHTML = "<p style='text-align:center; padding:40px'>جاري التحميل...</p>"
  
  try {
    // نبحث داخل مجلد images
    const { data, error } = await supabase.storage.from('aamal-images').list('images', { limit: 100 })
    if (error) throw error
    
    if (!data || data.length === 0) {
      grid.style.display = 'none'
      if(empty) empty.style.display = 'block'
      return
    }
    
    const images = data.filter(f => f.name && f.name.match(/\.(png|jpg|jpeg|webp|gif)$/i))
    
    if (images.length === 0) {
      grid.style.display = 'none'
      if(empty) empty.style.display = 'block'
      return
    }
    
    grid.style.display = 'grid'
    grid.innerHTML = ''
    
    images.forEach(file => {
      // نضيف images/ للرابط
      const { data: urlData } = supabase.storage.from('aamal-images').getPublicUrl(`images/${file.name}`)
      const imageUrl = urlData.publicUrl
      
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
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadWorks()
})
