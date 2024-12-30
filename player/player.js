let playing = false;
let width = 0;
let interval;
const playPauseBtn = document.getElementById('play-pause');
const rewindBtn = document.getElementById('rewind');
const forwardBtn = document.getElementById('forward');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const progressHandle = document.getElementById('progress-handle');
const controls = document.getElementById('controls');
const player = document.getElementById('player');
const sidebar = document.getElementById('sidebar');

let controlsVisible = true;
let hideControlsTimeout;
let sidebarVisible = false;
let hideSidebarTimeout;

playPauseBtn.addEventListener('click', togglePlayPause);

function togglePlayPause() {
    playing = !playing;
    playPauseBtn.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    if (playing) {
        startProgress();
    } else {
        stopProgress();
    }
}

function startProgress() {
    width = 0; // Reset width when starting progress
    interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            playing = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            width++;
            updateProgress(width);
        }
    }, 100);
}

function stopProgress() {
    clearInterval(interval);
}

function updateProgress(value) {
    progress.style.width = value + '%';
    progressHandle.style.left = value + '%';
}

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    width = (offsetX / rect.width) * 100;
    updateProgress(width);
});

progressHandle.addEventListener('mousedown', (e) => {
    const moveHandle = (e) => {
        const rect = progressBar.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));
        width = (offsetX / rect.width) * 100;
        updateProgress(width);
    };

    document.addEventListener('mousemove', moveHandle);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveHandle);
    }, { once: true });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        width = Math.min(100, width + 5);
    } else if (e.key === 'ArrowLeft') {
        width = Math.max(0, width - 5);
    }
    updateProgress(width);
});

rewindBtn.addEventListener('click', () => {
    width = Math.max(0, width - 15);
    updateProgress(width);
});

forwardBtn.addEventListener('click', () => {
    width = Math.min(100, width + 15);
    updateProgress(width);
});

playPauseBtn.addEventListener('click', togglePlayPause);

function showControls() {
    controls.classList.remove('hidden');
    resetHideControlsTimeout();
}

function hideControls() {
    controls.classList.add('hidden');
}

function toggleControls() {
    if (controlsVisible) {
        hideControls();
        controlsVisible = false;
    } else {
        showControls();
        controlsVisible = true;
    }
}

document.addEventListener('keydown', (e) => {
    showControls();
    controlsVisible = true;
});

document.addEventListener('mousemove', () => {
    showControls();
    controlsVisible = true;
});

function resetHideControlsTimeout() {
    clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(() => {
        hideControls();
        controlsVisible = false;
    }, 3000);
}

function toggleSidebar() {
    sidebarVisible = !sidebarVisible;
    if (sidebarVisible) {
        sidebar.classList.add('visible');
        resetHideSidebarTimeout();
    } else {
        sidebar.classList.remove('visible');
        clearTimeout(hideSidebarTimeout);
    }
}

function resetHideSidebarTimeout() {
    clearTimeout(hideSidebarTimeout);
    hideSidebarTimeout = setTimeout(() => {
        sidebar.classList.remove('visible');
        sidebarVisible = false;
    }, 3000);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 's') { // Change 's' to any key you want to use to toggle the sidebar
        toggleSidebar();
    }
});
resetHideControlsTimeout();