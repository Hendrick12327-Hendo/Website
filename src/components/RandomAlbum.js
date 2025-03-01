import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Use require.context to dynamically load all images from the directory
const albumImages = require.context('../images/albums', false, /\.(jpg|jpeg|png)$/).keys().map(require.context('../images/albums', false, /\.(jpg|jpeg|png)$/));

// Array of album information
const albumInfo = [
  {
    title: 'Max & Match',
    artist: '이달의 소녀 오드아이써클 [LOONA ODD EYE CIRCLE]',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/1',
      appleMusic: 'https://music.apple.com/album/1',
      rateYourMusic: 'https://rateyourmusic.com/release/album/1'
    }
  },
  {
    title: 'Fôrça bruta',
    artist: 'Jorge Ben',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/2',
      appleMusic: 'https://music.apple.com/album/2',
      rateYourMusic: 'https://rateyourmusic.com/release/album/2'
    }
  },
  {
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/3',
      appleMusic: 'https://music.apple.com/album/3',
      rateYourMusic: 'https://rateyourmusic.com/release/album/3'
    }
  },
  {
    title: 'Loveless',
    artist: 'My Bloody Valentine',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/4',
      appleMusic: 'https://music.apple.com/album/4',
      rateYourMusic: 'https://rateyourmusic.com/release/album/4'
    }
  },
];

function getRandomAlbum(currentAlbum) {
  let newAlbum;
  do {
    const randomIndex = Math.floor(Math.random() * albumImages.length);
    newAlbum = albumImages[randomIndex];
  } while (newAlbum === currentAlbum);
  return newAlbum;
}

function getAlbumInfo(album) {
  const index = albumImages.indexOf(album);
  return albumInfo[index];
}

function RandomAlbum() {
  const [album, setAlbum] = useState(getRandomAlbum(null));
  const [info, setInfo] = useState(getAlbumInfo(album));

  const handleNewAlbum = () => {
    const newAlbum = getRandomAlbum(album);
    setAlbum(newAlbum);
    setInfo(getAlbumInfo(newAlbum));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <img src={album} alt="Random Album" className="w-1/2 h-auto mb-4 mt-[-500px] transform scale-[0.35]" />
      <div className="text-center mb-4 mt-[-300px]">
        <h2 className="text-2xl font-bold text-white">{info.title}</h2>
        <p className="text-xl text-white">{info.artist}</p>
      </div>
      <button onClick={handleNewAlbum} className="bg-emerald-600 text-white p-4 rounded-md mb-4 hover:bg-emerald-700">
        Give Me Another Album
      </button>
      <Link to="/" className="text-blue-300 mb-4">Go Back</Link>
    </div>
  );
}

export default RandomAlbum;