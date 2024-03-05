import React, { useState, useEffect } from "react";
import "./App.css";
import { db, auth } from "./firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthPage from "./components/AuthPage";

const App = () => {
  const [user, setUser] = useState(null);

  const [red, setRed] = useState("");
  const [green, setGreen] = useState("");
  const [blue, setBlue] = useState("");
  const [redTemp, setRedTemp] = useState(null);
  const [greenTemp, setGreenTemp] = useState(null);
  const [blueTemp, setBlueTemp] = useState(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleRGBSubmit = async (e) => {
    e.preventDefault();
    updateLEDColors();
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;
  
    try {
    const response = await fetch('http://localhost:3001/api/generate-colors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
      console.log(data);
      if (typeof data === "string") {
        const formattedData = data.split(",").map(Number);
        setRedTemp(formattedData[0]);
        setGreenTemp(formattedData[1]);
        setBlueTemp(formattedData[2]);
      } else {
        console.error("Received data is not in the expected string format.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateLEDColors = async () => {
    try {
      await setDoc(doc(db, "maindata", "ledmaindata"), {
        red: red,
        green: green,
        blue: blue,
      });
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const copySuggestedValues = () => {
    setRed(redTemp);
    setGreen(greenTemp);
    setBlue(blueTemp);
  };

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="main-block">
      <div>
      <button onClick={signOutUser}>Sign Out</button>
      </div>
      <h1>Update LED Colors</h1>
      <form onSubmit={handleRGBSubmit}>
        <label>
          Red:
          <input
            type="number"
            value={red}
            onChange={(e) => setRed(e.target.value)}
            placeholder="0-255"
          />
        </label>

        <label>
          Green:
          <input
            type="number"
            value={green}
            onChange={(e) => setGreen(e.target.value)}
            placeholder="0-255"
          />
        </label>

        <label>
          Blue:
          <input
            type="number"
            value={blue}
            onChange={(e) => setBlue(e.target.value)}
            placeholder="0-255"
          />
        </label>

        <button type="submit">Update LED Colors</button>
      </form>
      <h1>Generate RGB Values:</h1>
      <form onSubmit={handlePromptSubmit}>
        <label>
          Enter Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="suggested-values-container">
            <button type="submit">Generate</button>
          </div>
          {redTemp !== null && greenTemp !== null && blueTemp !== null && (
  <div className="suggested-values-container">
    <div>
      <p>Suggested Red: {redTemp}</p>
      <p>Suggested Green: {greenTemp}</p>
      <p>Suggested Blue: {blueTemp}</p>
    </div>
    <div>
      <button onClick={copySuggestedValues}>
        Copy Suggested Values
      </button>
    </div>
  </div>
)}

        </label>
      </form>
    </div>
  );
};

export default App;
