import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="ft">
      <p className="ftext">
        {isMobile ? (
          <>
            ©&ensp;2024&ensp;
            <Link to="/" className="flink">
              «Filmoir»
            </Link>
          </>
        ) : (
          <>
            ©&ensp;2024&ensp;
            <Link to="/" className="flink">
              «Filmoir»
            </Link>
            &emsp;|&emsp;EO’s&ensp;🎥&ensp;Backlog&ensp;solution&emsp;|&emsp;SE&ensp;Capstone&ensp;Project&ensp;@&ensp;
            <a
              href="https://perscholas.org/"
              className="flink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Per Scholas
            </a>
          </>
        )}
      </p>
    </footer>
  );
}

export default Footer;