import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getF, createF } from '../api';

function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [newFname, setNewFname] = useState('');
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchF = async () => {
      const data = await getF();
      setFolders(data);
      setLoading(false);
    };
    fetchF();
  }, []);

  const createFolder = async (e) => {
    e.preventDefault();
    if (!newFname) return;

    const folderData = {
      name: newFname,
      emoji: '📂',
    };

    try {
      const result = await createF(folderData);
      if (result) {
        const newF = {
          ...result,
          name: result.name || newFname,
          emoji: result.emoji || folderData.emoji,
        };
        setFolders(prev => [...prev, newF]);
        setNewFname('');
        setShowCreate(false);
      }
    } catch (err) {
      console.error('❌ err create 📂', err);
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    const valid = /^[0-9 /&()+\-_. 0-9a-zA-Z]*$/;
    if (val === '' || valid.test(val)) setNewFname(val);
  };

  const deleteFolder = async (url) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiUrl}/folders/${url}`, { method: 'DELETE' });
      if (res.ok) {
        console.log(`✅ ok del 📂 ${url}`);
        setFolders(prev => prev.filter(f => f.url !== url));
      } else {
        console.error(`❌ err del 📂 ${url}`);
      }
    } catch (err) {
      console.error(`❌ err del 📂 ${url}`, err);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-cont">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="folders defaultF">
            {folders
              .filter(f => f.isDefault && f.url !== 'my-love')
              .map(f => (
                <div className="folder-btn" key={f._id || f.url}>
                  <button
                    className="folder-btn-content"
                    onClick={() => navigate(`/folders/${f.url}`)}
                  >
                    <span className="folder-title">
                      {f.emoji} {f.name || 'Unnamed Folder'}
                    </span>
                    <div className="folder-desc">
                      {f.description
                        ? f.description.map((line, i) => <span key={i}>{line}</span>)
                        : <span>No description</span>}
                    </div>
                  </button>
                </div>
              ))}
          </div>
          <div className="folders userF">
            {folders
              .filter(f => !f.isDefault && f.url !== 'my-love')
              .map(f => (
                <div className="folder-btn" key={f.url}>
                  <span
                    className="userF-btn"
                    onClick={() => navigate(`/folders/${f.url}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/folders/${f.url}`)}
                  >
                    <span className="folder-title">{f.emoji} {f.name || 'Unnamed Folder'}</span>
                  </span>
                  <span
                    className="delF-btn"
                    role="button"
                    tabIndex={0}
                    onClick={e => {
                      e.stopPropagation();
                      deleteFolder(f.url);
                    }}
                    onKeyDown={e => e.key === 'Enter' && deleteFolder(f.url)}
                  >
                    🗑️
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
      <button 
        onClick={() => setShowCreate(true)} 
        className="spawnF-btn"
      >
        📂 Spawn a Folder
      </button>
      {showCreate && (
        <form onSubmit={createFolder} className="createF-form">
          <div>
            <input
              type="text"
              id="folderName"
              className="folder-input"
              placeholder="✏️ Assign Directory Title.."
              value={newFname}
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit" className="spawnF-submit">
            💾 Save
          </button>
        </form>
      )}
    </div>
  );
}

export default Home;