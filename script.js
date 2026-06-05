// script.js - يقرا من data.js ويبني الكروت
const grid = document.getElementById('grid');
const empty = document.getElementById('empty');

function createCard(item, type) {
  if (type === 'product') {
    return `
      <div class="work-card" data-cat="product">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="work-card-content">
          <h3>${item.name}</h3>
          <p class="desc">${item.desc}</p>
          <div class="meta">
            <span class="category">منتج</span>
            <span class="price">${item.price} جنيه</span>
          </div>
          <a href="https://wa.me/2126XXXXXXXX?text=مرحبا، مهتم بـ ${encodeURIComponent(item.name)}" 
             class="btn-whatsapp" target="_blank">
             💬 اطلب الآن
          </a>
        </div>
      </div>
    `;
  }
  
  if (type === 'work') {
    return `
      <div class="work-card" data-cat="work">
        <img src="images/${item}" alt="تصميم" loading="lazy">
        <div class="work-card-content">
          <h3>تصميم احترافي</h3>
          <p class="desc">تصميم مميز يناسب براندك</p>
          <div class="meta">
            <span class="category">تصميم</span>
            <span class="price">تواصل للسعر</span>
          </div>
          <a href="https://wa.me/2126XXXXXXXX?text=مرحبا، ابغى تصميم" 
             class="btn-whatsapp" target="_blank">
             💬 اطلب تصميم
          </a>
        </div>
      </div>
    `;
  }
}

function renderAll() {
  grid.innerHTML = '';
  let count = 0;
  
  if (typeof products !== 'undefined' && products.length > 0) {
    products.forEach(p => {
      grid.innerHTML += createCard(p, 'product');
      count++;
    });
  }
  
  if (typeof works !== 'undefined' && works.length > 0) {
    works.forEach(w => {
      grid.innerHTML += createCard(w, 'work');
      count++;
    });
  }
  
  empty.style.display = count === 0 ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', renderAll);
