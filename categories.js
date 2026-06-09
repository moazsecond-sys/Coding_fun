const sb = supabase.createClient('https://mirrxytqttjglglxrarq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdHRqZ2xnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjE1MDMsImV4cCI6MjA5NjA5NzUwM30.I8EZoSupeqYZxPQvjNa4y0kq8XXZzfobhcHSFfVSbyo');
let currentUser = null;
let allProjects = [];

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
    searchProjects();
  }
});

async function loadProjects(category){
  let query = sb.from('projects').select('*').order('id',{ascending:false});
  
  if(category !== 'all') {
    query = query.eq('categories', category); // ← categories جمع
  }
  
  const {data} = await query;
  allProjects = data || [];
  
  searchProjects();
}

function searchProjects(){
  const term = document.getElementById('search').value.toLowerCase();
  
  let filtered = allProjects;
  if(currentCategory !== 'all') {
    filtered = allProjects.filter(p => p.categories === currentCategory); // ← categories جمع
  }
  
  if(term) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  }
  
  displayProjects(filtered);
}

function displayProjects(list){
  const container = document.getElementById('projects');
  if(!list.length) {
    container.innerHTML = '<p style="text-align:center;color:#666;padding:40px">لا توجد مشاريع في هذا القسم بعد</p>';
    return;
  }

  container.innerHTML = list.map(p=>`
  <div class="card">
    <span class="badge ${p.categories || 'general'}">${catNames[p.categories] || p.categories}</span>
    <h3>${p.title}</h3>
    <p>${p.description || 'بدون وصف'}</p>
    ${p.user_id == currentUser.id? `
      <button class="btn btn-edit small" onclick="editProject(${p.id})">تعديل</button>
      <button class="btn btn-delete small" onclick="deleteProject(${p.id})">حذف</button>
    ` : ''}
  </div>
  `).join('');
}
