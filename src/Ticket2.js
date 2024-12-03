import React, { useState, useEffect } from 'react';
import ticketIcon from './images/ticket.svg';
import './Ticket2.css';
import particle from './images/particle.svg';

import { ScratchCard } from 'next-scratchcard';
// import rewardImage from './images/FSL Games Scratch Animation-02.png'; // Adjust path as needed
import rewardImage from './images/scratch_ticket_background_full.png'; // Adjust path as needed
import scratch_foreground from './images/FSL Games Scratch Animation-01.png'; // Adjust path as needed

const Ticket2 = ({ ticketCount, onClose }) => {
    const [dimensions, setDimensions] = useState({ width: 400, height: 700 });
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const updateDimensions = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate dimensions (adjust these ratios as needed)
            const width = Math.min(viewportWidth, 400); // 90% of viewport width, max 400px
            const height = Math.min(viewportHeight, 700); // 70% of viewport height, max 700px
            
            setDimensions({ width, height });
        };

        // Set initial dimensions
        updateDimensions();

        // Add event listener for window resize
        window.addEventListener('resize', updateDimensions);

        // Cleanup
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleComplete = async () => {
        console.log('Scratch completed!');
        // Add any completion logic here
        setTimeout(() => {
            setShowResult(true);
        }, 1000);
    };

    const handleClaim = () => {
        console.log('Claiming reward...');
        setShowResult(false);
        onClose();
    };


    return (
        <>
            {showResult ? (
                <div className="result-container-ticket2">
                    <div className="coin-container">
                        <img src={particle} className="particle" alt="" />
                        {/* <img src={particle} className="particle" alt="" />
                        <img src={particle} className="particle" alt="" />
                        <img src={particle} className="particle" alt="" /> */}
                        <div className="coin">$</div>
                    </div>
                    <h2 className="congratulations">CONGRATULATIONS</h2>
                    <p className="reward-message">YOU'VE WON 1 $UT!</p>
                    <button className="share-button">
                        SHARE TO STORY
                        <span className="points">24.4</span>
                    </button>
                    <button className="claim-button" onClick={handleClaim}>CLAIM</button>
                </div>
            ) :
            (
                <div className="scratch-container">
                    <ScratchCard 
                        finishPercent={50} 
                        brushSize={40} 
                        onComplete={handleComplete}
                        width={dimensions.width}
                        height={dimensions.height}
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
                </div>
            )}
        </>
    );
};

export default Ticket2;
