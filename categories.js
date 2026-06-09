const sb = supabase.createClient('https://mirrxytqttjglglxrarq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdHRqZ2xnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjE1MDMsImV4cCI6MjA5NjA5NzUwM30.I8EZoSupeqYZxPQvjNa4y0kq8XXZzfobhcHSFfVSbyo');
let currentUser = null;
let currentCategory = 'all';
let allProjects = []; // ← مهم للبحث والفلترة

sb.auth.getUser().then(({data:{user}})=>{
  if(!user) return location.href='login.html';
  currentUser = user;
  document.getElementById('userEmail').textContent = user.email;
  loadProjects('all');
});

// أزرار الأقسام
document.querySelectorAll('.cat-btn').forEach(btn=>{
  btn.onclick = () => {
    document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    searchProjects(); // ← غيرنا من loadProjects لـ searchProjects عشان الفلترة محلية
  }
});

async function loadProjects(category){
  let query = sb.from('projects').select('*').order('id',{ascending:false});
  
  if(category !== 'all') {
    query = query.eq('category', category);
  }
  
  const {data} = await query;
  allProjects = data || []; // خزن كل شي
  
  searchProjects(); // اعرض بعد التخزين
}

// دالة العرض - صارت لحالها
function displayProjects(list){
  if(!list.length) {
    projects.innerHTML = '<p style="text-align:center;color:#666;padding:40px">لا توجد مشاريع في هذا القسم بعد</p>';
    return;
  }

  projects.innerHTML = list.map(p=>`
  <div class="card">
    <span class="badge ${p.category || 'عام'}">${p.category || 'عام'}</span>
    <h3>${p.title}</h3>
    <p>${p.description || 'بدون وصف'}</p>
    ${p.image_url? `<img src="${p.image_url}">` : ''}
    <div class="date">${new Date(p.created_at).toLocaleDateString('ar-EG')}</div>
    <div class="actions">
      ${p.user_id == currentUser.id? `
        <button class="btn btn-edit btn-small" onClick="editProject(${p.id})">تعديل</button>
        <button class="btn btn-danger btn-small" onClick="deleteProject(${p.id})">حذف</button>
      ` : ''}
    </div>
  </div>
  `).join('');
}

async function deleteProject(id){
  if(!confirm('متأكد؟')) return;
  await sb.from('projects').delete().eq('id',id);
  loadProjects(currentCategory); // نرجع نجيب البيانات من جديد
}

async function editProject(id){
  alert('التعديل بيكون من الصفحة الرئيسية home.html');
}

function searchProjects(){
  const term = document.getElementById('search').value.toLowerCase();
  
  // فلتر أول شي حسب القسم المختار
  let filtered = allProjects;
  if(currentCategory !== 'all') {
    filtered = allProjects.filter(p => p.category === currentCategory);
  }
  
  // بعدين فلتر حسب البحث
  if(term) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(term) || 
      (p.description && p.description.toLowerCase().includes(term))
    );
  }
  
  displayProjects(filtered);
}
