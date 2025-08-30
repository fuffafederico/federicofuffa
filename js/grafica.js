/* Navbar: sticky + mobile menu (immutato) */
(function () {
  const nav = document.querySelector('nav');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  const onScroll = () => {
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  if (toggle && menu) {
    toggle.addEventListener('click', () => { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
})();

/* Rotatore "Strumenti utilizzati" (immutato) */
(function () {
  const items = document.querySelectorAll(".tech-item");
  const dotsWrap = document.querySelector(".tech-dots");
  if (!items.length || !dotsWrap) return;

  // Dots
  items.forEach((_, i) => {
    const b = document.createElement("button");
    if (i === 0) b.classList.add("active");
    b.setAttribute("aria-label", `Strumento ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });

  const dots = dotsWrap.querySelectorAll("button");
  let index = 0;
  let timer = null;

  const show = (i) => {
    items.forEach(el => el.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    items[i].classList.add("active");
    dots[i].classList.add("active");
  };
  const next = () => { index = (index + 1) % items.length; show(index); };
  const goTo = (i) => { index = i; show(index); restart(); };
  const start = () => { timer = setInterval(next, 2500); };
  const stop = () => { if (timer) clearInterval(timer); };
  const restart = () => { stop(); start(); };

  const rotator = document.querySelector(".tech-rotator");
  rotator.addEventListener("mouseenter", stop);
  rotator.addEventListener("mouseleave", start);

  // Fallback Affinity (se i file locali non esistono) - immutato
  const FALLBACKS = {
    photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='white'><rect x='10' y='10' width='44' height='44' rx='8' ry='8' fill='none' stroke='white' stroke-width='4'/><circle cx='26' cy='26' r='6'/><path d='M18 46l12-12 10 8 6-6 10 10H18z' fill='white' /></svg>",
    designer: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='white'><polygon points='6,54 32,6 58,54' fill='none' stroke='white' stroke-width='4'/><path d='M22 40h20l-10-18z' fill='white'/></svg>",
    publisher: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='white'><rect x='8' y='8' width='48' height='48' fill='none' stroke='white' stroke-width='4'/><rect x='14' y='14' width='18' height='36' fill='white'/><rect x='36' y='14' width='14' height='24' fill='white'/></svg>"
  };

  document.querySelectorAll("img.affinity").forEach(img => {
    img.addEventListener("error", () => {
      const name = (img.getAttribute("src") || "").toLowerCase();
      if (name.includes("photo")) img.src = FALLBACKS.photo;
      else if (name.includes("designer")) img.src = FALLBACKS.designer;
      else if (name.includes("publisher")) img.src = FALLBACKS.publisher;
      else img.src = FALLBACKS.designer;
    }, { once: true });
  });

  start();
})();

/* Slider Biglietti + Lightbox (immutato nella logica) */
(function () {
  const stage = document.querySelector('.bc-stage');
  const cards = stage ? stage.querySelectorAll('.bc-card') : [];
  const prevBtn = document.querySelector('.bc-prev');
  const nextBtn = document.querySelector('.bc-next');
  if (!stage || !cards.length) return;

  let idx = 0;
  let timer = null;

  const show = (i) => { cards.forEach(c => c.classList.remove('active')); cards[i].classList.add('active'); };
  const next = () => { idx = (idx + 1) % cards.length; show(idx); };
  const prev = () => { idx = (idx - 1 + cards.length) % cards.length; show(idx); };
  const start = () => { timer = setInterval(next, 3000); };
  const stop = () => { if (timer) clearInterval(timer); };

  if (prevBtn) prevBtn.addEventListener('click', () => { stop(); prev(); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stop(); next(); start(); });

  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);

  // Lightbox (singola immagine per biglietto)
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" aria-label="Chiudi">Chiudi ✕</button>
      <img alt="Mockup biglietto">
    </div>
  `;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  const lbClose = lb.querySelector('.lightbox-close');

  const openLightbox = (src, caption) => {
    lbImg.src = src;
    lbImg.alt = caption || 'Mockup biglietto';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
  };

  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  lbClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
  });

  // Click card: apre SOLO il primo mockup disponibile
  cards.forEach((card) => {
    const open = () => {
      const first = card.querySelector('.mockups a[data-mockup]');
      if (first && first.getAttribute('href')) {
        openLightbox(first.getAttribute('href'), first.getAttribute('data-caption') || '');
      } else {
        const thumb = card.querySelector('.thumb');
        const src = thumb ? thumb.getAttribute('src') : '';
        if (src) openLightbox(src, 'Anteprima biglietto');
      }
    };
    card.addEventListener('click', open);
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') open(); });
  });

  show(idx);
  start();
})();
