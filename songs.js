const songs = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        cover: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        cover: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bcd24c20c2d3a3e9",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: 4,
        title: "Someone You Loved",
        artist: "Lewis Capaldi",
        cover: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bcd24c20c2d3a3e9",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: 5,
        title: "Don't Start Now",
        artist: "Dua Lipa",
        cover: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bcd24c20c2d3a3e9",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        id: 6,
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        cover: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bcd24c20c2d3a3e9",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    {
        id: 7,
        title: "Bad Guy",
        artist: "Billie Eilish",
        cover: "https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
    },
    {
        id: 8,
        title: "Circles",
        artist: "Post Malone",
        cover: "https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    },
    {
        id: 9,
        title: "Memories",
        artist: "Maroon 5",
        cover: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
    },
    {
        id: 10,
        title: "Señorita",
        artist: "Shawn Mendes & Camila Cabello",
        cover: "https://i.scdn.co/image/ab67616d0000b273e2e352d5f2e4e4e5e5e5e5e5",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    },
    {
        id: 11,
        title: "Sunflower",
        artist: "Post Malone & Swae Lee",
        cover: "https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3"
    },
    {
        id: 12,
        title: "Shallow",
        artist: "Lady Gaga & Bradley Cooper",
        cover: "https://i.scdn.co/image/ab67616d0000b273e2e352d5f2e4e4e5e5e5e5e5",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
    },
    {
        id: 13,
        title: "Mann Mera",
        artist: "Gajendra Verma",
        cover: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bcd24c20c2d3a3e9",
        file: "songs/Mann Mera (PenduJatt.Com.Se).mp3"
    }
];

// Create playlists
const playlists = [
    {
        id: 1,
        name: "Today's Top Hits",
        cover: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663bb",
        songs: [1, 2, 3, 4, 5]
    },
    {
        id: 2,
        name: "Chill Hits",
        cover: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
        songs: [6, 7, 8, 9, 10]
    },
    {
        id: 3,
        name: "Rock Classics",
        cover: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
        songs: [1, 2, 3, 4, 5, 6]
    },
    {
        id: 4,
        name: "All Out 2010s",
        cover: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
        songs: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 5,
        name: "Pop Mix",
        cover: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
        songs: [1, 3, 5, 7, 9, 11]
    },
    {
        id: 6,
        name: "Hip Hop Mix",
        cover: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
        songs: [2, 4, 6, 8, 10, 12]
    },
    {
        id: 7,
        name: "Bollywood Hits",
        cover: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
        songs: [13]
    }
]; 