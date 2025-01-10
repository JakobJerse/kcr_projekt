const socket = io();

let playing = false;
let width = 0;
let interval;
let leftIndicator = null;
let rightIndicator = null;
let skipInterval;
let skipActive = false;
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
const volumeDownBtn = document.getElementById('volume-down');
const volumeUpBtn = document.getElementById('volume-up');
const volumeBar = document.getElementById('volume-bar');
const volumeProgress = document.getElementById('volume-progress');

let controlsVisible = true;
let hideControlsTimeout;
let sidebarVisible = false;
let hideSidebarTimeout;
let focusControlIndex = 0;

let holdTimeout;
let isHolding = false;
let clickTimeout;
let clickCount = 0;

const cooldown = 5000;

const maxTime = 5 * 60; 
const totalSeconds = 15 * 60; // 15 minutes in seconds

let volume = 50;
let muteVolume = -1;

function animateButton(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200);
}

function updateVolumeBar() {
    volumeProgress.style.width = `${volume}%`;
}

function volumeDown() {
    if (volume > 0) {
        volume -= 10;
        updateVolumeBar();
        animateButton(volumeDownBtn);
        muteVolume = -1;
    }
}

function volumeUp() {
    if (volume < 100) {
        volume += 10;
        updateVolumeBar();
        animateButton(volumeUpBtn);
        muteVolume = -1;
    }
}

function toggleMute() {
    if (muteVolume === -1) {
        muteVolume = volume;
        volume = 0;
    } else {
        volume = muteVolume;
        muteVolume = -1;
    }
    updateVolumeBar();
}

volumeDownBtn.addEventListener('click', volumeDown);
volumeUpBtn.addEventListener('click', volumeUp);

updateVolumeBar();

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        animateButton(button);
    });
});

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
            step = 1 / totalSeconds * 10; // update every 0.1 seconds to look smoother
            width += step;
            updateProgress(width);
        }
    }, 100);
}

function stopProgress() {
    clearInterval(interval);
}

function skipForward(speed) {
    // speed = seconds per second
    skipActive = true;
    timeDisplay.style.opacity = 1;
    skipInterval = setInterval(() => {
        if (width >= 100) {
            skipActive = false;
            clearInterval(skipInterval);
            timeDisplay.style.opacity = 0;
        } else {
            step = speed / totalSeconds * 10;
            width += step;
            updateProgress(width);
            updateTimeDisplay(width);
        }
    }, 100);
}

function skipBackward(speed) {
    skipActive = true;
    timeDisplay.style.opacity = 1;
    skipInterval = setInterval(() => {
        if (width <= 0) {
            skipActive = false;
            clearInterval(skipInterval);
            timeDisplay.style.opacity = 0;
        } else {
            step = speed / totalSeconds * 10;
            width -= step;
            updateProgress(width);
            updateTimeDisplay(width);
        }
    }, 100);
}

