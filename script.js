const roles = [
  "Técnico de Soporte",
  "Hardware & Software",
  "Redes · CCTV · DVR",
  "POS Verifone / IZIPAY"
];
const typingEl = document.getElementById("typing");
let r = 0, c = 0, erasing = false;
function typeLoop(){
  const text = roles[r];
  typingEl.textContent = text.slice(0, c);
  if(!erasing && c < text.length){ c++; setTimeout(typeLoop, 80); }
  else if(!erasing && c === text.length){ erasing = true; setTimeout(typeLoop, 1200); }
  else if(erasing && c > 0){ c--; setTimeout(typeLoop, 40); }
  else { erasing = false; r = (r + 1) % roles.length; setTimeout(typeLoop, 300); }
}
if(typingEl) typeLoop();

// ===== 2) Animación: reveal on scroll =====
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((e)=>{
    if(e.isIntersecting){ e.target.classList.add('reveal--visible'); observer.unobserve(e.target); }
  });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach((el)=>observer.observe(el));

// ===== Menú móvil =====
const toggle = document.querySelector('.nav__toggle');
const list = document.querySelector('.nav__list');
if(toggle){
  toggle.addEventListener('click',()=>{
    const open = list.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// ===== Modales (usando <dialog>) =====
function openModal(id){ const d = document.querySelector(id); if(d && typeof d.showModal === 'function') d.showModal(); }
function closeModal(d){ if(d && d.open) d.close(); }

// Abrir por atributos data-modal
document.querySelectorAll('[data-modal]').forEach((btn)=>{
  btn.addEventListener('click', (ev)=>{
    ev.preventDefault();
    const href = btn.getAttribute('href');
    if(href) openModal(href);
  });
});
// Cerrar por botones data-close y clic fuera
document.querySelectorAll('dialog').forEach((dlg)=>{
  dlg.addEventListener('click', (e)=>{ if(e.target === dlg) closeModal(dlg); });
  dlg.querySelectorAll('[data-close]').forEach((b)=> b.addEventListener('click', ()=> closeModal(dlg)) );
});

// ===== Footer year =====
const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

// ===== Validación del formulario + feedback =====
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
if(form){
  form.addEventListener('submit', async (e)=>{
    // Comentado el envío AJAX por compatibilidad simple con PHP de XAMPP.
    // Descomenta para usar AJAX sin recarga.
    // e.preventDefault();
    // const data = new FormData(form);
    // const res = await fetch(form.action, { method:'POST', body:data });
    // const json = await res.json().catch(()=>({ok:false}));
    // if(json.ok){ statusEl.textContent = '¡Mensaje enviado!'; form.reset(); }
    // else { statusEl.textContent = 'Ocurrió un error. Intenta de nuevo.'; }
  });
}
// Abrir modal al hacer click en [data-modal]
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-modal]');
  if (!trigger) return;

  e.preventDefault();
  // Soporta <a href="#id"> y <button data-target="#id">
  const selector = trigger.getAttribute('href') || trigger.dataset.target;
  if (!selector) return;

  const dialog = document.querySelector(selector);
  if (dialog && typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else if (dialog) {
    // Fallback simple si showModal no existe (navegadores muy viejos)
    dialog.setAttribute('open', '');
  }
});

// Cerrar con cualquier [data-close]
document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close]');
  if (!closeBtn) return;

  const dialog = closeBtn.closest('dialog');
  if (dialog) dialog.close();
});

// Cerrar al hacer click fuera de la tarjeta (backdrop click)
document.querySelectorAll('dialog').forEach((dlg) => {
  dlg.addEventListener('click', (e) => {
    const rect = dlg.getBoundingClientRect();
    const clickInCard =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!clickInCard) dlg.close();
  });
});

class FadeShow {
  constructor(root) {
    this.root = root;
    this.slides = Array.from(root.querySelectorAll('img'));
    this.index = 0;
    this.interval = parseInt(root.dataset.interval || '4000', 10);
    this.timer = null;

    this.slides.forEach((img, i) => {
      img.classList.toggle('is-active', i === 0);
      if ('decode' in img) img.decode().catch(() => {});
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop(); else this.start();
    });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting ? this.start() : this.stop());
    }, { threshold: 0.1 });
    this.observer.observe(this.root);

    this.root.addEventListener('mouseenter', () => this.stop());
    this.root.addEventListener('mouseleave', () => this.start());
  }
  start(){ if (!this.timer && this.slides.length > 1) this.timer = setInterval(() => this.next(), this.interval); }
  stop(){ if (this.timer){ clearInterval(this.timer); this.timer = null; } }
  next(){
    const current = this.slides[this.index];
    this.index = (this.index + 1) % this.slides.length;
    const next = this.slides[this.index];
    current && current.classList.remove('is-active');
    next && next.classList.add('is-active');
  }
}
function initFadeShows(scope = document){
  Array.from(scope.querySelectorAll('.fadeshow')).forEach(el => { if (!el._fadeshow) el._fadeshow = new FadeShow(el); });
}
document.addEventListener('DOMContentLoaded', initFadeShows);
