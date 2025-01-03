function selectUser(profileImage) {
    localStorage.setItem('selectedUser', profileImage);
    window.location.href = indexUrl;
}

window.onload = function () {
    const profileImage = localStorage.getItem('selectedUser');
    if (profileImage) {
        document.getElementById('profileImage').src = staticImagesUrl + profileImage;
    }
};


function openPreview(channelName) {
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const description = document.getElementById('previewDescription');
    const playButton = document.querySelector('.play-btn');

    title.textContent = `Preview for ${channelName}`;
    description.textContent = `You're about to preview the amazing content available on ${channelName}. Stay tuned for exciting programs!`;
    playButton.onclick = () => playChannel(channelName); // Dynamically set channel
    modal.style.display = 'flex';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.style.display = 'none';
}

function playChannel(channelName) {
    window.location.href = `/player?channel=${encodeURIComponent(channelName)}`;
}

