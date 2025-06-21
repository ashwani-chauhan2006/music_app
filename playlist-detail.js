import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { app } from "./auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const playlistDetailModal = document.getElementById("playlist-detail-modal");
const playlistDetailClose = document.getElementById("playlist-detail-close");
const playlistDetailCover = document.getElementById("playlist-detail-cover");
const playlistDetailName = document.getElementById("playlist-detail-name");
const playlistDetailDescription = document.getElementById("playlist-detail-description");
const playlistDetailStats = document.getElementById("playlist-detail-stats");
const playlistSongsList = document.getElementById("playlist-songs-list");
const playPlaylistBtn = document.getElementById("play-playlist-btn");
const addSongsBtn = document.getElementById("add-songs-btn");

// Add Songs Modal Elements
const addSongsModal = document.getElementById("add-songs-modal");
const addSongsClose = document.getElementById("add-songs-close");
const addSongsSearch = document.getElementById("add-songs-search");
const addSongsSelection = document.getElementById("add-songs-selection");
const addSelectedSongsBtn = document.getElementById("add-selected-songs-btn");
const cancelAddSongsBtn = document.getElementById("cancel-add-songs-btn");

// Global variables
let currentPlaylistId = null;
let currentPlaylistData = null;
let selectedSongsToAdd = [];

// Initialize playlist detail functionality
function initPlaylistDetail() {
    // Event listeners for closing modals
    playlistDetailClose.addEventListener("click", closePlaylistDetail);
    addSongsClose.addEventListener("click", closeAddSongsModal);
    cancelAddSongsBtn.addEventListener("click", closeAddSongsModal);
    
    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === playlistDetailModal) {
            closePlaylistDetail();
        }
        if (e.target === addSongsModal) {
            closeAddSongsModal();
        }
    });
    
    // Play playlist button
    playPlaylistBtn.addEventListener("click", () => {
        if (currentPlaylistId) {
            window.playPlaylist(currentPlaylistId);
            closePlaylistDetail();
        }
    });
    
    // Add songs button
    addSongsBtn.addEventListener("click", openAddSongsModal);
    
    // Add selected songs button
    addSelectedSongsBtn.addEventListener("click", addSelectedSongsToPlaylist);
    
    // Search functionality
    addSongsSearch.addEventListener("input", filterSongs);
}

// Open playlist detail modal
async function openPlaylistDetail(playlistId) {
    try {
        currentPlaylistId = playlistId;
        
        // Show loading state
        playlistDetailModal.style.display = "block";
        playlistSongsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #b3b3b3;">
                <i class="fa fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p>Loading playlist...</p>
            </div>
        `;
        
        // Fetch playlist data from Firebase
        const playlistDoc = await getDoc(doc(db, "playlists", playlistId));
        
        if (!playlistDoc.exists()) {
            throw new Error("Playlist not found");
        }
        
        currentPlaylistData = playlistDoc.data();
        
        // Update modal content
        updatePlaylistDetailUI();
        
        // Load playlist songs
        loadPlaylistSongs();
        
    } catch (error) {
        console.error("Error opening playlist detail:", error);
        playlistSongsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fa fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p>Error loading playlist: ${error.message}</p>
            </div>
        `;
    }
}

// Update playlist detail UI
function updatePlaylistDetailUI() {
    if (!currentPlaylistData) return;
    
    // Set playlist info
    playlistDetailName.textContent = currentPlaylistData.name;
    playlistDetailDescription.textContent = currentPlaylistData.description || "No description";
    playlistDetailStats.textContent = `${currentPlaylistData.songCount || currentPlaylistData.songs?.length || 0} songs`;
    
    // Set playlist cover
    if (currentPlaylistData.songs && currentPlaylistData.songs.length > 0) {
        playlistDetailCover.src = currentPlaylistData.songs[0].cover;
    } else {
        playlistDetailCover.src = "imges/apma.png";
    }
}

