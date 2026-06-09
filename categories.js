const sb = supabase.createClient('https://mirrxytqttjglglxrarq.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnJ4eXRxdHRqZ2xnbHhyYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjE1MDMsImV4cCI6MjA5NjA5NzUwM30.I8EZoSupeqYZxPQvjNa4y0kq8XXZzfobhcHSFfVSbyo');

let currentCategory = 'all';
let allProjects = [];

const catConfig = {
  'all': { name: 'الكل', color: '#4ade80' },
  'programming': { name: 'برمجة', color: '#3b82f6' },
  'design': { name: 'تصميم', color: '#a855f7' },
  'articles': { name: 'مقالات', color: '#f59e0b' },
  'general': { name: 'عام', color: '#6b7280' }
};

function timeAgo(date){
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000; if(interval > 1) return `منذ ${Math.floor(interval)} سنة`;
  interval = seconds / 2592000; if(interval > 1) return `منذ ${Math.floor(interval)} شهر`;
  interval = seconds / 86400; if(interval > 1) return `منذ ${Math.floor(interval)} يوم`;
  interval = seconds / 3600; if(interval > 1) return `منذ ${Math.floor(interval)} ساعة`;
  interval = seconds / 60; if(interval > 1) return `منذ ${Math.floor(interval)} دقيقة`;
  return `منذ ${Math.floor(seconds)} ثانية`;
}

sb.auth.getUser().then(({data:{user}})=>{
  if(!user) return location.href='login.html';
  document.getElementById('userEmail').textContent = user.email;
  loadProjects();
  // خلي زر الكل نشط من البداية
  document.querySelector('.cat-btn[data-cat="all"]').style.background = catConfig.all.color;
  document.querySelector('.cat-btn[data-cat="all"]').style.color = '#000';
  document.querySelector('.cat-btn[data-cat="all"]').style.boxShadow = `0 0 15px ${catConfig.all.color}66`;
});

document.querySelectorAll('.cat-btn').forEach(btn=>{
  btn.onclick = () => {
    document.querySelectorAll('.cat-btn').forEach(b=>{
      b.style.background = '#2a2a2a';
      b.style.color = '#fff';
      b.style.boxShadow = 'none';
    });
    btn.style.background = catConfig[btn.dataset.cat].color;
    btn.style.color = '#000';
    btn.style.boxShadow = `0 0 15px ${catConfig[btn.dataset.cat].color}66`;
    currentCategory = btn.dataset.cat;
    searchProjects();
  }
});

document.getElementById('search').addEventListener('keyup', searchProjects);

async function loadProjects(){
  const {data} = await sb.from('projects').select('*').order('id',{ascending:false});
  allProjects = data || [];
  updateCounters();
  searchProjects();
}

function updateCounters(){
  document.querySelectorAll('.cat-btn').forEach(btn=>{
    const cat = btn.dataset.cat;
    const count = cat === 'all'? allProjects.length : allProjects.filter(p=>p.categories===cat).length;
    btn.innerHTML = `${catConfig[cat].name} <span style="opacity:0.8;font-size:12px;margin-right:4px">${count}</span>`;
  });
}

function searchProjects(){
  const term = document.getElementById('search').value.toLowerCase();
  let filtered = allProjects;
  if(currentCategory!== 'all') filtered = allProjects.filter(p => p.categories === currentCategory);
  if(term) filtered = filtered.filter(p => p.title.toLowerCase().includes(term));
  displayProjects(filtered);
}

async function displayProjects(list){
  const container = document.getElementById('projects');
  if(!list.length) return container.innerHTML = '<p style="text-align:center;color:#666;margin-top:40px">لا توجد مشاريع في هذا القسم</p>';

  let html = '';
  for(let p of list){
    const config = catConfig[p.categories];
    const isNew = (Date.now() - new Date(p.created_at)) < 24*60*60*1000;
    const {data: comments} = await sb.from('comments').select('*').eq('project_id', p.id).order('id',{ascending:true});

    html += `
    <div class="card" style="border-top:3px solid ${config.color}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span class="badge" style="background:${config.color};color:#000;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold">${config.name}</span>
        ${isNew? '<span style="background:#ef4444;color:#fff;padding:2px 6px;border-radius:4px;font-size:11px">جديد 🔥</span>' : ''}
      </div>
      <h3>${p.title}</h3>
      <p>${p.description || 'بدون وصف'}</p>
      ${p.image_url? `<img src="${p.image_url}" style="max-width:100%;border-radius:8px;margin-top:10px">` : ''}
      <div class="date" style="color:#888;font-size:12px;margin-top:10px">${timeAgo(p.created_at)}</div>
      <div style="margin-top:20px;border-top:1px solid #333;padding-top:15px">
        <h4 style="font-size:14px;color:#4ade80;margin-bottom:10px">💬 التعليقات ${comments.length}</h4>
        <div id="comments-${p.id}" style="max-height:300px;overflow-y:auto;margin-bottom:10px">
          ${comments.map(c=>`
            <div style="display:flex;gap:8px;margin-bottom:10px">
              <div style="width:32px;height:32px;border-radius:50%;background:${config.color};color:#000;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">${c.user_name.charAt(0).toUpperCase()}</div>
              <div style="flex:1;background:#2a2a2a;padding:8px 12px;border-radius:18px">
                <b style="color:${config.color};font-size:13px">${c.user_name}</b>
                <p style="margin:3px 0 0 0;font-size:14px">${c.comment}</p>
                <span style="font-size:11px;color:#666">${timeAgo(c.created_at)}</span>
              </div>
            </div>
          `).join('') || '<p style="color:#666;font-size:13px;text-align:center">لا توجد تعليقات</p>'}
        </div>
        <div style="display:flex;gap:8px">
          <div style="width:32px;height:32px;border-radius:50%;background:#4ade80;color:#000;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">${document.getElementById('userEmail').textContent.charAt(0).toUpperCase()}</div>
          <input id="comment-${p.id}" placeholder="اكتب تعليقاً..." style="flex:1;border-radius:20px;border:1px solid #444;background:#1a1a1a;color:#fff;padding:8px 15px">
          <button class="btn btn-small" onclick="addComment(${p.id})" style="border-radius:50%;width:36px;height:36px;padding:0">➤</button>
        </div>
      </div>
    </div>`;
  }
  container.innerHTML = html;
}

async function addComment(project_id){
  const input = document.getElementById(`comment-${project_id}`);
  if(!input.value.trim()) return;
  await sb.from('comments').insert({
    project_id,
    user_name: document.getElementById('userEmail').textContent.split('@')[0],
    comment: input.value.trim()
  });
  input.value = '';
  loadProjects();
}
