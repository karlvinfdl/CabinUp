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
(function desktopCalendar(){
  const container = document.getElementById("calendar-desktop");
  const grid      = document.getElementById("d-grid");
  const monthEl   = document.getElementById("d-month");
  const yearEl    = document.getElementById("d-year");
  const prevBtn   = document.getElementById("d-prev");
  const nextBtn   = document.getElementById("d-next");
  const arrivalInput   = document.getElementById("arrival");
  const departureInput = document.getElementById("departure");

  if (!container) return;

  let current = new Date();
  let selectingArrival = true;
  let arrivalDate = null;
  let departureDate = null;

  /* ---- Rendu du calendrier ---- */
  function render(){
    grid.innerHTML = "";
    const y = current.getFullYear();
    const m = current.getMonth();
    monthEl.textContent = MONTHS[m];
    yearEl.textContent  = y;

    const first = (new Date(y, m, 1).getDay() + 6) % 7;
    const last  = new Date(y, m+1, 0).getDate();

    for(let i=0;i<first;i++) grid.appendChild(document.createElement("div"));

    for(let d=1; d<=last; d++){
      const cell = document.createElement("div");
      cell.className = "accueil__day";
      cell.textContent = d;

      const isSel =
        (arrivalDate && y===arrivalDate.getFullYear() && m===arrivalDate.getMonth() && d===arrivalDate.getDate()) ||
        (departureDate && y===departureDate.getFullYear() && m===departureDate.getMonth() && d===departureDate.getDate());

      if (isSel) cell.classList.add("accueil__day--selected");

      cell.addEventListener("click", ()=>{
        const picked = new Date(y, m, d);
        if (selectingArrival) {
          arrivalDate = picked;
          arrivalInput.value = picked.toLocaleDateString("fr-FR");
          selectingArrival = false;
        } else {
          departureDate = picked;
          departureInput.value = picked.toLocaleDateString("fr-FR");
          selectingArrival = true;
          container.classList.add("accueil__calendar--hidden");
        }
        render();
      });

      grid.appendChild(cell);
    }
  }

  /* ---- Ouverture / Fermeture ---- */
  arrivalInput.addEventListener("click", (e)=>{
    if (isMobile()) return;
    e.stopPropagation();
    container.classList.remove("accueil__calendar--hidden");
    selectingArrival = true;
    render();
  });
  departureInput.addEventListener("click", (e)=>{
    if (isMobile()) return;
    e.stopPropagation();
    container.classList.remove("accueil__calendar--hidden");
    selectingArrival = false;
    render();
  });

  prevBtn.addEventListener("click", (e)=>{ e.stopPropagation(); current.setMonth(current.getMonth()-1); render(); });
  nextBtn.addEventListener("click", (e)=>{ e.stopPropagation(); current.setMonth(current.getMonth()+1); render(); });

  /* ---- Click en dehors ---- */
  document.addEventListener("click", (e)=>{
    if (!container.contains(e.target) && e.target !== arrivalInput && e.target !== departureInput) {
      container.classList.add("accueil__calendar--hidden");
    }
  });

  render();
})();

/* ========================================================================== */
/*                     DESKTOP : QUI (VOYAGEURS) DROPDOWN                     */
/* ========================================================================== */
(function desktopWho(){
  const input = document.getElementById("voyageurs");
  const panel = document.getElementById("who-desktop");
  if (!input || !panel) return;

  const counts = { adults:2, children:0, pets:0 };

  /* ---- Mise à jour du label ---- */
  function updateLabel(){
    const total = counts.adults + counts.children;
    let label = `${total} voyageur${total>1?'s':''}`;
    if (counts.pets>0) label += `, ${counts.pets} animal${counts.pets>1?'s':''}`;
    input.value = label;
  }
  updateLabel();

  /* ---- Ouverture ---- */
  input.addEventListener("click",(e)=>{
    if (isMobile()) return;
    e.stopPropagation();
    panel.classList.toggle("accueil__who--hidden");
  });

  /* ---- Boutons +/- ---- */
  panel.querySelectorAll(".accueil__who-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const type = btn.dataset.type;
      const action = btn.dataset.action;
      if (action === "increase") counts[type]++; else if (counts[type]>0) counts[type]--;
      panel.querySelector(`.accueil__who-count[data-scope="desk"][data-type="${type}"]`).textContent = counts[type];
      updateLabel();
    });
  });

  /* ---- Click en dehors ---- */
  document.addEventListener("click",(e)=>{
    if (!panel.contains(e.target) && e.target !== input) {
      panel.classList.add("accueil__who--hidden");
    }
  });
})();

