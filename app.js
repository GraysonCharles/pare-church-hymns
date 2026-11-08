
// =====================================
// PARE CHURCH HYMNS - MAIN APP.JS
// =====================================

// HTML ELEMENTS
const songList = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");

const songReader = document.getElementById("songReader");
const songTitle = document.getElementById("songTitle");
const songImage = document.getElementById("songImage");

const backButton = document.getElementById("backButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

const homeButton = document.getElementById("homeButton");
const searchButton = document.getElementById("searchButton");
const favoriteButton = document.getElementById("favoriteButton");

const darkModeButton = document.getElementById("darkModeButton");
const aboutButton = document.getElementById("aboutButton");
const aboutPage = document.getElementById("aboutPage");


// =====================================
// SONG FAVORITE BUTTON
// =====================================

let songFavoriteButton = document.getElementById("songFavoriteButton");

// Kama kitufe hakipo kwenye HTML, kitengeneze moja kwa moja
if (!songFavoriteButton) {

    songFavoriteButton = document.createElement("button");
    songFavoriteButton.id = "songFavoriteButton";
    songFavoriteButton.type = "button";
    songFavoriteButton.title = "Add to Favorites";
    songFavoriteButton.textContent = "♡";

    const heading = document.createElement("div");
    heading.className = "song-heading";

    songTitle.parentNode.insertBefore(heading, songTitle);

    heading.appendChild(songTitle);
    heading.appendChild(songFavoriteButton);
}


// =====================================
// SONG VARIABLES
// =====================================

let currentSongIndex = 0;
const availableSongs = songs;

let currentSong = null;

// FAVORITES
let favorites = [];

try {
    favorites = (
        JSON.parse(localStorage.getItem("pareFavorites")) || []
    ).map(Number);
} catch (error) {
    favorites = [];
}

let showFavorites = false;


// SAVE FAVORITES
function saveFavorites() {
    localStorage.setItem(
        "pareFavorites",
        JSON.stringify(favorites)
    );
}


// CHECK FAVORITE
function isFavorite(song) {
    return favorites.includes(Number(song.id));
}


// TOGGLE FAVORITE
function toggleFavorite(song) {

    const songId = Number(song.id);

    if (favorites.includes(songId)) {

        favorites = favorites.filter(function(id) {
            return id !== songId;
        });

    } else {

        favorites.push(songId);

    }

    saveFavorites();
}


// =====================================
// DISPLAY SONGS
// =====================================

function displaySongs(songData) {

    songList.innerHTML = "";

    songData.forEach(function(song) {

        const card = document.createElement("div");
        card.className = "song-card";

        const isFav = isFavorite(song);

        card.innerHTML = `
            <h3>Wimbo Na. ${song.id}</h3>
            <p>${song.title || ""}</p>
            <small>${song.subtitle || ""}</small>

            <button class="favoriteToggle" type="button">
                ${isFav ? "❤️" : "♡"}
            </button>
        `;

        // OPEN SONG
        card.addEventListener("click", function() {
            openSong(song);
        });

        // FAVORITE BUTTON ON CARD
        const favoriteToggle =
            card.querySelector(".favoriteToggle");

        favoriteToggle.addEventListener("click", function(event) {

            event.stopPropagation();

            toggleFavorite(song);

            const currentSongs = showFavorites
                ? songs.filter(s => isFavorite(s))
                : songs;

            displaySongs(currentSongs);

        });

        songList.appendChild(card);

    });

}


// =====================================
// OPEN SONG
// =====================================

function openSong(song) {

    currentSong = song;

    songList.style.display = "none";
    searchInput.style.display = "none";

    songReader.style.display = "block";

    songTitle.textContent =
        "Wimbo Na. " + song.id + " - " + (song.title || "");

    songImage.src = song.image;

    currentSongIndex = availableSongs.findIndex(function(item) {
        return Number(item.id) === Number(song.id);
    });

    // UPDATE FAVORITE BUTTON
    songFavoriteButton.textContent =
        isFavorite(song) ? "❤️" : "♡";

    prevButton.disabled = currentSongIndex <= 0;

    nextButton.disabled =
        currentSongIndex >= availableSongs.length - 1;

}


// =====================================
// FAVORITE BUTTON INSIDE SONG READER
// =====================================

songFavoriteButton.addEventListener("click", function() {

    if (!currentSong) return;

    toggleFavorite(currentSong);

    songFavoriteButton.textContent =
        isFavorite(currentSong) ? "❤️" : "♡";

});


// =====================================
// BACK BUTTON
// =====================================

backButton.addEventListener("click", function() {

    songReader.style.display = "none";

    songList.style.display = "grid";

    if (showFavorites) {

        displaySongs(songs.filter(function(song) {
            return isFavorite(song);
        }));

        searchInput.style.display = "none";

    } else {

        searchInput.style.display = "block";

        if (searchInput.value.trim() !== "") {
            searchInput.dispatchEvent(
                new Event("input")
            );
        } else {
            displaySongs(songs);
        }

    }

});


// =====================================
// SEARCH SYSTEM
// =====================================

searchInput.addEventListener("input", function() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredSongs = songs.filter(function(song) {

        return (

            String(song.id).includes(searchValue) ||

            String(song.title || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(song.subtitle || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(song.searchText || "")
                .toLowerCase()
                .includes(searchValue)

        );

    });

    displaySongs(filteredSongs);

});


// =====================================
// INITIAL SONG DISPLAY
// =====================================

displaySongs(songs);


// =====================================
// SIDEBAR MENU
// =====================================

menuButton.addEventListener("click", function() {

    sidebar.classList.toggle("active");

});


// =====================================
// HOME BUTTON
// =====================================

homeButton.addEventListener("click", function() {

    showFavorites = false;

    songReader.style.display = "none";
    aboutPage.style.display = "none";

    songList.style.display = "grid";
    searchInput.style.display = "block";

    searchInput.value = "";

    displaySongs(songs);

    sidebar.classList.remove("active");

});


// =====================================
// SEARCH BUTTON
// =====================================

searchButton.addEventListener("click", function() {

    showFavorites = false;

    songReader.style.display = "none";
    aboutPage.style.display = "none";

    songList.style.display = "grid";
    searchInput.style.display = "block";

    searchInput.focus();

    sidebar.classList.remove("active");

});


// =====================================
// FAVORITES PAGE
// =====================================

favoriteButton.addEventListener("click", function() {

    showFavorites = true;

    songReader.style.display = "none";
    aboutPage.style.display = "none";

    searchInput.style.display = "none";
    songList.style.display = "grid";

    const favoriteSongs = songs.filter(function(song) {
        return isFavorite(song);
    });

    displaySongs(favoriteSongs);

    sidebar.classList.remove("active");

});


// =====================================
// DARK MODE
// =====================================

if (localStorage.getItem("pareDarkMode") === "enabled") {

    document.body.classList.add("dark-mode");

    darkModeButton.textContent = "☀️ Light Mode";

}

darkModeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("pareDarkMode", "enabled");

        darkModeButton.textContent = "☀️ Light Mode";

    } else {

        localStorage.setItem("pareDarkMode", "disabled");

        darkModeButton.textContent = "🌙 Dark Mode";

    }

});


// =====================================
// ABOUT APP
// =====================================

aboutButton.addEventListener("click", function() {

    songList.style.display = "none";
    searchInput.style.display = "none";
    songReader.style.display = "none";

    aboutPage.style.display = "block";

    sidebar.classList.remove("active");

});


// =====================================
// PREVIOUS SONG
// =====================================

prevButton.addEventListener("click", function() {

    if (currentSongIndex > 0) {

        openSong(availableSongs[currentSongIndex - 1]);

    }

});


// =====================================
// NEXT SONG
// =====================================

nextButton.addEventListener("click", function() {

    if (currentSongIndex < availableSongs.length - 1) {

        openSong(availableSongs[currentSongIndex + 1]);

    }

});
