import React from 'react';
import { ScratchCard } from 'next-scratchcard';
// import rewardImage from './images/FSL Games Scratch Animation-02.png'; // Adjust path as needed
import rewardImage from './images/scratch_ticket_background_full.png'; // Adjust path as needed

import scratch_foreground from './images/FSL Games Scratch Animation-01.png'; // Adjust path as needed
import background from './images/background.png'; // Adjust path as needed

const ScratchTest = () => {
  const handleComplete = () => {
    console.log('Scratch completed!');
    // Add any completion logic here
  };

  return (
    <div className="scratch-container">
      <ScratchCard 
        finishPercent={50} 
        brushSize={40} 
        onComplete={handleComplete}
        width={350}    // Reduced from 400 to 350 to better fit mobile viewport
        height={700}   
        image={scratch_foreground}
      >
        <div className="reward-content">
          <img
            src={rewardImage}
            alt="reward"
            className="reward-image"
          />
          {/* <span className="reward-text">5000</span> */}
        </div>
      </ScratchCard>

      <style jsx>{`
        .scratch-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f5f5f5;
          padding: 0;
          margin-top: 0;
          width: 100%;  /* Added to ensure container spans full width */
        }

        .reward-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #000;
          color: white;
          position: relative; /* Added position relative */
        }

        .reward-image {
          width: 100%;
          height: 100%;
          object-fit: contain; /* Changed to contain */
          position: absolute; /* Made absolute to fill container */
          top: 0;
          left: 0;
        }

        .reward-text {
          font-size: 2rem;
          font-weight: bold;
          position: relative; /* Added position relative */
          z-index: 1; /* Ensure text stays on top */
        }
      `}</style>
    </div>
  );
};

export default ScratchTest;
