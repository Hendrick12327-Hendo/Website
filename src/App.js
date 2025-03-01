import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import RandomAlbum from './components/RandomAlbum';
import BlurGame from './components/BlurGame';

function Header() {
  return (
    <div>
      <header className="text-[65px] pt-[60px] text-neutral-50">RYM Random Album Generator</header>
      <p className="text-[15px] text-zinc-600">Made by Hendrick</p>
    </div>
  );
}

function Home() {
  return (
    <div className="App flex flex-col items-center justify-center h-screen relative">
      <Header />
      <div className="flex-grow"></div>
      <Link to="/blur-game">
        <button className="text-[20px] bg-emerald-600 text-white p-4 rounded-md hover:bg-emerald-700 mb-4">
          Blur Game
        </button>
      </Link>
      <Link to="/random-album">
        <button className="text-[20px] bg-emerald-600 text-white p-4 rounded-md hover:bg-emerald-700">
          Random Album Picker
        </button>
      </Link>
      <div className="flex-grow"></div>
      <div className="absolute bottom-4 flex space-x-4">
        <a href="https://discord.com/users/_hendo." target="_blank" rel="noopener noreferrer" className="text-blue-300">My Discord</a>
        <a href="https://rateyourmusic.com/~_Hendo" target="_blank" rel="noopener noreferrer" className="text-blue-300">My RYM Account</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/random-album" element={<RandomAlbum />} />
        <Route path="/blur-game" element={<BlurGame />} />
      </Routes>
    </Router>
  );
}

export default App;
