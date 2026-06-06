document.getElementById('grid').innerHTML = "جاري التحميل..."

fetch("https://mirrxytqttjglglxrarq.supabase.co/storage/v1/object/list/AAMAL-IMAGES/", {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({prefix: 'images', limit: 10})
.then(r => r.json())
.then(data => {
  document.getElementById('grid').innerHTML = "نجحنا! لقينا: <br>" + JSON.stringify(data, null, 2)
})
.catch(e => {
  document.getElementById('grid').innerHTML = "فشل: " + e.message
})
