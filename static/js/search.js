search_input = document.getElementById('searchInput');
keyboard = document.getElementById('keyboard');
movieContainer = document.getElementById('movieContainer'); // The container where the movies will be displayed





// Function to show the keyboard
// input.addEventListener('focus', function() {
//     keyboard.style.visibility = 'visible';
// });


// Function to add text to the search input field
function addToSearch(character) {
    search_input.value += character;
    searchMovies(search_input.value); // Trigger search whenever the user types
}

// Function to remove the last character (Backspace)
function backspace() {
    search_input.value = search_input.value.slice(0, -1);
    searchMovies(search_input.value); // Trigger search when backspace is pressed
}

// Function to hide the keyboard after pressing "Enter"
function enter() {
    keyboard.style.visibility = "hidden";

    if (num_of_reccomendations > 0) {
        current_tab = "recommendations";
        searchInput.classList.remove('focused');
        document.getElementById("reco-0-0").classList.add("focused");
        current_row = 0;
        current_column = 0;
    } else {
        current_tab = "searchbar";
        searchInput.classList.add('focused');
    }


}

// Movie database
movieDatabase = [
        { title: "Babica Gre Na Jug", description: "Srčna komedija o stariši ženski, ki se poda na pustolovščino proti jugu.", genre: "Komedija", year: 2021, image: "babicagrenajug.jpg", channel: "POP TV"},
        { title: "Kung Fury", description: "Akcijski film, ki je navdihnjen z retro slogom, v katerem policist dobi borilne sposobnosti in se bori proti nacistom in dinozavrom.", genre: "Akcija", year: 2015, image: "kungfury.jpg", channel: "Kanal A"},
        { title: "Pujsa Tatjana 1. Del", description: "Družina Prašič na podstrešju odkrije škatlo glasbenih inštrumentov.", genre: "Drama", year: 2010, image: "pujsatatjana.jpg", channel: "TV Slovenija 1"},
        { title: "Pujsa Tatjana 2. Del", description: "Družina Prašič se odpravi na Morje.", genre: "Drama", year: 2012, image: "pujsatatjana.jpg",  channel: "TV Slovenija 1" },
        { title: "Gladiator", description: "Rimski general išče maščevanje proti pokvarjenemu cesarju, ki je ubil njegovo družino.", genre: "Akcija", year: 2000, image: "gladiator.webp",  channel: "AMC" },
        { title: "Squid Games", description: "Spletni reality show, kjer se tekmovalci borijo za ogromno denarno nagrado.", genre: "Drama", year: 2021, image: "squidgame.jpg", channel: "Netflix"},
        { title: "How I Met Your Mother", description: "Komedija, ki spremlja skupino prijateljev, ki skupaj doživljajo življenjske dogodivščine.", genre: "Komedija", year: 2005, image: "tvojamami.jpg", channel: "CBS"},
        { title: "Snowman", description: "Napet triler o iskanju izginulega človeka, ki pušča skrivnostne sledi v snegu.", genre: "Triler", year: 2017, image: "snowman.webp", channel: "HBO"},
        { title: "Skrito v raju", description: "Slovenska oddaja, kjer tekmovalci rešujejo skrivnosti na eksotičnih otokih.", genre: "Resničnostna oddaja", year: 2021, image: "skrito-v-raju.jpg", channel: "POP TV"},
        { title: "Skoki", description: "Livestreaming smučarskih skokov z najboljšimi svetovnimi skakalci.", genre: "Šport", year: 2022, image: "skoki.jpg", channel: "EuroSport"},
        { title: "Home Alone", description: "Film o dečku, ki mora zaščititi svojo hišo pred vlomilci, medtem ko so njegovi starši na dopustu.", genre: "Komedija", year: 1990, image: "sam-doma.jpeg", channel: "Fox"},
        { title: "Nogomet", description: "Prenos nogometnega tekmovanja z najboljšimi ekipami.", genre: "Šport", year: 2022, image: "progress3.jpeg", channel: "ESPN"},
        { title: "Dnevnik", description: "Slovenski dnevnik, ki prinaša najnovejše novice z vsega sveta.", genre: "Novice", year: 2022, image: "progress2.jpg", channel: "RTV Slovenija"},
        { title: "Prison Break", description: "Skupina zapornikov načrtuje velik pobeg iz najstrožje varovane zaporniške ustanove.", genre: "Drama", year: 2005, image: "prison-break.jpg", channel: "Fox"},
        { title: "Naša Mala Klinika", description: "Slovenska humoristična serija, ki spremlja življenje v lokalni kliniki.", genre: "Komedija", year: 2004, image: "nmk.jpg", channel: "TV Slovenija 1"},
        { title: "Moto GP", description: "Prenos svetovnega prvenstva v motociklizmu.", genre: "Šport", year: 2022, image: "motogp.jpg", channel: "SportKlub"},
        { title: "Moj Dragi Zmore", description: "Slovenska komedija, ki spremlja zabavne prigode v zakonu.", genre: "Komedija", year: 2022, image: "mojdragi.jpg", channel: "POP TV"},
        { title: "Modern Family", description: "Sodobna komedija, ki spremlja življenje dveh družin.", genre: "Komedija", year: 2009, image: "modernfamily.webp", channel: "ABC"},
        { title: "James Bond", description: "Akcijski film o tajnem agentu 007, ki rešuje svet pred nevarnimi organizacijami.", genre: "Akcija", year: 2021, image: "jamesbond.jpg", channel: "Sony"},
        { title: "Friends", description: "Komedija, ki spremlja življenje skupine prijateljev v New Yorku.", genre: "Komedija", year: 1994, image: "friends.jpg", channel: "NBC"},
        { title: "Documentary About Lions", description: "Dokumentarec o življenju levov v divjini.", genre: "Dokumentarec", year: 2022, image: "channel3.jpg", channel: "National Geographic"},
        { title: "24 Ur Novice Dneva", description: "Slovenske novice, ki prinašajo dnevne dogodke z vsega sveta.", genre: "Novice", year: 2022, image: "channel2.webp", channel: "RTV Slovenija"},
        { title: "Breaking Bad", description: "Zgodba o učitelju kemije, ki se spusti v svet droge.", genre: "Drama", year: 2008, image: "breaking-bad.jpg", channel: "AMC"},
        { title: "Blacklist", description: "Napeta serija o tajnem agentu, ki pomaga FBI-ju pri iskanju nevarnih zločincev.", genre: "Triler", year: 2013, image: "blacklist.jpg", channel: "NBC"},
        { title: "Big Bang Theory", description: "Komedija o skupini briljantnih, a socialno nenavadnih znanstvenikov.", genre: "Komedija", year: 2007, image: "bigbang.jpg", channel: "CBS"},
        { title: "Lilly Phillips: Všeč mi je bilo", description: "Dokumentarni film o zvezdnici vsebin za odrasle - Lilly Phillips, 75 minut.", genre: "Dokumentarni", year: 2007, image: "progress4.jpeg", channel: "TLC"},    
    ];

