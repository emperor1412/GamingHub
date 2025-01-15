import React from 'react';
import './BankSteps.css';
import shared from './Shared';
import backIcon from './images/back.svg';
import sneaker_icon from './images/sneaker_icon.png';
import bank_step_background from './images/bank_step_background.png';
import checkmark from './images/checkmark_banksteps.png';

const BankSteps = ({ showFSLIDScreen, onClose }) => {

    const [canClaim, setCanClaim] = React.useState(false);

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
        window.open("https://youtu.be/ZmEq4LLxRnw?si=1z635ok5An4u_HeV", "_blank");
    };

    if (shared.userProfile.fslId === 0 && false) {
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
            <div className="bank-steps-container-1" style={{ background: `url(${bank_step_background}) no-repeat center center fixed`, backgroundSize: 'cover' }}></div>
            <div className="bank-steps-container-1"> 
                <button className="back-button" onClick={handleBack}>
                    <img src={backIcon} alt="Back" />
                </button>

                <div className="bank-steps-content-1">
                    <div className="starlets-received">
                        STARLETS RECEIVED
                        <span className='starlets-received-amount'>172,8</span>
                    </div>

                    <img 
                        src={sneaker_icon}
                        alt="STEPN NFT" 
                        className="stepn-nft"
                    />

                    <div className="bank-step-stats-container">
                        <div className="bank-step-stat-item">
                            <div className="bank-step-stat-value">4.02</div>
                            <div className="bank-step-stat-label">Km</div>
                        </div>
                        <div className="bank-step-stat-item">
                            <div className="bank-step-stat-value">00:30:00</div>
                            <div className="bank-step-stat-label">Time</div>
                        </div>
                        <div className="bank-step-stat-item">
                            <div className="bank-step-stat-value">24,978</div>
                            <div className="bank-step-stat-label">total steps</div>
                        </div>
                    </div>

                    <div className="bank-step-progress-container">
                        <div className="bank-step-progress-box">
                            <span className="bank-step-progress-label">STARLETS</span>
                            {/* <span className="bank-step-progress-divider">|</span> */}
                            <div className="bank-step-progress-value active">
                                <span>100</span>
                                <img src={checkmark} alt="" className="bank-step-progress-checkmark" />
                            </div>
                            <span className="bank-step-progress-divider">|</span>
                            <div className="bank-step-progress-value active">
                                <span>200</span>
                                <img src={checkmark} alt="" className="bank-step-progress-checkmark" />
                            </div>
                            <span className="bank-step-progress-divider">|</span>
                            <div className="bank-step-progress-value active">
                                <span>300</span>
                                <img src={checkmark} alt="" className="bank-step-progress-checkmark" />
                            </div>
                            <span className="bank-step-progress-divider">|</span>
                            <div className="bank-step-progress-value active">
                                <span>400</span>
                                <img src={checkmark} alt="" className="bank-step-progress-checkmark" />
                            </div>
                            <span className="bank-step-progress-divider">|</span>
                            <div className="bank-step-progress-value">500</div>
                        </div>
                    </div>

                    <div className="stepn-info">
                        TURN YOUR STEPS INTO INSTANT REWARDS! <br /><br />
                        EQUIP AND USE YOUR FIRST NFT <br/> SNEAKER, EARN GST AND GMT DAILY.
                    </div>

                    <button 
                        className="action-button" 
                        onClick={handleClaimStarlets}
                        disabled={!canClaim}
                    >
                        {/* {canClaim ? 'CLAIM STARLETS' : 'CLAIM UNAVAILABLE'} */}
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
