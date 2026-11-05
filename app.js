const songList = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");

const songReader = document.getElementById("songReader");
const songTitle = document.getElementById("songTitle");
const songImage = document.getElementById("songImage");
const backButton = document.getElementById("backButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

let currentSongIndex = 0;
const availableSongs = songs.filter(song => song.title.trim() !== "");
// FAVORITES SYSTEM
let favorites = JSON.parse(localStorage.getItem("pareFavorites")) || [];
let showFavorites = false;

function saveFavorites() {
    localStorage.setItem("pareFavorites", JSON.stringify(favorites));
}

function displaySongs(songData) {
    songList.innerHTML = "";

    songData.forEach(function(song) {
        const card = document.createElement("div");
        card.className = "song-card";

        const isFavorite = favorites.includes(song.id);

        card.innerHTML = `
            <h3>Wimbo Na. ${song.id}</h3>
            <p>${song.title}</p>
            <small>${song.subtitle}</small>

           <button class="favoriteToggle">
    ${isFavorite ? "❤️" : "♡"}
</button>
        `;

        card.addEventListener("click", function() {
            openSong(song);
        });

        const favoriteToggle = card.querySelector(".favoriteToggle");

        favoriteToggle.addEventListener("click", function(event) {
            event.stopPropagation();

            if (favorites.includes(song.id)) {
                favorites = favorites.filter(id => id !== song.id);
            } else {
                favorites.push(song.id);
            }

            saveFavorites();

            const currentSongs = showFavorites
                ? songs.filter(s => favorites.includes(s.id))
                : songs;

            displaySongs(currentSongs);
        });

        songList.appendChild(card);
    });
}

function openSong(song) {
    songList.style.display = "none";
    searchInput.style.display = "none";

    songReader.style.display = "block";
    songTitle.textContent = "Wimbo Na. " + song.id + " - " + song.title;
    songImage.src = song.image;
currentSongIndex = availableSongs.findIndex(item => item.id === song.id);

prevButton.disabled = currentSongIndex <= 0;
nextButton.disabled = currentSongIndex >= availableSongs.length - 1;
}

backButton.addEventListener("click", function() {
    songReader.style.display = "none";
    songList.style.display = "grid";
    searchInput.style.display = "block";
});

searchInput.addEventListener("input", function() {
    const searchValue = searchInput.value.toLowerCase();

    const filteredSongs = songs.filter(function(song) {
        return (
            song.id.toString().includes(searchValue) ||
            song.title.toLowerCase().includes(searchValue) ||
            song.subtitle.toLowerCase().includes(searchValue) ||
            song.searchText.toLowerCase().includes(searchValue)
        );
    });

    displaySongs(filteredSongs);
});

displaySongs(songs);
// SIDEBAR MENU
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

menuButton.addEventListener("click", function() {
    sidebar.classList.toggle("active");
});

// HOME BUTTON
homeButton.addEventListener("click", function() {
    showFavorites = false;

    songReader.style.display = "none";
    aboutPage.style.display = "none";

    songList.style.display = "grid";
    searchInput.style.display = "block";

    searchInput.value = "";

    displaySongs(songs.filter(song => song.title.trim() !== ""));

    sidebar.classList.remove("active");
});

// SEARCH BUTTON
searchButton.addEventListener("click", function() {
    showFavorites = false;

    songReader.style.display = "none";
    aboutPage.style.display = "none";

    songList.style.display = "grid";
    searchInput.style.display = "block";

    searchInput.focus();

    sidebar.classList.remove("active");
});
// FAVORITES BUTTON
favoriteButton.addEventListener("click", function() {
    showFavorites = true;

    songReader.style.display = "none";
    aboutPage.style.display = "none";
    searchInput.style.display = "none";
    songList.style.display = "grid";

    const favoriteSongs = songs.filter(function(song) {
        return favorites.includes(song.id) && song.title.trim() !== "";
    });

    displaySongs(favoriteSongs);

    sidebar.classList.remove("active");
});
// DARK MODE SYSTEM

const darkModeButton = document.getElementById("darkModeButton");

// Kagua kama mtumiaji aliwahi kuchagua Dark Mode
if (localStorage.getItem("pareDarkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeButton.textContent = "☀️ Light Mode";
}

// Bonyeza kubadilisha muonekano
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
// ABOUT APP

const aboutButton = document.getElementById("aboutButton");
const aboutPage = document.getElementById("aboutPage");

aboutButton.addEventListener("click", function() {

    songList.style.display = "none";
    searchInput.style.display = "none";
    songReader.style.display = "none";

    aboutPage.style.display = "block";

    sidebar.classList.remove("active");

});
prevButton.addEventListener("click", function() {
    if (currentSongIndex > 0) {
        openSong(availableSongs[currentSongIndex - 1]);
    }
});

nextButton.addEventListener("click", function() {
    if (currentSongIndex < availableSongs.length - 1) {
        openSong(availableSongs[currentSongIndex + 1]);
    }
});
