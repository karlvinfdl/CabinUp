document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".panier-card");
  const summaryImg = document.querySelector(".panier-summary img");
  const summaryTitle = document.querySelector(".panier-summary__body h3");
  const summaryRows = document.querySelectorAll(".summary-row");
  const summaryBtn = document.querySelector(".panier-summary .btn");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img").src;
      const title = card.querySelector("h3").textContent;
      const price = card.querySelector(".price")?.textContent || "Non disponible";
      const badge = card.querySelector(".badge");

      // Met à jour résumé
      summaryImg.src = img;
      summaryTitle.textContent = title;
      summaryRows[2].querySelector("div").innerHTML =
        `<strong>Prix total</strong><br>${price}`;

      // Bouton dispo/indispo
      if (badge.classList.contains("badge--green")) {
        summaryBtn.textContent = "Réserver";
        summaryBtn.className = "btn btn--green";
      } else {
        summaryBtn.textContent = "Indisponible";
        summaryBtn.className = "btn btn--red";
      }
    });

    // Suppression d’une carte
    card.querySelector(".panier-card__remove").addEventListener("click", e => {
      e.stopPropagation(); // évite de sélectionner la carte
      card.remove();
    });
  });
});
