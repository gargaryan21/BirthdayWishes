const imageFiles = [
  "PICTURE1.jpg",
  "PICTURE2.jpg",
  "PICTURE3.jpg",
  "PICTURE4.jpg",
  "PICTURE5.jpg",
  "PICTURE6.jpg",
  "PICTURE7.jpg",
  "PICTURE8.jpg",
  "PICTURE9.jpg",
  "PICTURE10.jpg"
];

const memoryMessages = [
  "Dekhlena Tumara Kahi Parse na girjay. ♥",
  "Mat Dekho Udar.Hero Idhar hai. 😌",
  "Good times + crazy people = perfect memories 😂",
  "Yes I Know duppate ka shi size haI ♥",
  "I Know you are practicing PT Excercise But Anyway Looking Adorable. ✨",
  "A smile worth saving forever",
  "Main character energy, birthday edition",
  "The kind of memory that warms the whole day",
  "Cute, chaotic, and completely unforgettable",
  "Another reason this day feels special",
  "This picture has happiness written all over it",
  "A little frame full of love",
  "Nancy, keep shining exactly like this ✨"
];

const stages = [...document.querySelectorAll(".stage")];
const confettiLayer = document.querySelector("#confettiLayer");
const balloonLayer = document.querySelector("#balloonLayer");
const sparkleLayer = document.querySelector("#sparkleLayer");
const musicToggle = document.querySelector("#musicToggle");
const backgroundMusic = document.querySelector("#bgMusic");

let currentStep = 1;
let balloonTimer = null;
let audioContext = null;
let musicGain = null;
let musicInterval = null;
let musicPlaying = false;
let backgroundMusicStartSet = false;

// Start Dooron Dooron as soon as the page is opened.  Some browsers block
// audible autoplay, so the first tap/key press retries it automatically.
function startBackgroundMusic() {
  const playFromStartPoint = () => {
    if (!backgroundMusicStartSet) {
      backgroundMusic.currentTime = 15;
      backgroundMusicStartSet = true;
    }

    backgroundMusic.play().catch(() => {
      document.addEventListener("pointerdown", startBackgroundMusic, { once: true });
      document.addEventListener("keydown", startBackgroundMusic, { once: true });
    });
  };

  if (backgroundMusic.readyState >= HTMLMediaElement.HAVE_METADATA) {
    playFromStartPoint();
  } else {
    backgroundMusic.addEventListener("loadedmetadata", playFromStartPoint, { once: true });
    backgroundMusic.load();
  }
}

document.addEventListener("DOMContentLoaded", startBackgroundMusic);

document.addEventListener("click", (event) => {
  const nextButton = event.target.closest("[data-next]");
  if (!nextButton) return;
  goToStep(Number(nextButton.dataset.next));
});

document.querySelector("#lightsButton").addEventListener("click", () => {
  const lightsStage = document.querySelector(".lights-stage");
  lightsStage.classList.add("lights-on");
  burstConfetti(34);
  sparkleBurst(window.innerWidth / 2, window.innerHeight * 0.25, 36);
  document.querySelector("#lightsButton").hidden = true;
  setTimeout(() => {
    document.querySelector("#afterLightsButton").hidden = false;
  }, 850);
});

document.querySelector("#playMusicButton").addEventListener("click", async () => {
  await startMusic();
  burstConfetti(26);
  document.querySelector("#playMusicButton").hidden = true;
  document.querySelector("#afterMusicButton").hidden = false;
  musicToggle.hidden = false;
});

document.querySelector("#playBalloonsButton").addEventListener("click", () => {
  startBalloons();
  burstConfetti(46);
  document.querySelector("#playBalloonsButton").hidden = true;
  document.querySelector("#afterBalloonsButton").hidden = false;
});

document.querySelector("#revealButton").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.classList.add("is-open");
  startBalloons();
  burstConfetti(110);
  sparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 58);
  setTimeout(() => {
    button.hidden = true;
    document.querySelector("#birthdayMessage").hidden = false;
  }, 420);
});

musicToggle.addEventListener("click", async () => {
  if (musicPlaying) {
    stopMusic();
    musicToggle.classList.add("is-paused");
    return;
  }
  await startMusic();
  musicToggle.classList.remove("is-paused");
});

