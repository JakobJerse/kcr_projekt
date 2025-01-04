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


function openPreview(channelName, desc, imageUrl, buttonText = 'Glej v živo', flag = false) {
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const modalImage = modal.querySelector('.preview-image img');
    const description = document.getElementById('previewDescription');
    const playButton = document.querySelector('.play-btn');
    const startOverButton = document.querySelector('.start-over-btn');

    // Update modal content dynamically
    title.textContent = `${channelName}`;
    modalImage.src = imageUrl;
    modalImage.alt = channelName;
    description.textContent = desc;
    playButton.innerHTML = `<i class="fa-solid fa-tv"></i> ${buttonText}`;
    if (flag) {
        startOverButton.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> Glej od začetka`;
    }
    else {
        startOverButton.classList.add('hidden');
        startOverButton.classList.add('primary-button');
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