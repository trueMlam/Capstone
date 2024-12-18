import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Folder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mvs, setMvs] = useState([]);
  const [fname, setFname] = useState('');
  const [femoji, setFemoji] = useState('📂'); 
  const [load, setLoad] = useState(true);
  const [showOver, setShowOver] = useState(false);

  const emptyMsgs = [
    "❓ Empty folder, where are the films!? 👀",
    "🌱 Empty folder, just dust and hope..🧹💭",
    "📚 Empty folder, but hey, it’s organized! 👌",
    "🍿 Empty folder, but the popcorn's ready.. 🎥",
    "🔄 Empty folder, still buffering.. forever.... 💻",
    "💡 Empty folder, but hey, plenty of space for imagination.. 🎨",
    "📂 It's not empty, it's minimalistic.. ✨",
    "🗓️ Empty folder, the movie's still in production.. 🛠️"
  ];

  const randMsg = emptyMsgs[Math.floor(Math.random() * emptyMsgs.length)];

  useEffect(() => {
    const getFDetails = async () => {
      try {
        const res = await fetch(`/folders/${id}`);
        const data = await res.json();
        setFname(data.folder.name);
        setFemoji(data.folder.emoji || '📂');
        setMvs(data.movies);
        setLoad(false);
      } catch (err) {
        console.error("❌ err get 🎬", err);
        setLoad(false);
      }
    };

    getFDetails();
  }, [id]);

  const delMv = async (mId) => {
    try {
      const res = await axios.delete(`/folders/${id}/${mId}`);
      if (res.status === 200) {
        setMvs(prev => prev.filter(m => m._id !== mId));
      }
    } catch (err) {
      console.error("❌ err del 🎬", err);
    }
  };

  const shrekLove = () => {
    navigate("/folders/my-love");
  };

  const zeroChance = () => {
    setShowOver(true);
    setTimeout(() => {
      navigate("/search?query=The%20Human%20Centipede");
    }, 10000);
  };

  return (
    <div>
      <h5>{femoji} {fname}</h5><br />
      {load ? (
        <div className="loader-cont">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {mvs.length === 0 ? (
            <div className="empty-msg">
              <h3>{randMsg}</h3>
              <img src="\img\shreksophone.gif" alt="Shrek" className="shrek-img" />
              <h4>Wanna Watch Shrek❓</h4>
              <div className="shrek-btns">
                <button className="shrek-btn" onClick={shrekLove}>
                  Totally, Shrek is life
                </button>
                <button className="shrek-btn" onClick={zeroChance}>
                  Zero chance
                </button>
              </div>
            </div>
          ) : (
            <div className="mov-cont">
              {mvs.map(m => (
                <div key={m._id} className="mov-card">
                  <h3>
                    {m.title}
                    <br />
                    <span style={{ fontWeight: 'normal', fontSize: '0.9em' }}>
                      {m.year && ` (${m.year})`}
                    </span>
                  </h3>
                  {m.poster && m.poster.length > 0 ? (
                    <img src={m.poster[0]} alt={m.title} />
                  ) : (
                    <p>🖼️ Poster Coming.. never</p>
                  )}
                  <button
                    onClick={() => delMv(m._id)}
                    disabled={id === "my-love"}
                    className={id === "my-love" ? "disabled-btn" : ""}
                  >
                    🗑️ Unlist
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showOver && (
        <div className="over">
          <img src="/img/shrek3.png" alt="Shrek" className="over-img" />
        </div>
      )}
    </div>
  );
}

export default Folder;