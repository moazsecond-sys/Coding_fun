// 1. استدعاء مكتبة Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. حط مفاتيحك هنا بين " "
const SUPABASE_URL = "https://mirrxytqttjglglxrarq.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_kuXmAppdiHaZ1OKlWsHbBg_QUebJHdu"

// 3. انشاء الاتصال
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 4. استدعاء العناصر من HTML
const grid = document.getElementById('grid')
const empty = document.getElementById('empty')

// 5. دالة جلب الأعمال من جدول works
async function loadWorks() {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('خطأ Supabase:', error)
    if(grid) grid.innerHTML = `<p class="empty">صار خطأ: ${error.message}</p>`
    return
  }

  if (!data || data.length === 0) {
    if(empty) empty.style.display = 'block'
    return
  }

  if(empty) empty.style.display = 'none'
  
  // 6. عرض البيانات في grid
  grid.innerHTML = data.map(work => `
  <div class="card">
    ${work.image_url ? `<img src="${work.image_url}" alt="${work.title}">` : ''}
    <h3>${work.title}</h3>
    <p>${work.description}</p>
    <p><b>السعر:</b> ${work.price} ريال</p>
    <span class="tag">${work.category}</span>
  </div>
`).join('')
}

// 7. شغل الدالة أول ما الصفحة تفتح
loadWorks()
