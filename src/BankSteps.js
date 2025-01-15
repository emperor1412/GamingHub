import React from 'react';
import './BankSteps.css';
import shared from './Shared';
import backIcon from './images/back.svg';
import sneaker_icon from './images/sneaker_icon.png';
import bank_step_background from './images/bank_step_background.png';

const BankSteps = ({ showFSLIDScreen, onClose }) => {

    const handleBack = () => {
        onClose();
    };

    const handleConnectFSL = () => {
        showFSLIDScreen();
    };

    const handleClaimStarlets = () => {
        // Handle claiming starlets
    };

    const handleFindOutMore = () => {
        // Handle find out more action
    };

    if (shared.userProfile.fslId === 0) {
        return (
            <>
                <div className="bank-steps-container" style={{ background: `url(${bank_step_background}) no-repeat center center fixed`, backgroundSize: 'cover' }}></div>
                <div className="bank-steps-container">
                    <button className="back-button" onClick={handleBack}>
                        <img src={backIcon} alt="Back" />
                    </button>
                    
                    <div className="bank-steps-content">
                        <img 
                            src={sneaker_icon}
                            alt="STEPN NFT" 
                            className="stepn-nft"
                        />

                        <div className="stepn-info">
                            <div> STEPN IS A WEB3 LIFESTYLE APP THAT REWARDS </div>
                            <div> USERS FOR MOVEMENT </div>
                            USERS EQUIPPED WITH STEPN NFTS CAN EARN BY WALKING, JOGGING AND RUNNING OUTDOORS
                        </div>

                        <div className="points-container">
                            <div className="points-title">EARN UP TO 500 KM POINTS PER DAY!</div>
                            <ul className="points-steps">
                                <li>DOWNLOAD THE STEPN APP FROM YOUR APP STORE.</li>
                                <li>LINK YOUR STEPN APP TO YOUR FSL ID.</li>
                                <li>LOG IN TO THE FSL GAME HUB VIA TELEGRAM.</li>
                                <li>START YOUR WALK OR ACTIVITY USING THE STEPN APP.</li>
                                <li>AFTER YOUR ACTIVITY, CLAIM YOUR KM POINTS IN THE FSL GAME HUB.</li>
                            </ul>
                        </div>

                        <button className="action-button" onClick={handleConnectFSL}>
                            CONNECT FSL ID
                        </button>
                        {/* <button className="secondary-button">
                            CLAIM KM POINT
                        </button> */}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="bank-steps-container" style={{ background: `url(${bank_step_background}) no-repeat center center fixed`, backgroundSize: 'cover' }}></div>
            <div className="bank-steps-container"> 
                <button className="back-button" onClick={handleBack}>
                    <img src={backIcon} alt="Back" />
                </button>

                <div className="bank-steps-content">
                    <div className="starlets-received">
                        STARLETS RECEIVED 172,8
                    </div>

                    <img 
                        src={sneaker_icon}
                        alt="STEPN NFT" 
                        className="stepn-nft"
                    />

                    <div className="stats-container">
                        <div className="stat-item">
                            <div className="stat-value">4.02</div>
                            <div className="stat-label">Km</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">00:30:00</div>
                            <div className="stat-label">Time</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">24,978</div>
                            <div className="stat-label">total steps</div>
                        </div>
                    </div>

                    <div className="progress-bar">
                        <div className="progress-point active">
                            <span className="progress-value">100</span>
                        </div>
                        <div className="progress-point active">
                            <span className="progress-value">200</span>
                        </div>
                        <div className="progress-point active">
                            <span className="progress-value">300</span>
                        </div>
                        <div className="progress-point active">
                            <span className="progress-value">400</span>
                        </div>
                        <div className="progress-point active">
                            <span className="progress-value">500</span>
                        </div>
                    </div>

                    <div className="stepn-info">
                        TURN YOUR STEPS INTO INSTANT REWARDS!
                        EQUIP AND USE YOUR FIRST NFT SNEAKER, EARN GST AND GMT DAILY.
                    </div>

                    <button className="action-button" onClick={handleClaimStarlets}>
                        CLAIM STARLETS
                    </button>
                    <button className="secondary-button" onClick={handleFindOutMore}>
                        FIND OUT MORE
                    </button>
                </div>
            </div>
        </>
    );
};

export default BankSteps;
