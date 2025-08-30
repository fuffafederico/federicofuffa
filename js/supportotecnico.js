// ===============================
// supportotecnico.js
// Navbar, menu mobile, rotatore, cards slider
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  /* NAVBAR: stato "scrolled" */
  const nav = document.querySelector("nav");
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll);

  /* MENU MOBILE */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.classList.toggle("active");
    });
  }

  /* ROTATORE "Strumenti & Tecniche" */
  (function initTechRotator() {
    const items = document.querySelectorAll(".tech-rotator .tech-item");
    const dotsWrap = document.querySelector(".tech-dots");
    if (!items.length || !dotsWrap) return;

    // Crea i dots
    items.forEach((_, i) => {
      const b = document.createElement("button");
      if (i === 0) b.classList.add("active");
      b.setAttribute("aria-label", `Slide ${i + 1}`);
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
    });

    const dots = dotsWrap.querySelectorAll("button");
    let index = 0;
    let timer = null;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const show = (i) => {
      items.forEach(el => el.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));
      items[i].classList.add("active");
      dots[i].classList.add("active");
    };

    const next = () => { index = (index + 1) % items.length; show(index); };
    const goTo = (i) => { index = i; show(index); restart(); };
    const start = () => { if (!prefersReduced) timer = setInterval(next, 3000); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const restart = () => { stop(); start(); };

    const rotator = document.querySelector(".tech-rotator");
    rotator.addEventListener("mouseenter", stop);
    rotator.addEventListener("mouseleave", start);
    rotator.addEventListener("focusin", stop);
    rotator.addEventListener("focusout", start);

    show(0);
    start();
  })();

  /* CARDS SLIDER (multi-card) */
  document.querySelectorAll(".cards-slider").forEach(initCardsSlider);

  function initCardsSlider(slider) {
    const viewport = slider.querySelector(".cards-viewport");
    const track = slider.querySelector(".cards-track");
    const cards = Array.from(slider.querySelectorAll(".slide-card"));
    if (!viewport || !track || cards.length === 0) return;

    // Crea controlli se mancanti
    let prevBtn = slider.querySelector(".cards-prev");
    let nextBtn = slider.querySelector(".cards-next");
    let dotsWrap = slider.querySelector(".cards-dots");
    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.className = "cards-prev";
      prevBtn.setAttribute("aria-label", "Slide precedente");
      prevBtn.innerHTML = arrowSvg("left");
      slider.appendChild(prevBtn);
    } else if (!prevBtn.innerHTML) prevBtn.innerHTML = arrowSvg("left");

    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.className = "cards-next";
      nextBtn.setAttribute("aria-label", "Slide successiva");
      nextBtn.innerHTML = arrowSvg("right");
      slider.appendChild(nextBtn);
    } else if (!nextBtn.innerHTML) nextBtn.innerHTML = arrowSvg("right");

    if (!dotsWrap) {
      dotsWrap = document.createElement("div");
      dotsWrap.className = "cards-dots";
      slider.appendChild(dotsWrap);
    }

    const autoplay = slider.getAttribute("data-autoplay") !== "false";
    const interval = parseInt(slider.getAttribute("data-interval") || "3500", 10);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let index = 0;
    let perView = 1;
    let timer = null;
    let cardW = 0, gap = 0;

    // Dots
    function buildDots() {
      dotsWrap.innerHTML = "";
      const pages = Math.max(1, cards.length - perView + 1);
      for (let i = 0; i < pages; i++) {
        const b = document.createElement("button");
        b.setAttribute("aria-label", `Vai alla slide ${i + 1}`);
        if (i === index) b.classList.add("active");
        b.addEventListener("click", () => { goTo(i); restart(); });
        dotsWrap.appendChild(b);
      }
    }

    function measure() {
      const first = cards[0];
      const rect = first.getBoundingClientRect();
      cardW = rect.width;
      const style = getComputedStyle(track);
      const gapStr = style.gap || style.columnGap || "0px";
      gap = parseFloat(gapStr);
      const sliderW = viewport.getBoundingClientRect().width;
      perView = Math.max(1, Math.round((sliderW + gap) / (cardW + gap)));
      index = Math.min(index, Math.max(0, cards.length - perView));
      buildDots();
      update();
    }

    function update() {
      const x = -index * (cardW + gap);
      track.style.transform = `translate3d(${x}px,0,0)`;
      const dots = dotsWrap.querySelectorAll("button");
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
      prevBtn.disabled = (index === 0);
      nextBtn.disabled = (index >= cards.length - perView);
    }

    function prev() { index = Math.max(0, index - 1); update(); }
    function next() { index = Math.min(cards.length - perView, index + 1); update(); }
    function goTo(i) { index = Math.max(0, Math.min(i, cards.length - perView)); update(); }

    // Autoplay
    function start() {
      if (!autoplay || prefersReduced || cards.length <= perView) return;
      timer = setInterval(() => {
        if (index >= cards.length - perView) index = 0;
        else index++;
        update();
      }, interval);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    // Eventi
    prevBtn.addEventListener("click", () => { prev(); restart(); });
    nextBtn.addEventListener("click", () => { next(); restart(); });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    // Tastiera
    slider.setAttribute("tabindex", "0");
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { prev(); restart(); }
      if (e.key === "ArrowRight") { next(); restart(); }
    });

    // Swipe touch / pointer
    let startX = 0, currentX = 0, dragging = false;
    viewport.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      currentX = startX;
      stop();
      viewport.setPointerCapture(e.pointerId);
      track.style.transition = "none";
    });
    viewport.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      currentX = e.clientX;
      const dx = currentX - startX;
      const baseX = -index * (cardW + gap);
      track.style.transform = `translate3d(${baseX + dx}px,0,0)`;
    });
    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = ""; // ripristina easing
      const dx = currentX - startX;
      const threshold = Math.max(40, (cardW + gap) * 0.2);
      if (dx > threshold) prev();
      else if (dx < -threshold) next();
      restart();
      try { viewport.releasePointerCapture(e.pointerId); } catch(_) {}
    };
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    // Resize
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);

    // Init
    measure();
    start();
  }

  function arrowSvg(dir) {
    const d = dir === "left"
      ? "M14.7 5.3a1 1 0 0 1 0 1.4L10.41 11l4.3 4.3a1 1 0 1 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.41 0z"
      : "M9.3 5.3a1 1 0 0 0 0 1.4L13.59 11l-4.3 4.3a1 1 0 1 0 1.42 1.4l5-5a1 1 0 0 0 0-1.4l-5-5a1 1 0 0 0-1.41 0z";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="${d}"/></svg>`;
  }
});