// Function to search and display the movies
function searchMovies(query) {
    // Filter movies based on the search query (title or description)
    filteredMovies = movieDatabase.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase())
    );

    // Slice to display only the first 10 recommendations (first 5 in the first row, next 5 in the second row)
    top10Movies = filteredMovies.slice(0, 10);
    
    // Clear the previous search results
    movieContainer.innerHTML = "<table class='recommendations'><tr>"; // Start with an empty container and the first row
    id_i = -1;
    // Iterate through the filtered top 5 movies and add them to the first row
    top10Movies.slice(0, 5).forEach(movie => {
        // Create a new table cell (td) for each movie
        id_i += 1;
        movieCell = document.createElement('td');
        movieCell.style.textAlign = "center"; // Center the image within the cell
        movieCell.style.padding = "10px"; // Optional padding for spacing between images

        // Insert the image inside the cell with an overlay and title at the bottom
        movieCell.innerHTML = `
    <div id="reco-0-${id_i}" onclick="openPreview('${movie.title}', '../static/images/${movie.image}', 'Predvajaj', false, '${movie.description}', '${movie.channel}', 'Film, 210 min', 'Actor details here')" style="width: 200px; height: 150px; position: relative; border-radius: 10px; overflow: hidden;">
        <!-- Dark overlay -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 1;"></div>

        <!-- Image -->
        <img src="../static/images/${movie.image}" alt="${movie.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">

        <!-- Title at the bottom of the image, aligned left -->
        <div style="position: absolute; bottom: 20px; left: 10px; z-index: 2; color: white; font-size: 1.2em; font-weight: bold;">
            ${movie.title}
        </div>

        <!-- Channel name at the bottom (smaller font size), aligned left -->
        <div style="position: absolute; bottom: 5px; left: 10px; z-index: 2; color: white; font-size: 0.8em;">
            ${movie.channel}
        </div>
    </div>
`;

        
        // Append the movie cell (td) to the first row (tr)
        movieContainer.querySelector('tr').appendChild(movieCell);
    });

    // Close the first row and start the second row
    movieContainer.innerHTML += "</tr><tr>";
    id_i = -1;
    // Iterate through the next 5 movies and add them to the second row
    top10Movies.slice(5, 10).forEach(movie => {
        // Create a new table cell (td) for each movie
        id_i += 1;
        movieCell = document.createElement('td');
        movieCell.style.textAlign = "center"; // Center the image within the cell
        movieCell.style.padding = "10px"; // Optional padding for spacing between images

        // Insert the image inside the cell with an overlay and title at the bottom
        movieCell.innerHTML = `
    <div id="reco-1-${id_i}" onclick="openPreview('${movie.title}', '../static/images/${movie.image}', 'Predvajaj', false, '${movie.description}', '${movie.channel}', 'Film, 210 min', 'Actor details here')" style="width: 200px; height: 150px; position: relative; border-radius: 10px; overflow: hidden;">
        <!-- Dark overlay -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 1;"></div>

        <!-- Image -->
        <img src="../static/images/${movie.image}" alt="${movie.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">

        <!-- Title at the bottom of the image, aligned left -->
        <div style="position: absolute; bottom: 20px; left: 10px; z-index: 2; color: white; font-size: 1.2em; font-weight: bold;">
            ${movie.title}
        </div>

        <!-- Channel name at the bottom (smaller font size), aligned left -->
        <div style="position: absolute; bottom: 5px; left: 10px; z-index: 2; color: white; font-size: 0.8em;">
            ${movie.channel}
        </div>
    </div>
`;

        
        // Append the movie cell (td) to the second row (tr)
        movieContainer.querySelectorAll('tr')[1].appendChild(movieCell);
    });

    // Close the second row and table tag
    movieContainer.innerHTML += "</tr></table>";

    // If no movies match the search query, display a "No results found" message
    if (top10Movies.length === 0) {
        movieContainer.innerHTML = "<p>No results found. Please try a different search.</p>";
    }

    num_of_reccomendations = top10Movies.length;



}



