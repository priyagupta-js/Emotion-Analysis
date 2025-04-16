// Emotion-Analysis/frontend/src/Screen/Screen.jsx
import React, { useState, useRef } from "react";
import "./Screen.css";
import { FaMicrophone, FaPlay, FaArrowUp } from "react-icons/fa";

function Screen() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [responseAudioUrl, setResponseAudioUrl] = useState(null);
  const [text, setText] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [inputAudioUrl, setInputAudioUrl] = useState(null);


  const handleMicClick = async () => {
    if (!isRecording) {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const inputAudioUrl = URL.createObjectURL(audioBlob);  // <- Create preview URL
        setInputAudioUrl(inputAudioUrl);
        setAudioBlob(audioBlob);
        sendAudio(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
    } else {
      setIsRecording(false);
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob,"input.wav");

    try {
      const response = await fetch("http://localhost:8080/api/audio", {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResponseAudioUrl(url);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };
/* 
  const handleTextSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      alert(`Predicted Emotion: ${data.emotion}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };
*/
const handleTextSubmit = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    let customMessage = "";

    switch (data.emotion.toLowerCase()) {
      case "happiness":
        customMessage = "Glad to hear you are happy!";
        break;
      case "sadness":
        customMessage = "I am here for you. It's okay to feel sad sometimes.";
        break;
      case "worry":
        customMessage = "Take a deep breath. Things will be okay.";
        break;
      case "neutral":
        customMessage = "Thanks for sharing. Feel free to talk more.";
        break;
      case "love":
        customMessage = "Love is beautiful. Spread it around!";
        break;
      default:
        customMessage = "Thanks for expressing yourself!";
    }
    alert(`Predicted Emotion: ${data.emotion}\n${customMessage}`);
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
}
};
  return (
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
          <button type="submit" className="submit-btn" onClick={handleTextSubmit}>
            <FaArrowUp className="submit-icon" />
          </button>
        </div>
        <div className="textfield-container">
          <button onClick={handleMicClick} className="mic-btn">
            <FaMicrophone style={{ color: isRecording ? "red" : "#fff" }} />
          </button>

          {inputAudioUrl && (
          <button className="play-btn" onClick={() => new Audio(inputAudioUrl).play()}>
            Play My Input
          </button>
          )}

          {responseAudioUrl && (
            <button className="play-btn" onClick={() => new Audio(responseAudioUrl).play()}>
              <FaPlay />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Screen;
