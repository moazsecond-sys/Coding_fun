const sb = supabase.createClient('https://mirrxytqttjglglxrarq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdHRqZ2xnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjE1MDMsImV4cCI6MjA5NjA5NzUwM30.I8EZoSupeqYZxPQvjNa4y0kq8XXZzfobhcHSFfVSbyo');

let currentCategory = 'all';
let allProjects = [];

const catNames = {
  'articles': 'مقالات',
  'design': 'تصميم', 
  'programming': 'برمجة',
  'general': 'عام'
};

console.log('categories.js اشتغل ✅'); // عشان نتأكد الملف يتحمل

sb.auth.getUser().then(({data:{user}})=>{
  if(!user) {
    console.log('مافي يوزر، بيرجع للوجن');
    return location.href='login.html';
  }
  document.getElementById('userEmail').textContent = user.email;
  loadProjects();
});

document.querySelectorAll('.cat-btn').forEach(btn=>{
  btn.onclick = () => {
    document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    console.log('القسم المختار:', currentCategory);
    searchProjects();
  }
});

document.getElementById('search').addEventListener('keyup', searchProjects);

async function loadProjects(){
  console.log('جاري تحميل المشاريع...');
  const {data, error} = await sb.from('projects').select('*').order('id',{ascending:false});
  
  if(error) {
    console.error('خطأ Supabase:', error);
    document.getElementById('projects').innerHTML = `<p style="color:red">خطأ: ${error.message}</p>`;
    return;
  }
  
  console.log('المشاريع اللي جت:', data);
  allProjects = data || [];
  searchProjects();
}

function searchProjects(){
  const term = document.getElementById('search').value.toLowerCase();
  let filtered = allProjects;
  
  if(currentCategory !== 'all') {
    filtered = allProjects.filter(p => p.categories === currentCategory);
    console.log(`فلترة على ${currentCategory}، النتيجة:`, filtered.length);
  }
  
  if(term) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(term));
  }
  
  displayProjects(filtered);
}

function displayProjects(list){
  const container = document.getElementById('projects');
  if(!list.length) {
    container.innerHTML = '<p style="text-align:center;color:#666;margin-top:40px">لا توجد مشاريع في هذا القسم</p>';
    return;
  }
  
  container.innerHTML = list.map(p=>`
    <div class="card">
      <span class="badge" style="background:#4ade80;color:#000;padding:4px 8px;border-radius:6px;font-size:12px">${catNames[p.categories] || p.categories}</span>
      <h3>${p.title}</h3>
      <p>${p.description || 'بدون وصف'}</p>
      ${p.image_url? `<img src="${p.image_url}" style="max-width:100%;border-radius:8px;margin-top:10px">` : ''}
      <div class="date" style="color:#888;font-size:12px;margin-top:10px">${new Date(p.created_at).toLocaleDateString('ar-EG')}</div>
    </div>
  `).join('');
}