// Initially display all movies (with an empty search query)
searchMovies('');


bar_size = 4;
keyboard_size = (4,11);
current_tab = "bar";
current_row = 1;
current_column = 0;

key_row = 0;
key_column = 0;

toolbar_buttons =  [document.getElementById('home_button'),
                document.getElementById('search_button'),
                document.getElementById('recents_button'),
                document.getElementById('favourites_button'),
                document.getElementById('profile_button')]

// toolbar_shortcuts = []


toolbar_buttons[current_row].classList.add('focused');


socket = io();

document.addEventListener("DOMContentLoaded", () => {


    function looksmaxing(num, max) {
        if (num < 0) {
            return max;
        } else if (num > max) {
            return 0;
        } else {
            return num;
        }
    }

    function changeBarFocus (action) {
        if (action == "down" || action == "up") {
            previous_row = current_row;
    
            if (action == "down") {
                current_row = looksmaxing(current_row + 1, bar_size)
            } else if(action == "up") {
                current_row = looksmaxing(current_row - 1, bar_size)
            }

            toolbar_buttons[previous_row].classList.remove('focused');
            toolbar_buttons[current_row].classList.add('focused');
        } else if (action == "right") {
            toolbar_buttons[current_row].classList.remove('focused');
            current_tab = "searchbar";
            searchInput.classList.add('focused');
        } else if (action == "ok") {
            toolbar_buttons[current_row].click();
        }
    }



    function changeSearchBarFocus(action) {
        if (action == "left") {
            current_tab = "bar";
            current_row = 1;
            searchInput.classList.remove('focused');
            toolbar_buttons[current_row].classList.add('focused');
        } else if (action == "down" || action == "right") {
            if (num_of_reccomendations > 0) {
                current_tab = "recommendations";
                searchInput.classList.remove('focused');
                document.getElementById("reco-0-0").classList.add("focused");
                current_row = 0;
                current_column = 0;
            }
        } else if (action == "ok") {
            current_tab = "keyboard"
            searchInput.classList.remove('focused');
            keyboard.style.visibility = "visible";
            document.getElementById('key-0-0').classList.add("selectedkey");
            key_row = 0;
            key_column = 0;
        }
    }


    function changeRecFocus (action) {
        jump_back = false;
        previous_row = current_row;
        previous_column = current_column;
        previous_id = `reco-${previous_row}-${previous_column}`;
        previous_rec = document.getElementById(previous_id);
        if (action == "left") {
            if (current_column > 0) {
                current_column = current_column - 1;
            } else if (current_column == 0) {
                jump_back = true;
            }
        } else if (action == "up") {
            if (current_row > 0) {
                current_row = current_row - 1;
            } else if (current_row == 0) {
                jump_back = true;
            }
        } else if (action == "down") {
            if (current_row < 1 && current_column + 5 < num_of_reccomendations) {
                current_row = current_row + 1;
            }
        } else if (action == "right") {
            if ((current_row == 0 && current_column + 1 < num_of_reccomendations && current_column < 4) ||
            (current_row == 1 && current_column + 6 < num_of_reccomendations)) {
                current_column += 1;
            }
        }
        
        if (action == "ok") {
            current_id = `reco-${current_row}-${current_column}`;
            current_rec = document.getElementById(current_id);
            current_rec.click();
            current_rec.classList.remove("focused");
            document.getElementById('gumbajgafokus').classList.add("focused");
            current_tab = "preview";
            preview_play = true;
            


        } else {
            if (jump_back) {
                current_tab = "searchbar";
                searchInput.classList.add("focused");
                previous_rec.classList.remove("focused");
            } else {
                current_id = `reco-${current_row}-${current_column}`;
                current_rec = document.getElementById(current_id);
                previous_rec.classList.remove("focused");
                current_rec.classList.add("focused");
            }

        }
        
    }


    function changeKeyFocus(action) {
        previous_key_row = key_row;
        previous_key_column = key_column;

        if (action == "up") {
            key_row = looksmaxing(key_row - 1, 4)
        } else if (action == "down") {
            key_row = looksmaxing(key_row + 1, 4)
        } else if (action == "left") {
            key_column = looksmaxing(key_column - 1, 11)
        } else if (action == "right") {
            key_column = looksmaxing(key_column + 1, 11)
        } 


     
        key_id = `key-${key_row}-${key_column}`
        prevous_key_id = `key-${previous_key_row}-${previous_key_column}`
        if (key_row == 4) {
            key_id = "key-4"
        }
        if (previous_key_row == 4) {
            prevous_key_id = "key-4"
        }

        if (key_row == 0 && (key_column == 11)) {
            key_id="key-0-10";
        }
        if (previous_key_row == 0 && (previous_key_column == 11)) {
            prevous_key_id="key-0-10";
        }


        if (key_row == 3 && (key_column == 11)) {
            key_id="key-3-10";
        }
        if (previous_key_row == 3 && (previous_key_column == 11)) {
            prevous_key_id="key-3-10";
        }
        
        console.log(key_id)
        document.getElementById(prevous_key_id).classList.remove("selectedkey");
        document.getElementById(key_id).classList.add("selectedkey");

        if (action == "ok") {
            document.getElementById(key_id).click();
        }

        if (action == "back") {
            enter();
        }

    }


    function changePreviewFocus (action) {
        if (action == "ok") {
            if (preview_play) {
                document.getElementById('gumbajga').click();
            } else {
                closePreview();
                current_tab = "recommendations";
                current_rec.classList.add("focused");
            }
        } else if (action == "up" || action == "right" || action == "left" || action == "down") {
            preview_play = !preview_play;
            if (preview_play) {
                document.getElementById('gumbajgafokus').classList.add("focused");
                document.getElementById('zatvoribrate').classList.remove("focused");
            } else {
                document.getElementById('gumbajgafokus').classList.remove("focused");
                document.getElementById('zatvoribrate').classList.add("focused");
            }
        } else if (action == "back") {
            closePreview();
            current_tab = "recommendations";
            current_rec.classList.add("focused");
        }
    }


    function moveFocus1(action) {
        if (current_tab == "bar") {
            changeBarFocus(action);
        } else if (current_tab == "searchbar") {
            changeSearchBarFocus(action);
        } else if (current_tab == "recommendations") {
            changeRecFocus(action)
        } else if (current_tab == "keyboard") {
            changeKeyFocus(action)
        } else if (current_tab == "preview") {
            changePreviewFocus(action)
        }    
    }



    socket.on('command', (data) => {
        const action = data.action;
        // console.log(current_tab)
        if (action === 'up' || action === 'down' || action === 'left' || action === 'right' || action == 'ok' || action == "back") {
            moveFocus1(action);
            tvContent.textContent = `Moved ${action}`;
        } else if (action === 'play') {
            alert("Got you SON of a GUN!");
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        } else if (action === 'search') {

            window.location.href = "/search"
        }
        // console.log(current_tab)
    });



});



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