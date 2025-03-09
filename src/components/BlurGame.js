import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pixelify } from "react-pixelify";

const modes = {
  advanced: [75, 50, 25],
  intermediate: [60, 40, 15],
  beginner: [40, 20, 5]
};

function zfill(str, length) {
  return String(str).padStart(length, '0');
}

const fetchRandomAlbum = async () => {
  const response = await fetch('/data.json');
  const data = await response.json();
  const albums = data.map(album => {
    const albumName = Object.keys(album)[0];
    const albumData = album[albumName];
    albumData.name = albumName;
    return albumData;
  });
  const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
  const rank = randomAlbum["Rank"];
  const fileName = String(rank).padStart(5, '0');
  const src = `/images/album_covers/${fileName}.jpg`;

  return { albums, randomAlbum, src };
};

function normalizeString(str, symbol=false) {
  if (!str) return '';
  if (symbol)
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  else
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace("&", "and");
}

function BlurGame() {
  const [album, setAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [pixelSize, setPixelSize] = useState(75);
  const [borderColor, setBorderColor] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [mode, setMode] = useState(null); // Initially, no mode is selected
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsIndex, setSuggestionsIndex] = useState(0);
  const [src, setSrc] = useState('');

  useEffect(() => {
    fetchRandomAlbum().then(({ albums, randomAlbum, src }) => {
      setAlbums(albums);
      setAlbum(randomAlbum);
      setSrc(src);
    }).catch(error => {
      console.error('Error fetching random album:', error);
    });
  }, []);

  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleGuess();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, [guess, album]);

  const handleGuess = () => {
    if (
      normalizeString(guess, false) === normalizeString(album.name, false) ||
      normalizeString(guess, true) === normalizeString(album.name, true)
    ) {
      setIsCorrect(true);
      setBorderColor('border-green-500');
      setPixelSize(0);
      setTimeout(() => {
        fetchRandomAlbum().then(({ randomAlbum, src }) => {
          setAlbum(randomAlbum);
          setSrc(src);
          setGuess('');
          setPixelSize(modes[mode][0]);
          setBorderColor('');
          setAttempts(0);
          setIsCorrect(false);
          setSuggestions([]);
        }).catch(error => {
          console.error('Error fetching random album:', error);
        });
      }, 1500);
    } else if (!guess)
      return;
    else {
      setBorderColor('border-red-500');
      setTimeout(() => {
        setBorderColor('');
      }, 300);

      setAttempts(attempts + 1);
      if (attempts < 2) {
        setPixelSize(modes[mode][attempts + 1]);
      } else {
        setPixelSize(0);
        setTimeout(() => {
          fetchRandomAlbum().then(({ randomAlbum, src }) => {
            setAlbum(randomAlbum);
            setSrc(src);
            setGuess('');
            setPixelSize(modes[mode][0]);
            setBorderColor('');
            setAttempts(0);
            setSuggestions([]);
          }).catch(error => {
            console.error('Error fetching random album:', error);
          });
        }, 1500);
      }
    }
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setPixelSize(modes[selectedMode][0]);
    setAttempts(0);
    setGuess('');
    fetchRandomAlbum().then(({ randomAlbum, src }) => {
      setAlbum(randomAlbum);
      setSrc(src);
    }).catch(error => {
      console.error('Error fetching random album:', error);
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setGuess(value);

    if (value) {
      const filteredSuggestions = albums.filter(album =>
        album.name.toLowerCase().includes(value.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setGuess(suggestions[suggestionsIndex].name);
      setSuggestionsIndex(0);
      // if (suggestions.length == 1)
      //   setSuggestionsIndex(0);
      // else if (suggestionsIndex > suggestions.length)
      //   setSuggestionsIndex(suggestions.length);
      // else
      //   setSuggestionsIndex(suggestionsIndex + 1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setGuess(suggestion.name);
    setSuggestions([]);
  };

  if (!mode) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Link to="/" className="absolute top-4 left-4 text-blue-300">Go Back</Link>
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
  if (isCorrect) {
    message = "Correct!";
  } else if (attempts === 0) {
    message = "You have 3 guesses.";
  } else if (attempts >= 3) {
    message = `Out of guesses! The correct answer was <b>${album.name}</b>.`;
  } else {
    message = `You have ${3 - attempts} guesses left.`;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/" className="absolute top-4 left-4 text-blue-300">Go Back</Link>
      <div className="mb-4 text-white text-[25px]" dangerouslySetInnerHTML={{ __html: message }} />
      <div className="mb-4">
        {album && src ? (
          <Pixelify
            src={src}
            pixelSize={pixelSize}
            width={600}
            height={600}
          />
        ) : (
          <div className="w-[600px] h-[600px] bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center relative w-full max-w-md">
        <input
          type="text"
          value={guess}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Album Title..."
          className={`animate-fade outline-none p-2 mb-4 rounded border-4 ${borderColor} w-full`}
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10 max-h-20 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BlurGame;