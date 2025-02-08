import React, {useEffect} from 'react';
import './BankSteps.css';
import shared from './Shared';
import backIcon from './images/back.svg';
import sneaker_icon from './images/sneaker_icon.png';
import bank_step_coin from './images/bank_step_coin.png';
import bank_step_background from './images/bank_step_background.png';
import checkmark from './images/checkmark_banksteps.png';
import star1 from './images/single_star.svg';
import star2 from './images/single_star_2.svg';
import star3 from './images/single_star_3.svg';
import star4 from './images/single_star_4.svg';
import star5 from './images/single_star_5.svg';
import starlet from './images/starlet.png';
import sneaker_icon_group from './images/sneaker_icon_group.png';
import text_turn_your_step from './images/text_turn_your_step.png';
import claim_starlet_button from './images/claim_starlet_button.png';
import { shareStory } from '@telegram-apps/sdk';
import { trackStoryShare, trackOverlayView, trackOverlayExit } from './analytics';

/*
url: /app/getBankSteps
Request:
Response:
{
    "code": 0,
    "data": {
        "received": 40,
        "canReceive": 500,
        "distance": 20,
        "time": 30,
        "steps": 800,
        "energy": 50
    }
}

url: /app/claimBankSteps
Request:
Response:
{
    "code": 0
}
*/