// Load playlist songs
function loadPlaylistSongs() {
    if (!currentPlaylistData || !currentPlaylistData.songs) {
        playlistSongsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #b3b3b3;">
                <i class="fa fa-music" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p>No songs in this playlist yet</p>
            </div>
        `;
        return;
    }
    
    if (currentPlaylistData.songs.length === 0) {
        playlistSongsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #b3b3b3;">
                <i class="fa fa-music" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p>No songs in this playlist yet</p>
                <button onclick="openAddSongsModal()" 
                        style="background: #1db954; color: #fff; border: none; padding: 10px 20px; border-radius: 20px; margin-top: 10px; cursor: pointer;">
                    Add Songs
                </button>
            </div>
        `;
        return;
    }
    
    playlistSongsList.innerHTML = currentPlaylistData.songs.map((song, index) => `
        <div class="playlist-song-item" data-song-id="${song.id}">
            <img src="${song.cover}" alt="${song.title}">
            <div class="playlist-song-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <div class="playlist-song-actions">
                <button class="play-song-btn" onclick="playSongFromPlaylist(${song.id})">
                    <i class="fa fa-play"></i> Play
                </button>
                <button class="remove-song-btn" onclick="removeSongFromPlaylist(${song.id})">
                    <i class="fa fa-times"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

// Close playlist detail modal
function closePlaylistDetail() {
    playlistDetailModal.style.display = "none";
    currentPlaylistId = null;
    currentPlaylistData = null;
}

// Open add songs modal
function openAddSongsModal() {
    addSongsModal.style.display = "block";
    selectedSongsToAdd = [];
    populateAddSongsSelection();
    updateAddSelectedSongsButton();
}

// Close add songs modal
function closeAddSongsModal() {
    addSongsModal.style.display = "none";
    selectedSongsToAdd = [];
    addSongsSearch.value = "";
}

// Populate add songs selection
function populateAddSongsSelection() {
    if (typeof songs === 'undefined' || !Array.isArray(songs)) {
        addSongsSelection.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #b3b3b3;">
                <p>Error: Songs not loaded</p>
            </div>
        `;
        return;
    }
    
    // Filter out songs that are already in the playlist
    const existingSongIds = currentPlaylistData?.songs?.map(s => s.id) || [];
    const availableSongs = songs.filter(song => !existingSongIds.includes(song.id));
    
    if (availableSongs.length === 0) {
        addSongsSelection.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #b3b3b3;">
                <p>All songs are already in this playlist</p>
            </div>
        `;
        return;
    }
    
    addSongsSelection.innerHTML = availableSongs.map(song => `
        <div class="song-item" data-song-id="${song.id}">
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
        </div>
    `).join('');
    
    // Add click event listeners
    addSongsSelection.querySelectorAll('.song-item').forEach(item => {
        const songId = parseInt(item.dataset.songId);
        const song = availableSongs.find(s => s.id === songId);
        if (song) {
            item.addEventListener('click', () => toggleSongSelectionForAdd(item, song));
        }
    });
}

// Toggle song selection for adding
function toggleSongSelectionForAdd(songItem, song) {
    const songId = song.id;
    const isSelected = selectedSongsToAdd.some(s => s.id === songId);
    
    if (isSelected) {
        selectedSongsToAdd = selectedSongsToAdd.filter(s => s.id !== songId);
        songItem.classList.remove("selected");
    } else {
        selectedSongsToAdd.push(song);
        songItem.classList.add("selected");
    }
    
    updateAddSelectedSongsButton();
}

// Update add selected songs button
function updateAddSelectedSongsButton() {
    addSelectedSongsBtn.disabled = selectedSongsToAdd.length === 0;
    addSelectedSongsBtn.textContent = `Add Selected Songs (${selectedSongsToAdd.length})`;
}

// Filter songs in add songs modal
function filterSongs() {
    const searchTerm = addSongsSearch.value.toLowerCase();
    const songItems = addSongsSelection.querySelectorAll('.song-item');
    
    songItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const artist = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add selected songs to playlist
async function addSelectedSongsToPlaylist() {
    if (!currentPlaylistId || selectedSongsToAdd.length === 0) return;
    
    try {
        addSelectedSongsBtn.disabled = true;
        addSelectedSongsBtn.textContent = "Adding...";
        
        // Update playlist in Firebase
        const playlistRef = doc(db, "playlists", currentPlaylistId);
        await updateDoc(playlistRef, {
            songs: arrayUnion(...selectedSongsToAdd),
            songCount: (currentPlaylistData.songCount || currentPlaylistData.songs?.length || 0) + selectedSongsToAdd.length,
            updatedAt: serverTimestamp()
        });
        
        // Refresh playlist data
        const playlistDoc = await getDoc(playlistRef);
        currentPlaylistData = playlistDoc.data();
        
        // Update UI
        updatePlaylistDetailUI();
        loadPlaylistSongs();
        
        // Close add songs modal
        closeAddSongsModal();
        
        console.log(`Added ${selectedSongsToAdd.length} songs to playlist`);
        
    } catch (error) {
        console.error("Error adding songs to playlist:", error);
        alert("Error adding songs to playlist: " + error.message);
    } finally {
        addSelectedSongsBtn.disabled = false;
        updateAddSelectedSongsButton();
    }
}

// Remove song from playlist
async function removeSongFromPlaylist(songId) {
    if (!currentPlaylistId || !currentPlaylistData) return;
    
    if (!confirm("Are you sure you want to remove this song from the playlist?")) {
        return;
    }
    
    try {
        const songToRemove = currentPlaylistData.songs.find(s => s.id === songId);
        if (!songToRemove) return;
        
        // Update playlist in Firebase
        const playlistRef = doc(db, "playlists", currentPlaylistId);
        await updateDoc(playlistRef, {
            songs: arrayRemove(songToRemove),
            songCount: (currentPlaylistData.songCount || currentPlaylistData.songs?.length || 0) - 1,
            updatedAt: serverTimestamp()
        });
        
        // Refresh playlist data
        const playlistDoc = await getDoc(playlistRef);
        currentPlaylistData = playlistDoc.data();
        
        // Update UI
        updatePlaylistDetailUI();
        loadPlaylistSongs();
        
        console.log("Song removed from playlist");
        
    } catch (error) {
        console.error("Error removing song from playlist:", error);
        alert("Error removing song from playlist: " + error.message);
    }
}

// Play song from playlist
function playSongFromPlaylist(songId) {
    if (typeof window.currentSongIndex !== 'undefined' && typeof window.loadSong === 'function') {
        const songIndex = songs.findIndex(s => s.id === songId);
        if (songIndex !== -1) {
            window.currentSongIndex = songIndex;
            window.loadSong(songIndex);
            window.togglePlay();
            closePlaylistDetail();
        }
    }
}

// Make functions globally available
window.openPlaylistDetail = openPlaylistDetail;
window.removeSongFromPlaylist = removeSongFromPlaylist;
window.playSongFromPlaylist = playSongFromPlaylist;
window.openAddSongsModal = openAddSongsModal;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initPlaylistDetail); 