// // App.jsx
// import React, { useState } from "react";
// import "./Screen.css";

//  function Screen() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [inputFocused, setInputFocused] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);

//   const previousChats = [
//     // "Overfitting in ML",
//     // "AI Mental Health Assistant",
//     // "Training with Wav2Vec2.0",
//     // "MERN Food Takeaway App",
//     // "Managing Overwhelm Together"
//   ];

//   const toggleDarkMode = () => setDarkMode(!darkMode);

//   return (
//     <div className={`app-container ${darkMode ? "dark" : "light"}`}>
//       <button className="theme-toggle" onClick={toggleDarkMode}>
//         {darkMode ? "🌞" : "🌙"}
//       </button>

//       {sidebarOpen && (
//         <div className="sidebar">
//           <button className="close-btn" onClick={() => setSidebarOpen(false)}>
//             &times;
//           </button>
//           <h3>Library</h3>
//           <ul>
//             {previousChats.map((chat, index) => (
//               <li key={index}>{chat}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div className="main">
//         {!sidebarOpen && (
//           <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
//             &#9776;
//           </button>
//         )}
//         <div className="center-text">What can I help with?</div>
//         <div className={`input-container ${inputFocused ? "focused" : ""}`}>
//           <input
//             type="text"
//             placeholder="Ask anything..."
//             onFocus={() => setInputFocused(true)}
//             onBlur={() => setInputFocused(false)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Screen;

import react from "react";
import "./Screen.css";
import { FaMicrophone , FaArrowUp } from 'react-icons/fa';

function Screen() {
  return (
    <>
      <div className="main-container">
        <div className="left-Navbar">
          <h3>Library</h3>
        </div>
        <div className="container">
          <div className="navbar-container">
            <div className="leftside">Chat</div>
            <div className="rightside">
              <button className="toggle-btn"></button>
            </div>
          </div>
          <div className="textfield-container">
            <input type="text" placeholder="Ask me Anything...."/>
            <div className="voice-btn"><FaMicrophone className="mic-icon" /></div>
            <button type="submit" className="submit-btn"><FaArrowUp className="submit-icon"/></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Screen;
