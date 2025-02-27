import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import RandomAlbum from './components/RandomAlbum';

function Header() {
  return (
    <div>
      <header className="text-[65px] py-[60px] text-neutral-50">Random Album Generator</header>
    </div>
  );
}

function Home() {
  return (
    <div className="App flex flex-col items-center justify-center h-screen">
      <Header />
      <Link to="/random-album">
        <button className="mt-4 bg-blue-500 text-white p-4 rounded">Give me a Random Album</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/random-album" element={<RandomAlbum />} />
      </Routes>
    </Router>
  );
}

export default App;
