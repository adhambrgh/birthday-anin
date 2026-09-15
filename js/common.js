/* ===== Common JS — dipakai semua halaman ===== */

const CONFETTI_COLORS = ["#ef5350", "#42a5f5", "#66bb6a", "#ffca28", "#ab47bc", "#ff7043", "#ec407a"];

function semprotConfetti(jumlah) {
  for (let i = 0; i < jumlah; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.className = "confetti-piece";
      c.style.left = Math.random() * 100 + "vw";
      c.style.top = "-20px";
      c.style.background =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      c.style.width = Math.random() * 8 + 6 + "px";
      c.style.height = Math.random() * 8 + 6 + "px";
      c.style.animationDuration = Math.random() * 4 + 6 + "s";
      c.style.animationDelay = Math.random() * 2 + "s";
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 8000);
    }, i * 40);
  }
}

function sparkleDi(x, y) {
  const s = document.createElement("span");
  s.className = "sparkle";
  s.innerText = Math.random() > 0.5 ? "✦" : "✧";
  s.style.left = x + "px";
  s.style.top = y + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1500);
}

/* ===== MUSIC — persist across pages via localStorage ===== */
function toggleMusic() {
  const music = document.getElementById("music");
  const btn = document.getElementById("music-btn");
  if (!music || !btn) return;
  if (music.paused) {
    music.play()
      .then(() => {
        btn.classList.add("playing");
        localStorage.setItem("anin_music", "on");
      })
      .catch(() => {});
  } else {
    music.pause();
    btn.classList.remove("playing");
    localStorage.setItem("anin_music", "off");
  }
}

function autoPlayMusic() {
  const music = document.getElementById("music");
  const btn = document.getElementById("music-btn");
  if (!music) return;
  music.volume = 0.5;
  // Coba putar otomatis, kalau browser blokir fallback di first click
  music.play()
    .then(() => {
      if (btn) btn.classList.add("playing");
      localStorage.setItem("anin_music", "on");
    })
    .catch(() => {});
}

// Setelah DOM ready, cek status musik sebelumnya dari localStorage
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("anin_music");
  if (saved !== "off") {
    autoPlayMusic();
  }
  // Fallback: klik pertama di halaman → coba play
  document.addEventListener("click", () => {
    const music = document.getElementById("music");
    const btn = document.getElementById("music-btn");
    if (music && music.paused && localStorage.getItem("anin_music") !== "off") {
      music.play()
        .then(() => { if (btn) btn.classList.add("playing"); })
        .catch(() => {});
    }
  }, { once: true });
});

function createBgDecor() {
  const container = document.getElementById("bgDecor");
  if (!container) return;
  const items = ["✿", "❀", "✦", "✧", "❁", "✾"];
  for (let i = 0; i < 30; i++) {
    const span = document.createElement("span");
    span.className = "floating-item";
    span.innerText = items[Math.floor(Math.random() * items.length)];
    span.style.left = Math.random() * 100 + "vw";
    span.style.fontSize = (Math.random() * 15 + 10) + "px";
    span.style.color = Math.random() > 0.5 ? "#BBDEFB" : "white";
    span.style.animationDuration = (Math.random() * 10 + 5) + "s";
    span.style.animationDelay = (Math.random() * 5) + "s";
    container.appendChild(span);
  }
}

// Klik di mana saja (kecuali di game area) → sparkle
document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" || e.target.closest(".photo-frame")) {
    sparkleDi(e.clientX - 8, e.clientY - 8);
  }
});
