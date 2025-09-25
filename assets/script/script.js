// Récupération des éléments
const navToggle   = document.getElementById("nav-toggle");
const menuClose   = document.getElementById("menu-close");
const mobileMenu  = document.getElementById("mobile-menu");

// Ouvrir le menu
navToggle.addEventListener("click", () => {
  mobileMenu.style.display = "flex"; // ou .classList.add("active") si tu préfères gérer avec une classe CSS
});

// Fermer le menu
menuClose.addEventListener("click", () => {
  mobileMenu.style.display = "none"; // ou .classList.remove("active")
});
