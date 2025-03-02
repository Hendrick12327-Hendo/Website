import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { albumInfo } from '../data';
import { Pixelify } from "react-pixelify";

const albumImages = require.context('../images/albums', false, /\.(jpg|jpeg|png)$/).keys().map(require.context('../images/albums', false, /\.(jpg|jpeg|png)$/));

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

function normalizeString(str, symbol=false) {
  if (symbol)
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  else
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace("&", "and");
}

const modes = {
  advanced: [75, 50, 25],
  intermediate: [60, 40, 15],
  beginner: [40, 20, 5]
};

function BlurGame() {
  const [album, setAlbum] = useState(getRandomAlbum({ image: null }));
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [pixelSize, setPixelSize] = useState(75);
  const [borderColor, setBorderColor] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [mode, setMode] = useState(null); // Initially, no mode is selected

  const handleGuess = () => {
    if (
      normalizeString(guess, false) === normalizeString(album.info.title, false) ||
      normalizeString(guess, true) === normalizeString(album.info.title, true)
    ) {
      setIsCorrect(true);
      setBorderColor('border-green-500');
      setPixelSize(0);
      setTimeout(() => {
        setAlbum(getRandomAlbum(album));
        setGuess('');
        setPixelSize(modes[mode][0]);
        setBorderColor('');
        setAttempts(0);
        setIsCorrect(false);
      }, 1500); // Milliseconds, 1000 ms = 1 second
    } else if (!guess)
      return;
    else {
      setBorderColor('border-red-500');
      setTimeout(() => {
        setBorderColor('');
      }, 300); // Flash red for 1 second

      setAttempts(attempts + 1);
      if (attempts < 2) {
        setPixelSize(modes[mode][attempts + 1]);
      } else {
        setPixelSize(0);
        setTimeout(() => {
          setAlbum(getRandomAlbum(album));
          setGuess('');
          setPixelSize(modes[mode][0]);
          setBorderColor('');
          setAttempts(0);
        }, 1500); // Milliseconds, 1000 ms = 1 second
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setPixelSize(modes[selectedMode][0]);
    setAttempts(0);
    setGuess('');
    setAlbum(getRandomAlbum({ image: null }));
  };

  if (!mode) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-white text-[35px] mb-4">Select Mode</h1>
        <div className="flex space-x-4">
          <button onClick={() => handleModeSelect('advanced')} className="bg-emerald-600 text-white p-4 rounded-md hover:bg-emerald-700">
            Advanced
          </button>
          <button onClick={() => handleModeSelect('intermediate')} className="bg-emerald-600 text-white p-4 rounded-md hover:bg-emerald-700">
            Intermediate
          </button>
          <button onClick={() => handleModeSelect('beginner')} className="bg-emerald-600 text-white p-4 rounded-md hover:bg-emerald-700">
            Beginner
          </button>
        </div>
      </div>
    );
  }

  let message;
  if (attempts === 0) {
    message = "You have 3 guesses.";
  } else if (attempts >= 3) {
    message = `Out of guesses! The correct answer was <b>${album.info.title}</b>.`;
  } else if (isCorrect) {
    message = "Correct!";
  } else {
    message = `You have ${3 - attempts} guesses left.`;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4 text-white text-[25px]" dangerouslySetInnerHTML={{ __html: message }} />
      <div className="mb-4">
        <Pixelify
          src={album.image}
          pixelSize={pixelSize}
          width={600}
          height={600}
        />
      </div>
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Album Title..."
          className={`animate-fade outline-none p-2 mb-4 rounded border-4 ${borderColor}`}
        />
        <Link to="/" className="text-blue-300 mb-4">Go Back</Link>
      </div>
    </div>
  );
}

export default BlurGame;