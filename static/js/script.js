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


function openPreview(channelName, desc, imageUrl) {
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const modalImage = modal.querySelector('.preview-image img');
    const description = document.getElementById('previewDescription');
    const playButton = document.querySelector('.play-btn');

    // Update modal content dynamically
    title.textContent = `${channelName}`;
    modalImage.src = imageUrl;
    modalImage.alt = channelName;
    description.textContent = desc;
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
