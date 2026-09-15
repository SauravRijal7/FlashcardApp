import React, { useState } from 'react';
import { motion } from 'framer-motion';

const cardStyle = {
  width: '300px',
  height: '200px',
  perspective: '1000px',
};

const innerStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
};

const faceStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  padding: '20px',
};

const frontStyle = {
  ...faceStyle,
  backgroundColor: '#f0f0f0',
};

const backStyle = {
  ...faceStyle,
  backgroundColor: '#d0eaff',
  transform: 'rotateY(180deg)',
};

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={cardStyle} onClick={() => setFlipped(!flipped)}>
      <motion.div
        style={{
          ...innerStyle,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div style={frontStyle}>
          <strong>Q:</strong> {question}
        </div>
        <div style={backStyle}>
          <strong>A:</strong> {answer}
        </div>
      </motion.div>
    </div>
  );
}

export default Flashcard;
