# APMA Music Player

A Spotify-like music player with Firebase integration for playlist management.

## Features

- 🎵 Music playback with full player controls
- 📱 Responsive design for mobile and desktop
- 🔐 Google authentication with Firebase
- 📋 Create and manage playlists
- 🔍 Search functionality
- 🎨 Modern UI with smooth animations

## Firebase Integration

This app uses Firebase for:

- **Authentication**: Google Sign-in
- **Firestore Database**: Store user playlists
- **Real-time updates**: Playlist synchronization

## How to Use Playlists

### Creating a Playlist

1. Sign in with your Google account
2. Click "Create Playlist" in the sidebar
3. Enter a playlist name and optional description
4. Select songs from the available library
5. Click "Create Playlist" to save to Firebase

### Managing Playlists

- **Play**: Click the play button on any playlist to start playback
- **Delete**: Hover over a playlist and click the trash icon to delete
- **View**: Your playlists are automatically loaded when you sign in

### Playlist Playback

- When playing a playlist, the next/previous buttons will navigate through the playlist
- Playlists are stored in Firebase and persist across sessions
- Each user can only see and manage their own playlists

## Firebase Setup

The app is already configured with Firebase. The configuration includes:

- Authentication (Google Sign-in)
- Firestore Database
- Security rules for user data isolation

## File Structure

```
spotify/
├── index.html          # Main HTML file
├── style.css           # Styles and responsive design
├── script.js           # Main player functionality
├── songs.js            # Song library data
├── auth.js             # Firebase authentication
├── playlists.js        # Playlist management with Firebase
├── songs/              # Audio files
└── imges/              # Album covers
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore)
- **UI**: Font Awesome icons
- **Audio**: HTML5 Audio API

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Local Development

1. Clone or download the project
2. Open `index.html` in a web browser
3. Sign in with Google to access playlist features
4. Start creating and managing your playlists!

## Firebase Data Structure

### Playlists Collection

```javascript
{
  name: "Playlist Name",
  description: "Optional description",
  songs: [
    {
      id: 1,
      title: "Song Title",
      artist: "Artist Name",
      cover: "path/to/cover.jpg",
      file: "path/to/song.mp3"
    }
  ],
  createdBy: "user_uid",
  createdByEmail: "user@example.com",
  createdAt: timestamp,
  updatedAt: timestamp,
  songCount: 5
}
```

## Security

- Users can only access their own playlists
- Authentication is required for playlist operations
- Data is validated before saving to Firebase

## Setup Instructions

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Add your music files:

   - Place your music files in the appropriate directory
   - Update the `songs.js` file with your song information

3. Open the project:
   - Use a local server to run the project
   - Access through your web browser

## Usage

### Playing Music

- Click on any song to start playing
- Use the player controls to manage playback:
  - Play/Pause
  - Next/Previous track
  - Shuffle
  - Repeat
- View current song information and progress

### Navigation

- Use the sidebar to navigate between different sections
- Access Home, Search, and Library
- Create playlists and view liked songs
- Browse all songs in your collection

## Project Structure

```
spotify/
├── index.html          # Main HTML file
├── script.js          # Main JavaScript file
├── songs.js           # Song data and playlist information
├── style.css          # Stylesheet
├── imges/             # Images directory
│   └── apma.png       # Logo
└── songs/             # Music files directory
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
- Font Awesome for the beautiful icons
- All the artists whose music is featured in the demo
