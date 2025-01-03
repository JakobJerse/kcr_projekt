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


function openPreview(channelName, imageUrl) {
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const modalImage = modal.querySelector('.preview-image img');
    const description = document.getElementById('previewDescription');
    const playButton = document.querySelector('.play-btn');

    // Update modal content dynamically
    title.textContent = `Preview for ${channelName}`;
    modalImage.src = imageUrl; // Set the image dynamically
    modalImage.alt = channelName; // Set alt text for accessibility
    description.textContent = `You're about to preview the amazing content available on ${channelName}. Stay tuned for exciting programs!`;
    playButton.onclick = () => playChannel(channelName); // Dynamically set the channel name for the play button

    modal.style.display = 'flex';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.style.display = 'none';
}

function playChannel(channelName) {
    window.location.href = `/player?channel=${encodeURIComponent(channelName)}`;
}
