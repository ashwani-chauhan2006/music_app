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
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const menuOverlay = document.querySelector('.menu-overlay');
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results');

// Audio Element
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'none'; // none, one, all

// Mobile Menu Functionality
function toggleMobileMenu() {
    sidebar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

// Handle search on mobile
function handleMobileSearch() {
    if (window.innerWidth <= 480) {
        searchResults.style.display = 'block';
        searchInput.focus();
    }
}

// Close search on mobile
function closeMobileSearch() {
    if (window.innerWidth <= 480) {
searchResults.style.display = 'none';
        searchInput.value = '';
    }
}

// Handle touch events for mobile
function handleMobileTouch() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && touchStartX < 50) {
                // Swipe right - open menu
                if (!sidebar.classList.contains('active')) {
                    toggleMobileMenu();
                }
            } else if (swipeDistance < 0 && sidebar.classList.contains('active')) {
                // Swipe left - close menu
                toggleMobileMenu();
            }
        }
    }
}

// Initialize mobile functionality
function initMobileFeatures() {
    if (window.innerWidth <= 480) {
        handleMobileTouch();
    }

    // Add event listeners
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    menuOverlay.addEventListener('click', toggleMobileMenu);

    // Handle search link click
    const searchLink = document.querySelector('.navigation a[href="#"] i.fa-search').parentElement;
    if (searchLink) {
        searchLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleMobileSearch();
        });
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && !searchLink.contains(e.target)) {
            closeMobileSearch();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 480) {
            sidebar.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

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

    // Add event listener for Home link
    const homeLink = document.querySelector('.navigation a[href="#"]');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            displayHome();
        });
    }

    // Add event listener for All Songs link
    const allSongsLink = document.getElementById('all-songs-link');
    if (allSongsLink) {
        allSongsLink.addEventListener('click', (e) => {
            e.preventDefault();
            displayAllSongs();
        });
    }

    // Add event listener for Search link
    const searchLink = document.querySelector('.navigation a[href="#"] i.fa-search').parentElement;
    if (searchLink) {
        searchLink.addEventListener('click', (e) => {
            e.preventDefault();
            displaySearch();
        });
    }

    // Add event listener for Your Library link
    const libraryLink = document.querySelector('.navigation a[href="#"] i.fa-book').parentElement;
    if (libraryLink) {
        libraryLink.addEventListener('click', (e) => {
            e.preventDefault();
            displayLibrary();
        });
    }
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
            <div class="image-container">
            <img src="${playlist.cover}" alt="${playlist.name}">
            </div>
            <div class="content">
            <h4>${playlist.name}</h4>
            <p>Playlist</p>
            </div>
            <div class="play">
                <i class="fa fa-play"></i>
            </div>
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

// Add window resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        adjustGridLayout();
    }, 250);
});

// Function to adjust grid layout based on screen size
function adjustGridLayout() {
    const container = document.querySelector('.spotify-playlists .list');
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const items = container.querySelectorAll('.item');
    
    // Remove any existing inline styles
    items.forEach(item => {
        item.style = '';
                });
                
    // Adjust item sizes based on container width
    if (containerWidth < 600) {
        container.style.gridTemplateColumns = '1fr';
        items.forEach(item => {
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.height = containerWidth < 360 ? '45px' : 
                              containerWidth < 480 ? '50px' : '60px';
            item.style.padding = containerWidth < 360 ? '5px' : 
                               containerWidth < 480 ? '6px' : '8px';
    });
    } else {
        container.style.gridTemplateColumns = '';
        items.forEach(item => {
            item.style.width = containerWidth < 768 ? '140px' :
                             containerWidth < 1024 ? '150px' :
                             containerWidth < 1200 ? '160px' : '180px';
            item.style.margin = '10px';
        });
    }
}

// Call adjustGridLayout initially
adjustGridLayout();

