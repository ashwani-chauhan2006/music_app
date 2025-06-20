const songs = [
    {
        id: 1,
        title: "Mann Mera",
        artist: "Gajendra Verma",
        cover: "imges/mann mera.jpg",
        file: "songs/Mann Mera - Table No. 21 - Table No 21 2013 128KBPS.mp3"
    },
    {
        id: 2,
        title: "Mast Magan",
        artist: "Arijit Singh",
        cover: "imges/2states.jpg",
        file: "songs/Mast Magan - 2 States - 2 States 2014 128KBPS.mp3"
    },
    {
        id: 3,
        title: "Vele",
        artist: "Neha Kakkar",
        cover: "imges/student of the year.jpg  ",
        file: "songs/Vele - Student of the Year - Student of the Year 2012 128KBPS.mp3"
    },
    {
        id: 4,
        title: "Saaiyaan",
        artist: "Kailash Kher",
        cover: "imges/gunday.jpg",
        file: "songs/Saaiyaan - Gunday - Gunday 2014 128KBPS.mp3"
    },
    {
        id: 5,
        title: "Pani Da Rang",
        artist: "Ayushmann Khurrana",
        cover: "imges/vicky donor.jpg",
        file: "songs/Pani Da Rang Male - Vicky Donor - Vicky Donor 2012 128KBPS.mp3"
    },
    {
        id: 6,
        title: "Tum Jo Aaye",
        artist: "Rahat Fateh Ali Khan",
        cover: "imges/once upon a time in mumbai.jpg",
        file: "songs/Tum Jo Aaye Jindagi - Once Upon A Time In Mumbaai - Once Upon A Time In Mumbaai 2010 128KBPS.mp3"
    },
    {
        id: 7,
        title: "Ramta Jogi",
        artist: "Sukhwinder Singh",
        cover: "imges/ramta jogi.jpg",
        file: "songs/Ramta Jogi - Taal - Taal 1999 128KBPS.mp3"
    },
    {
        id: 8,
        title: "Hua Hain Aaj Pehli Baar",
        artist: "Arijit Singh",
        cover: "imges/sanam re.jpg",
        file: "songs/Hua Hain Aaj Pehli Baar - Sanam Re - Sanam Re 2016 128KBPS.mp3"
    },
    {
        id: 9,
        title: "Bhula Dena",
        artist: "Mustafa Zahid",
        cover: "imges/Aashiqui 2.jpg",
        file: "songs/Bhula Dena - Aashiqui 2 - Aashiqui 2 2013 128KBPS.mp3"
    },
    {
        id: 10,
        title: "Kabhi Jo Baadal Barse",
        artist: "Arijit Singh",
        cover: "imges/arijit singh.jpg",
        file: "songs/Kabhi Jo Baadal Barse - Jackpot - Jackpot 2013 128KBPS.mp3"
    },
    {
        id: 11,
        title: "Uska Hi Banana",
        artist: "Rahat Fateh Ali Khan",
        cover: "imges/arijit singh.jpg",
        file: "songs/Uska Hi Banana - 1920 Evil Returns - 1920 Evil Returns 2012 128KBPS.mp3"
    },
    {
        id: 12,
        title: "Mat Aazma Re",
        artist: "Arijit Singh",
        cover: "imges/murder 3.jpg",
        file: "songs/Mat Aazma Re - Murder 3 - Murder 3 2013 128KBPS.mp3"
    },
    {
        id: 13,
        title: "Senorita",
        artist: "Farhan Akhtar",
        cover: "imges/jindagi na milegi dobara.jpg",
        file: "songs/Senorita - Zindagi Na Milegi Dobara - Zindagi Na Milegi Dobara 2011 128KBPS.mp3"
    },
    {
        id: 14,
        title: "Chahun Main Ya Naa",
        artist: "Arijit Singh",
        cover: "imges/Aashiqui 2.jpg",
        file: "songs/Chahun Main Ya Naa - Aashiqui 2 - Aashiqui 2 2013 128KBPS.mp3"
    },
    {
        id: 15,
        title: "Kya Mujhe Pyar Hai",
        artist: "KK",
        cover: "imges/kk.jpg",
        file: "songs/Kya Mujhe Pyar Hai - Woh Lamhe - Woh Lamhe 2006 128KBPS.mp3"
    },
    {
        id: 16,
        title: "Sunn Raha Hai",
        artist: "Ankit Tiwari",
        cover: "imges/Aashiqui 2.jpg",
        file: "songs/Sunn Raha Hai Male - Aashiqui 2 - Aashiqui 2 2013 128KBPS.mp3"
    },
    {
        id: 17,
        title: "Tu Hai Ki Nahi",
        artist: "Arijit Singh",
        cover: "imges/roy.jpg",
        file: "songs/Tu Hai Ki Nahi - Roy - Roy 2015 128KBPS.mp3"
    },
    {
        id: 18,
        title: "Dekhte Dekhte",
        artist: "Atif Aslam",
        cover: "imges/bati gul.jpg",
        file: "songs/Dekhte Dekhte - Batti Gul Meter Chalu - Batti Gul Meter Chalu 2018 128KBPS.mp3"
    },
    {
        id: 19,
        title: "Zaroorat",
        artist: "Mustafa Zahid",
        cover: "imges/ek villain.jpg",
        file: "songs/Zaroorat - Ek Villain - Ek Villain 2014 128KBPS.mp3"
    },
    {
        id: 20,
        title: "Isq Risk",
        artist: "Rahat Fateh Ali Khan",
        cover: "imges/isq risk.jpg",
        file: "songs/Isq Risk - Mere Brother Ki Dulhan - Mere Brother Ki Dulhan 2011 128KBPS.mp3"
    },
    {
        id: 21,
        title: "Ajj Din Chadheya",
        artist: "Rahat Fateh Ali Khan",
        cover: "imges/love aaj kal.jpg",
        file: "songs/Ajj Din Chadheya - Love Aaj Kal - Love Aaj Kal 2009 128KBPS.mp3"
    },
    {
        id: 22,
        title: "Kaun Tujhe",
        artist: "Palak Muchhal",
        cover: "imges/ms dhoni.jpg",
        file: "songs/Kaun Tujhe - M.S. Dhoni - M.S. Dhoni - The Untold Story 2016 128KBPS.mp3"
    },
    {
        id: 23,
        title: "Chaiyya Chaiyya",
        artist: "Sukhwinder Singh",
        cover: "imges/chaiya chaiya.jpg",
        file: "songs/Chaiyya Chaiyya - Dil Se - Dil Se 1998 128KBPS.mp3"
    },
    {
        id: 24,
        title: "Meri Mehbooba",
        artist: "Kumar Sanu",
        cover: "imges/pardes.jpg",
        file: "songs/Meri Mehbooba - Pardes - Pardes 1997 128KBPS.mp3"
    },
    {
        id: 25,
        title: "Dil Diwane Ka Dola",
        artist: "Kumar Sanu",
        cover: "imges/dil deewane ka dola.jpg",
        file: "songs/Dil Diwane Ka Dola Dildar Ke Liye - Tahalka - Tahalka 1992 128KBPS.mp3"
    },
    {
        id: 26,
        title: "Bewajah",
        artist: "Arijit Singh",
        cover: "imges/sanam teri kasam.jpg",
        file: "songs/Bewajah - Sanam Teri Kasam - Sanam Teri Kasam 2016 128KBPS.mp3"
    },
    {
        id: 27,
        title: "Teri Yaadon Mein",
        artist: "KK",
        cover: "imges/the killer.jpg",
        file: "songs/Teri Yaadon Mein - The Killer - The Killer 2006 128KBPS.mp3"
    },
    {
        id: 28,
        title: "Labon Ko",
        artist: "KK",
        cover: "imges/bhul bhulaiyaa.jpg",
        file: "songs/Labon Ko - Bhool Bhulaiyaa - Bhool Bhulaiyaa 2007 128KBPS.mp3"
    },
    {
        id: 29,
        title: "Sajde",
        artist: "Kishore Kumar",
        cover: "imges/sajde.jpg",
        file: "songs/Sajde – Kill Dil.mp3"
    },
    {
        id: 30,
        title: "Khairiyat",
        artist: "Pritam",
        cover: "imges/chhichorre.jpg",
        file: "songs/07 - Khairiyat (Sad) - Chhichhore (2019).mp3"
    },
    {
        id: 31,
        title: "Peecha Choote",
        artist: "RV",
        cover: "imges/ramaiya vastavaiya.jpg",
        file: "songs/RV-Peecha Choote.mp3"
    },
    {
        id: 32,
        title: "Jeene Laga Hoon",
        artist: "RV",
        cover: "imges/ramaiya vastavaiya.jpg",
        file: "songs/RV-Jeene Laga Hoon.mp3"
    },
    {
        id: 33,
        title: "Challa",
        artist: "Rahat Fateh Ali Khan",
        cover: "imges/jab tak hai jaan.jpg",
        file: "songs/JTHJ 2012 - Challa.mp3"
    },
    {
        id: 34,
        title: "Hasi",
        artist: "Arijit Singh",
        cover: "imges/adhuri.jpg",
        file: "songs/HAK - Hasi.mp3"
    },
    {
        id: 35,
        title: "Hamari Adhuri Kahani",
        artist: "Arijit Singh",
        cover: "imges/adhuri.jpg",
        file: "songs/HAK - Hamari Adhuri Kahani.mp3"
    },
    {
        id: 36,
        title: "Zinda",
        artist: "Siddharth Mahadevan",
        cover: "imges/bhaag milkha baag.jpg",
        file: "songs/BMB 2013 - Zinda.mp3"
    },
    {
        id: 37,
        title: "Mera Yaar",
        artist: "Amit Trivedi",
        cover: "imges/bhaag milkha baag.jpg",
        file: "songs/BMB 2013 - Mera Yaar.mp3"
    },
    {
        id: 38,
        title: "Maston Ka Jhund",
        artist: "Amit Trivedi",
        cover: "imges/bhaag milkha baag.jpg",
        file: "songs/BMB 2013 - Maston Ka Jhund.mp3"
    },
    {
        id: 39,
        title: "O Rangrez",
        artist: "Amit Trivedi",
        cover: "imges/bhaag milkha baag.jpg",
        file: "songs/BMB 2013 - O Rangrez.mp3"
    },
    {
        id: 40,
        title: "Slow Motion Angreza",
        artist: "Amit Trivedi",
        cover: "imges/bhaag milkha baag.jpg",
        file: "songs/BMB 2013 - Slow Motion Angreza.mp3"
    },
    {
        id: 41,
        title: "Phir Bhi Tumko Chaahunga",
        artist: "Arijit Singh",
        cover: "imges/half girlfriend.jpg",
        file: "songs/HG 2017 - Phir Bhi Tumko Chaahunga.mp3"
    },
    {
        id: 42,
        title: "Tune Jo Na Kaha",
        artist: "Mohit Chauhan",
        cover: "imges/new york.jpg",
        file: "songs/New York - Tune Jo Na Kaha.mp3"
    },
    {
        id: 43,
        title: "Teri Mere Kahaani",
        artist: "Arijit Singh",
        cover: "imges/gabbar is back.jpg",
        file: "songs/GIB - Teri Mere Kahaani.mp3"
    },
    {
        id: 44,
        title: "Mere Rashke Qamar",
        artist: "Rahat Fateh Ali Khan",
        cover: "imges/baadshaho.jpg",
        file: "songs/Baadshaho 2017 - Mere Rashke Qamar.mp3"
    },
    {
        id: 45,
        title: "Pani Da Rang",
        artist: "Ayushmann Khurrana",
        cover: "imges/vicky donor.jpg",
        file: "songs/Vicky Donor-Pani Da Rang(Male).mp3"
    },
    {
        id: 46,
        title: "Mile Ho Tum",
        artist: "Neha Kakkar",
        cover: "imges/fever.jpg",
        file: "songs/Fever 2016 - Mile Ho Tum.mp3"
    },
    {
        id: 47,
        title: "Mile Ho Tum (Reprise)",
        artist: "Neha Kakkar",
        cover: "imges/fever.jpg",
        file: "songs/Fever 2016 - Mile Ho Tum (Reprise).mp3"
    },
    {
        id: 48,
        title: "Dil To Bachcha Hai",
        artist: "Rahat Fateh Ali Khan",
        cover: "imges/ishqiya.jpg",
        file: "songs/Ishqiya-Dil To Bachcha Hai.mp3"
    },
    {
        id: 49,
        title: "Shayad (Reprise)",
        artist: "Pritam",
        cover: "imges/love ajj kal.jpg",
        file: "songs/07 - Shayad (Reprise) - Love Aaj Kal (2020).mp3"
    }
];

// Create playlists
const playlists = [
    {
        id: 1,
        name: "Bollywood Hits",
        cover: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
        songs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
    }
]; 