const BankSteps = ({ showFSLIDScreen, onClose }) => {

    const [canClaim, setCanClaim] = React.useState(false);
    const [showOverlayClaimSuccess, setShowOverlayClaimSuccess] = React.useState(false);
    const [starletsReceived, setStarletsReceived] = React.useState(0);
    const [canReceive, setCanReceive] = React.useState(0);
    const [distance, setDistance] = React.useState(0);
    const [time, setTime] = React.useState(0);
    const [steps, setSteps] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handleBack = () => {
        onClose();
    };

    const handleConnectFSL = () => {
        showFSLIDScreen();
    };

    const handleClaimStarlets = async (depth = 0) => {
        if (depth > 3) {
            console.error('claimBankSteps failed after 3 attempts');
            return;
        }

        setLoading(true);
        try {
            console.log('Claiming bank steps...');
            const response = await fetch(`${shared.server_url}/api/app/claimBankSteps?token=${shared.loginData.token}`);
            const data = await response.json();
            console.log('Claim response:', data);
            
            if (data.code === 0) {
                console.log('Claim successful, refreshing data...');
                await getBankSteps();
                setShowOverlayClaimSuccess(true);
            } else if (data.code === 102002 || data.code === 102001) {
                console.log('Token expired, attempting to refresh...');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    console.log('Token refresh successful, retrying claimBankSteps...');
                    handleClaimStarlets(depth + 1);
                } else {
                    console.error('Login failed:', result.error);
                }
            } else {
                console.error('Failed to claim bank steps:', data);
                await shared.showPopup({
                    type: 'error',
                    message: data.msg || 'Failed to claim bank steps. Please try again later.'
                });
            }
        } catch (error) {
            console.error('claimBankSteps error:', error);
            await shared.showPopup({
                type: 0,
                message: 'Failed to claim starlets. Please try again later.'
            });
        }
        setLoading(false);
    };

    const handleFindOutMore = () => {
        // Handle find out more action
        // window.open("https://youtu.be/ZmEq4LLxRnw?si=1z635ok5An4u_HeV", "_blank");
        window.open("https://www.notion.so/fsl-web3/STEPN-User-Guide-18995c775fea800f90c1cafa81459d9c?pvs=4", "_blank");
    };

    const updateProgressBar = (received) => {
        const progressBar = document.querySelector('.progress-bar-track');
        if (progressBar) {
            const progress = Math.min(Math.max(received / 500, 0), 1) * 100;
            progressBar.style.setProperty('--progress-width', `${progress}%`);
        }
    };

    useEffect(() => {
        updateProgressBar(starletsReceived);
    }, [starletsReceived]);

    const getBankSteps = async (depth = 0) => {
        if (depth > 3) return;
        try {
            console.log('Fetching bank steps data...');
            const response = await fetch(`${shared.server_url}/api/app/getBankSteps?token=${shared.loginData.token}`);
            const data = await response.json();
            console.log('Bank steps response:', data);
            
            if (data.code === 0) {
                // data.data.received = 110;
                // data.data.canReceive = 240;

                console.log('Bank steps data:', {
                    received: data.data.received,
                    canReceive: data.data.canReceive,
                    distance: data.data.distance,
                    time: data.data.time,
                    steps: data.data.steps,
                    energy: data.data.energy
                });
                setStarletsReceived(data.data.received);
                setCanReceive(data.data.canReceive);
                setDistance((data.data.distance * 0.1 / 1000).toFixed(2));
                setTime(Math.round(data.data.time * 0.1));
                setSteps(data.data.steps);
                setCanClaim(data.data.canReceive > data.data.received);

                /* testing  */
                // setStarletsReceived(335);
                // setCanReceive(400);
                // setSteps(2232);
                // setTime(9876);
                // setDistance(22.34);
                // setCanClaim(true);
                /* ------- */

                

            } else if (data.code === 102002 || data.code === 102001) {
                console.log('Token expired, attempting to refresh...');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    console.log('Token refresh successful, retrying getBankSteps...');
                    getBankSteps(depth + 1);
                }
            } else {
                console.error('Failed to get bank steps:', data);
            }
        } catch (error) {
            console.error('getBankSteps error:', error);
        }
    };

    const setUp = async () => {
        if (shared.userProfile.fslId === 0) return;
        setLoading(true);
        await getBankSteps();
        setLoading(false);
    };

    useEffect(() => {
        setUp();
    }, []);

    const claimRewardFromSharingStory = async (depth = 0) => {
        if (depth > 3) {
            console.error('claimRewardFromSharingStory failed after 3 attempts');
            return;
        }

        console.log('Claiming reward from sharing story...');

        try {
            const response = await fetch(`${shared.server_url}/api/app/sharingStory?token=${shared.loginData.token}&type=0`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Claim reward from sharing story data:', data);

                if (data.code === 0) {
                    console.log('Reward claimed successfully');
                }
                else if (data.code === 102002 || data.code === 102001) {
                    console.error('Claim reward from sharing story error:', data.msg);
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        claimRewardFromSharingStory(depth + 1);
                    }
                    else {
                        console.error('Login failed:', result.error);
                    }
                }
                else {
                    console.error('Claim reward from sharing story error:', response);
                }
            }
            else {
                console.error('Claim reward from sharing story error:', response);
            }
        }
        catch (error) {
            console.error('claimRewardFromSharingStory error:', error);
        }
    };

    const onClickShareStory = async () => {
        console.log('Share story');

        if (shareStory.isSupported()) {
            const inviteLink = `${shared.app_link}?startapp=invite_${shared.loginData.link}`;
            try {
                await shareStory({
                    media: 'https://storage.googleapis.com/text2image-118de.appspot.com/Test/FSL.png',
                    text: inviteLink,
                    button_text: 'Join Now',
                });

                trackStoryShare('bank_steps', {
                    invite_link: inviteLink,
                    bank_steps_status: shared.userProfile.fslId !== 0 ? 'connected' : 'not_connected'
                }, shared.loginData?.userId);

                await claimRewardFromSharingStory();
                setShowOverlayClaimSuccess(false);
            } catch (error) {
                console.error('Error sharing story:', error);
            }
        }
    };

    // Track overlay views
    useEffect(() => {
        if (showOverlayClaimSuccess) {
            trackOverlayView('bank_steps_success', shared.loginData?.link, 'bank_steps');
        }
    }, [showOverlayClaimSuccess]);

    const handleCloseSuccessOverlay = () => {
        trackOverlayExit('bank_steps_success', shared.loginData?.link, 'bank_steps');
        setShowOverlayClaimSuccess(false);
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
                            <div className="points-title">EARN UP TO 500 STARLETS PER DAY!</div>
                            <ul className="points-steps">
                                <li>DOWNLOAD THE STEPN APP FROM YOUR APP STORE.</li>
                                <li>LINK YOUR STEPN APP TO YOUR FSL ID.</li>
                                <li>LOG IN TO THE FSL GAME HUB VIA TELEGRAM.</li>
                                <li>START YOUR WALK OR ACTIVITY USING THE STEPN APP.</li>
                                <li>AFTER YOUR ACTIVITY, CLAIM YOUR STARLETS IN THE FSL GAME HUB.</li>
                            </ul>
                        </div>

                        <button className="action-button" onClick={handleConnectFSL}>
                            CONNECT FSL ID
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* <div className="bank-steps-container-1" style={{ background: `url(${bank_step_background}) no-repeat center center fixed`, backgroundSize: 'cover' }}></div> */}
            <div className="bank-steps-container-1"> 
                <button className="back-button" onClick={handleBack}>
                    <img src={backIcon} alt="Back" />
                </button>

                <div className="bank-steps-content-1">
                    <div className="starlets-header">
                        STARLETS
                    </div>

                    <div className="progress-bar">
                        <div className="progress-bar-track">
                            <div style={{ backgroundColor: '#000FEF' }}>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div style={{ backgroundColor: '#000FEF' }}>&nbsp;</div>
                        </div>
                        <div className="progress-steps">
                            <div className="progress-step">100</div>
                            <div className="progress-step">200</div>
                            <div className="progress-step">300</div>
                            <div className="progress-step">400</div>
                            <div className="progress-step">500</div>
                        </div>
                    </div>

                    <img 
                        src={sneaker_icon_group}
                        alt="STEPN NFT Group" 
                        className="stepn-nft-group"
                    />
                    <div className='bs_stat'>
                        <div className="stat-labels">
                            <div className="stat-label">Km</div>
                            <div className="stat-label">Time</div>
                            <div className="stat-label">Total Steps</div>
                        </div>
                        <div className="stats-display">
                            <div className="stat-item">
                                <div className="stat-value">{distance}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{`${String(Math.floor(time / 3600)).padStart(2, '0')}:${String(Math.floor((time % 3600) / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{steps}</div>
                            </div>
                        </div>
                    </div>
                    <img 
                        src={text_turn_your_step}
                        alt="Turn your steps into instant rewards" 
                        className="turn-steps-text"
                    />

                    <button className="claim-button" onClick={handleClaimStarlets} disabled={!canClaim}>
                        <img src={claim_starlet_button} alt="Claim Starlets" />
                        <div className="claim-time">*Available daily after 13:00 UTC</div>
                    </button>

                    <button className="find-out-more" onClick={handleFindOutMore}>
                        FIND OUT MORE
                    </button>
                </div>
            </div>
            {showOverlayClaimSuccess && (
                <div className="bank-step-overlay">
                    <div className="bank-step-overlay-content">
                        <div className="bank-step-overlay-images">
                            <img src={starlet} alt="" className="bank-step-overlay-coin" />
                            <img src={sneaker_icon} alt="" className="bank-step-overlay-sneaker" />
                            <div className="bank-step-sparkle top-left"></div>
                            <div className="bank-step-sparkle top-right"></div>
                            <div className="bank-step-sparkle bottom-left"></div>
                            <div className="bank-step-sparkle bottom-right"></div>
                            <img src={star1} alt="" className="bank-step-star star1" />
                            <img src={star2} alt="" className="bank-step-star star2" />
                            <img src={star3} alt="" className="bank-step-star star3" />
                            <img src={star4} alt="" className="bank-step-star star4" />
                            <img src={star5} alt="" className="bank-step-star star5" />
                        </div>
                        <div className="bank-step-overlay-text">
                            <div>{canReceive - starletsReceived} STARLETS CLAIMED</div>
                            <div>SUCCESSFULLY!</div>
                        </div>

                        {/* <button 
                            className="action-button share-story-button" 
                            onClick={onClickShareStory}
                        >
                            <span>SHARE TO STORY</span>
                            <div className="bank-step-share-story-reward">
                                <img src={starlet} alt="" className="share-story-reward-icon" />
                                <span>24.4</span>
                            </div>
                        </button> */}

                        <button 
                            className="action-button" 
                            onClick={handleCloseSuccessOverlay}
                        >
                            <span>DONE</span>
                        </button>
                    </div>
                </div>
            )}
            {loading && (
                <div className="bank-step-loading-overlay">
                    <div className="bank-step-loading-spinner"></div>
                </div>
            )}
        </>
    );
};

export default BankSteps;
