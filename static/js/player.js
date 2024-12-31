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
const timeDisplay = document.getElementById('time-display');
const progressText = document.getElementById('progress-text');

let controlsVisible = true;
let hideControlsTimeout;
let sidebarVisible = false;
let hideSidebarTimeout;

const cooldown = 50000;

const maxTime = 5 * 60; 
const totalSeconds = 5 * 60; // 5 minutes in seconds

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
    updateTimeDisplay(value);
    updateProgressText(value);
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
    }, cooldown);
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
    }, cooldown);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 's') { // Change 's' to any key you want to use to toggle the sidebar
        toggleSidebar();
    }
});

function updateTimeDisplay(value) {
    if (value < 0) {
        value = 0;
    }
    const rect = progressBar.getBoundingClientRect();
    const handleRect = progressHandle.getBoundingClientRect();
    const percentage = value / 100;
    const currentTime = totalSeconds * percentage;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    timeDisplay.style.left = `${value}%`;
}

function updateProgressText(value) {
    const currentTime = totalSeconds * (value / 100);
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    progressText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / 5:00`;
}

progressBar.addEventListener('mousemove', function(e) {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    let width = (offsetX / rect.width) * 100;
    updateTimeDisplay(width);
    timeDisplay.style.opacity = 1;
});

progressBar.addEventListener('mouseleave', function() {
    timeDisplay.style.opacity = 0;
});

let isDragging = false;

progressHandle.addEventListener('mousedown', function() {
    isDragging = true;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onStopDrag);
});

function onDrag(e) {
    if (!isDragging) return;
    const rect = progressBar.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width)); // Ensure within bounds
    progressHandle.style.left = `${offsetX}px`;
    timeDisplay.style.left = `${offsetX}px`;
}

function onStopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onStopDrag);
}

// Initial call to set the time display
updateTimeDisplay(0);
updateProgressText(0);

resetHideControlsTimeout();

document.addEventListener('DOMContentLoaded', function() {
    const channels = ['Channel 1', 'Channel 2', 'Channel 3'];
    const channelListContainer = document.querySelector('.channel-list');

    // Generate the HTML for the channel items
    channels.forEach((channel) => {
        const channelItem = document.createElement('div');
        channelItem.classList.add('channel-item');
        channelItem.textContent = channel;
        channelListContainer.appendChild(channelItem);
    });

    const channelItems = document.querySelectorAll('.channel-item');
    let selectedIndex = 0;

    function updateSelection() {
        channelItems.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    }

    updateSelection();

    document.addEventListener('keydown', function(e) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('visible') && channelItems.length > 0) {
            if (e.key === 'ArrowUp') {
                selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : channelItems.length - 1;
                updateSelection();
            } else if (e.key === 'ArrowDown') {
                selectedIndex = (selectedIndex < channelItems.length - 1) ? selectedIndex + 1 : 0;
                updateSelection();
            }
        }
    });
});