
    // Dropdown équipements
    const btn = document.getElementById("toggleAmenities");
    const more = document.getElementById("moreAmenities");

    btn.addEventListener("click", () => {
      more.classList.toggle("hidden__detail");
      btn.textContent = more.classList.contains("hidden__detail")
        ? "Voir plus"
        : "Voir moins";
    });

    // Carte Leaflet
    const map = L.map('map').setView([45.758, 4.84], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([45.758, 4.84]).addTo(map)
      .bindPopup("<b>Logement à Lyon</b><br>Proche centre-ville.")
      .openPopup();
