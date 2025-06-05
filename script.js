// DOM Elements
const playPauseBtn = document.querySelector('.play-pause');
const prevBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');
const shuffleBtn = document.querySelector('.shuffle');
const repeatBtn = document.querySelector('.repeat');
const progressBar = document.querySelector('.progress');
const progressFilled = document.querySelector('.progress-filled');
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
searchInput.style.display = 'none'; // Hide search input initially

const searchResults = document.createElement('div');
searchResults.className = 'search-results';
searchResults.style.display = 'none'; // Hide search results initially

// Initialize the player
function initPlayer() {
    displayHome();
    updatePlayerUI();
    
    // Add error handling for audio
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

// Load a song
function loadSong(index) {
    const song = songs[index];
    audio.src = song.file;
    currentSongImg.src = song.cover;
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
    
    // Reset play state
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Load the audio
    audio.load();
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
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
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
}

// Next Song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
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
    // Set initial volume to 1 (100%)
    audio.volume = 1;
}

// Event Listeners
playPauseBtn.addEventListener('click', () => {
    togglePlay();
});

// Add audio event listeners
audio.addEventListener('play', () => {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    } else {
        nextSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', setProgress);

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
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
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
}

// Clear search and show playlists
function clearSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
    }
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

// Add Enter key event listener
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value.trim();
        if (query) {
            performSearch(query);
            // Show search results
            const searchResults = document.querySelector('.search-results');
            if (searchResults) {
                searchResults.style.display = 'block';
            }
        }
    }
});

// Navigation functionality
document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = link.querySelector('span').textContent.toLowerCase();
        
        switch(action) {
            case 'home':
                displayHome();
                clearSearch();
                break;
            case 'search':
                break;
            case 'your library':
                displayLibrary();
                clearSearch();
                break;
            case 'create playlist':
                createPlaylist(); // <-- Place it here
                break;
            case 'liked songs':
                alert('Liked songs feature coming soon!');
                break;
            case 'all songs':
                displayAllSongs();
                break;            
                const mainContent = document.querySelector('.main-content');
                mainContent.innerHTML = `
                    <div class="topbar">
                        <div class="prev-next-buttons">
                            <button type="button" class="fa fa-chevron-left"></button>
                            <button type="button" class="fa fa-chevron-right"></button>
                        </div>
                        <div class="navbar">
                            <ul>
                                <li><a href="#">Premium</a></li>
                                <li><a href="#">Support</a></li>
                                <li><a href="#">Download</a></li>
                                <li class="divider">|</li>
                                <li><a href="#">Sign Up</a></li>
                            </ul>
                            <button type="button">Log In</button>
                        </div>
                    </div>
                    <div class="search-container">
                        <div class="search-header">
                            <h2>Search</h2>
                            <input type="text" class="search-input" placeholder="Search for songs, artists, or playlists">
                        </div>
                        <div class="search-results"></div>
                    </div>
                `;
                
                // Show search input
                const newSearchInput = document.querySelector('.search-input');
                newSearchInput.style.display = 'block';
                
                // Add event listener to the new search input
                newSearchInput.addEventListener('input', (e) => {
                    if (e.target.value.trim() === '') {
                        clearSearch();
                    } else {
                        performSearch(e.target.value);
                    }
                });

                // Add Enter key event listener
                newSearchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const query = e.target.value.trim();
                        if (query) {
                            performSearch(query);
                            // Show search results
                            const searchResults = document.querySelector('.search-results');
                            if (searchResults) {
                                searchResults.style.display = 'block';
                            }
                        }
                    }
                });
                
                // Focus the search input
                newSearchInput.focus();
                break;
            case 'your library':
                alert('Library feature coming soon!');
                break;
            case 'create playlist':
                alert('Create playlist feature coming soon!');
                break;
            case 'liked songs':
                alert('Liked songs feature coming soon!');
                break;
            case 'all songs':
                displayAllSongs();
                break;
        }

        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            toggleMobileMenu();
        }
    });
});

