import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { app } from "./auth.js"; // Make sure 'app' is exported from auth.js

// Check if Firebase app is properly initialized
if (!app) {
    console.error("Firebase app not initialized");
    throw new Error("Firebase app not initialized");
}

const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const modal = document.getElementById("playlist-modal");
const closeBtn = document.querySelector(".close");
const playlistForm = document.getElementById("playlist-form");
const createBtn = document.getElementById("create-playlist-btn");
const nameInput = document.getElementById("playlist-name");
const descriptionInput = document.getElementById("playlist-description");
const songSelection = document.getElementById("song-selection");
const selectedSongsPreview = document.getElementById("selected-songs-preview");
const selectedCount = document.getElementById("selected-count");
const createPlaylistLink = document.querySelector('a[href="#"] i.fa-plus-square').parentElement;

// Global variables
let selectedSongs = [];
let currentUser = null;

// Initialize playlist functionality
function initPlaylistSystem() {
    // Check if required DOM elements exist
    if (!modal || !closeBtn || !playlistForm || !createBtn || !nameInput || !descriptionInput || !songSelection || !selectedSongsPreview || !selectedCount || !createPlaylistLink) {
        console.error("Required DOM elements not found for playlist system");
        return;
    }
    
    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            console.log("User signed in:", user.displayName);
            loadUserPlaylists();
        } else {
            console.log("User signed out");
            clearPlaylists();
        }
    });

    // Event listeners
    createPlaylistLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Please sign in to create a playlist.");
            return;
        }
        openModal();
    });

    closeBtn.addEventListener("click", closeModal);
    
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    playlistForm.addEventListener("submit", handleCreatePlaylist);
}

// Open playlist creation modal
function openModal() {
    modal.style.display = "block";
    populateSongSelection();
    updateSelectedSongsPreview();
    updateSelectedCount();
    nameInput.focus();
}

// Close playlist creation modal
function closeModal() {
    modal.style.display = "none";
    resetForm();
}

// Reset form
function resetForm() {
    playlistForm.reset();
    selectedSongs = [];
    updateSongSelectionUI();
    updateSelectedSongsPreview();
    updateSelectedCount();
}

// Populate song selection
function populateSongSelection() {
    songSelection.innerHTML = "";
    
    // Check if songs array is available
    if (typeof songs === 'undefined' || !Array.isArray(songs)) {
        songSelection.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #b3b3b3;">
                <i class="fa fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p>Error: Songs not loaded. Please refresh the page.</p>
            </div>
        `;
        return;
    }
    
    // Access songs from the global songs array (defined in songs.js)
    songs.forEach((song, index) => {
        const songItem = document.createElement("div");
        songItem.className = "song-item";
        songItem.dataset.songId = song.id;
        
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
        `;
        
        songItem.addEventListener("click", () => toggleSongSelection(song, songItem));
        songSelection.appendChild(songItem);
    });
}

// Toggle song selection
function toggleSongSelection(song, songItem) {
    const songId = song.id;
    const isSelected = selectedSongs.some(s => s.id === songId);
    
    if (isSelected) {
        selectedSongs = selectedSongs.filter(s => s.id !== songId);
        songItem.classList.remove("selected");
    } else {
        selectedSongs.push(song);
        songItem.classList.add("selected");
    }
    
    updateCreateButton();
    updateSelectedSongsPreview();
    updateSelectedCount();
}

// Update create button state
function updateCreateButton() {
    const hasName = nameInput.value.trim().length > 0;
    const hasSongs = selectedSongs.length > 0;
    
    createBtn.disabled = !hasName || !hasSongs;
}

// Update song selection UI
function updateSongSelectionUI() {
    const songItems = songSelection.querySelectorAll(".song-item");
    songItems.forEach(item => {
        const songId = parseInt(item.dataset.songId);
        const isSelected = selectedSongs.some(s => s.id === songId);
        item.classList.toggle("selected", isSelected);
    });
}

