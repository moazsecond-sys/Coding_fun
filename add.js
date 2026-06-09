const sb = supabase.createClient('https://mirrxytqttjglxrarq.supabase.co', 'حط-المفتاح-العام-هنا');
let currentUser = null;

sb.auth.getUser().then(({data:{user}})=>{
  if(!user) return location.href='login.html';
  currentUser = user;
});

async function publish(){
  const title = document.getElementById('title').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const img = document.getElementById('img').value.trim();
  const cat = document.getElementById('cat').value;
  const msg = document.getElementById('msg');

  if(!title){
    msg.innerHTML = '<div class="success-msg" style="background:#4a1e1e;color:#ef4444;border-color:#ef4444">اكتب عنوان المشروع</div>';
    return;
  }

  const { error } = await sb.from('projects').insert({
    title: title,
    description: desc,
    image_url: img,
    category: cat,
    user_id: currentUser.id
  });

  if(error){
    msg.innerHTML = '<div class="success-msg" style="background:#4a1e1e;color:#ef4444;border-color:#ef4444">صار خطأ: ' + error.message + '</div>';
  } else {
    msg.innerHTML = '<div class="success-msg">تم النشر بنجاح ✅</div>';
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('img').value = '';
    setTimeout(()=> msg.innerHTML = '', 3000);
  }
}