/* ========================================================================== */
/*                     MOBILE : POPUP PLEIN ÉCRAN                             */
/* ========================================================================== */
(function mobilePopup(){
  const popup    = document.getElementById("mobile-popup");
  const openBtn  = document.getElementById("search-btn");
  const closeBtn = document.getElementById("popup-close");
  const clearBtn = document.getElementById("popup-clear");
  const goBtn    = document.getElementById("popup-search");

  if (!popup) return;

  /* ---- Ouverture / Fermeture ---- */
  openBtn.addEventListener("click", ()=>{
    if (!isMobile()) return;
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  });
  closeBtn.addEventListener("click", ()=>{
    popup.classList.remove("active");
    document.body.style.overflow = "";
  });

  /* ------------------- CALENDRIER MOBILE ------------------- */
  const grid = document.getElementById("m-grid");
  const mEl  = document.getElementById("m-month");
  const yEl  = document.getElementById("m-year");
  const prev = document.getElementById("m-prev");
  const next = document.getElementById("m-next");

  let cur = new Date();
  let mArrival = null, mDeparture = null, pickArr = true;

  function renderM(){
    grid.innerHTML = "";
    const y = cur.getFullYear(), m = cur.getMonth();
    mEl.textContent = MONTHS[m]; yEl.textContent = y;

    const first = (new Date(y,m,1).getDay()+6)%7;
    const last  = new Date(y,m+1,0).getDate();

    for(let i=0;i<first;i++) grid.appendChild(document.createElement("div"));
    for(let d=1; d<=last; d++){
      const cell = document.createElement("div");
      cell.className = "accueil__mday";
      cell.textContent = d;

      const sel =
        (mArrival && y===mArrival.getFullYear() && m===mArrival.getMonth() && d===mArrival.getDate()) ||
        (mDeparture && y===mDeparture.getFullYear() && m===mDeparture.getMonth() && d===mDeparture.getDate());
      if (sel) cell.classList.add("accueil__mday--selected");

      cell.addEventListener("click", ()=>{
        const picked = new Date(y,m,d);
        if (pickArr) { mArrival = picked; pickArr = false; }
        else { mDeparture = picked; pickArr = true; }
        renderM();
      });

      grid.appendChild(cell);
    }
  }
  prev.addEventListener("click", ()=>{ cur.setMonth(cur.getMonth()-1); renderM(); });
  next.addEventListener("click", ()=>{ cur.setMonth(cur.getMonth()+1); renderM(); });
  renderM();

  /* ------------------- COMPTEURS MOBILE (QUI) ------------------- */
  const mCounts = { adults:2, children:0, pets:0 };
  function updateMobile(){
    document.querySelectorAll('.accueil__num[data-scope="mob"]').forEach(el=>{
      el.textContent = mCounts[el.dataset.type];
    });
  }
  updateMobile();

  document.querySelectorAll('.accueil__ctl[data-scope="mob"]').forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const t = btn.dataset.type;
      if (btn.classList.contains("-plus")) mCounts[t]++; else if (mCounts[t]>0) mCounts[t]--;
      updateMobile();
    });
  });

  /* ------------------- ACTIONS FOOTER ------------------- */
  clearBtn.addEventListener("click", ()=>{
    document.getElementById("dest-mobile").value = "";
    mCounts.adults = 2; mCounts.children = 0; mCounts.pets = 0; updateMobile();
    mArrival = mDeparture = null; pickArr = true; renderM();
  });

  goBtn.addEventListener("click", ()=>{
    // Exemple de récupération (à brancher à ta recherche)
    const dest = document.getElementById("dest-mobile").value.trim();
    console.log({ dest, mArrival, mDeparture, mCounts });

    popup.classList.remove("active");
    document.body.style.overflow = "";

    // Remplissage des inputs desktop pour cohérence
    const arrivalInput   = document.getElementById("arrival");
    const departureInput = document.getElementById("departure");
    if (mArrival)   arrivalInput.value   = mArrival.toLocaleDateString("fr-FR");
    if (mDeparture) departureInput.value = mDeparture.toLocaleDateString("fr-FR");

    const voyageurs = document.getElementById("voyageurs");
    const total = mCounts.adults + mCounts.children;
    voyageurs.value = `${total} voyageur${total>1?'s':''}${mCounts.pets?`, ${mCounts.pets} animal${mCounts.pets>1?'s':''}`:''}`;

    const destDesk = document.getElementById("dest-desktop");
    if (dest) destDesk.value = dest;
  });
})();

/* ========================================================================== */
/*                     CARROUSEL ACCUEIL 2                                     */
/* ========================================================================== */

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
