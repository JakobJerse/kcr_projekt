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
    if (username && document.getElementById('username')) {
        document.getElementById('username').textContent = username;
    }
};

var isModalOpen = false;

function openPreview(channelName, imageUrl, buttonText = 'Glej v živo', flag = false, genre = '', streamingPlatform = '', info = '', cast = '') {
    
    isModalOpen = true;
    modalItems = [
        document.getElementById('playButton'), 
        document.getElementById('startOverButton'), 
        document.getElementById('closeButton')];
    focusIndex = focusables.indexOf(modalItems[0]);


    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const modalImage = document.getElementById('previewImage');
    const playButton = document.getElementById('playButton');
    const startOverButton = document.getElementById('startOverButton');
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
    isModalOpen = false;
}

function playChannel(channelName) {
    window.location.href = `/player?channel=${encodeURIComponent(channelName)}`;
}



const socket = io();
var focusables = [];
var sidebarItems = [];
var modalItems = [];

document.addEventListener("DOMContentLoaded", () => {
    let focusIndex = 0;
    const sidebar = document.querySelector(".sidebar");
    sidebarItems = [document.getElementById('home_button'),
        document.getElementById('search_button'),
        document.getElementById('movies_button'),
        document.getElementById('shows_button'),
        document.getElementById('favourites_button'),
        document.getElementById('hbo_button'),
        document.getElementById('netflix_button'),
        document.getElementById('disney_button')]
    const profileImage = document.getElementById('profileImage');

    const rowSelectors = [".row1", ".row2", ".row3", ".row4"];
    let rows = rowSelectors.map(selector => document.querySelector(selector));
    rows = rows.filter(row => row !== null);
    const allCards = rows.flatMap(row => Array.from(row.querySelectorAll(".card")));

    focusables = Array.from(sidebarItems).concat([profileImage]).concat(allCards);
    const active = document.querySelector(".active");
    focusIndex = focusables.indexOf(active)

    updateFocus();

    function updateFocus() {
        console.log(modalItems)
        focusables = !isModalOpen ? Array.from(sidebarItems).concat([profileImage]).concat(allCards) : modalItems;

        console.log(focusables)
        console.log(focusIndex)
        focusables.forEach((item, index) => {
            item.classList.toggle("focused", index === focusIndex);
        });

        if (focusables[focusIndex] === profileImage) {
            profileImage.classList.add("focused");
        } else {
            profileImage.classList.remove("focused");
        }

        const focusedElement = focusables[focusIndex];
        focusedElement.focus();

        if (focusIndex < sidebarItems.length) {
            const sidebarRect = sidebar.getBoundingClientRect();
            const itemRect = focusedElement.getBoundingClientRect();
            if (itemRect.top < sidebarRect.top) {
                sidebar.scrollTop -= sidebarRect.top - itemRect.top;
            } else if (itemRect.bottom > sidebarRect.bottom) {
                sidebar.scrollTop += itemRect.bottom - sidebarRect.bottom;
            }
        }
    }

    function moveFocus(direction) {
        if (focusIndex < sidebarItems.length + 1) {
            if (direction === "down") {
                focusIndex = Math.min(focusIndex + 1, sidebarItems.length);
            } else if (direction === "up") {
                focusIndex = Math.max(0, focusIndex - 1);
            } else if (direction === "right") {
                if (allCards.length > 0) {
                    focusIndex = sidebarItems.length + 1;
                }
            }
        } else {
            const currentCard = focusables[focusIndex];
            const currentRowIndex = rows.findIndex(row => row.contains(currentCard));
            const currentRow = rows[currentRowIndex];
            const cardsInRow = Array.from(currentRow.querySelectorAll(".card"));
            const currentCardIndex = cardsInRow.indexOf(currentCard);

            if (direction === "left") {
                if (currentCardIndex === 0) {
                    focusIndex = 0;
                } else {
                    if (currentCardIndex > 0) {
                        focusIndex = focusables.indexOf(cardsInRow[currentCardIndex - 1]);
                    } else if (currentRowIndex > 0) {
                        const prevRowCards = rows[currentRowIndex - 1].querySelectorAll(".card");
                        if (prevRowCards.length) {
                            focusIndex = focusables.indexOf(prevRowCards[prevRowCards.length - 1]);
                        }
                    }
                }
            } else if (direction === "right") {
                if (currentCardIndex < cardsInRow.length - 1) {
                    focusIndex = focusables.indexOf(cardsInRow[currentCardIndex + 1]);
                }
            } else if (direction === "up") {
                if (currentRowIndex > 0) {
                    const prevRowCards = rows[currentRowIndex - 1].querySelectorAll(".card");
                    if (prevRowCards.length) {
                        focusIndex = focusables.indexOf(prevRowCards[0]);
                    }
                }
            } else if (direction === "down") {
                if (currentRowIndex < rows.length - 1) {
                    const nextRowCards = rows[currentRowIndex + 1].querySelectorAll(".card");
                    if (nextRowCards.length) {
                        focusIndex = focusables.indexOf(nextRowCards[0]);
                    }
                }
            }
        }

        updateFocus();
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                moveFocus("up");
                break;
            case "ArrowDown":
                moveFocus("down");
                break;
            case "ArrowLeft":
                moveFocus("left");
                break;
            case "ArrowRight":
                moveFocus("right");
                break;
        }
    });

    socket.on('command', (data) => {
        const mouse = data.mouse;
        
        if (mouse === 'up')
            return;
        
        const action = data.action;

        if (action === 'up' || action === 'down' || action === 'left' || action === 'right') {
            moveFocus(action);
        } else if (action === 'ok') {
            const focusedElement = focusables[focusIndex];
            if (focusedElement) {
                focusedElement.click();
            }
        } else if (action === 'play') {
            alert("Got you SON of a GUN!");
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        } else if (action === 'search') {
            window.location.href = "/search"
        }

    });

    updateFocus();
});
