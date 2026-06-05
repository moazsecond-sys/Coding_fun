// utils.js - مكتبة أكواد GREEN APPLE

// 1. Scroll ناعم لأي قسم
function smoothScroll(targetId) {
  const el = document.querySelector(targetId);
  if(el) el.scrollIntoView({behavior: 'smooth'});
}

// 2. سلايدر تلقائي
function initSlider(sliderId, interval = 4000) {
  const slider = document.getElementById(sliderId);
  if (!slider || slider.children.length === 0) return;

  const slides = slider.children;
  let current = 0;

  function showSlide(n) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.opacity = '0';
      slides[i].style.position = 'absolute';
    }
    slides[n].style.opacity = '1';
    slides[n].style.position = 'relative';
  }

  showSlide(current);

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, interval);
}

// 3. بحث فوري في الكروت
function initSearch(inputId, cardsClass) {
  const input = document.getElementById(inputId);
  const cards = document.querySelectorAll(cardsClass);
  if (!input) return;

  input.addEventListener('keyup', function() {
    const search = this.value.toLowerCase();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(search)? 'block' : 'none';
    });
  });
}

// 4. زر الرجوع للأعلى
function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.id = 'backToTop';
  btn.style.cssText = 'position:fixed; bottom:25px; left:25px; width:55px; height:55px; border-radius:50%; background:#FF6F00; color:white; border:none; font-size:28px; cursor:pointer; display:none; z-index:999; box-shadow:0 4px 12px rgba(0,0,0,0.3); transition:all 0.3s';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 400? 'block' : 'none';
  });

  btn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
  btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';
}

// 5. فلترة حسب التصنيف
function initFilter(buttonsClass, cardsClass) {
  const buttons = document.querySelectorAll(buttonsClass);
  const cards = document.querySelectorAll(cardsClass);

  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.filter;

      buttons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      cards.forEach(card => {
        const cardCat = card.querySelector('.category').textContent;
        card.style.display = (category === 'all' || cardCat === category)? 'block' : 'none';
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initBackToTop);
