// ===== MENU MOBILE =====
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// Chiudi menu quando clicchi un link
document.querySelectorAll("#menu a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
  });
});

// ===== NAVBAR ON SCROLL =====
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
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
    } catch (error) {
      status.textContent = "⚠️ Connessione fallita, riprova più tardi.";
      status.style.color = "orange";
    }
  });
}

// ===== FADE-IN ON SCROLL =====
const faders = document.querySelectorAll(".fade-in");

// Funzione observer
const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

// Attivo observer sugli elementi con classe .fade-in
faders.forEach(el => {
  appearOnScroll.observe(el);
});
