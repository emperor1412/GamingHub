import React, { useState, useEffect } from 'react';
import './ChallengeInfo.css';
import starletIcon from './images/starlet.png';
import backIcon from './images/back.svg';
// import legIcon from './images/legIcon.png';

const ChallengeInfo = ({ challenge, onClose, onJoinChallenge }) => {
    const [fontSize, setFontSize] = useState('14px');

    useEffect(() => {
        // Check text length and adjust font size
        const textLength = challenge.title.length;
        if (textLength > 35) {
            setFontSize('10px');
        } else if (textLength > 30) {
            setFontSize('12px');
        } else {
            setFontSize('14px');
        }
    }, [challenge.title]);

    // Format end time from API (consistent with ChallengeUpdate.js)
    const formatEndDate = (endTime) => {
        console.log('ChallengeInfo - endTime received:', endTime);
        console.log('ChallengeInfo - challenge object:', challenge);
        if (!endTime || endTime === 0) return challenge.dateEnd + ' HH:MM UTC';
        const date = new Date(endTime);
        console.log('ChallengeInfo - converted date:', date);
        return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="challenge-info-page">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={onClose}>
                <img src={backIcon} alt="Back" />
            </button>
            
            <div className="challenge-info-content">
                {/* Challenge Banner */}
                <div className="info-challenge-banner">
                    <div className="info-challenge-info">
                        <div className="info-challenge-type">{challenge.type.toUpperCase()} CHALLENGE:</div>
                        <div className="info-challenge-name" style={{ fontSize: fontSize }}>{challenge.title.toUpperCase()}</div>
                    </div>
                    <div className="info-challenge-reward">
                        <img src={starletIcon} alt="Starlet" className="info-starlet-icon" />
                        <span className="info-reward-amount">{challenge.reward}</span>
                    </div>
                </div>

                {/* Main Description */}
                <div className="main-description">
                    <div className="description-text">WALK THE</div>
                    <div className="description-text">ANCIENT PATH TO</div>
                    <div className="description-text">{challenge.shortTitle}</div>
                    <div className="description-text">IN ONE {challenge.type}!</div>
                </div>

                {/* Challenge End */}
                <div className="challenge-end">
                    CHALLENGE END: {formatEndDate(challenge.endTime)}
                </div>

                {/* Action Steps & Entry Fee */}
                <div className="challenge-details-wrapper">
                    <div className="challenge-info-corner challenge-info-top-left"></div>
                    <div className="challenge-info-corner challenge-info-top-right"></div>
                    <div className="challenge-info-corner challenge-info-bottom-left"></div>
                    <div className="challenge-info-corner challenge-info-bottom-right"></div>
                    
                    {/* Action Steps */}
                    <div className="action-steps">
                        {/* Enter Step */}
                        <div className="step-container">
                            <div className="step-content">
                                <button className="step-button enter">ENTER</button>
                                <div className="step-description-container">
                                    <div className="step-description">ENTER WITH STARLETS!</div>
                                    <div className="step-description">COMPLETE THE CHALLENGE AND GET</div>
                                    <div className="step-description">DOUBLE YOUR STARLETS BACK!</div>
                                </div>
                            </div>
                        </div>

                        {/* Walk Step */}
                        <div className="step-container">
                            <div className="step-content">
                                <button className="step-button walk">WALK</button>
                                <div className="step-description-container">
                                    <div className="step-description">DO YOUR DAILY WALK WITH STEPN, AS USUAL.</div>
                                </div>
                            </div>
                        </div>

                        {/* Claim Step */}
                        <div className="step-container">
                            <div className="step-content">
                                <button className="step-button claim">CLAIM</button>
                                <div className="step-description-container">
                                    <div className="step-description">ONCE COMPLETED, CLAIM YOUR EXPLORER</div>
                                    <div className="step-description">BADGE AND WELL EARNED STARLETS!</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Entry Fee Info */}
                    <div className="entry-fee-info">
                    <div className="fee-content">
                        <div className="fee-text">ENTRY FEE = {challenge.entryFee} STARLETS</div>
                        <div className="burn-warning-container">
                            <div className="burn-warning">IF YOU DON'T COMPLETE THE CHALLENGE IN TIME,</div>
                            <div className="burn-warning">YOUR STARLETS WILL BE BURNED</div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Join Button */}
                <div className="join-section">
                    <button className="join-button" onClick={onJoinChallenge}>
                        JOIN CHALLENGE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeInfo;
