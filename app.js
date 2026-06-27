// ── Song Data ──
const songs = [
  {
    id: 1,
    title: "Working",
    artist: "Cory Barker feat. Jordan King",
    album: "Working - Single",
    cover: "assets/album_working.png",
    src: "https://res.cloudinary.com/dtmshnien/video/upload/v1778164042/Working_-_Cory_Barker_feat._Jordan_King_hducax.mp3",
    color: "#5c3d1e"
  },
  {
    id: 2,
    title: "Tonight Again",
    artist: "Rod Kim feat. Mostly Moss",
    album: "Tonight Again - Single",
    cover: "assets/album_tonight_again.png",
    src: "https://res.cloudinary.com/dtmshnien/video/upload/v1778164042/Tonight_Again_-_Rod_Kim_feat._Mostly_Moss_gzvlmc.mp3",
    color: "#1a1a4e"
  },
  {
    id: 3,
    title: "The Fog",
    artist: "Trey Xavier & Rod Kim",
    album: "The Fog - Single",
    cover: "assets/album_the_fog.png",
    src: "https://res.cloudinary.com/dtmshnien/video/upload/v1778164042/The_Fog_-_Trey_Xavier_Rod_Kim_yuqabs.mp3",
    color: "#1a2e24"
  },
  {
    id: 4,
    title: "Taught Her How To Leave",
    artist: "Bill Douglas",
    album: "Taught Her How To Leave - Single",
    cover: "assets/album_taught_her.png",
    src: "https://res.cloudinary.com/dtmshnien/video/upload/v1778164041/Taught_Her_How_To_Leave_-_Bill_Douglas_mrnzgf.mp3",
    color: "#2e1f0a"
  }
];

// ── State ──
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one
let likedSongs = new Set();

// ── DOM ──
const audio = document.getElementById("audio-player");
const btnPlay = document.getElementById("btn-play");
const playIcon = document.getElementById("play-icon");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnShuffle = document.getElementById("btn-shuffle");
const btnRepeat = document.getElementById("btn-repeat");
const btnLike = document.getElementById("btn-like");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const timeCurrent = document.getElementById("time-current");
const timeTotal = document.getElementById("time-total");
const playerImg = document.getElementById("player-img");
const playerTrackName = document.getElementById("player-track-name");
const playerTrackArtist = document.getElementById("player-track-artist");
const volumeBar = document.getElementById("volume-bar");
const volumeFill = document.getElementById("volume-fill");
const mainContent = document.getElementById("main-content");
const topbar = document.getElementById("topbar");
const mainGradient = document.getElementById("main-gradient");
const greetingText = document.getElementById("greeting-text");
const greetingGrid = document.getElementById("greeting-grid");
const cardRow = document.getElementById("card-row");
const trackListBody = document.getElementById("track-list-body");
const libraryList = document.getElementById("library-list");

// ── Init ──
function init() {
  setGreeting();
  renderGreetingCards();
  renderSongCards();
  renderTrackList();
  renderLibrary();
  loadSong(currentIndex);
  setupEventListeners();
  audio.volume = 0.7;
}

// ── Greeting ──
function setGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) greetingText.textContent = "Good Morning";
  else if (hour < 18) greetingText.textContent = "Good Afternoon";
  else greetingText.textContent = "Good Evening";
}

