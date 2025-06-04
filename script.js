// DOM Elements
const playPauseBtn = document.querySelector('.play-pause');
const prevBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');
const shuffleBtn = document.querySelector('.shuffle');
const repeatBtn = document.querySelector('.repeat');
const volumeBtn = document.querySelector('.volume');
const progressBar = document.querySelector('.progress');
const progressFilled = document.querySelector('.progress-filled');
const volumeSlider = document.querySelector('.volume-slider');
const volumeFilled = document.querySelector('.volume-filled');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const currentSongImg = document.getElementById('current-song-img');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');
const playlistContainer = document.querySelector('.spotify-playlists .list');

// Audio Element
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'none'; // none, one, all

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const menuOverlay = document.querySelector('.menu-overlay');

// Navigation and Search Functionality
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search for songs, artists, or playlists';
searchInput.className = 'search-input';

const searchResults = document.createElement('div');
searchResults.className = 'search-results';

// Initialize the player
function initPlayer() {
    loadSong(currentSongIndex);
    renderPlaylists();
    updatePlayerUI();
}

// Load a song
function loadSong(index) {
    const song = songs[index];
    audio.src = song.file;
    currentSongImg.src = song.cover;
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

// Previous Song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

// Next Song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

// Update Progress Bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressFilled.style.width = `${progressPercent}%`;
    
    // Update time displays
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = formatTime(duration);
}

// Set Progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Format Time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Toggle Shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#1db954' : '#b3b3b3';
}

// Toggle Repeat
function toggleRepeat() {
    switch (repeatMode) {
        case 'none':
            repeatMode = 'one';
            repeatBtn.style.color = '#1db954';
            break;
        case 'one':
            repeatMode = 'all';
            repeatBtn.style.color = '#1db954';
            break;
        case 'all':
            repeatMode = 'none';
            repeatBtn.style.color = '#b3b3b3';
            break;
    }
}

// Set Volume
function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    audio.volume = volume;
    volumeFilled.style.width = `${volume * 100}%`;
}

// Toggle Mute
function toggleMute() {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeFilled.style.width = '0%';
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        audio.volume = 1;
        volumeFilled.style.width = '100%';
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// Render Playlists
function renderPlaylists() {
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'item';
        playlistElement.innerHTML = `
            <img src="${playlist.cover}" alt="${playlist.name}">
            <div class="play">
                <i class="fa fa-play"></i>
            </div>
            <h4>${playlist.name}</h4>
            <p>Playlist</p>
        `;
        playlistContainer.appendChild(playlistElement);
    });
}

// Update Player UI
function updatePlayerUI() {
    // Set initial volume
    audio.volume = 0.5;
    volumeFilled.style.width = '50%';
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
volumeBtn.addEventListener('click', toggleMute);
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', setProgress);
volumeSlider.addEventListener('click', setVolume);
audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
    } else if (repeatMode === 'all') {
        nextSong();
    } else {
        if (currentSongIndex < songs.length - 1) {
            nextSong();
        } else {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
});

// Initialize the player when the page loads
window.addEventListener('load', initPlayer);

// Mobile Menu Functionality
function toggleMobileMenu() {
    sidebar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
menuOverlay.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a navigation link
document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMobileMenu();
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
});

// Add search elements to the page
document.querySelector('.navbar').insertBefore(searchInput, document.querySelector('.navbar button'));
document.querySelector('.main-content').appendChild(searchResults);

