const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
document.getElementById('grid').innerHTML = "جاري التحميل..."

supabase.storage.from('AAMAL-IMAGES').list('', {limit:5}).then(r => {
  console.log("النتيجة:", r)
  if(r.error) {
    document.getElementById('grid').innerHTML = "خطأ: " + r.error.message
    return
  }
  if(r.data.length == 0) {
    document.getElementById('grid').innerHTML = "البكت فاضي تماماً"
    return
  }
  document.getElementById('grid').innerHTML = "لقينا " + r.data.length + " عنصر:<br><br>" + JSON.stringify(r.data, null, 2)
})
