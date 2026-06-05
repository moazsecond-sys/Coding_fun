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
