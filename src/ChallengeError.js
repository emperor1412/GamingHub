import React from 'react';
import './ChallengeError.css';
import starletIcon from './images/starlet.png';
import doodleExtra from './images/doodle_extra.png';

const ChallengeError = ({ onGoToMarket, onBack }) => {
    return (
        <div className="challenge-error-container">
            {/* Background Pattern */}
            <div className="ce-background-pattern"></div>
            
            {/* Main Content */}
            <div className="ce-main-content">
                {/* Error Header */}
                <div className="ce-error-header">
                    <div className="ce-error-text">ERROR!</div>
                </div>

                {/* Error Message */}
                <div className="ce-error-message">
                    <div className="ce-message-line">YOU DO NOT HAVE ENOUGH STARLETS.</div>
                    <div className="ce-message-group">
                        <div className="ce-message-line">GRAB MORE STARLETS</div>
                        <div className="ce-message-line">FROM THE MARKET.</div>
                    </div>
                </div>

                {/* Central Starlet Icon with Corner Decorations */}
                <div className="ce-starlet-container">
                    {/* Corner Decorations */}
                    <div className="ce-corner ce-top-left"></div>
                    <div className="ce-corner ce-top-right"></div>
                    <div className="ce-corner ce-bottom-left"></div>
                    <div className="ce-corner ce-bottom-right"></div>
                    
                    {/* Main Starlet Circle */}
                    <div className="ce-starlet-circle">
                        <img src={starletIcon} alt="Starlet" className="ce-starlet-icon" />
                    </div>
                                       
                    {/* Floating Starlets */}
                    <div className="ce-floating-starlets">
                        <img src={starletIcon} alt="Floating Starlet" className="ce-floating-starlet s1" />
                        <img src={starletIcon} alt="Floating Starlet" className="ce-floating-starlet s2" />
                    </div>
                </div>

                {/* Go to Market Button */}
                <button className="ce-go-to-market-button" onClick={onGoToMarket}>
                    GO TO MARKET
                </button>
            </div>
        </div>
    );
};

export default ChallengeError;
