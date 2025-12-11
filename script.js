// ============ CORE ELEMENTS ============
var mysong = document.getElementById("mysong");
var icon = document.getElementById("icon");
var playPauseBtn = document.getElementById("play-pause-btn");
var playIcon = document.getElementById("play-icon");
var progressBar = document.getElementById("progress-bar");
var progress = document.getElementById("progress");
var currentTimeEl = document.getElementById("current-time");
var durationEl = document.getElementById("duration");
var volumeSlider = document.getElementById("volume-slider");
var volumeIcon = document.getElementById("volume-icon");
var shuffleBtn = document.getElementById("shuffle-btn");
var repeatBtn = document.getElementById("repeat-btn");
var prevBtn = document.getElementById("prev-btn");
var nextBtn = document.getElementById("next-btn");
var songTitle = document.getElementById("song-title");
var artistName = document.getElementById("artist-name");
var albumArt = document.querySelector(".album-art");
var playlistItems = document.querySelectorAll(".playlist-item");
var equalizer = document.querySelector(".equalizer");

// ============ STATE VARIABLES ============
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongIndex = 0;
let isMuted = false;
let previousVolume = 70;

// ============ PLAYLIST DATA ============
const playlist = [
    { src: "Aaj Ki Raat.mp3", title: "Aaj Ki Raat", artist: "Unknown Artist" },
    { src: "song2.mp3", title: "Song 2", artist: "Artist 2" },
    { src: "song3.mp3", title: "Song 3", artist: "Artist 3" }
];

// ============ PLAY/PAUSE FUNCTIONALITY ============
function togglePlay() {
    if (mysong.paused) {
        mysong.play();
        isPlaying = true;
        icon.src = "pause.png";
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
        albumArt.classList.add("playing");
        if (equalizer) equalizer.classList.remove("paused");
    } else {
        mysong.pause();
        isPlaying = false;
        icon.src = "play.png";
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
        albumArt.classList.remove("playing");
        if (equalizer) equalizer.classList.add("paused");
    }
}

icon.onclick = togglePlay;
if (playPauseBtn) playPauseBtn.onclick = togglePlay;

// ============ PROGRESS BAR ============
mysong.addEventListener("timeupdate", function() {
    if (mysong.duration) {
        const progressPercent = (mysong.currentTime / mysong.duration) * 100;
        progress.style.width = progressPercent + "%";
        currentTimeEl.textContent = formatTime(mysong.currentTime);
    }
});

mysong.addEventListener("loadedmetadata", function() {
    durationEl.textContent = formatTime(mysong.duration);
});

// Click on progress bar to seek
if (progressBar) {
    progressBar.addEventListener("click", function(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const seekTime = (clickX / width) * mysong.duration;
        mysong.currentTime = seekTime;
    });
}

// ============ FORMAT TIME ============
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ============ VOLUME CONTROL ============
if (volumeSlider) {
    volumeSlider.addEventListener("input", function() {
        mysong.volume = volumeSlider.value / 100;
        updateVolumeIcon();
        previousVolume = volumeSlider.value;
    });
    
    // Set initial volume
    mysong.volume = 0.7;
}

if (volumeIcon) {
    volumeIcon.addEventListener("click", function() {
        if (isMuted) {
            mysong.volume = previousVolume / 100;
            volumeSlider.value = previousVolume;
            isMuted = false;
        } else {
            previousVolume = volumeSlider.value;
            mysong.volume = 0;
            volumeSlider.value = 0;
            isMuted = true;
        }
        updateVolumeIcon();
    });
}

function updateVolumeIcon() {
    const vol = mysong.volume;
    if (vol === 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (vol < 0.5) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
}

// ============ SHUFFLE & REPEAT ============
if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("active", isShuffle);
    });
}

if (repeatBtn) {
    repeatBtn.addEventListener("click", function() {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle("active", isRepeat);
        mysong.loop = isRepeat;
    });
}

// ============ NEXT & PREVIOUS ============
if (nextBtn) {
    nextBtn.addEventListener("click", function() {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * playlist.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
        }
        loadSong(currentSongIndex);
        if (isPlaying) mysong.play();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", function() {
        if (mysong.currentTime > 3) {
            mysong.currentTime = 0;
        } else {
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(currentSongIndex);
            if (isPlaying) mysong.play();
        }
    });
}

