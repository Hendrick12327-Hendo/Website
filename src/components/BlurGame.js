import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Use require.context to dynamically load all images from the directory
const albumImages = require.context('../images/albums', false, /\.(jpg|jpeg|png)$/).keys().map(require.context('../images/albums', false, /\.(jpg|jpeg|png)$/));

// Array of album information
const albumInfo = [
  {
    title: 'Max & Match',
    artist: '이달의 소녀 오드아이써클 [LOONA ODD EYE CIRCLE]',
    blurGameEligible: false
  },
  {
    title: 'Fôrça bruta',
    artist: 'Jorge Ben',
    blurGameEligible: true
  },
  {
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    blurGameEligible: true
  },
  {
    title: 'Loveless',
    artist: 'My Bloody Valentine',
    blurGameEligible: true
  },
];

function getRandomAlbum(currentAlbum) {
  const eligibleAlbums = albumInfo.filter(album => album.blurGameEligible);
  const eligibleImages = eligibleAlbums.map(album => albumImages[albumInfo.indexOf(album)]);
  let newAlbum;
  do {
    const randomIndex = Math.floor(Math.random() * eligibleAlbums.length);
    newAlbum = { image: eligibleImages[randomIndex], info: eligibleAlbums[randomIndex] };
  } while (newAlbum.image === currentAlbum.image);
  return newAlbum;
}

function normalizeString(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function BlurGame() {
  const [album, setAlbum] = useState(getRandomAlbum({ image: null }));
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');

  const handleGuess = () => {
    if (normalizeString(guess) === normalizeString(album.info.title)) {
      setMessage('Correct!');
      setTimeout(() => {
        setAlbum(getRandomAlbum(album));
        setGuess('');
        setMessage('');
      }, 1000); // Wait 1 second before loading a new album
    } else {
      setMessage('Try Again!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <img src={album.image} alt="Blurred Album" className="w-1/2 h-auto mt-[-300px] transform scale-[0.35]" style={{ filter: 'blur(40px)' }} />
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Album Title..."
        className="p-2 mb-4 mt-[-250px] border rounded"
      />
      <p className="text-white mb-4">{message}</p>
      <Link to="/" className="text-blue-300 mb-4">Go Back</Link>
    </div>
  );
}

export default BlurGame;