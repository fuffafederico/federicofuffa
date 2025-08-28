// ===== MENU MOBILE =====
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("open");
});

document.querySelectorAll("#menu a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
  });
});

// ===== NAVBAR ON SCROLL =====
const navbar = document.querySelector("nav");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});


// ===== FORM CON FORMSPREE =====
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const action = form.action;

    status.textContent = "Invio in corso...";
    status.style.color = "#ccc";

    try {
      const response = await fetch(action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        status.textContent = "✅ Messaggio inviato con successo!";
        status.style.color = "lightgreen";
        form.reset();
      } else {
        status.textContent = "❌ Errore nell'invio, riprova.";
        status.style.color = "tomato";
      }
    } catch {
      status.textContent = "⚠️ Connessione fallita, riprova più tardi.";
      status.style.color = "orange";
    }
  });
}

// ===== FADE-IN ON SCROLL =====
const faders = document.querySelectorAll(".fade-in");
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

faders.forEach(el => appearOnScroll.observe(el));

// ===== ABOUT SLIDER =====
const aboutCards = document.querySelectorAll('.about-card');
const aboutPrevBtn = document.getElementById('about-prev');
const aboutNextBtn = document.getElementById('about-next');
const aboutDotsContainer = document.querySelector('.about-dots');
let aboutIndex = 0;
let aboutAutoSlide;

// Genera i pallini
aboutCards.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    showAboutCard(i);
    resetAboutAutoSlide();
  });
  aboutDotsContainer.appendChild(dot);
});

const aboutDots = aboutDotsContainer.querySelectorAll('button');

function showAboutCard(index) {
  aboutCards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
    aboutDots[i].classList.toggle('active', i === index);
  });
  aboutIndex = index;
}

function nextAboutCard() {
  showAboutCard((aboutIndex + 1) % aboutCards.length);
}

function prevAboutCard() {
  showAboutCard((aboutIndex - 1 + aboutCards.length) % aboutCards.length);
}

aboutNextBtn.addEventListener('click', () => {
  nextAboutCard();
  resetAboutAutoSlide();
});

aboutPrevBtn.addEventListener('click', () => {
  prevAboutCard();
  resetAboutAutoSlide();
});

// Auto-slide
function startAboutAutoSlide() {
  aboutAutoSlide = setInterval(nextAboutCard, 6000);
}

function resetAboutAutoSlide() {
  clearInterval(aboutAutoSlide);
  startAboutAutoSlide();
}

startAboutAutoSlide();
