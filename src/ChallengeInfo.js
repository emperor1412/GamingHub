import React from 'react';
import './ChallengeInfo.css';
import starletIcon from './images/starlet.png';
// import legIcon from './images/legIcon.png';

const ChallengeInfo = ({ challenge, onClose, onJoinChallenge }) => {
    return (
        <div className="challenge-info-page">
            <div className="challenge-info-content">
                {/* Challenge Banner */}
                <div className="info-challenge-banner">
                    <div className="info-challenge-info">
                        <div className="info-challenge-type">{challenge.type.toUpperCase()} CHALLENGE:</div>
                        <div className="info-challenge-name">{challenge.title.toUpperCase()}</div>
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
                    <div className="description-text">MACHU PICCHU</div>
                    <div className="description-text">IN ONE WEEK!</div>
                </div>

                {/* Challenge End */}
                <div className="challenge-end">
                    CHALLENGE END: {challenge.dateEnd} 13:00 UTC
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
