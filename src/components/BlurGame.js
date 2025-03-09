import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pixelify } from "react-pixelify";

const fetchAlbums = async () => {
  const response = await fetch('/data.json');
  const data = await response.json();
  return data.map(album => {
    const albumName = Object.keys(album)[0];
    const albumData = album[albumName];
    albumData.name = albumName;
    return albumData;
  });
};

const fetchRandomAlbum = (albums, mode, shownAlbums) => {
  let filteredAlbums = albums;

  if (mode === 'Discogs') {
    filteredAlbums = albums.filter(album => album.Rank <= 500); // Filter albums with rank 500 or higher
  } else if (mode === 'RYM') {
    filteredAlbums = albums.filter(album => album.RYM === true); // Filter albums with RYM: true
  }

  const availableAlbums = filteredAlbums.filter(album => !shownAlbums.includes(album.name));

  if (availableAlbums.length === 0) {
    shownAlbums.length = 0; // Reset shown albums if all have been shown
    return fetchRandomAlbum(albums, mode, shownAlbums);
  }

  const randomAlbum = availableAlbums[Math.floor(Math.random() * availableAlbums.length)];
  const rank = randomAlbum["Rank"];
  const fileName = String(rank).padStart(5, '0');
  const src = `/images/album_covers/${fileName}.jpg`;

  shownAlbums.push(randomAlbum.name);

  return { randomAlbum, src };
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
  const [mode, setMode] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsIndex, setSuggestionsIndex] = useState(0);
  const [src, setSrc] = useState('');
  const [shownAlbums, setShownAlbums] = useState([]);

  const pixelSizes = [75, 60, 40, 0];

  useEffect(() => {
    fetchAlbums().then(albums => {
      setAlbums(albums);
    }).catch(error => {
      console.error('Error fetching albums:', error);
    });
  }, []);

  useEffect(() => {
    if (mode) {
      const { randomAlbum, src } = fetchRandomAlbum(albums, mode, shownAlbums);
      setAlbum(randomAlbum);
      setSrc(src);
    }
  }, [mode]);

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
        const { randomAlbum, src } = fetchRandomAlbum(albums, mode, shownAlbums);
        setAlbum(randomAlbum);
        setSrc(src);
        setGuess('');
        setPixelSize(pixelSizes[0]);
        setBorderColor('');
        setAttempts(0);
        setIsCorrect(false);
        setSuggestions([]);
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
        setPixelSize(pixelSizes[attempts + 1]);
      } else {
        setPixelSize(0);
        setTimeout(() => {
          const { randomAlbum, src } = fetchRandomAlbum(albums, mode, shownAlbums);
          setAlbum(randomAlbum);
          setSrc(src);
          setGuess('');
          setPixelSize(pixelSizes[0]);
          setBorderColor('');
          setAttempts(0);
          setSuggestions([]);
        }, 1500);
      }
    }
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setPixelSize(pixelSizes[0]);
    setAttempts(0);
    setGuess('');
    setShownAlbums([]);
    const { randomAlbum, src } = fetchRandomAlbum(albums, selectedMode, shownAlbums);
    setAlbum(randomAlbum);
    setSrc(src);
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
        <h1 className="text-white text-[35px] mb-4">Select Game Mode</h1>
        <div className="flex space-x-4">
          <button onClick={() => handleModeSelect('RYM')} className="bg-emerald-600 text-white p-4 rounded-md hover:bg-emerald-700">
            RYM
          </button>
          <button onClick={() => handleModeSelect('Discogs')} className="bg-emerald-600 text-white p-4 rounded-md hover:bg-emerald-700">
            Discogs
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