// Update selected songs preview
function updateSelectedSongsPreview() {
    if (selectedSongs.length === 0) {
        selectedSongsPreview.innerHTML = `
            <div class="no-songs-selected">
                <i class="fa fa-music" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                No songs selected yet
            </div>
        `;
        return;
    }
    
    selectedSongsPreview.innerHTML = selectedSongs.map((song, index) => `
        <div class="selected-song-item" data-song-id="${song.id}" draggable="true" data-index="${index}">
            <div class="drag-handle">
                <i class="fa fa-grip-vertical"></i>
            </div>
            <img src="${song.cover}" alt="${song.title}">
            <div class="selected-song-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <button class="remove-song-btn" onclick="removeSelectedSong(${song.id})">
                <i class="fa fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Add drag and drop functionality
    addDragAndDrop();
}

// Add drag and drop functionality for reordering
function addDragAndDrop() {
    const songItems = selectedSongsPreview.querySelectorAll('.selected-song-item');
    
    songItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedItem !== this) {
        const allItems = [...selectedSongsPreview.querySelectorAll('.selected-song-item')];
        const draggedIndex = allItems.indexOf(draggedItem);
        const droppedIndex = allItems.indexOf(this);
        
        // Reorder the selectedSongs array
        const [movedSong] = selectedSongs.splice(draggedIndex, 1);
        selectedSongs.splice(droppedIndex, 0, movedSong);
        
        // Update the preview
        updateSelectedSongsPreview();
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedItem = null;
}

// Update selected count
function updateSelectedCount() {
    selectedCount.textContent = selectedSongs.length;
    
    // Calculate total duration (if available)
    const totalDuration = selectedSongs.reduce((total, song) => {
        // You can add duration property to songs if available
        return total + (song.duration || 0);
    }, 0);
    
    if (totalDuration > 0) {
        const minutes = Math.floor(totalDuration / 60);
        const seconds = totalDuration % 60;
        selectedCount.textContent = `${selectedSongs.length} songs (${minutes}:${seconds.toString().padStart(2, '0')})`;
    }
}

// Remove song from selection (called from HTML)
window.removeSelectedSong = function(songId) {
    selectedSongs = selectedSongs.filter(s => s.id !== songId);
    
    // Update song selection UI
    const songItem = songSelection.querySelector(`[data-song-id="${songId}"]`);
    if (songItem) {
        songItem.classList.remove("selected");
    }
    
    updateCreateButton();
    updateSelectedSongsPreview();
    updateSelectedCount();
};

// Handle playlist creation
async function handleCreatePlaylist(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert("Please sign in to create a playlist.");
        return;
    }
    
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!name) {
        alert("Please enter a playlist name.");
        return;
    }
    
    if (selectedSongs.length === 0) {
        alert("Please select at least one song.");
        return;
    }
    
    try {
        createBtn.disabled = true;
        createBtn.textContent = "Creating...";
        
        // Create playlist document
        const playlistData = {
            name: name,
            description: description || "",
            songs: selectedSongs.map(song => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                cover: song.cover,
                file: song.file
            })),
            createdBy: currentUser.uid,
            createdByEmail: currentUser.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            songCount: selectedSongs.length
        };
        
        const docRef = await addDoc(collection(db, "playlists"), playlistData);
        console.log("Playlist created with ID:", docRef.id);
        
        alert("Playlist created successfully!");
        closeModal();
        loadUserPlaylists(); // Refresh playlists
        
        // Refresh library if it's currently displayed
        refreshLibraryIfOpen();
        
    } catch (error) {
        console.error("Error creating playlist:", error);
        alert("Error creating playlist: " + error.message);
    } finally {
        createBtn.disabled = false;
        createBtn.textContent = "Create Playlist";
    }
}

// Refresh library if it's currently open
function refreshLibraryIfOpen() {
    const mainContent = document.querySelector('.main-content');
    const libraryTitle = mainContent.querySelector('h2');
    
    if (libraryTitle && libraryTitle.textContent === 'Your Library') {
        // Call displayLibrary function directly if it exists globally
        if (typeof window.displayLibrary === 'function') {
            window.displayLibrary();
        } else {
            // Fallback: reload the page to refresh the library
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
}

// Load user's playlists
async function loadUserPlaylists() {
    if (!currentUser) return;
    
    try {
        const q = query(
            collection(db, "playlists"),
            where("createdBy", "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const playlists = [];
        
        querySnapshot.forEach((doc) => {
            playlists.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        displayPlaylists(playlists);
        
    } catch (error) {
        console.error("Error loading playlists:", error);
    }
}

// Display playlists in the UI
function displayPlaylists(playlists) {
    const playlistContainer = document.querySelector('.spotify-playlists .list');
    
    if (playlists.length === 0) {
        playlistContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #b3b3b3;">
                <i class="fa fa-music" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                <h3>No playlists yet</h3>
                <p>Create your first playlist to get started!</p>
            </div>
        `;
        return;
    }
    
    playlistContainer.innerHTML = playlists.map(playlist => `
        <div class="item" data-playlist-id="${playlist.id}" onclick="openPlaylistDetail('${playlist.id}')" style="cursor: pointer;">
            <img src="${playlist.songs.length > 0 ? playlist.songs[0].cover : 'imges/apma.png'}" alt="${playlist.name}">
            <div class="play">
                <i class="fa fa-play"></i>
            </div>
            <h4>${playlist.name}</h4>
            <p>${playlist.songCount} songs</p>
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

// Clear playlists display
function clearPlaylists() {
    const playlistContainer = document.querySelector('.spotify-playlists .list');
    playlistContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #b3b3b3;">
            <i class="fa fa-sign-in" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
            <h3>Sign in to view your playlists</h3>
            <p>Create and manage your playlists after signing in.</p>
        </div>
    `;
}

// Play playlist (to be implemented in script.js)
window.playPlaylist = function(playlistId) {
    // This function will be called from the playlist items
    console.log("Playing playlist:", playlistId);
    // Implementation will be added to script.js
};

// Delete playlist
window.deletePlaylist = async function(playlistId) {
    if (!currentUser) {
        alert("Please sign in to delete playlists.");
        return;
    }
    
    if (!confirm("Are you sure you want to delete this playlist?")) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, "playlists", playlistId));
        alert("Playlist deleted successfully!");
        loadUserPlaylists(); // Refresh playlists
        
        // Refresh library if it's currently displayed
        refreshLibraryIfOpen();
        
    } catch (error) {
        console.error("Error deleting playlist:", error);
        alert("Error deleting playlist: " + error.message);
    }
};

// Add input event listeners for real-time validation
nameInput.addEventListener("input", updateCreateButton);

// Initialize the playlist system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    try {
        initPlaylistSystem();
    } catch (error) {
        console.error("Error initializing playlist system:", error);
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <strong>Playlist System Error</strong><br>
            Please refresh the page to try again.
        `;
        document.body.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
});

// Export functions for use in other modules
export { loadUserPlaylists, displayPlaylists };