import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  return randomAlbum;
};

const RandomAlbum = () => {
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    fetchRandomAlbum().then(album => {
      setAlbum(album);
    }).catch(error => {
      console.error('Error fetching random album:', error);
    });
  }, []);

  const handleNewAlbum = async () => {
    try {
      const album = await fetchRandomAlbum();
      setAlbum(album);
    } catch (error) {
      console.error('Error fetching random album:', error);
    }
  };

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-white text-[35px] mb-4">No album found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <img src={album['Image URL']} alt="Random Album" className="w-1/2 h-auto mb-4 mt-[-500px] transform scale-[0.2]" onError={(e) => { e.target.onerror = null; e.target.src = 'images/album_covers/default.jpg'; }} />
      <div className="text-center mb-4 mt-[-300px]">
        <h2 className="text-2xl font-bold text-white">{album.name}</h2>
        <p className="text-xl text-white">{album['Artist']}</p>
        <p className="text-xl text-white">{album['Release Date']}</p>
        <p className="text-xl text-white">{album['Genre'].join(', ')}</p>
        <p className="text-xl text-white">{album['Style'].join(', ')}</p>
      </div>
      <button onClick={handleNewAlbum} className="bg-emerald-600 text-white p-4 rounded-md mb-4 hover:bg-emerald-700">
        Give Me Another Album
      </button>
      <Link to="/" className="absolute top-4 left-4 text-blue-300 mb-4">Go Back</Link>
    </div>
  );
};

export default RandomAlbum;