// Search functionality
function performSearch(query) {
    query = query.toLowerCase();
    const results = {
        songs: songs.filter(song => 
            song.title.toLowerCase().includes(query) || 
            song.artist.toLowerCase().includes(query)
        ),
        playlists: playlists.filter(playlist => 
            playlist.name.toLowerCase().includes(query)
        )
    };

    // Hide all playlists
    document.querySelectorAll('.spotify-playlists').forEach(playlist => {
        playlist.style.display = 'none';
    });

    // Show search results
    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    if (results.songs.length === 0 && results.playlists.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }

    // Display songs
    if (results.songs.length > 0) {
        const songsSection = document.createElement('div');
        songsSection.className = 'search-section';
        songsSection.innerHTML = '<h2>Songs</h2>';
        
        const songsList = document.createElement('div');
        songsList.className = 'list';
        
        results.songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'item';
            songElement.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="play">
                    <i class="fa fa-play"></i>
                </div>
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            `;
            songElement.addEventListener('click', () => {
                currentSongIndex = songs.findIndex(s => s.id === song.id);
                loadSong(currentSongIndex);
                if (!isPlaying) togglePlay();
            });
            songsList.appendChild(songElement);
        });
        
        songsSection.appendChild(songsList);
        searchResults.appendChild(songsSection);
    }

    // Display playlists
    if (results.playlists.length > 0) {
        const playlistsSection = document.createElement('div');
        playlistsSection.className = 'search-section';
        playlistsSection.innerHTML = '<h2>Playlists</h2>';
        
        const playlistsList = document.createElement('div');
        playlistsList.className = 'list';
        
        results.playlists.forEach(playlist => {
            const playlistElement = document.createElement('div');
            playlistElement.className = 'item';
            playlistElement.innerHTML = `
                <img src="${playlist.cover}" alt="${playlist.name}">
                <div class="play">
                    <i class="fa fa-play"></i>
                </div>
                <h4>${playlist.name}</h4>
                <p>Playlist</p>
            `;
            playlistElement.addEventListener('click', () => {
                // Play first song in playlist
                if (playlist.songs.length > 0) {
                    currentSongIndex = songs.findIndex(s => s.id === playlist.songs[0]);
                    loadSong(currentSongIndex);
                    if (!isPlaying) togglePlay();
                }
            });
            playlistsList.appendChild(playlistElement);
        });
        
        playlistsSection.appendChild(playlistsList);
        searchResults.appendChild(playlistsSection);
    }
}

// Clear search and show playlists
function clearSearch() {
    searchInput.value = '';
    searchResults.style.display = 'none';
    document.querySelectorAll('.spotify-playlists').forEach(playlist => {
        playlist.style.display = 'block';
    });
}

// Search event listeners
searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim() === '') {
        clearSearch();
    } else {
        performSearch(e.target.value);
    }
});

// Navigation functionality
document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = link.querySelector('span').textContent.toLowerCase();
        
        switch(action) {
            case 'home':
                clearSearch();
                break;
            case 'search':
                searchInput.focus();
                break;
            case 'your library':
                // Show user's library (you can implement this later)
                alert('Library feature coming soon!');
                break;
            case 'create playlist':
                // Create new playlist (you can implement this later)
                alert('Create playlist feature coming soon!');
                break;
            case 'liked songs':
                // Show liked songs (you can implement this later)
                alert('Liked songs feature coming soon!');
                break;
        }

        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            toggleMobileMenu();
        }
    });
});

// Add styles for search
const style = document.createElement('style');
style.textContent = `
    .search-input {
        padding: 8px 15px;
        border-radius: 20px;
        border: none;
        background: #242424;
        color: #fff;
        width: 200px;
        margin-right: 10px;
    }

    .search-input:focus {
        outline: none;
        background: #2a2a2a;
    }

    .search-results {
        display: none;
        padding: 20px;
    }

    .search-section {
        margin-bottom: 30px;
    }

    .search-section h2 {
        color: #fff;
        font-size: 22px;
        margin-bottom: 20px;
    }

    .no-results {
        color: #b3b3b3;
        text-align: center;
        padding: 20px;
    }

    @media screen and (max-width: 768px) {
        .search-input {
            width: 150px;
        }
    }

    @media screen and (max-width: 480px) {
        .search-input {
            width: 120px;
            padding: 6px 12px;
            font-size: 12px;
        }
    }
`;
document.head.appendChild(style); 