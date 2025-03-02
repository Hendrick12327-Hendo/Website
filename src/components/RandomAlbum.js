import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { albumInfo } from '../data';

// Use require.context to dynamically load all images from the directory
const albumImages = require.context('../images/albums', false, /\.(jpg|jpeg|png)$/).keys().map(require.context('../images/albums', false, /\.(jpg|jpeg|png)$/));

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