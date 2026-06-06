  
// 2. حط مفاتيحك هنا بين " "
const SUPABASE_URL = "https://mirrxytqttjglglxrarq.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_kuXmAppdiHaZ1OKlWsHbBg_QUebJHdu"
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

async function loadWorks() {
  const { data, error } = await supabase.from('works').select('*')
  if (error) { console.log(error); return }
  
  const grid = document.getElementById('works-grid')
  grid.innerHTML = data.map(w => `
    <div class="card">
      ${w.image_url ? `<img src="${w.image_url}">` : ''}
      <h3>${w.title}</h3>
      <p>${w.description}</p>
      <p><b>السعر:</b> ${w.price} ريال</p>
    </div>
  `).join('')
}
loadWorks()
// كود الفحص - احذفه بعد ما نضبط
async function debug() {
  console.log("1. بدأ الفحص...")

  const { data, error } = await supabase.from('works').select('*')

  if (error) {
    console.error("2. فيه خطأ:", error.message)
    return
  }

  console.log("2. البيانات اللي جات من Supabase:", data)
  console.log("3. عدد الكروت:", data.length)

  if (data.length > 0) {
    console.log("4. رابط أول صورة:", data[0].image_url)
  }

  const grid = document.getElementById('works-grid')
  console.log("5. هل لقينا div#works-grid؟", grid)
}
debug()