// ── Render Greeting Cards ──
function renderGreetingCards() {
  greetingGrid.innerHTML = songs.map((song, i) => `
    <div class="greeting-card" data-index="${i}" id="greeting-card-${i}">
      <img src="${song.cover}" alt="${song.title}">
      <span>${song.title}</span>
      <div class="play-overlay">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="#000"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"/></svg>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".greeting-card").forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.dataset.index);
      if (currentIndex === idx && isPlaying) {
        pauseSong();
      } else {
        currentIndex = idx;
        loadSong(currentIndex);
        playSong();
      }
    });
  });
}

// ── Render Song Cards ──
function renderSongCards() {
  cardRow.innerHTML = songs.map((song, i) => `
    <div class="song-card" data-index="${i}" id="song-card-${i}">
      <div class="song-card-img">
        <img src="${song.cover}" alt="${song.title}">
        <button class="play-btn" data-index="${i}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="#000"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"/></svg>
        </button>
      </div>
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
    </div>
  `).join("");

  document.querySelectorAll(".song-card .play-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      if (currentIndex === idx && isPlaying) {
        pauseSong();
      } else {
        currentIndex = idx;
        loadSong(currentIndex);
        playSong();
      }
    });
  });

  document.querySelectorAll(".song-card").forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.dataset.index);
      if (currentIndex === idx && isPlaying) {
        pauseSong();
      } else {
        currentIndex = idx;
        loadSong(currentIndex);
        playSong();
      }
    });
  });
}

// ── Render Track List ──
function renderTrackList() {
  trackListBody.innerHTML = songs.map((song, i) => `
    <div class="track-row" data-index="${i}" id="track-row-${i}">
      <div>
        <span class="track-num">${i + 1}</span>
        <span class="track-play-icon">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"/></svg>
        </span>
      </div>
      <div class="track-info">
        <img src="${song.cover}" alt="${song.title}">
        <div>
          <div class="track-title">${song.title}</div>
          <div class="track-artist">${song.artist}</div>
        </div>
      </div>
      <div class="track-album">${song.album}</div>
      <div class="track-duration" id="track-duration-${i}">--:--</div>
    </div>
  `).join("");

  document.querySelectorAll(".track-row").forEach(row => {
    row.addEventListener("click", () => {
      const idx = parseInt(row.dataset.index);
      if (currentIndex === idx && isPlaying) {
        pauseSong();
      } else {
        currentIndex = idx;
        loadSong(currentIndex);
        playSong();
      }
    });
  });

  // Load durations
  songs.forEach((song, i) => {
    const tempAudio = new Audio();
    tempAudio.addEventListener("loadedmetadata", () => {
      const el = document.getElementById(`track-duration-${i}`);
      if (el) el.textContent = formatTime(tempAudio.duration);
    });
    tempAudio.src = song.src;
  });
}

// ── Render Library ──
function renderLibrary() {
  libraryList.innerHTML = `
    <div class="library-item active" data-index="playlist">
      <img src="assets/album_working.png" alt="Liked Songs" style="background:linear-gradient(135deg,#450af5,#c4efd9);padding:8px;">
      <div class="library-item-info">
        <h4>Liked Songs</h4>
        <p>Playlist · ${likedSongs.size} songs</p>
      </div>
    </div>
    ${songs.map((song, i) => `
      <div class="library-item" data-index="${i}">
        <img src="${song.cover}" alt="${song.title}">
        <div class="library-item-info">
          <h4>${song.title}</h4>
          <p>Single · ${song.artist.split(" feat.")[0].split(" & ")[0]}</p>
        </div>
      </div>
    `).join("")}
  `;

  document.querySelectorAll(".library-item[data-index]").forEach(item => {
    item.addEventListener("click", () => {
      const idx = item.dataset.index;
      if (idx === "playlist") return;
      const i = parseInt(idx);
      currentIndex = i;
      loadSong(currentIndex);
      playSong();
    });
  });
}

// ── Load Song ──
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  playerImg.src = song.cover;
  playerTrackName.textContent = song.title;
  playerTrackArtist.textContent = song.artist;

  // Update gradient
  mainGradient.style.background = `linear-gradient(180deg, ${song.color} 0%, #121212 100%)`;

  // Update active states
  updateActiveStates();

  // Update like button
  btnLike.classList.toggle("liked", likedSongs.has(song.id));

  // Update page title
  document.title = `${song.title} · ${song.artist} | Spotify`;
}

// ── Update Active States ──
function updateActiveStates() {
  document.querySelectorAll(".song-card").forEach((card, i) => {
    card.classList.toggle("playing", i === currentIndex && isPlaying);
  });
  document.querySelectorAll(".track-row").forEach((row, i) => {
    row.classList.toggle("playing", i === currentIndex);
    const numEl = row.querySelector(".track-num");
    const playIconEl = row.querySelector(".track-play-icon");
    if (i === currentIndex && isPlaying) {
      numEl.innerHTML = '<div class="eq-bars"><span></span><span></span><span></span><span></span></div>';
      numEl.style.display = "flex";
      playIconEl.style.display = "none";
    } else {
      numEl.textContent = i + 1;
      numEl.style.display = "";
      playIconEl.style.display = "";
    }
  });
  document.querySelectorAll(".library-item").forEach(item => {
    const idx = item.dataset.index;
    if (idx === "playlist") return;
    item.classList.toggle("active", parseInt(idx) === currentIndex);
  });
}

// ── Play / Pause ──
function playSong() {
  audio.play().catch(() => {});
  isPlaying = true;
  playIcon.innerHTML = '<path d="M2.7 1a.7.7 0 01.7.7v12.6a.7.7 0 01-.7.7H.7a.7.7 0 01-.7-.7V1.7A.7.7 0 01.7 1h2zm11 0a.7.7 0 01.7.7v12.6a.7.7 0 01-.7.7h-2a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h2z"/>';
  updateActiveStates();
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playIcon.innerHTML = '<path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"/>';
  updateActiveStates();
}

// ── Next / Prev ──
function nextSong() {
  if (isShuffle) {
    let newIndex;
    do { newIndex = Math.floor(Math.random() * songs.length); } while (newIndex === currentIndex && songs.length > 1);
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (isShuffle) {
    let newIndex;
    do { newIndex = Math.floor(Math.random() * songs.length); } while (newIndex === currentIndex && songs.length > 1);
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  }
  loadSong(currentIndex);
  playSong();
}

// ── Time Formatting ──
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ── Event Listeners ──
function setupEventListeners() {
  btnPlay.addEventListener("click", () => isPlaying ? pauseSong() : playSong());
  btnNext.addEventListener("click", nextSong);
  btnPrev.addEventListener("click", prevSong);

  btnShuffle.addEventListener("click", () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle("active", isShuffle);
  });

  btnRepeat.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;
    btnRepeat.classList.toggle("active", repeatMode > 0);
    if (repeatMode === 2) {
      btnRepeat.style.position = "relative";
      if (!btnRepeat.querySelector(".repeat-one")) {
        const dot = document.createElement("span");
        dot.className = "repeat-one";
        dot.style.cssText = "position:absolute;bottom:2px;right:2px;width:6px;height:6px;background:var(--accent);border-radius:50%;";
        btnRepeat.appendChild(dot);
      }
    } else {
      const dot = btnRepeat.querySelector(".repeat-one");
      if (dot) dot.remove();
    }
  });

  btnLike.addEventListener("click", () => {
    const song = songs[currentIndex];
    if (likedSongs.has(song.id)) {
      likedSongs.delete(song.id);
    } else {
      likedSongs.add(song.id);
    }
    btnLike.classList.toggle("liked", likedSongs.has(song.id));
    renderLibrary();
  });

  // Progress bar
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = pct + "%";
      timeCurrent.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    if (repeatMode === 2) {
      audio.currentTime = 0;
      playSong();
    } else if (repeatMode === 1 || currentIndex < songs.length - 1) {
      nextSong();
    } else {
      pauseSong();
    }
  });

  // Click on progress bar
  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // Drag progress
  let draggingProgress = false;
  progressBar.addEventListener("mousedown", (e) => {
    draggingProgress = true;
    const rect = progressBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });
  document.addEventListener("mousemove", (e) => {
    if (!draggingProgress) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  });
  document.addEventListener("mouseup", () => { draggingProgress = false; });

  // Volume bar
  volumeBar.addEventListener("click", (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = pct;
    volumeFill.style.width = (pct * 100) + "%";
  });

  let draggingVolume = false;
  volumeBar.addEventListener("mousedown", (e) => {
    draggingVolume = true;
    const rect = volumeBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = pct;
    volumeFill.style.width = (pct * 100) + "%";
  });
  document.addEventListener("mousemove", (e) => {
    if (!draggingVolume) return;
    const rect = volumeBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = pct;
    volumeFill.style.width = (pct * 100) + "%";
  });
  document.addEventListener("mouseup", () => { draggingVolume = false; });

  // Volume button mute toggle
  const btnVolume = document.getElementById("btn-volume");
  let prevVolume = 0.7;
  btnVolume.addEventListener("click", () => {
    if (audio.volume > 0) {
      prevVolume = audio.volume;
      audio.volume = 0;
      volumeFill.style.width = "0%";
    } else {
      audio.volume = prevVolume;
      volumeFill.style.width = (prevVolume * 100) + "%";
    }
  });

  // Topbar scroll effect
  mainContent.addEventListener("scroll", () => {
    topbar.classList.toggle("scrolled", mainContent.scrollTop > 64);
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    switch (e.code) {
      case "Space":
        e.preventDefault();
        isPlaying ? pauseSong() : playSong();
        break;
      case "ArrowRight":
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        break;
      case "ArrowLeft":
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        break;
    }
  });

  // Library chips
  document.querySelectorAll(".library-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".library-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });
}

// ── Start ──
document.addEventListener("DOMContentLoaded", init);
