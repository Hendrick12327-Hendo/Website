import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

const fetchRandomAlbum = (albums, selectedGenresAndStyles, rymOnly, rankFilter, rankEnabled) => {
  let filteredAlbums = albums;

  if (selectedGenresAndStyles.length > 0) {
    filteredAlbums = filteredAlbums.filter(album => {
      const combinedGenresAndStyles = [...(album['Genre'] || []), ...(album['Style'] || [])];
      return combinedGenresAndStyles.some(item => selectedGenresAndStyles.includes(item));
    });
  }

  if (rymOnly) {
    filteredAlbums = filteredAlbums.filter(album => album['RYM'] === true);
  }

  if (rankEnabled && rankFilter && rankFilter <= 10000) {
    filteredAlbums = filteredAlbums.filter(album => album['Rank'] && album['Rank'] <= rankFilter);
  }

  if (filteredAlbums.length === 0) {
    return null;
  }

  const randomAlbum = filteredAlbums[Math.floor(Math.random() * filteredAlbums.length)];
  return randomAlbum;
};

const RandomAlbum = () => {
  const [album, setAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedGenresAndStyles, setSelectedGenresAndStyles] = useState([]);
  const [rymOnly, setRymOnly] = useState(false);
  const [rankFilter, setRankFilter] = useState(null);
  const [rankEnabled, setRankEnabled] = useState(false);

  useEffect(() => {
    fetchAlbums().then(albums => {
      setAlbums(albums);
      setAlbum(fetchRandomAlbum(albums, selectedGenresAndStyles, rymOnly, rankFilter, rankEnabled));
    }).catch(error => {
      console.error('Error fetching albums:', error);
    });
  }, []);

  const handleNewAlbum = () => {
    setAlbum(fetchRandomAlbum(albums, selectedGenresAndStyles, rymOnly, rankFilter, rankEnabled));
  };

  const handleGenreOrStyleChange = (item) => {
    setSelectedGenresAndStyles(prevSelected => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter(i => i !== item);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleRymChange = () => {
    setRymOnly(prevRymOnly => !prevRymOnly);
  };

  const handleRankChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setRankFilter(value > 10000 ? null : value);
  };

  const handleRankEnabledChange = () => {
    setRankEnabled(prevRankEnabled => !prevRankEnabled);
    if (rankEnabled) {
      setRankFilter(null);
    }
  };

  useEffect(() => {
    if (albums.length > 0) {
      setAlbum(fetchRandomAlbum(albums, selectedGenresAndStyles, rymOnly, rankFilter, rankEnabled));
    }
  }, [selectedGenresAndStyles, rymOnly, rankFilter, rankEnabled]);

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-white text-[35px] mb-4">No album found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <img src={album['Image URL']} alt="Random Album" className="w-[500px] h-[500px] mb-4" onError={(e) => { e.target.onerror = null; e.target.src = 'images/album_covers/default.jpg'; }} />
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white">{album.name}</h2>
        <p className="text-xl text-white">{album['Artist']}</p>
        <p className="text-xl text-white">{album['Release Date']}</p>
        <p className="text-xl text-white">{album['Genre'] ? album['Genre'].join(', ') : 'Unknown Genre'}</p>
        {album['Style'] && album['Style'].length > 0 && (
          <p className="text-xl text-white">{album['Style'].join(', ')}</p>
        )}
      </div>
      <button onClick={handleNewAlbum} className="bg-emerald-600 text-white p-4 rounded-md mb-4 hover:bg-emerald-700">
        Give Me Another Album
      </button>
      <Link to="/" className="absolute top-4 left-4 text-blue-300 mb-4">Go Back</Link>
      <div className="absolute top-4 right-4 text-white">
        <h3 className="text-xl mt-[100px] mb-[8px] mr-[250px]">Filter by Genre</h3>
        <div>
          {['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Pop', 'Funk / Soul', 'Folk', 'Pop Rock', 'Prog Rock', 'Alternative Rock', 'Synth-pop', 'Ambient', 'Power Pop', 'Heavy Metal', 'Boom Bap', 'Punk'].map(item => (
            <div key={item} className="mb-2">
              <label>
                <input
                  type="checkbox"
                  value={item}
                  checked={selectedGenresAndStyles.includes(item)}
                  onChange={() => handleGenreOrStyleChange(item)}
                  className="mr-2"
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <h3 className="text-xl mb-2 mt-4">Other</h3>
        <div className="mt-4">
          <label className={rankEnabled ? "text-gray-500" : ""}>
            <input
              type="checkbox"
              checked={rymOnly}
              onChange={handleRymChange}
              className="mr-2"
              disabled={rankEnabled}
            />
            RYM
          </label>
        </div>
        <div className="mt-4">
          <label className={rymOnly ? "text-gray-500" : ""}>
            <input
              type="checkbox"
              checked={rankEnabled}
              onChange={handleRankEnabledChange}
              className="mr-2"
              disabled={rymOnly}
            />
            Rank
          </label>
          <input
            type="number"
            value={rankFilter || ''}
            onChange={handleRankChange}
            className="ml-2 p-1 rounded text-black w-16 no-arrows"
            placeholder="Rank.."
            disabled={!rankEnabled}
          />
        </div>
      </div>
    </div>
  );
};

export default RandomAlbum;