function goToStep(step) {
  const active = document.querySelector(".stage.is-active");
  const next = document.querySelector(`.stage[data-step="${step}"]`);
  if (!next || step === currentStep) return;

  active.classList.add("is-exiting");
  active.classList.remove("is-active");

  setTimeout(() => {
    active.classList.remove("is-exiting");
    next.classList.add("is-active");
    currentStep = step;
    if (step === 10) {
      document.body.style.overflowY = "auto";
      renderGallery();
      burstConfetti(64);
    } else {
      document.body.style.overflowY = "hidden";
    }
  }, 390);
}

function renderGallery() {
  const grid = document.querySelector("#galleryGrid");
  if (grid.childElementCount) return;

  imageFiles.forEach((file, index) => {
    const figure = document.createElement("figure");
    figure.className = "memory-card";
    figure.style.animationDelay = `${index * 55}ms`;
    figure.tabIndex = 0;

    const image = document.createElement("img");
    image.src = `../Pictures/${encodeURIComponent(file).replaceAll("%2F", "/")}`;
    image.alt = `Memory photo ${index + 1} for Gunnu`;
    image.loading = index < 4 ? "eager" : "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = memoryMessages[index % memoryMessages.length];

    figure.append(image, caption);
    figure.addEventListener("click", () => figure.classList.toggle("is-tapped"));
    grid.appendChild(figure);
  });
}

function burstConfetti(count = 40) {
  const colors = ["#ff477e", "#ffd166", "#69d6b3", "#7ac7ff", "#ff7a59", "#9b5cff"];
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--duration", `${2.2 + Math.random() * 1.8}s`);
    piece.style.setProperty("--sway", `${-90 + Math.random() * 180}px`);
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 4300);
  }
}

function startBalloons() {
  if (balloonTimer) return;
  for (let i = 0; i < 10; i += 1) {
    setTimeout(createBalloon, i * 180);
  }
  balloonTimer = setInterval(createBalloon, 820);
}

function createBalloon() {
  const colors = [
    "linear-gradient(145deg, #ff7aa8, #db2b73)",
    "linear-gradient(145deg, #76ddff, #5290ff)",
    "linear-gradient(145deg, #ffe27a, #ff9c42)",
    "linear-gradient(145deg, #8cf4c9, #23b98e)",
    "linear-gradient(145deg, #caa5ff, #7a4dff)"
  ];
  const balloon = document.createElement("span");
  const size = 44 + Math.random() * 54;
  balloon.className = "floating-balloon";
  balloon.style.left = `${Math.random() * 94}%`;
  balloon.style.setProperty("--size", `${size}px`);
  balloon.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
  balloon.style.setProperty("--speed", `${7 + Math.random() * 5}s`);
  balloon.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
  balloonLayer.appendChild(balloon);
  setTimeout(() => balloon.remove(), 12500);
}

function sparkleBurst(originX, originY, count = 24) {
  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 170;
    sparkle.className = "sparkle";
    sparkle.style.left = `${originX}px`;
    sparkle.style.top = `${originY}px`;
    sparkle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    sparkleLayer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1900);
  }
}

async function startMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    musicGain = audioContext.createGain();
    musicGain.gain.value = 0.045;
    musicGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (musicPlaying) return;
  musicPlaying = true;
  musicToggle.classList.remove("is-paused");
  playMelody();
  musicInterval = setInterval(playMelody, 4200);
}

function stopMusic() {
  musicPlaying = false;
  clearInterval(musicInterval);
}

function playMelody() {
  if (!audioContext || !musicPlaying) return;
  const now = audioContext.currentTime;
  const notes = [
    [392, 0], [392, 0.28], [440, 0.56], [392, 0.88], [523.25, 1.2], [493.88, 1.62],
    [392, 2.15], [392, 2.43], [440, 2.71], [392, 3.03], [587.33, 3.35], [523.25, 3.78]
  ];

  notes.forEach(([frequency, offset]) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.38, now + offset + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.24);
    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(now + offset);
    osc.stop(now + offset + 0.27);
  });
}

window.addEventListener("beforeunload", () => {
  clearInterval(balloonTimer);
  clearInterval(musicInterval);
});
function playMusic() {
    startBackgroundMusic();
}
function birthdaysong() {
  backgroundMusic.pause();
  const birthdaySong = document.getElementById("birthdaysong");

  const playFromFiveSeconds = () => {
    birthdaySong.currentTime = 5;
    birthdaySong.play();
  };

  // The audio duration must be available before its playback position can change.
  if (birthdaySong.readyState >= HTMLMediaElement.HAVE_METADATA) {
    playFromFiveSeconds();
  } else {
    birthdaySong.addEventListener("loadedmetadata", playFromFiveSeconds, { once: true });
    birthdaySong.load();
  }
}
