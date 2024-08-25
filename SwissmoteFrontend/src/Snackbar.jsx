// Snackbar.js
import React from "react";
import "./Snackbar.css";

function Snackbar({ message, show, onClose }) {
  return (
    <div className={`snackbar ${show ? "show" : ""}`}>
      {message}
      <button onClick={onClose} className="close-snackbar">
        X
      </button>
    </div>
  );
}

export default Snackbar;