// ============ LOAD SONG ============
function loadSong(index) {
    const song = playlist[index];
    mysong.src = song.src;
    if (songTitle) songTitle.textContent = song.title;
    if (artistName) artistName.textContent = song.artist;
    
    // Update playlist UI
    playlistItems.forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
    
    // Reset progress
    progress.style.width = "0%";
    currentTimeEl.textContent = "0:00";
}

// ============ PLAYLIST CLICK ============
playlistItems.forEach((item, index) => {
    item.addEventListener("click", function() {
        currentSongIndex = index;
        loadSong(index);
        togglePlay();
    });
});

// ============ AUTO PLAY NEXT ============
mysong.addEventListener("ended", function() {
    if (!isRepeat) {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * playlist.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
        }
        loadSong(currentSongIndex);
        mysong.play();
    }
});

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener("keydown", function(e) {
    switch(e.code) {
        case "Space":
            e.preventDefault();
            togglePlay();
            break;
        case "ArrowRight":
            mysong.currentTime += 5;
            break;
        case "ArrowLeft":
            mysong.currentTime -= 5;
            break;
        case "ArrowUp":
            e.preventDefault();
            if (mysong.volume < 1) {
                mysong.volume = Math.min(1, mysong.volume + 0.1);
                volumeSlider.value = mysong.volume * 100;
                updateVolumeIcon();
            }
            break;
        case "ArrowDown":
            e.preventDefault();
            if (mysong.volume > 0) {
                mysong.volume = Math.max(0, mysong.volume - 0.1);
                volumeSlider.value = mysong.volume * 100;
                updateVolumeIcon();
            }
            break;
        case "KeyM":
            volumeIcon.click();
            break;
        case "KeyN":
            if (nextBtn) nextBtn.click();
            break;
        case "KeyP":
            if (prevBtn) prevBtn.click();
            break;
    }
});

// ============ VISUALIZER (Simple CSS-based) ============
const visualizer = document.getElementById("visualizer");
if (visualizer) {
    const ctx = visualizer.getContext("2d");
    let animationId;
    
    function drawVisualizer() {
        const width = visualizer.width = visualizer.offsetWidth;
        const height = visualizer.height = visualizer.offsetHeight;
        
        ctx.clearRect(0, 0, width, height);
        
        if (isPlaying) {
            const barCount = 30;
            const barWidth = width / barCount - 2;
            
            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.random() * height * 0.8 + 10;
                const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                gradient.addColorStop(0, "#667eea");
                gradient.addColorStop(1, "#764ba2");
                
                ctx.fillStyle = gradient;
                ctx.fillRect(i * (barWidth + 2), height - barHeight, barWidth, barHeight);
            }
        } else {
            const barCount = 30;
            const barWidth = width / barCount - 2;
            
            for (let i = 0; i < barCount; i++) {
                ctx.fillStyle = "rgba(102, 126, 234, 0.3)";
                ctx.fillRect(i * (barWidth + 2), height - 10, barWidth, 10);
            }
        }
        
        animationId = requestAnimationFrame(drawVisualizer);
    }
    
    drawVisualizer();
}

// ============ LIKE BUTTON (if exists) ============
const likeBtn = document.querySelector(".like-btn");
if (likeBtn) {
    likeBtn.addEventListener("click", function() {
        this.classList.toggle("liked");
        const icon = this.querySelector("i");
        if (this.classList.contains("liked")) {
            icon.className = "fas fa-heart";
        } else {
            icon.className = "far fa-heart";
        }
    });
}

// ============ SPEED CONTROL ============
const speedBtns = document.querySelectorAll(".speed-btn");
speedBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        speedBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        mysong.playbackRate = parseFloat(this.dataset.speed);
    });
});

// ============ TOUCH/MOBILE SUPPORT ============
let touchStartX = 0;
document.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener("touchend", function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > 100) {
        if (diff > 0 && prevBtn) {
            prevBtn.click();
        } else if (diff < 0 && nextBtn) {
            nextBtn.click();
        }
    }
});

console.log("🎵 Music Player Loaded! Keyboard shortcuts:");
console.log("Space: Play/Pause | ←/→: Seek | ↑/↓: Volume | M: Mute | N: Next | P: Previous");

// ============ MOBILE MENU TOGGLE ============
const menuToggle = document.getElementById("menu-toggle");
const navUl = document.querySelector(".navbar ul");

if (menuToggle && navUl) {
    menuToggle.addEventListener("click", function() {
        navUl.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (navUl.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener("click", function(e) {
        if (!menuToggle.contains(e.target) && !navUl.contains(e.target)) {
            navUl.classList.remove("active");
            const icon = menuToggle.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });
}