// Navigation functionality
document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = link.querySelector('span').textContent.toLowerCase();
        
        switch(action) {
            case 'home':
                displayHome();
                break;
            case 'search':
                displaySearch();
                break;
            case 'your library':
                displayLibrary();
                break;
            case 'create playlist':
                createPlaylist();
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
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="topbar">
            <div class="prev-next-buttons">
                <button type="button" class="fa fa-chevron-left"></button>
                <button type="button" class="fa fa-chevron-right"></button>
            </div>
        </div>
        <div class="spotify-playlists">
            <h2>All Songs</h2>
            <div class="list" id="all-songs-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding: 20px;"></div>
        </div>
    `;

    const allSongsList = document.getElementById('all-songs-list');
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'item';
        songElement.style.cssText = `
            background: #181818;
            padding: 16px;
            border-radius: 8px;
            transition: background-color 0.3s ease;
            cursor: pointer;
            position: relative;
            ${song.title === "Sajde" ? 'padding-top: 21px;' : ''}
        `;
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 4px; margin-bottom: 16px;">
            <div class="play" style="position: absolute; right: 24px; bottom: 80px; background: #1db954; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <i class="fa fa-play" style="color: black;"></i>
            </div>
            <h4 style="color: white; margin: 0 0 8px 0; font-size: 16px;">${song.title}</h4>
            <p style="color: #b3b3b3; margin: 0; font-size: 14px;">${song.artist}</p>
        `;
        
        songElement.addEventListener('mouseenter', () => {
            songElement.style.backgroundColor = '#282828';
            songElement.querySelector('.play').style.opacity = '1';
        });
        
        songElement.addEventListener('mouseleave', () => {
            songElement.style.backgroundColor = '#181818';
            songElement.querySelector('.play').style.opacity = '0';
        });

        songElement.addEventListener('click', () => {
            currentSongIndex = songs.findIndex(s => s.id === song.id);
            loadSong(currentSongIndex);
            if (!isPlaying) togglePlay();
        });
        
        allSongsList.appendChild(songElement);
    });
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