function displayAllSongs() {
}
function displayLibrary() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="topbar">
            <div class="prev-next-buttons">
                <button type="button" class="fa fa-chevron-left"></button>
                <button type="button" class="fa fa-chevron-right"></button>
            </div>
            <div class="navbar">
                <ul>
                    <li><a href="#">Premium</a></li>
                    <li><a href="#">Support</a></li>
                    <li><a href="#">Download</a></li>
                    <li class="divider">|</li>
                    <li><a href="#">Sign Up</a></li>
                </ul>
                <button type="button">Log In</button>
            </div>
        </div>
        <div class="spotify-playlists">
            <h2>Your Playlists</h2>
            <div class="list" id="library-playlists-list"></div>
        </div>
    `;

    const libraryList = document.getElementById('library-playlists-list');
    if (playlists.length === 0) {
        libraryList.innerHTML = '<p style="color:#b3b3b3;text-align:center;">No playlists yet.</p>';
    } else {
        playlists.forEach((playlist, idx) => {
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
                showPlaylistDetail(idx);
            });
            libraryList.appendChild(playlistElement);
        });
    }
}

// Show playlist detail and add song button
function showPlaylistDetail(playlistIndex) {
    const playlist = playlists[playlistIndex];
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="playlist-detail">
            <h2>${playlist.name}</h2>
            <p>Total Songs: ${playlist.songs.length}</p>
            <button id="add-song-btn">Add Song</button>
            <div id="playlist-songs-list" style="margin-top:20px; display: flex; flex-wrap: wrap; gap: 20px;">
    ${
        playlist.songs.length === 0
            ? '<p style="color:#b3b3b3;">No songs in this playlist.</p>'
            : playlist.songs.map(songId => {
                const song = songs.find(s => s.id === songId);
                return song
                    ? `
                        <div class="item" style="width:180px;">
                            <img src="${song.cover}" alt="${song.title}">
                            <div class="play">
                                <i class="fa fa-play"></i>
                            </div>
                            <h4>${song.title}</h4>
                            <p>${song.artist}</p>
                        </div>
                    `
                    : '';
            }).join('')
    }
       </div>
            <button id="back-to-library" style="margin-top:20px;">Back to Library</button>
        </div>
    `;

    // Add event for "Add Song" button
    document.getElementById('add-song-btn').onclick = function() {
        // Simple prompt to add by song title (you can enhance this)
        const songTitle = prompt('Enter song title to add:');
        if (songTitle) {
            const song = songs.find(s => s.title.toLowerCase() === songTitle.toLowerCase());
            if (song && !playlist.songs.includes(song.id)) {
                playlist.songs.push(song.id);
                showPlaylistDetail(playlistIndex); // Refresh detail view
            } else {
                alert('Song not found or already in playlist.');
            }
        }
    };

    // Back to library button
    document.getElementById('back-to-library').onclick = function() {
        displayLibrary();
    };

    // Add play functionality to each song card in the playlist
    document.querySelectorAll('#playlist-songs-list .item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const song = songs.find(s => s.title === title);
            if (song) {
                currentSongIndex = songs.findIndex(s => s.id === song.id);
                loadSong(currentSongIndex);
                if (!isPlaying) togglePlay();
            }
        });
    });
}

    const libraryList = document.getElementById('library-playlists-list');
    if (playlists.length === 0) {
        libraryList.innerHTML = '<p style="color:#b3b3b3;text-align:center;">No playlists yet.</p>';
    } else {
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
            playlistElement.addEventListener('click', () => {
                // Play first song in playlist if available
                if (playlist.songs.length > 0) {
                    currentSongIndex = songs.findIndex(s => s.id === playlist.songs[0]);
                    loadSong(currentSongIndex);
                    if (!isPlaying) togglePlay();
                }
            });
            libraryList.appendChild(playlistElement);
        });
    }

    // Add search input back
    document.querySelector('.navbar').insertBefore(searchInput, document.querySelector('.navbar button'));

    // Display all songs
    const allSongsList = document.getElementById('all-songs-list');
    songs.forEach(song => {
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
        allSongsList.appendChild(songElement);
    });

// Function to display home content
function displayHome() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="topbar">
            <div class="prev-next-buttons">
                <button type="button" class="fa fa-chevron-left"></button>
                <button type="button" class="fa fa-chevron-right"></button>
            </div>
            <div class="navbar">
                <ul>
                    <li><a href="#">Premium</a></li>
                    <li><a href="#">Support</a></li>
                    <li><a href="#">Download</a></li>
                    <li class="divider">|</li>
                    <li><a href="#">Sign Up</a></li>
                </ul>
                <button type="button">Log In</button>
            </div>
        </div>
        <div class="spotify-playlists">
            <h2>Bollywood Hits</h2>
            <div class="list" id="bollywood-hits"></div>
        </div>
        <div class="spotify-playlists">
            <h2>Romantic Hits</h2>
            <div class="list" id="romantic-hits"></div>
        </div>
    `;

    // Display Bollywood Hits
    const bollywoodHitsList = document.getElementById('bollywood-hits');
    const bollywoodSongs = songs.filter(song => song.id >= 13 && song.id <= 40);
    bollywoodSongs.slice(0, 6).forEach(song => {
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
        bollywoodHitsList.appendChild(songElement);
    });

    // Display Romantic Hits
    const romanticHitsList = document.getElementById('romantic-hits');
    const romanticSongs = [
        songs.find(s => s.id === 26), // Chahun Main Ya Naa
        songs.find(s => s.id === 28), // Sunn Raha Hai
        songs.find(s => s.id === 21), // Bhula Dena
        songs.find(s => s.id === 22), // Kabhi Jo Baadal Barse
        songs.find(s => s.id === 29), // Tu Hai Ki Nahi
        songs.find(s => s.id === 38)  // Bewajah
    ].filter(Boolean);

    romanticSongs.forEach(song => {
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
        romanticHitsList.appendChild(songElement);
    });
}

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

    .search-container {
        padding: 20px;
    }

    .search-header {
        margin-bottom: 30px;
    }

    .search-header h2 {
        color: #fff;
        font-size: 32px;
        margin-bottom: 20px;
    }

    .search-header .search-input {
        width: 100%;
        max-width: 500px;
        font-size: 16px;
        padding: 12px 20px;
    }

    @media screen and (max-width: 768px) {
        .search-header .search-input {
            max-width: 100%;
        }
    }

    @media screen and (max-width: 480px) {
        .search-header h2 {
            font-size: 24px;
        }
        
        .search-header .search-input {
            font-size: 14px;
            padding: 10px 15px;
        }
    }
`;
document.head.appendChild(style); 
function createPlaylist() {
    const playlistName = prompt('Enter playlist name:');
    if (playlistName && playlistName.trim() !== '') {
       
        const newPlaylist = {
            name: playlistName.trim(),
            cover: 'default-cover.jpg', 
            songs: [],
        };
        playlists.push(newPlaylist);
        renderPlaylists();     
        displayLibrary();       
        alert(`Playlist "${playlistName}" created!`);
    }
}