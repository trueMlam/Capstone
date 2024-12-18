import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchMvs, addMvToF } from '../api';
import Select from 'react-select';

function Search() {
  const [mvs, setMvs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [load, setLoad] = useState(false);
  const [manualM, setManualM] = useState({ title: '', year: '' });
  const [manualForm, setManualForm] = useState(false);
  const [selFolders, setSelFolders] = useState([]);
  const [drop, setDrop] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const loc = useLocation();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const query = new URLSearchParams(loc.search).get('query');
    if (query) searchM(query);
    loadFolders();
  }, [loc]);

  const loadFolders = async () => {
    try {
      const res = await fetch('/folders');
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      console.error('❌ err fetch 📂', err);
    }
  };

  const searchM = (query) => {
    const cleanQuery = query.replace(/[^/&()+\-.—,:;!?'"*%#@~_₽$€«» 0-9A-Za-z]/g, '');
    setLoad(true);
    setManualForm(false);
    setManualM({ title: '', year: '' });

    searchMvs(cleanQuery).then((res) => {
      setMvs(res);
      if (res.length === 0) {
        setManualM((prev) => ({ ...prev, title: cleanQuery }));
        setManualForm(true);
      }
      setLoad(false);
    });
  };

  const addToFolder = async (mid) => {
    for (const folder of selFolders) {
      try {
        await addMvToF(folder, { imdbID: mid });
        setSuccessMsg('💾 Saved in «Added by User»!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('❌ err add 🎬 to 📂', err);
      }
    }
  };

  const submitManual = async (e) => {
    e.preventDefault();
    const yr = parseInt(manualM.year, 10);
    if (manualM.year && (yr < 1888 || yr > new Date().getFullYear())) {
      console.error('❌ must be 1888-current');
      return;
    }
    if (!manualM.title) return;

    try {
      const res = await fetch(`${API_URL}/folders/added-by-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: manualM.title, year: manualM.year ? yr : null }),
      });

      if (res.ok) {
        console.log('✅ added to Added by User 📂');
        setSuccessMsg('💾 Saved in «Added by User»!');
      } else {
        console.error('❌ err add');
      }
    } catch (err) {
      console.error('❌ err add 🎬', err);
    }
  };

  const validTitle = (val) => /^[/&()+\-.—,:;!?'"*%#@~_₽$€«» 0-9A-Za-z]*$/.test(val);

  const changeTitle = (e) => {
    const val = e.target.value;
    if (validTitle(val)) setManualM((prev) => ({ ...prev, title: val }));
  };

  const changeYear = (e) => {
    const val = e.target.value;
    if (/^\d{0,4}$/.test(val)) setManualM((prev) => ({ ...prev, year: val }));
  };

  return (
    <div>
      {load ? (
        <div className="loader-cont">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="mov-cont">
          {mvs.map((m) => (
            <div key={m.imdbID} className="mov-card">
              <h3>
                {m.Title} <br />
                <span style={{ fontWeight: 'normal', fontSize: '0.9em' }}>({m.Year})</span>
              </h3>
              <img src={m.Poster} alt={m.Title} />
              <button
                onClick={() => setDrop(drop === m.imdbID ? null : m.imdbID)}
                className="add-folder-btn"
              >
                📂 Add to Folder
              </button>
              {drop === m.imdbID && (
                <div>
                  <Select
                    isMulti
                    options={folders
                      .filter((f) => !['unsorted', 'added-by-user', 'my-love'].includes(f.url))
                      .map((f) => ({ value: f.url, label: `${f.emoji} ${f.name}` }))}
                    onChange={(sel) => setSelFolders(sel.map((s) => s.value))}
                    placeholder="📋 Select folders.."
                    menuPlacement="top"
                    styles={{
                      control: (p) => ({ ...p, backgroundColor: '#1E1E1E', borderColor: '#2d264a' }),
                      menu: (p) => ({ ...p, backgroundColor: '#1E1E1E', border: '1px solid #2d264a' }),
                      option: (p, state) => ({
                        ...p,
                        backgroundColor: state.isSelected ? '#FF5722' : 'transparent',
                      }),
                      placeholder: (p) => ({ ...p, color: '#888' }),
                    }}
                  />
                </div>
              )}
              {selFolders.length > 0 && drop === m.imdbID && (
                <button onClick={() => addToFolder(m.imdbID)} disabled={load}>
                  ✅ Add to Selected 📂
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {manualForm && (
        <>
          <p className="manual-form-note">🚫 No movies fetched by the API − don’t be shy, add your personal fave right here 👇</p>
          <form onSubmit={submitManual} className="manual-form">
            <div className="form-group">
              <label htmlFor="movieTitle" className="manual-label">🎬 Movie Title:</label>
              <input id="movieTitle" type="text" value={manualM.title} onChange={changeTitle} required />
            </div>
            <div className="form-group">
              <label htmlFor="releaseYear" className="manual-label">🗓️ Release Year (optional):</label>
              <input id="releaseYear" type="number" value={manualM.year} onChange={changeYear} />
            </div>
            <button type="submit" className="add-user-btn">🏷️ Put in Added by User 📂</button>
            {successMsg && (
              <div className="success-message-container">
                <p className="success-message">{successMsg}</p>
                <Link to="/" className="return-home-btn">⏪ Return to Home 🏠</Link>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}

export default Search;