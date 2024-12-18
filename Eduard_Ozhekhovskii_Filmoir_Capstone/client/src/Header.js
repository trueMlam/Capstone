import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function Header() {
  const loc = useLocation();
  const nav = useNavigate();
  const [searchQ, setSearchQ] = useState("");
  const [showRandAll, setShowRandAll] = useState(false);
  const [showRandThis, setShowRandThis] = useState(false);
  const [showBackBtn, setShowBackBtn] = useState(false);
  const [showAllBtn, setShowAllBtn] = useState(false);

  const handleSearch = () => {
    if (searchQ.trim()) {
      nav(`/search?query=${searchQ}`);
    }
  };

  useEffect(() => {
    const checkFolderContent = async () => {
      const path = loc.pathname.split("/");
      const folderIdOrUrl = path[2] ? path[2] : null;

      if (!folderIdOrUrl) {
        setShowRandThis(false);
        return;
      }

      try {
        const folderRes = await fetch(`/folders/${folderIdOrUrl}`);
        if (!folderRes.ok) {
          setShowRandThis(false);
          return;
        }

        const folderData = await folderRes.json();
        const folderMovies = folderData.movies || [];
        setShowRandThis(folderMovies.length > 0);
      } catch (err) {
        setShowRandThis(false);
      }
    };

    if (loc.pathname === "/") {
      setShowAllBtn(true);
      setShowBackBtn(false);
      setShowRandAll(false);
      setShowRandThis(false);
    } else if (loc.pathname === "/folders") {
      setShowAllBtn(true);
      setShowBackBtn(false);
      setShowRandAll(false);
      setShowRandThis(false);
    } else if (loc.pathname.startsWith("/folders/")) {
      checkFolderContent();
      setShowRandAll(false);
      setShowBackBtn(true);
      setShowAllBtn(false);
    } else if (loc.pathname.startsWith("/all")) {
      setShowRandAll(true);
      setShowRandThis(false);
      setShowBackBtn(true);
      setShowAllBtn(false);
    } else {
      setShowRandAll(false);
      setShowRandThis(false);
      setShowBackBtn(true);
      setShowAllBtn(false);
    }
  }, [loc.pathname]);

  const handleRandThis = () => {
    const basePath = loc.pathname.replace(/\/random$/, "");
    nav(`${basePath}/random`);
  };

  return (
    <>
      <header>
        <h1>
          <Link to="/" className="hdr-link">
            🎞️ Filmoir
          </Link>
        </h1>
        <h2>Tag and store, crave no more.</h2>
      </header>

      <div
        className={`scontainer ${showBackBtn ? "with-back-btn" : ""} ${
          showAllBtn ? "with-all-btn" : ""
        }`}
      >
        <div className="s-wrapper">
          {showAllBtn ? (
            <Link to="/all">
              <button className="b-btn">🎬 All Movies</button>
            </Link>
          ) : (
            <button className="b-btn" onClick={() => nav(-1)}>
              ⬅️ Back
            </button>
          )}

          <span className="s-icon" onClick={handleSearch}>
            🔍
          </span>
          <input
            type="text"
            className="s-input"
            placeholder="Type and find, ease your mind.."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <button className="r-btn" onClick={handleSearch}>
          🍿 Reveal
        </button>
      </div>

      <div className="rb-container">
        {showRandAll && (
          <button className="rand-btn" onClick={() => nav("/all/random")}>
            🎲 Random From All 📂
          </button>
        )}
        {showRandThis && (
          <button className="rand-btn" onClick={handleRandThis}>
            🎲 Random From This 📂
          </button>
        )}
      </div>
    </>
  );
}

export default Header;