function stopSkip() {
    clearInterval(skipInterval);
    leftIndicator = null;
    rightIndicator = null;
    updateProgress(width);
    timeDisplay.style.opacity = 0;
    skipActive = false;
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

rewindBtn.addEventListener('mousedown', () => {
    remoteCommand('rewind', 'down');
});

rewindBtn.addEventListener('mouseup', () => {
    remoteCommand('rewind', 'up');
});

forwardBtn.addEventListener('mousedown', () => {
   remoteCommand('forward', 'down');
});

forwardBtn.addEventListener('mouseup', () => {
    remoteCommand('forward', 'up');
 });

playPauseBtn.addEventListener('mousedown', togglePlayPause);

volumeUpBtn.addEventListener('click', volumeUp);
volumeDownBtn.addEventListener('click', volumeDown);

function showControls(resetTimer = true) {
    controls.classList.remove('hidden');
    resetHideControlsTimeout(resetTimer);
    controlsVisible = true;
}

function hideControls() {
    controls.classList.add('hidden');
    clearTimeout(hideControlsTimeout);
    controlsVisible = false;
    focusControlIndex = 0;
}

document.addEventListener('mousemove', () => {
    showControls();
    controlsVisible = true;
});

function resetHideControlsTimeout(resetTimer = true) {
    clearTimeout(hideControlsTimeout);
    if (!resetTimer) return;

    hideControlsTimeout = setTimeout(() => {
        hideControls();
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

function openSidebar() {
    sidebar.classList.add('visible');
    sidebarVisible = true;
    resetHideSidebarTimeout();
}

function closeSidebar() {
    sidebar.classList.remove('visible');
    sidebarVisible = false;
    clearTimeout(hideSidebarTimeout);
}

function resetHideSidebarTimeout() {
    clearTimeout(hideSidebarTimeout);
    hideSidebarTimeout = setTimeout(() => {
        sidebar.classList.remove('visible');
        sidebarVisible = false;
    }, cooldown);
}

function updateTimeDisplay(value) {
    if (value < 0) {
        value = 0;
    }
    const percentage = value / 100;
    const currentTime = totalSeconds * percentage;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    if (leftIndicator !== null) {
        timeDisplay.textContent = `${leftIndicator} ${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (rightIndicator !== null) {
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} ${rightIndicator}`;
    } else {
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    timeDisplay.style.left = `${value}%`;
}

function updateProgressText(value) {
    const currentTime = totalSeconds * (value / 100);
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    progressText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / ${(totalSeconds / 60)}:00`;
}

progressBar.addEventListener('mousemove', function(e) {
    if (skipActive) return;
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

const channels = ['Slovenija 1', 'Slovenija 2', 'Slovenija 3', 'POP TV', 'Kanal A', 'Planet TV', 'HBO'];
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

function changeChannel(action) {
    openSidebar();
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('visible') && channelItems.length > 0) {
        if (action === 'up') {
            selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : channelItems.length - 1;
            updateSelection();
        } else if (action === 'down') {
            selectedIndex = (selectedIndex < channelItems.length - 1) ? selectedIndex + 1 : 0;
            updateSelection();
        }
    }
}

// -------------------------
// --- Remote for Player ---
// -------------------------

const sidebarItems = document.querySelectorAll(".sidebar .channel-item");
const controlss = document.querySelectorAll(".control-buttons button");
const controlArray = Array.from(controlss);

function remoteAction(action, clicks, holding) {
    if ((action === "up" || action === "down") && !controlsVisible) {
        openSidebar();
    }
    showControls(!holding);
    switch (action) {
        case "up":
            if (sidebarVisible) {
                changeChannel("up");
            } else {
                openSidebar();
            } 
            break;
        case "down":
            if (sidebarVisible) {
                changeChannel("down");
            } else {
                openSidebar();
            } 
            break;
        case "left":
            if (focusControlIndex === 0) {
                openSidebar();
            } else {
                focusControlIndex -= 1;
            }
            break;
        case "right":
            if (sidebarVisible) {
                focusControlIndex = 0;
                closeSidebar();
            } else {
                focusControlIndex += 1;
                if (focusControlIndex >= controlArray.length) {
                    focusControlIndex = 0;
                }
            }
            break;
        case "release":
            stopSkip();
            break;
        case "forward":
            if (holding) {
                let speed = 1;
                if (clicks === 1) {
                    speed = 4;
                    rightIndicator = '>';
                } else if (clicks === 2) {
                    speed = 8;
                    rightIndicator = '>>'
                }
                else if (clicks === 3) {
                    speed = 16;
                    rightIndicator = '>>>';
                }
                skipForward(speed);
            } else {
                let percentage = width / 100;
                let currentTime = totalSeconds * percentage;
                let timeStep = 0;
                if (clicks === 1) {
                    timeStep = 15;
                }
                if (clicks === 2) {
                    timeStep = 60;
                }
                if (clicks === 3) {
                    timeStep = 300;
                }
                let newTime = Math.min(totalSeconds, currentTime + timeStep);
                width = (newTime / totalSeconds) * 100;
                updateProgress(width);
                animateButton(forwardBtn);
            }
            break;
        case "rewind":
            if (holding) {
                let speed = 1;
                if (clicks === 1) {
                    speed = 4;
                    leftIndicator = '<';
                } else if (clicks === 2) {
                    speed = 8;
                    leftIndicator = '<<';
                }
                else if (clicks === 3) {
                    speed = 16;
                    leftIndicator = '<<<';
                }
                skipBackward(speed);
            } else {
                let percentage = width / 100;
                let currentTime = totalSeconds * percentage;
                let timeStep = 0;
                if (clicks === 1) {
                    timeStep = 15;
                }
                if (clicks === 2) {
                    timeStep = 60;
                }
                if (clicks === 3) {
                    timeStep = 300;
                }
                let newTime = Math.max(0, currentTime - timeStep);
                width = (newTime / totalSeconds) * 100;
                updateProgress(width);
                animateButton(rewindBtn);
            }
            break;
        case "play":
            togglePlayPause();
            animateButton(playPauseBtn);
            break;
        case "ok":
            if (sidebarVisible) {
                closeSidebar();
            } else if (controlsVisible) {
                const focusedElement = controlArray[focusControlIndex];
                if (focusedElement) {
                    const mousedownEvent = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    focusedElement.dispatchEvent(mousedownEvent);
                    const mouseupEvent = new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    focusedElement.dispatchEvent(mouseupEvent);
                }
            } else {
                showControls();
            }
            break;    
        case "home":
            document.getElementById("home").click();
            break;
        case "back":
            document.getElementById("home").click();
            break;
        case "vol_down":
            for (let i = 0; i < clicks; i++) {
                volumeDown();
            }
            break;
        case "vol_up":
            for (let i = 0; i < clicks; i++) {
                volumeUp();
            }
            break;
        case "mute":
            toggleMute();
            break;
    }

    updateFocus();
}

function updateFocus() {
    if (sidebarVisible) {
        controlArray.forEach((control, index) => {
            control.classList.remove("focused");
        });
    } else {
        controlArray.forEach((item, index) => {
            item.classList.toggle("focused", index === focusControlIndex);
        });
    }
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            remoteAction("up", 1, false);
            break;
        case "ArrowDown":
            remoteAction("down", 1, false);
            break;
        case "ArrowLeft":
            remoteAction("left", 1, false);
            break;
        case "ArrowRight":
            remoteAction("right", 1, false);
            break;
        case "Enter":
            remoteAction("ok", 1, false);
            break;
    }
});

function remoteCommand(action, mouse) {
    if (mouse === 'up') {
        clearTimeout(holdTimeout);
        if (isHolding) {
            remoteAction('release', clickCount, isHolding);
            isHolding = false;
            return;
        }
        clickCount++;
        if (clickCount === 1) {
            clickTimeout = setTimeout(() => {
                if (clickCount === 1) {
                    remoteAction(action, 1, isHolding);
                    clearTimeout(holdTimeout);
                }
                clickCount = 0;
            }, 200);
        } else if (clickCount === 2) {
            clickTimeout = setTimeout(() => {
                if (clickCount === 2) {
                    remoteAction(action, 2, isHolding);
                    clearTimeout(holdTimeout);
                }
                clickCount = 0;
            }, 200);
        } else if (clickCount === 3) {
            remoteAction(action, 3, isHolding);
            clearTimeout(holdTimeout);
            clickCount = 0;
        }
    }
    else if (mouse === 'down') {
        clearTimeout(clickTimeout);
        holdTimeout = setTimeout(() => {
            let innerClickCount = clickCount + 1;
            isHolding = true;
            remoteAction(action, innerClickCount, isHolding);
            clickCount = 0;
        }, 250);
        return;
    }
}

socket.on('command', (data) => {
    remoteCommand(data.action, data.mouse);
});

updateFocus();