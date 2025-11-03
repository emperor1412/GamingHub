import React from 'react';
import './LeaderboardIntroduce.css';
import background from './images/background_2.png';
import shared from './Shared';

const LeaderboardIntroduce = ({ onClose, setIsFSLIDConnected, isOpen = true, isFromProfile = false }) => {
    if (!isOpen) return null;

    const handleConnectFSLID = () => {
        console.log('Connect FSL ID clicked');
        if (setIsFSLIDConnected) {
            setIsFSLIDConnected();
        }
    };

    return (
        <div className={`li-popup-overlay ${isFromProfile ? 'fullscreen' : 'mainview'}`}>
            <div className="li-popup-container">
                {/* Background */}
                <div className="li-background-container">
                    <img src={background} alt="background" />
                </div>

                {/* Main Content */}
                <div className="li-main-content">
                    {/* Title Section */}
                    <div className="li-title-section">
                        {/* Corner borders for title */}
                        <div className="li-corner li-top-left"></div>
                        <div className="li-corner li-top-right"></div>
                        <div className="li-corner li-bottom-left"></div>
                        <div className="li-corner li-bottom-right"></div>
                        <div className="li-title-container">
                            <span className="li-title-text">STEP LEADERBOARD</span>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="li-steps-section">
                        {/* Step 1 */}
                        <div className="li-step-item">
                            <div className="li-step-content">
                                <div className="li-step-title-wrapper">
                                    <div className="li-step-title">CONNECT</div>
                                </div>
                                <div className="li-step-description">Link your FSL ID to FSL Game Hub</div>
                                <div className="li-step-description">and to STEPN.</div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="li-step-item">
                            <div className="li-step-content">
                                <div className="li-step-title-wrapper">
                                    <div className="li-step-title">CREATE</div>
                                </div>
                                <div className="li-step-description">Do your daily walk with STEPN, as usual.</div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="li-step-item">
                            <div className="li-step-content">
                                <div className="li-step-title-wrapper">
                                    <div className="li-step-title">JOIN</div>
                                </div>
                                <div className="li-step-description">You will automatically join the Leaderboards</div>
                                <div className="li-step-description">after you recorded your first steps in STEPN</div>
                            </div>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <div className="li-connect-button-container">
                        <button className="li-connect-button" onClick={handleConnectFSLID}>
                            CONNECT FSL ID
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardIntroduce;

