import React, { useState, useRef } from "react";
import "./Screen.css";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";

function Screen() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Try Chrome.");
    return null;
  }

  // Initialize recognition only once
  if (!recognitionRef.current) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      setText(""); // clear previous text if needed
      recognitionRef.current.start();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
  
      const data = await response.json();
      alert(`Predicted Emotion: ${data.emotion} (${(data.confidence * 100).toFixed(2)}%)`);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

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
            <input
              type="text"
              placeholder="Ask me Anything...."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="voice-btn">
              <FaMicrophone
                className="mic-icon"
                onClick={handleMicClick}
                style={{ color: isListening ? "red" : "#fff" }}
              />
            </div>
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              <FaArrowUp className="submit-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Screen;
