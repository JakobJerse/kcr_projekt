function selectUser(profileImage, username) {
    localStorage.setItem('selectedUser', profileImage);
    localStorage.setItem('selectedUserName', username);
    window.location.href = indexUrl;
}

window.onload = function () {
    const profileImage = localStorage.getItem('selectedUser');
    const username = localStorage.getItem('selectedUserName');
    if (profileImage) {
        document.getElementById('profileImage').src = staticImagesUrl + profileImage;
    }
    if (username) {
        document.getElementById('username').textContent = username;
    }
};


function openPreview(channelName, imageUrl, buttonText = 'Glej v živo', flag = false, genre = '', streamingPlatform = '', info = '', cast = '') {
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const modalImage = modal.querySelector('.preview-image img');
    const playButton = document.querySelector('.play-btn');
    const startOverButton = document.querySelector('.start-over-btn');
    const genreSpan = document.getElementById('previewGenre');
    const infoSpan = document.getElementById('previewInfo');
    const streamingPlatformSpan = document.getElementById('previewStreamingPlatform');
    const castSpan = document.getElementById('previewCast');

    // Update modal content dynamically
    title.textContent = channelName;
    modalImage.src = imageUrl;
    modalImage.alt = channelName;
    genreSpan.textContent = genre;
    infoSpan.textContent = info;
    streamingPlatformSpan.textContent = streamingPlatform;
    castSpan.textContent = cast;

    playButton.innerHTML = `<i class="fa-solid fa-tv"></i> ${buttonText}`;
    if (flag) {
        startOverButton.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> Glej od začetka`;
    } else {
        startOverButton.classList.add('hidden');
    }

    startOverButton.onclick = () => playChannel(channelName);
    playButton.onclick = () => playChannel(channelName);

    modal.style.display = 'flex';
}



function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.style.display = 'none';
}

function playChannel(channelName) {
    window.location.href = `/player?channel=${encodeURIComponent(channelName)}`;
}