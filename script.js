//import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/const supabase = createClient(
  'https://mirrxytqtjglxrarq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdGpnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjY5NjMsImV4cCI6MjA3Mjc0Mjk2M30.PTvNgqjPIPZJ9b5f_1FuNzkyPec6afcgMynSQ7CFeyI'
)

/let allWorks = []

//function showWorks(filter = 'الكل'){
  //const grid = document.getElementById('works-grid')
  //const filtered = filter === 'الكل' ? allWorks : allWorks.filter(w => w.category === filter)
  
  //if(filtered.length === 0){
   // grid.innerHTML = '<p class="empty">لا توجد أعمال في هذا القسم</p>'
   // return
  }
  
 / grid.innerHTML = filtered.map(w=>`
//   <div class='card'>
  /  //  <h3>${w.title}</h3>
  //    <p class='desc'>${w.description || 'لا يوجد وصف'}</p>
   //   <div class='meta'>
     //   <span class='category'>${w.category || 'عام'}</span>
     //   <span class='price'>${w.price ? w.price + ' ريال' : 'تواصل للسعر'}</span>
      </div>
   //   <a href="https://wa.me/9665XXXXXXXX?text=مرحبا، مهتم بعمل: ${w.title}" target="_blank" class="btn-whatsapp">تواصل واتساب</a>
    </div>
  `).join('')
}

supabase.from('works').select('*').order('created_at',{ascending:false}).then(({data, error})=>{
  if(error || !data) return
  allWorks = data
  
  // سوي أزرار الفلتر تلقائي
 // const cats = ['الكل', ...new Set(data.map(w => w.category).filter(Boolean))]
 // document.getElementById('filter-bar').innerHTML = cats.map(c=> 
//    `//<button class="filter-btn ${c==='الكل'?'active':''}" onclick="filterWorks('${c}')">${c}</button>`
//  ).join('')
  
//  showWorks()
})

//window.filterWorks = (cat) => {
 // document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'))
 // event.target.classList.add('active')
//  showWorks(cat)
}

console.log("1- الملف يقرا")
document.getElementById('works-grid').innerHTML = '<h2 style="color:yellow;text-align:center">لو شفت هذي معناها الملف شغال</h2>'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
console.log("2- Supabase دخل")

const supabase = createClient('https://mirrxytqtjglxrarq.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdGpnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjY5NjMsImV4cCI6MjA3Mjc0Mjk2M30.PTvNgqjPIPZJ9b5f_1FuNzkyPec6afcgMynSQ7CFeyI')

supabase.from('works').select('*').then(({data, error})=>{
  console.log("3- النتيجة:", data, error)
  if(error){
    document.getElementById('works-grid').innerHTML = '<h2 style="color:red">خطأ Supabase: '+error.message+'</h2>'
    return
  }
  if(!data || data.length==0){
    document.getElementById('works-grid').innerHTML = '<h2 style="color:orange">الجدول فاضي أو RLS مقفل</h2>'
    return
  }
  document.getElementById('works-grid').innerHTML = '<h2 style="color:green">نجح! عندك '+data.length+' أعمال</h2>'
})