async function displayLibrary() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="topbar">
            <div class="prev-next-buttons">
                <button type="button" class="fa fa-chevron-left"></button>
                <button type="button" class="fa fa-chevron-right"></button>
            </div>
        </div>
        <div class="spotify-playlists">
            <h2>Your Library</h2>
            <div class="list" id="library-playlists-list"></div>
        </div>
    `;

    const libraryList = document.getElementById('library-playlists-list');
    
    // Show loading state
    libraryList.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #b3b3b3;">
            <i class="fa fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
            <h3>Loading your playlists...</h3>
        </div>
    `;

    try {
        console.log("Starting library load...");
        
        // Import Firebase functions
        const { getFirestore, collection, getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js");
        console.log("Firestore imported successfully");
        
        const { getAuth } = await import("https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js");
        console.log("Auth imported successfully");
        
        const { app } = await import("./auth.js");
        console.log("Auth app imported successfully");
        
        if (!app) {
            throw new Error("Firebase app not initialized");
        }
        
        const db = getFirestore(app);
        const auth = getAuth(app);
        
        console.log("Firebase services initialized");
        
        // Check if user is authenticated
        if (!auth.currentUser) {
            console.log("No user authenticated, showing sign-in message");
            libraryList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #b3b3b3;">
                    <i class="fa fa-sign-in" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                    <h3>Sign in to view your library</h3>
                    <p>Your playlists will appear here after you sign in.</p>
                    <button onclick="document.getElementById('sign-in-btn').click()" 
                            style="background: #1db954; color: #fff; border: none; padding: 12px 24px; border-radius: 25px; margin-top: 15px; cursor: pointer; font-weight: bold;">
                        Sign In Now
                    </button>
                </div>
            `;
            return;
        }

        console.log("User authenticated:", auth.currentUser.email);

        // Load user's playlists from Firebase
        const q = query(
            collection(db, "playlists"),
            where("createdBy", "==", auth.currentUser.uid)
        );
        
        console.log("Query created, fetching playlists...");
        const querySnapshot = await getDocs(q);
        const firebasePlaylists = [];
        
        querySnapshot.forEach((doc) => {
            firebasePlaylists.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log("Playlists fetched:", firebasePlaylists.length);

        // Display playlists
        if (firebasePlaylists.length === 0) {
            libraryList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #b3b3b3;">
                    <i class="fa fa-music" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                    <h3>No playlists yet</h3>
                    <p>Create your first playlist to get started!</p>
                    <button onclick="document.querySelector('a[href=\"#\"] i.fa-plus-square').parentElement.click()" 
                            style="background: #1db954; color: #fff; border: none; padding: 12px 24px; border-radius: 25px; margin-top: 15px; cursor: pointer; font-weight: bold;">
                        Create Playlist
                    </button>
                </div>
            `;
        } else {
            libraryList.innerHTML = firebasePlaylists.map(playlist => `
                <div class="item" data-playlist-id="${playlist.id}" onclick="openPlaylistDetail('${playlist.id}')" style="cursor: pointer;">
                    <img src="${playlist.songs && playlist.songs.length > 0 ? playlist.songs[0].cover : 'imges/apma.png'}" alt="${playlist.name}">
                    <div class="play">
                        <i class="fa fa-play"></i>
                    </div>
                    <h4>${playlist.name}</h4>
                    <p>${playlist.songCount || playlist.songs?.length || 0} songs</p>
                    <div class="playlist-actions">
                        <button class="play-playlist" onclick="event.stopPropagation(); playPlaylist('${playlist.id}')">
                            <i class="fa fa-play"></i> Play
                        </button>
                        <button class="delete-playlist" onclick="event.stopPropagation(); deletePlaylist('${playlist.id}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        console.log("Library display completed successfully");
        
    } catch (error) {
        console.error("Error loading library:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        libraryList.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #b3b3b3;">
                <i class="fa fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px; display: block; color: #e74c3c;"></i>
                <h3>Error loading playlists</h3>
                <p>${error.message}</p>
                <button onclick="displayLibrary()" 
                        style="background: #1db954; color: #fff; border: none; padding: 12px 24px; border-radius: 25px; margin-top: 15px; cursor: pointer; font-weight: bold;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Function to display home content
function displayHome() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="topbar">
            <div class="prev-next-buttons">
                <button type="button" class="fa fa-chevron-left"></button>
                <button type="button" class="fa fa-chevron-right"></button>
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
            <div class="image-container">
                <img src="${song.cover}" alt="${song.title}">
            </div>
            <div class="content">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <div class="play">
                <i class="fa fa-play"></i>
            </div>
        `;
        
        // Add hover effects
        songElement.addEventListener('mouseenter', () => {
            songElement.style.backgroundColor = '#252525';
            songElement.querySelector('.play').style.opacity = '1';
        });
        
        songElement.addEventListener('mouseleave', () => {
            songElement.style.backgroundColor = '#181818';
            songElement.querySelector('.play').style.opacity = '0';
        });

        // Add click event
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
            <div class="image-container">
                <img src="${song.cover}" alt="${song.title}">
            </div>
            <div class="content">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <div class="play">
                <i class="fa fa-play"></i>
            </div>
        `;
        
        // Add hover effects
        songElement.addEventListener('mouseenter', () => {
            songElement.style.backgroundColor = '#252525';
            songElement.querySelector('.play').style.opacity = '1';
        });
        
        songElement.addEventListener('mouseleave', () => {
            songElement.style.backgroundColor = '#181818';
            songElement.querySelector('.play').style.opacity = '0';
        });

        // Add click event
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

    /* Mobile Responsive Styles */
    @media screen and (max-width: 768px) {
        .spotify-playlists .list {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
            gap: 15px !important;
            padding: 15px !important;
        }

        .item {
            padding: 12px !important;
        }

        .item h4 {
            font-size: 14px !important;
        }

        .item p {
            font-size: 12px !important;
        }

        .play {
            width: 35px !important;
            height: 35px !important;
            right: 15px !important;
            bottom: 65px !important;
        }

        .search-header .search-input {
            max-width: 100%;
            font-size: 14px;
            padding: 10px 15px;
        }

        .search-header h2 {
            font-size: 24px;
        }

        .search-section h2 {
            font-size: 20px;
        }

        .topbar {
            padding: 10px 15px;
        }

        .prev-next-buttons button {
            padding: 8px;
            font-size: 14px;
        }
    }

    @media screen and (max-width: 480px) {
        .spotify-playlists .list {
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)) !important;
            gap: 10px !important;
            padding: 10px !important;
        }

        .item {
            padding: 10px !important;
        }

        .item h4 {
            font-size: 13px !important;
            margin-bottom: 5px !important;
        }

        .item p {
            font-size: 11px !important;
        }

        .play {
            width: 30px !important;
            height: 30px !important;
            right: 10px !important;
            bottom: 55px !important;
        }

        .search-header h2 {
            font-size: 20px;
        }

        .search-header .search-input {
            font-size: 13px;
            padding: 8px 12px;
        }

        .search-section h2 {
            font-size: 18px;
        }

        .topbar {
            padding: 8px 12px;
        }

        .prev-next-buttons button {
            padding: 6px;
            font-size: 12px;
        }

        .spotify-playlists h2 {
            font-size: 18px;
            padding: 0 10px;
        }
    }

    /* Additional Mobile Optimizations */
    @media screen and (max-width: 768px) {
        .main-content {
            padding-bottom: 80px; /* Space for player controls */
        }

        .player-controls {
            padding: 10px;
        }

        .progress {
            margin: 0 10px;
        }

        .current-time, .total-time {
            font-size: 12px;
        }

        .player-controls button {
            padding: 8px;
        }

        .player-controls button i {
            font-size: 16px;
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

// Add search display function
function displaySearch() {
    // Clear the main content
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="search-container">
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search for songs, artists...">
            </div>
            <div class="search-results">
                <h2>Search Results</h2>
                <div class="list"></div>
            </div>
        </div>
    `;

    // Add event listener for search input
    const searchInput = document.querySelector('.search-input');
    const searchResultsList = document.querySelector('.search-results .list');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredSongs = songs.filter(song => 
            song.title.toLowerCase().includes(searchTerm) || 
            song.artist.toLowerCase().includes(searchTerm)
        );

        // Clear previous results
        searchResultsList.innerHTML = '';

        // Display filtered results
        filteredSongs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'item';
            songElement.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
                <div class="play">
                    <i class="fa fa-play"></i>
                </div>
            `;

            // Add click event to play the song
            songElement.addEventListener('click', () => {
                currentSongIndex = songs.findIndex(s => s.id === song.id);
                loadSong(currentSongIndex);
                togglePlay();
            });

            searchResultsList.appendChild(songElement);
        });
    });

    // Focus the search input
    searchInput.focus();
}

// Call initMobileFeatures when the page loads
window.addEventListener('load', () => {
    initPlayer();
    initMobileFeatures();
});

// Export functions for use in other modules
export { displayLibrary };

// Make displayLibrary globally available
window.displayLibrary = displayLibrary;

// Firebase playlist playback functionality
let currentPlaylist = null;
let currentPlaylistSongs = [];

// Function to play a playlist (called from playlists.js)
window.playPlaylist = async function(playlistId) {
    try {
        // Import Firebase functions
        const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js");
        const { app } = await import("./auth.js");
        
        const db = getFirestore(app);
        const playlistDoc = await getDoc(doc(db, "playlists", playlistId));
        
        if (playlistDoc.exists()) {
            const playlistData = playlistDoc.data();
            currentPlaylist = playlistId;
            currentPlaylistSongs = playlistData.songs;
            
            // Set the first song as current
            if (currentPlaylistSongs.length > 0) {
                const firstSong = currentPlaylistSongs[0];
                currentSongIndex = songs.findIndex(s => s.id === firstSong.id);
                if (currentSongIndex !== -1) {
                    loadSong(currentSongIndex);
                    togglePlay();
                    
                    // Update UI to show playlist is playing
                    updatePlayerUI();
                    console.log(`Now playing playlist: ${playlistData.name}`);
                }
            }
        } else {
            console.error("Playlist not found");
        }
    } catch (error) {
        console.error("Error playing playlist:", error);
        alert("Error playing playlist: " + error.message);
    }
};

// Override nextSong to work with playlists
const originalNextSong = nextSong;
nextSong = function() {
    if (currentPlaylist && currentPlaylistSongs.length > 0) {
        // Find current song in playlist
        const currentSongInPlaylist = songs[currentSongIndex];
        const currentPlaylistIndex = currentPlaylistSongs.findIndex(s => s.id === currentSongInPlaylist.id);
        
        if (currentPlaylistIndex !== -1) {
            const nextPlaylistIndex = (currentPlaylistIndex + 1) % currentPlaylistSongs.length;
            const nextSongInPlaylist = currentPlaylistSongs[nextPlaylistIndex];
            const nextSongIndex = songs.findIndex(s => s.id === nextSongInPlaylist.id);
            
            if (nextSongIndex !== -1) {
                currentSongIndex = nextSongIndex;
                loadSong(currentSongIndex);
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
                return;
            }
        }
    }
    
    // Fall back to original behavior
    originalNextSong();
};

// Override prevSong to work with playlists
const originalPrevSong = prevSong;
prevSong = function() {
    if (currentPlaylist && currentPlaylistSongs.length > 0) {
        // Find current song in playlist
        const currentSongInPlaylist = songs[currentSongIndex];
        const currentPlaylistIndex = currentPlaylistSongs.findIndex(s => s.id === currentSongInPlaylist.id);
        
        if (currentPlaylistIndex !== -1) {
            const prevPlaylistIndex = currentPlaylistIndex === 0 ? currentPlaylistSongs.length - 1 : currentPlaylistIndex - 1;
            const prevSongInPlaylist = currentPlaylistSongs[prevPlaylistIndex];
            const prevSongIndex = songs.findIndex(s => s.id === prevSongInPlaylist.id);
            
            if (prevSongIndex !== -1) {
                currentSongIndex = prevSongIndex;
                loadSong(currentSongIndex);
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
                return;
            }
        }
    }
    
    // Fall back to original behavior
    originalPrevSong();
};