import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import All from './pages/All';
import Folder from './pages/Folder';
import Random from './pages/Random';
import Home from './pages/Home';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/folders" element={<Home />} />
        <Route path="/all" element={<All />} />
        <Route path="/all/random" element={<Random />} />
        <Route path="/folders/:id" element={<Folder />} />
        <Route path="/folders/:id/random" element={<Random />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;