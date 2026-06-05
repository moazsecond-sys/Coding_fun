  
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
