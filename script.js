import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  "https://mirrxytqttjglglxrarq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdHRqZ2xnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjE1MDMsImV4cCI6MjA5NjA5NzUwM30.I8EZoSupeqYZxPQvjNa4y0kq8XXZzfobhcHSFfVSbyo"
)

supabase.from('works').select('*').order('created_at',{ascending:false}).then(({data, error})=>{
  const grid = document.getElementById('works-grid')
  
  if(error){
    grid.innerHTML = `<p class="empty">خطأ: ${error.message}</p>`
    return
  }
  if(!data || data.length === 0){
    grid.innerHTML = '<p class="empty">لا توجد أعمال بعد. ضف من Supabase</p>'
    return
  }
  
  grid.innerHTML = data.map(w=>`
    <div class='card'>
      <h3>${w.title}</h3>
      <p class='desc'>${w.description || 'لا يوجد وصف'}</p>
      <div class='meta'>
        <span class='category'>${w.category || 'عام'}</span>
        <span class='price'>${w.price ? w.price + ' ريال' : 'تواصل للسعر'}</span>
      </div>
      <a href="https://wa.me/9665XXXXXXXX?text=مرحبا، مهتم بعمل: ${w.title}" target="_blank" class="btn-whatsapp">تواصل واتساب</a>
    </div>
  `).join('')
})
