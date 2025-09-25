/* ========================================================================== */
/*                                UTILS                                       */
/* ========================================================================== */
const MONTHS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];
const isMobile = () => window.innerWidth <= 768;

/* ========================================================================== */
/*                   DESKTOP : CALENDRIER DROPDOWN                            */
/* ========================================================================== */
(function desktopCalendar() {
  const container = document.getElementById("calendar-desktop");
  if (!container) return;

  const grid      = document.getElementById("d-grid");
  const monthEl   = document.getElementById("d-month");
  const yearEl    = document.getElementById("d-year");
  const prevBtn   = document.getElementById("d-prev");
  const nextBtn   = document.getElementById("d-next");
  const arrivalEl = document.getElementById("arrival");
  const departEl  = document.getElementById("departure");

  let current = new Date();
  let pickingArrival = true;
  let arrivalDate = null;
  let departDate  = null;

  function render() {
    grid.innerHTML = "";
    const y = current.getFullYear();
    const m = current.getMonth();
    monthEl.textContent = MONTHS[m];
    yearEl.textContent  = y;

    const first = (new Date(y, m, 1).getDay() + 6) % 7;
    const last  = new Date(y, m+1, 0).getDate();

    for (let i=0; i<first; i++) grid.appendChild(document.createElement("div"));

    for (let d=1; d<=last; d++) {
      const cell = document.createElement("div");
      cell.className = "accueil__day";
      cell.textContent = d;

      const sel = 
        (arrivalDate && y===arrivalDate.getFullYear() && m===arrivalDate.getMonth() && d===arrivalDate.getDate()) ||
        (departDate  && y===departDate.getFullYear()  && m===departDate.getMonth()  && d===departDate.getDate());
      if (sel) cell.classList.add("accueil__day--selected");

      cell.addEventListener("click", () => {
        const picked = new Date(y, m, d);
        if (pickingArrival) {
          arrivalDate = picked;
          arrivalEl.value = picked.toLocaleDateString("fr-FR");
          pickingArrival = false;
        } else {
          departDate = picked;
          departEl.value = picked.toLocaleDateString("fr-FR");
          pickingArrival = true;
          container.classList.add("accueil__calendar--hidden");
        }
        render();
      });

      grid.appendChild(cell);
    }
  }

  arrivalEl.addEventListener("click", e => {
    if (isMobile()) return;
    e.stopPropagation();
    pickingArrival = true;
    container.classList.remove("accueil__calendar--hidden");
    render();
  });
  departEl.addEventListener("click", e => {
    if (isMobile()) return;
    e.stopPropagation();
    pickingArrival = false;
    container.classList.remove("accueil__calendar--hidden");
    render();
  });

  prevBtn.addEventListener("click", e => { e.stopPropagation(); current.setMonth(current.getMonth()-1); render(); });
  nextBtn.addEventListener("click", e => { e.stopPropagation(); current.setMonth(current.getMonth()+1); render(); });

  document.addEventListener("click", e => {
    if (!container.contains(e.target) && e.target !== arrivalEl && e.target !== departEl) {
      container.classList.add("accueil__calendar--hidden");
    }
  });

  render();
})();

/* ========================================================================== */
/*                     DESKTOP : QUI (VOYAGEURS) DROPDOWN                     */
/* ========================================================================== */
(function desktopWho() {
  const input = document.getElementById("voyageurs");
  const panel = document.getElementById("who-desktop");
  if (!input || !panel) return;

  const counts = { adults:2, children:0, pets:0 };

  function updateLabel() {
    const total = counts.adults + counts.children;
    let txt = `${total} voyageur${total>1?"s":""}`;
    if (counts.pets) txt += `, ${counts.pets} animal${counts.pets>1?"s":""}`;
    input.value = txt;
  }
  updateLabel();

  input.addEventListener("click", e => {
    if (isMobile()) return;
    e.stopPropagation();
    panel.classList.toggle("accueil__who--hidden");
  });

  panel.querySelectorAll(".accueil__who-row").forEach(row => {
    const type = row.dataset.type;
    const countEl = row.querySelector(".accueil__who-count");
    row.querySelectorAll(".accueil__ctl").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("-plus")) counts[type]++;
        else if (counts[type] > 0) counts[type]--;
        countEl.textContent = counts[type];
        updateLabel();
      });
    });
  });

  document.addEventListener("click", e => {
    if (!panel.contains(e.target) && e.target !== input) {
      panel.classList.add("accueil__who--hidden");
    }
  });
})();

