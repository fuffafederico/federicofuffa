// ========================================
// NAVBAR: Hamburger toggle per mobile
// ========================================
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// ========================================
// TEMA: Automatico in base alla modalità del dispositivo
// ========================================
function applyTheme() {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  document.body.classList.toggle("light", prefersLight);
}

applyTheme();
window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", applyTheme);

// ========================================
// LOGHI: Aggiornamento loghi chiaro/scuro
// ========================================
const navLogo = document.getElementById("nav-logo");
const heroLogo = document.getElementById("hero-logo");

function updateLogos() {
  if (document.body.classList.contains("light")) {
    navLogo.src = "img/logo1.png";
    heroLogo.src = "img/logo1.png";
  } else {
    navLogo.src = "img/logo1b.png";
    heroLogo.src = "img/logo1b.png";
  }
}
updateLogos();
window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", updateLogos);

// ========================================
// EMAILJS: Invia email dal form contatti
// ========================================
(function() {
  emailjs.init("Xkb_09maKtPCot8ya");
})();

const contactForm = document.getElementById("contact-form");
const contactMessage = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      contactMessage.textContent = "Per favore, compila tutti i campi.";
      contactMessage.style.color = "red";
      return;
    }

    emailjs.send("service_m8qoi4s", "template_k0arone", {
        name: name,        // {{name}} nel template
        email: email,      // {{email}} nel template (Reply To)
        message: message   // {{message}} nel template
    })
    .then(() => {
        contactMessage.textContent = "Messaggio inviato con successo! ✅";
        contactMessage.style.color = "lightgreen";
        contactForm.reset();
    })
    .catch((error) => {
        console.error("Errore invio:", error);
        contactMessage.textContent = "Errore nell'invio. Riprova più tardi.";
        contactMessage.style.color = "red";
    });
  });
}

// ========================================
// CARD INSTAGRAM: rende tutta la card cliccabile
// ========================================
const instagramCard = document.querySelector(".instagram-card");
if (instagramCard) {
  instagramCard.addEventListener("click", () => {
    window.open("https://www.instagram.com/fedefuffa_/", "_blank");
  });
}
