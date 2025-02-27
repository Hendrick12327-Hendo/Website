import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Use require.context to dynamically load all images from the directory
const albumImages = require.context('../images/albums', false, /\.(jpg|jpeg|png)$/).keys().map(require.context('../images/albums', false, /\.(jpg|jpeg|png)$/));

// Array of album information
const albumInfo = [
  {
    title: 'Album 1',
    artist: 'Artist 1',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/1',
      appleMusic: 'https://music.apple.com/album/1',
      rateYourMusic: 'https://rateyourmusic.com/release/album/1'
    }
  },
  {
    title: 'Album 2',
    artist: 'Artist 2',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/2',
      appleMusic: 'https://music.apple.com/album/2',
      rateYourMusic: 'https://rateyourmusic.com/release/album/2'
    }
  },
  {
    title: 'Album 3',
    artist: 'Artist 3',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/2',
      appleMusic: 'https://music.apple.com/album/2',
      rateYourMusic: 'https://rateyourmusic.com/release/album/2'
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
    <div className="flex flex-col items-center justify-center mt-[-200px]">
      <img src={album} alt="Random Album" className="w-1/2 h-auto mb-4 mt-[-20px] transform scale-[0.35]" />
      <div className="text-center mb-4 mt-[-300px]">
        <h2 className="text-2xl font-bold text-white">{info.title}</h2>
        <p className="text-xl text-white">{info.artist}</p>
        <div className="flex justify-center space-x-4">
          <a href={info.streamingLinks.spotify} className="text-blue-500" target="_blank" rel="noopener noreferrer">Spotify</a>
          <a href={info.streamingLinks.appleMusic} className="text-blue-500" target="_blank" rel="noopener noreferrer">Apple Music</a>
          <a href={info.streamingLinks.rateYourMusic} className="text-blue-500" target="_blank" rel="noopener noreferrer">Rate Your Music</a>
        </div>
      </div>
      <button onClick={handleNewAlbum} className="bg-blue-500 text-white p-4 rounded mb-4">
        Give me a Random Album
      </button>
      <Link to="/" className="text-blue-500">Go Back</Link>
    </div>
  );
}

export default RandomAlbum;