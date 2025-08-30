// Rotazione automatica Tecnologie + dots e pausa on-hover
(function () {
  const items = document.querySelectorAll(".tech-item");
  const dotsWrap = document.querySelector(".tech-dots");
  if (!items.length || !dotsWrap) return;

  // Crea i dots
  items.forEach((_, i) => {
    const b = document.createElement("button");
    if (i === 0) b.classList.add("active");
    b.setAttribute("aria-label", `Tecnologia ${i + 1}`);
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

  const next = () => {
    index = (index + 1) % items.length;
    show(index);
  };

  const goTo = (i) => {
    index = i;
    show(index);
    restart();
  };

  const start = () => { timer = setInterval(next, 2500); };
  const stop = () => { if (timer) clearInterval(timer); };
  const restart = () => { stop(); start(); };

  // Pausa al passaggio del mouse
  const rotator = document.querySelector(".tech-rotator");
  rotator.addEventListener("mouseenter", stop);
  rotator.addEventListener("mouseleave", start);

  // Avvio
  start();
})();

