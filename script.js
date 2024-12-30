// Function to handle user selection
function selectUser(profileImage) {
    // Store the selected user's image name in localStorage
    console.log('essa')
    localStorage.setItem('selectedUser', profileImage);

    // Redirect to the index.html (sidebar page)
    window.location.href = 'index.html';
}

// This runs when the page is loaded
window.onload = function () {
    // Retrieve the selected user image from localStorage
    const profileImage = localStorage.getItem('selectedUser');

    // Check if there's a selected user image stored
    if (profileImage) {
        // Update the profile image in the sidebar with the selected user image
        document.getElementById('profileImage').src = './assets/' + profileImage;
    }
};
