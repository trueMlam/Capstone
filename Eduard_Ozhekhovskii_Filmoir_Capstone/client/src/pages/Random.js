import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Random() {
  const [mv, setMv] = useState(null);
  const loc = useLocation();

  useEffect(() => {
    const fetchRand = async () => {
      const path = loc.pathname.split('/');
      let url = '';

      if (path[1] === 'all' && path[2] === 'random') {
        url = '/all/random';
      } else if (path[1] === 'folders' && path[3] === 'random') {
        url = `/folders/${path[2]}/random`;
      }

      if (url) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          setMv(data);
        } catch (err) {
          console.error('❌ err get random 🎬', err);
        }
      }
    };

    fetchRand();
  }, [loc]);

  return (
    <div>
      {mv ? (
        <div className="mov-cont">
          <div className="mov-card">
            <h3>
              {mv.title}
              <br />
              <span style={{ fontWeight: 'normal', fontSize: '0.9em' }}>({mv.year})</span>
            </h3>
            {mv.poster ? (
              <img src={mv.poster[0]} alt={mv.title} />
            ) : (
              <p>🖼️ Poster Coming.. never</p>
            )}
          </div>
        </div>
      ) : (
        <div className="loader-cont">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default Random;