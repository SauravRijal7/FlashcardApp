import React, { useState } from 'react';
import FileDropzone from './dropzone';
import Flashcard from './flashcard';
import './App.css';


function App() {
  const [pdfText, setPdfText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardCount, setFlashcardCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

const generateFlashcards = async () => {
  if (!pdfText) {
    alert("Please upload a PDF file first.");
    return;
  }

  try {
    setLoading(true);

    const prompt = `Extract ${flashcardCount} flashcard-style question-answer unique pairs from the following text:

${pdfText}`;

    const response = await fetch("https://flashcardapp-e7ti.onrender.com/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate flashcards");
    }

    const flashcardData = JSON.parse(data.text);

    setFlashcards(flashcardData);
    setFlippedCards({});
  } catch (err) {
    console.error("Gemini error:", err);
    alert("High Volume of Requests received. Please try again in 30 seconds :) ");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h1>Flashcard App</h1>

      <FileDropzone
        onTextExtracted={(text) => setPdfText(text)}
        onFileNameExtracted={(name) => setFileName(name)}
      />

      <div style={{ marginTop: '15px' }}>
        <label htmlFor="countSelect" style={{ marginRight: '10px' }}>
          Number of cards:
        </label>
        <select
          id="countSelect"
          value={flashcardCount}
          onChange={(e) => setFlashcardCount(Number(e.target.value))}
          style={{ padding: '5px 10px', borderRadius: '4px' }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <button
        onClick={generateFlashcards}
        disabled={loading || !pdfText}
        style={{
          backgroundColor: loading || !pdfText ? '#cccccc' : '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: loading || !pdfText ? 'not-allowed' : 'pointer',
          marginTop: '15px',
          fontSize: '16px',
        }}
      >
        {loading ? 'Generating...' : 'Generate Flashcards'}
      </button>

      {loading && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              border: '6px solid #f3f3f3',
              borderTop: '6px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '20px auto',
            }}
          />
          <p>Generating flashcards from {fileName || 'document'}...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {flashcards.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2>Generated Flashcards ({flashcards.length})</h2>
          <div style={cardGridStyle}>
            {flashcards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  ...cardContainerStyle,
                  transform: flippedCards[idx] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                onClick={() => toggleFlip(idx)}
              >
                <div style={{ ...cardFaceStyle, ...cardFrontStyle }}>
                  <p><strong>Q:</strong> {card.question}</p>
                </div>
                <div style={{ ...cardFaceStyle, ...cardBackStyle }}>
                  <p><strong>A:</strong> {card.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: '60px' }}>
        <div className="footer-container">
          <div className="footer-section">
            <h4>Contact Me</h4>
            <a href="mailto:sauravplayer1@gmail.com">Email: sauravplayer1@gmail.com</a>
            <p>Address: Baniyatar, Kathmandu</p>
          </div>

          <div className="footer-section">
            <h4>Follow Me</h4>
            <a href="https://github.com/SauravRijal7" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="https://www.linkedin.com/in/saurav-rijal-4100b6216/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="copyright">
          &copy; {new Date().getFullYear()} Saurav Rijal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;

const cardGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '30px',
};

const cardContainerStyle = {
  width: '250px',
  height: '260px',
  perspective: '1000px',
  position: 'relative',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  cursor: 'pointer',
};

const cardFaceStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const cardFrontStyle = {
  backgroundColor: '#e0f7fa',
  transform: 'rotateY(0deg)',
};

const cardBackStyle = {
  backgroundColor: '#ffecb3',
  transform: 'rotateY(180deg)',
};
