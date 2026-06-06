const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
document.getElementById('grid').innerHTML = "<p style='text-align:center'>جاري التحميل...</p>"

supabase.storage.from('aamal-images').list('images', {limit:50}).then(({data, error}) => {
  if(error) {
    document.getElementById('grid').innerHTML = "<p style='color:red; text-align:center'>الخطأ: "+error.message+"</p>"
    return
  }
  if(!data || data.length==0) {
    document.getElementById('grid').innerHTML = "<p style='color:orange; text-align:center'>البكت فاضي</p>"
    return
  }
  
  let html = ''
  data.forEach(f => {
    if(f.name.match(/\.(png|jpg|jpeg|gif)$/i)) {
      let url = supabase.storage.from('aamal-images').getPublicUrl('images/'+f.name).data.publicUrl
      html += `<div><img src="${url}" style="width:100%"><p>${f.name}</p></div>`
    }
  })
  document.getElementById('grid').innerHTML = html
})
