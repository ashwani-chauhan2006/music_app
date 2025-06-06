# Spotify Clone

A modern web-based music player inspired by Spotify, built with HTML, CSS, and JavaScript. This application provides a seamless music listening experience with features like playlists, search functionality, and user authentication.

## Features

### Music Player
- Play/Pause, Next/Previous track controls
- Progress bar with seek functionality
- Shuffle and repeat modes
- Current song information display
- Volume control

### Playlists
- Create and manage custom playlists
- Add/remove songs from playlists
- Pre-made playlists (Sad Songs, Bollywood Hits, Romantic Hits)
- Playlist cover images and song counts

### User Interface
- Responsive design that works on desktop and mobile
- Modern, Spotify-like dark theme
- Sidebar navigation
- Search functionality
- Mobile-friendly menu

### User Features
- Google Sign-in integration
- User-specific playlists
- Library management
- Search across songs and playlists

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Set up Firebase:
   - Create a Firebase project
   - Enable Google Authentication
   - Add your Firebase configuration to the project

3. Configure Firebase:
   - Replace the Firebase configuration in `script.js` with your own:
   ```javascript
   const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-auth-domain",
       projectId: "your-project-id",
       storageBucket: "your-storage-bucket",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id",
       measurementId: "your-measurement-id"
   };
   ```

4. Add your music files:
   - Place your music files in the `songs` directory
   - Update the `songs.js` file with your song information

5. Open the project:
   - Use a local server to run the project
   - Access through your web browser

## Usage

### Playing Music
- Click on any song to start playing
- Use the player controls to manage playback
- Create playlists to organize your music
- Use the search bar to find specific songs or playlists

### Managing Playlists
1. Create a new playlist:
   - Click "Create Playlist" in the sidebar
   - Enter a name for your playlist

2. Add songs to a playlist:
   - Go to the playlist
   - Click "Add Song"
   - Select songs to add

3. Remove songs from a playlist:
   - Go to the playlist
   - Click the remove button on any song

### User Account
- Sign in with Google to access your playlists
- Your playlists are saved to your account
- Access your library from any device

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase (Authentication & Database)
- Google Authentication

## Project Structure

```
spotify-clone/
├── index.html
├── script.js
├── songs.js
├── styles.css
├── songs/
│   └── [music files]
└── imges/
    └── [cover images]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spotify for the design inspiration
- Firebase for backend services
- All the artists whose music is featured in the demo 