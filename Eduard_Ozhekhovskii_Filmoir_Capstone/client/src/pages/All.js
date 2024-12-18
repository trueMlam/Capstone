import React, { useState, useEffect } from "react";

function All() {
  const [mvs, setMvs] = useState([]), [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    fetchMvs();
  }, []);

  const fetchMvs = async () => {
    try {
      const res = await fetch("/all");
      const data = await res.json();
      const unique = [], dups = new Set();

      data.forEach((mv) => {
        const k = `${mv.title}-${mv.year}-${mv.poster ? mv.poster[0] : ""}`;
        if (unique.some((m) => m.key === k)) dups.add(k);
        else unique.push({ ...mv, key: k });
      });

      setMvs(
        unique.map((mv) => ({
          ...mv,
          isDup: dups.has(mv.key),
        }))
      );
    } catch (err) {
      console.error("❌ err get 🎬", err);
    } finally {
      setLoad(false);
    }
  };

  const unlist = async (m) => {
    setLoad(true);
    try {
      const api = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${api}/folders/${m.folderUrl}/${m._id}`, {
        method: "DELETE",
      });
      if (!res.ok) console.error(`❌ err del 🎬 from 📂 ${m.folderUrl}`);
      else {
        console.log(`✅ ok del 🎬 from 📂 ${m.folderUrl}`);
        setMvs((prev) => prev.filter((i) => i._id !== m._id));
      }
    } catch (err) {
      console.error("❌ err del 🎬", err);
    } finally {
      setLoad(false);
    }
  };

  const delAll = async (m) => {
    setLoad(true);
    try {
      const res = await fetch("/all");
      const all = await res.json();
      const dups = all.filter(
        (i) =>
          i.title === m.title &&
          i.year === m.year &&
          JSON.stringify(i.poster) === JSON.stringify(m.poster)
      );

      for (const d of dups) {
        const api = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const delRes = await fetch(`${api}/folders/${d.folderUrl}/${d._id}`, {
          method: "DELETE",
        });
        if (!delRes.ok) console.error(`❌ err del 🎬 from 📂 ${d.folderUrl}`);
      }

      setMvs((prev) =>
        prev.filter(
          (i) =>
            i.title !== m.title ||
            i.year !== m.year ||
            JSON.stringify(i.poster) !== JSON.stringify(m.poster)
        )
      );
    } catch (err) {
      console.error("❌ err del all 📂", err);
    } finally {
      setLoad(false);
    }
  };

  const hasPosters = mvs.filter((i) => i.poster && i.poster.length > 0),
    noPosters = mvs.filter((i) => !i.poster || i.poster.length === 0);

  return (
    <div>
      <h5>All Collection 🎬</h5>
      {load ? (
        <div className="load-wrap">
          <div className="load"></div>
        </div>
      ) : (
        <>
          {hasPosters.length > 0 && (
            <div className="mov-cont">
              {hasPosters.map((m) => (
                <div key={m._id} className="mov-card">
                  <h3>
                    {m.title} <br />
                    <span style={{ fontWeight: "normal", fontSize: "0.9em" }}>
                      ({m.year})
                    </span>
                  </h3>
                  <img src={m.poster[0]} alt={m.title} />
                  {m.isDup ? (
                    <button onClick={() => delAll(m)}>🗑️ from All 📂</button>
                  ) : (
                    <button onClick={() => unlist(m)}>🗑️ Unlist</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {noPosters.length > 0 && (
            <div>
              <br />
              <h5>👤 Added by User:</h5>
              <div className="mov-cont">
                {noPosters.map((m) => (
                  <div key={m._id} className="mov-card">
                    <h3>
                      {m.title}
                      <br />
                      {m.year ? `(${m.year})` : ""}
                    </h3>
                    <p>🖼️ Poster Coming.. never</p>
                    {m.isDup ? (
                      <button onClick={() => delAll(m)}>🗑️ from All 📂</button>
                    ) : (
                      <button
                        onClick={() => unlist({ ...m, folderUrl: "added-by-user" })}
                      >
                        🗑️ Unlist
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default All;