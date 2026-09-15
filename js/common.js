/* ===== Common JS — dipakai semua halaman ===== */

const CONFETTI_COLORS = ["#ef5350", "#42a5f5", "#66bb6a", "#ffca28", "#ab47bc", "#ff7043", "#ec407a"];

/* ===== PJAX ROUTER — navigasi tanpa reload, musik tetap jalan ===== */
const pageState = {
  timers: [],
  scripts: [],
  listeners: [],
  navClassName: "pjax-loading",
};

function pageInterval(fn, ms) {
  const id = setInterval(fn, ms);
  pageState.timers.push(id);
  return id;
}
function pageTimeout(fn, ms) {
  const id = setTimeout(fn, ms);
  pageState.timers.push(id);
  return id;
}
function clearPageTimers() {
  pageState.timers.forEach((id) => {
    clearInterval(id);
    clearTimeout(id);
  });
  pageState.timers = [];
}
function pageListener(el, type, fn, opts) {
  el.addEventListener(type, fn, opts);
  pageState.listeners.push({ el, type, fn, opts });
}
function cleanupPreviousPage() {
  clearPageTimers();
  pageState.listeners.forEach(({ el, type, fn, opts }) =>
    el.removeEventListener(type, fn, opts)
  );
  pageState.listeners = [];
}

function isInternalLink(href) {
  if (!href || href.startsWith("#")) return false;
  const url = new URL(href, window.location.origin);
  return url.origin === window.location.origin && url.pathname.endsWith(".html");
}

function pjaxNavigate(url) {
  const target = new URL(url, window.location.origin).pathname.split("/").pop();
  document.body.classList.add(pageState.navClassName);
  fetch(target)
    .then((r) => r.text())
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");

      // Buang elemen persistent dari halaman target (biar ga duplikat)
      doc.querySelectorAll("#music, #music-btn, #bgDecor").forEach((el) => el.remove());

      cleanupPreviousPage();

      // Pertahankan elemen musik & tombol, swap sisanya
      const music = document.getElementById("music");
      const musicBtn = document.getElementById("music-btn");
      const bg = document.getElementById("bgDecor");

      // Kumpulkan script target (inline) untuk dijalankan setelah swap
      const inlineScripts = [];
      doc.querySelectorAll("script").forEach((s) => {
        if (s.src) return;
        if (s.textContent.includes("js/common.js")) return;
        if (s.textContent.includes("common.js")) return;
        inlineScripts.push(s.textContent);
      });

      // Ganti body content
      const newBody = doc.body.innerHTML;
      document.body.innerHTML = newBody;

      // Masukkan ulang elemen musik & bg decor (tetap hidup)
      if (music) document.body.appendChild(music);
      if (musicBtn) document.body.appendChild(musicBtn);
      if (bg) document.body.appendChild(bg);

      document.title = doc.title;

      // Salin style page target
      const oldStylish = document.querySelectorAll("style[data-pjax-style]");
      oldStylish.forEach((s) => s.remove());
      doc.querySelectorAll("style").forEach((s) => {
        const st = document.createElement("style");
        st.setAttribute("data-pjax-style", "");
        st.textContent = s.textContent;
        document.head.appendChild(st);
      });

      // Jalankan script halaman baru
      inlineScripts.forEach((code) => {
        const sc = document.createElement("script");
        sc.textContent = code;
        document.body.appendChild(sc);
      });

      // Auto-play musik jika sebelumnya playing
      const music = document.getElementById("music");
      const btn = document.getElementById("music-btn");
      const saved = localStorage.getItem("anin_music");
      if (saved !== "off" && music && music.paused) {
        music.volume = 0.5;
        music.play().then(() => {
          if (btn) btn.classList.add("playing");
        }).catch(() => {});
      }

      window.scrollTo(0, 0);
      history.pushState({ pjax: true }, "", target);
      document.body.classList.remove(pageState.navClassName);
    })
    .catch(() => {
      // Kalau fetch gagal, fallback navigasi biasa
      window.location.href = target;
    });
}

// Intercept klik internal links
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (isInternalLink(href) && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
    e.preventDefault();
    pjaxNavigate(href);
  }
});

// Tombol back browser → navigasi balik via PJAX
window.addEventListener("popstate", () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  pjaxNavigate(path);
});

// Tersedia global untuk tombol onclick
window.pjaxNavigate = pjaxNavigate;

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
    localStorage.setItem("anin_music", "on");
    resumeAndPlay(music);
  } else {
    music.pause();
    btn.classList.remove("playing");
    localStorage.setItem("anin_music", "off");
  }
}

function resumeAndPlay(music) {
  const savedTime = parseFloat(localStorage.getItem("anin_music_time") || "0");
  if (savedTime > 0 && music.currentTime < 1) {
    music.currentTime = savedTime;
  }
  const btn = document.getElementById("music-btn");
  const p = music.play();
  if (p && p.then) {
    p.then(() => {
      if (btn) btn.classList.add("playing");
    }).catch(() => {});
  }
}

function autoPlayMusic() {
  const music = document.getElementById("music");
  if (!music) return;
  music.volume = 0.5;
  resumeAndPlay(music);
}

// Saat pindah halaman / tutup → simpan posisi lagu
function saveMusicTime() {
  const music = document.getElementById("music");
  if (music && !music.paused) {
    localStorage.setItem("anin_music_time", String(music.currentTime));
  }
}
window.addEventListener("pagehide", saveMusicTime);
window.addEventListener("beforeunload", saveMusicTime);
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveMusicTime();
});

// Simpan progres tiap detik biar ga kehilangan posisi
setInterval(() => {
  const music = document.getElementById("music");
  if (music && !music.paused) {
    localStorage.setItem("anin_music_time", String(music.currentTime));
  }
}, 1000);

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
  container.innerHTML = "";
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
