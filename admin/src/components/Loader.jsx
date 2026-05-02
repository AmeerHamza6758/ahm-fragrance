import React from 'react';
import "../styles/admin.css";

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  return (
    <div className={fullScreen ? "loader-overlay" : "section-loader"}>
      <div className="spinner-wrapper">
        <div className="spinner-glow"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-inner"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