/* ========================================================================== */
/*                     MOBILE : POPUP PLEIN ÉCRAN                             */
/* ========================================================================== */
(function mobilePopup() {
  const popup    = document.getElementById("mobile-popup");
  if (!popup) return;

  const openBtn  = document.getElementById("search-btn");
  const closeBtn = document.getElementById("popup-close");
  const clearBtn = document.getElementById("popup-clear");
  const goBtn    = document.getElementById("popup-search");

  // Ouverture / fermeture
  openBtn.addEventListener("click", () => {
    if (!isMobile()) return;
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  });
  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  });

  // === Calendrier mobile ===
  const grid = document.getElementById("m-grid");
  const mEl  = document.getElementById("m-month");
  const yEl  = document.getElementById("m-year");
  const prev = document.getElementById("m-prev");
  const next = document.getElementById("m-next");

  let cur = new Date();
  let arrival = null, depart = null, pickingArrival = true;

  function renderM() {
    grid.innerHTML = "";
    const y = cur.getFullYear(), m = cur.getMonth();
    mEl.textContent = MONTHS[m];
    yEl.textContent = y;

    const first = (new Date(y,m,1).getDay()+6)%7;
    const last  = new Date(y,m+1,0).getDate();

    for (let i=0; i<first; i++) grid.appendChild(document.createElement("div"));
    for (let d=1; d<=last; d++) {
      const cell = document.createElement("div");
      cell.className = "accueil__mday";
      cell.textContent = d;

      const sel =
        (arrival && y===arrival.getFullYear() && m===arrival.getMonth() && d===arrival.getDate()) ||
        (depart  && y===depart.getFullYear()  && m===depart.getMonth()  && d===depart.getDate());
      if (sel) cell.classList.add("accueil__mday--selected");

      cell.addEventListener("click", () => {
        const picked = new Date(y,m,d);
        if (pickingArrival) { arrival = picked; pickingArrival = false; }
        else { depart = picked; pickingArrival = true; }
        renderM();
      });

      grid.appendChild(cell);
    }
  }
  prev.addEventListener("click", () => { cur.setMonth(cur.getMonth()-1); renderM(); });
  next.addEventListener("click", () => { cur.setMonth(cur.getMonth()+1); renderM(); });
  renderM();

  // === Voyageurs mobile ===
  const mCounts = { adults:2, children:0, pets:0 };
  function updateMCounts() {
    document.querySelectorAll(".accueil__row").forEach(row => {
      row.querySelector(".accueil__num").textContent = mCounts[row.dataset.type];
    });
  }
  updateMCounts();

  document.querySelectorAll(".accueil__row").forEach(row => {
    const type = row.dataset.type;
    row.querySelectorAll(".accueil__ctl").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("-plus")) mCounts[type]++;
        else if (mCounts[type] > 0) mCounts[type]--;
        updateMCounts();
      });
    });
  });

  // === Footer actions ===
  clearBtn.addEventListener("click", () => {
    document.getElementById("dest-mobile").value = "";
    Object.assign(mCounts, { adults:2, children:0, pets:0 });
    arrival = depart = null; pickingArrival = true;
    updateMCounts(); renderM();
  });

  goBtn.addEventListener("click", () => {
    const dest = document.getElementById("dest-mobile").value.trim();

    popup.classList.remove("active");
    document.body.style.overflow = "";

    // Sync vers desktop
    if (arrival) document.getElementById("arrival").value = arrival.toLocaleDateString("fr-FR");
    if (depart)  document.getElementById("departure").value = depart.toLocaleDateString("fr-FR");

    const total = mCounts.adults + mCounts.children;
    let txt = `${total} voyageur${total>1?"s":""}`;
    if (mCounts.pets) txt += `, ${mCounts.pets} animal${mCounts.pets>1?"s":""}`;
    document.getElementById("voyageurs").value = txt;

    if (dest) document.getElementById("dest-desktop").value = dest;
  });
})();

/* ========================================================================== */
/*                           MENU MOBILE                                      */
/* ========================================================================== */
(function mobileMenu() {
  const navToggle  = document.getElementById("nav-toggle");
  const menuClose  = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!navToggle || !mobileMenu) return;

  navToggle.addEventListener("click", () => {
    mobileMenu.style.display = "flex";
  });

  menuClose.addEventListener("click", () => {
    mobileMenu.style.display = "none";
  });
})();

/* ========================================================================== */
/*                           CARROUSEL ACCUEIL                                */
/* ========================================================================== */
(function carouselAccueil() {
  const toggleBtn = document.querySelector(".features-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function() {
      document.querySelectorAll(".feature-hidden").forEach(el => {
        el.classList.toggle("open");
      });
      this.classList.toggle("rotate");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".carousel-container__accueil2").forEach(container => {
      const carousel = container.querySelector(".carousel__accueil2");
      const leftArrow = container.querySelector(".arrow__accueil2.left");
      const rightArrow = container.querySelector(".arrow__accueil2.right");

      if (!carousel || !leftArrow || !rightArrow) return;

      const step = () => {
        const item = carousel.querySelector("div");
        return item ? item.offsetWidth + 20 : 300;
      };

      function updateArrows() {
        const max = carousel.scrollWidth - carousel.clientWidth;
        const x = carousel.scrollLeft;
        leftArrow.disabled = x <= 2;
        rightArrow.disabled = x >= max - 2;
      }

      rightArrow.addEventListener("click", () => {
        carousel.scrollBy({ left: step(), behavior: "smooth" });
      });
      leftArrow.addEventListener("click", () => {
        carousel.scrollBy({ left: -step(), behavior: "smooth" });
      });

      carousel.addEventListener("scroll", updateArrows, { passive: true });
      window.addEventListener("resize", updateArrows);

      // Drag
      let isDown = false, startX = 0, scrollStart = 0;
      carousel.addEventListener("pointerdown", (e) => {
        isDown = true;
        startX = e.clientX;
        scrollStart = carousel.scrollLeft;
        carousel.setPointerCapture(e.pointerId);
      });
      carousel.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        carousel.scrollLeft = scrollStart - dx;
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach(evt =>
        carousel.addEventListener(evt, () => { isDown = false; updateArrows(); })
      );

      updateArrows();
    });
  });
})();

/* ========================================================================== */
/*                              PAGINATION                                    */
/* ========================================================================== */
(function pagination() {
  const cardsPerPage = 4;
  let currentPage = 1;

  function renderPagination() {
    const cards = Array.from(document.querySelectorAll("#cardsContainer .card"));
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    pagination.innerHTML = "";

    // cacher/afficher les cards
    cards.forEach((card, index) => {
      card.style.display =
        index >= (currentPage - 1) * cardsPerPage &&
        index < currentPage * cardsPerPage
          ? "flex"
          : "none";
    });

    // générer les boutons
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");

      btn.addEventListener("click", () => {
        currentPage = i;
        renderPagination();
      });

      pagination.appendChild(btn);
    }
  }

  renderPagination();
})();

/* ========================================================================== */
/*                             LEAFLET - CARTE                                */
/* ========================================================================== */
(function leafletMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const map = L.map("map").setView([46.5, 2], 6);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20
  }).addTo(map);

  const cards = document.querySelectorAll(".card");
  const bounds = [];

  cards.forEach(card => {
    const lat = parseFloat(card.dataset.lat);
    const lng = parseFloat(card.dataset.lng);
    const prix = card.dataset.prix;
    const ville = card.dataset.ville;
    const dispo = card.dataset.dispo;
    const imgSrc = card.querySelector("img").src;

    if (!isNaN(lat) && !isNaN(lng)) {
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "price-marker",
          html: prix,
          iconSize: null,
          iconAnchor: [30, 20]
        })
      }).addTo(map);

      marker.bindPopup(`
        <div style="text-align:center;width:250px">
          <img src="${imgSrc}" alt="${ville}" 
               style="width:100%;height:150px;object-fit:cover;border-radius:10px;margin-bottom:8px">
          <strong style="font-size:16px">${ville}</strong><br>
          <small>${dispo}</small><br>
          <span style="font-weight:bold;color:#2f6f3f;font-size:16px">${prix}</span>
        </div>
      `, { maxWidth: 260 });

      bounds.push([lat, lng]);
    }
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  /* ======================================================================== */
  /*                  LIEN RECHERCHE ↔ CARDS & CARTE                          */
  /* ======================================================================== */
  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const destInput = document.getElementById("dest-desktop").value.trim().toLowerCase();
      const cards = document.querySelectorAll(".card");
      const bounds = [];

      cards.forEach(card => {
        const ville = card.dataset.ville.toLowerCase();
        if (!destInput || ville.includes(destInput)) {
          card.classList.remove("hidden");
          const lat = parseFloat(card.dataset.lat);
          const lng = parseFloat(card.dataset.lng);
          if (!isNaN(lat) && !isNaN(lng)) bounds.push([lat, lng]);
        } else {
          card.classList.add("hidden");
        }
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });
  }
})();
