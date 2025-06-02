import React, { useState, useEffect } from 'react';
import './Ticket2.css';
import particle from './images/particle.svg';
import shared from './Shared';
import { ScratchCard } from 'next-scratchcard';
// import rewardImage from './images/FSL Games Scratch Animation-02.png'; // Adjust path as needed
import scratchBackground from './images/scratch_ticket_background_full.png'; // Adjust path as needed
import scratch_foreground from './images/FSL Games Scratch Animation-01.png'; // Adjust path as needed
// import nothing from './images/FSL-Games-UI-2-nothing.png'; // Adjust path as needed
import nothing from './images/background_no_reward.png'; // Adjust path as needed

// import km from './images/km.svg';
import km from './images/starlet.png';

import fail_animation_frame_0 from './images/FSL Games UI 2-10.png';
import fail_animation_frame_1 from './images/FSL Games UI 2-09.png';
import fail_animation_frame_2 from './images/FSL Games UI 2-08.png';
import fail_animation_frame_3 from './images/FSL Games UI 2-07.png';

import { shareStory, popup } from '@telegram-apps/sdk';
import { trackStoryShare } from './analytics';

let animationFrameIndex = 0;

const Ticket2 = ({ onClose }) => {
    const [dimensions, setDimensions] = useState({ width: 400, height: 700 });
    const [showResult, setShowResult] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [rewardImage, setRewardImage] = useState(null);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [rewardText, setRewardText] = useState('');
    const [noReward, setNoReward] = useState(false);
    const [showShareStory, setShowShareStory] = useState(true);
    const [tryAgain, setTryAgain] = useState(false);
    const [animationFrame, setAnimationFrame] = useState(0);

    const animationFrames = [
        fail_animation_frame_0,
        fail_animation_frame_1,
        fail_animation_frame_2,
        fail_animation_frame_3,
    ];
/*
url: /app/ticketUse
Request:
	type int 1.use one, other.use all
Response:
{
    "code": 0,
    "data": [
        {
            "type": 10000, //propType
            "amount": 1  
        },
        {
            "type": 10020,
            "amount": 100
        }
    ]
}

url: /app/sharingTicket
Request:
Response:
{
    "code": 0,
    "data": 200 //Reward granted
}
*/
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
            try {
                const success = await shared.shareStoryWithReferral(
                    'ticket',
                    "https://fsl-minigame-res.s3.ap-east-1.amazonaws.com/miniGameHub/2543.png",
                    'I just scratched a ticket and claimed a reward! Join me to get your rewards too!'
                );

                if (success) {
                    setShowShareStory(false);
                    await claimRewardFromSharingStory();
                }
            } catch (error) {
                console.error('Error sharing story:', error);
            }
        }
    };

    const requestTicketUse = async (amount, depth = 0) => {
        if (depth > 3) {
            console.error('Get trophy data failed after 3 attempts');
            return;
        }
        console.log(`Requesting ticket use...: ${amount}`);
        let retVal;

        try {
            const response = await fetch(`${shared.server_url}/api/app/ticketUse?token=${shared.loginData.token}&type=${amount}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },                
            });


            if (response.ok) {
                const data = await response.json();
                console.log('Ticket use data:', data);

                if (data.code === 0) {
                    console.log('Ticket used successfully');
                    retVal = data.data;

                }
                else if (data.code === 102002 || data.code === 102001) {
                    console.error('Ticket use error:', data.msg);
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        retVal = requestTicketUse(amount, depth + 1);
                    }
                    else {
                        console.error('Login failed:', result.error);
                    }
                }
                else {
                    console.error('Ticket use error:', response);
                }
            }
            else {
                console.error('Ticket use error:', response);
            }
        }
        catch (error) {
            console.error('Ticket use error:', error);
        }

        return retVal;
    }

    const setupRewward = async () => {
        setShowLoading(true);
        const rewards = await requestTicketUse(1);
        if (rewards && rewards.length === 1) {
            // Process rewards
            const reward = rewards[0];
            console.log('Reward[0]:', JSON.stringify(reward, null, 2));
            setNoReward(reward.type === 10000);
            // reward.type = 10000;
            // setNoReward(true);
            setRewardImage(shared.mappingIcon[reward.type]);
            setRewardAmount((reward.type === 20010 || reward.type === 20020) ? reward.amount / 100 : reward.amount);
            setRewardText(shared.mappingText[reward.type]);

            // testing
            // setRewardImage(shared.mappingIcon[30020]);
        }
        else {
            console.error('Ticket use failed');
            if (popup.open.isAvailable()) {
                const promise = popup.open({
                    title: 'Ticket use failed',
                    message: `Error: Ticket use failed`,
                    buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                await promise;
            }
            onClose();
        }
        setShowLoading(false);
    };

    useEffect(() => {
        setupRewward();  
    }, []);

    useEffect(() => {
        const updateDimensions = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate dimensions (adjust these ratios as needed)
            const width = Math.min(viewportWidth, 1080); // 90% of viewport width, max 400px
            const height = Math.min(viewportHeight, 1920); // 70% of viewport height, max 700px
            // const height = width * 1920 / 1080;
            // 1080 x 1920
            console.log('Dimensions:', width, height);
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
        animationFrameIndex = 0;
        if(noReward) {
            // setTryAgain(true);
            setAnimationFrame(animationFrameIndex);
            setShowResult(true);
            const interval = setInterval(() => {
                if (animationFrameIndex >= animationFrames.length) {
                    clearInterval(interval);
                    setTryAgain(true);
                }
                else {
                    setAnimationFrame(animationFrameIndex);
                }
                ++animationFrameIndex;

            }, 200);
        }
        else {
            setTimeout(() => {
                setShowResult(true);
            }, 0);
        }


    };

    const handleClaim = () => {
        console.log('Claiming reward...');
        setShowResult(false);
        onClose();
    };


    return (
        <>
            {
            showLoading ? (
                <div className='loading'>Loading...</div>
            )
            : showResult ? (
                <div className="result-container-ticket2">
                    {noReward ?
                    (
                        <>
                            {/* <button className="claim-button" onClick={handleClaim}>Done</button> */}
                            <div className='fail-animation-container'>
                                <img src={animationFrames[animationFrame]} alt="Fail animation" className='fail-animation'/>
                            </div>

                            {tryAgain && (
                            
                                <button 
                                    className="full-viewport-button"
                                    onClick={() => {
                                        setTryAgain(false);
                                        handleClaim();
                                    }}
                                />
                                
                            )}
                        </>
                    )
                    : 
                    (
                        <>
                            <div className="coin-container">
                                {/* <img src={particle} className="particle" alt="" /> */}
                                <div className='reward-details'>
                                    <img src={rewardImage} alt="reward type" className="reward-type-image" />
                                    <div className='won-amount'>{rewardAmount}</div>
                                    <div className='stars' style={{ top: 158, left: -124 }}>
                                        <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                                        <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                                        <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                                        <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                                        <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                                    </div>
                                </div>
                            </div>
                            <h2 className="congratulations">CONGRATULATIONS</h2>
                            <p className="reward-message">YOU'VE WON {rewardAmount} {rewardText}!</p>

                            {showShareStory && (
                                <button className="share-button" onClick={() => onClickShareStory()}>
                                    SHARE TO STORY
                                    <div className='share-story-reward'>
                                        <img src={km} alt="KM" className='share-story-reward-starlet'/>
                                        <span className='share-story-reward-text'>20</span>
                                    </div>
                                </button>
                            )}

                            <button className="claim-button" onClick={handleClaim}>CLAIM</button>
                        </>
                    )}
                </div>
            ) :
            (
                <div className="scratch-container">
                    <ScratchCard 
                        finishPercent={40} 
                        brushSize={40} 
                        onComplete={handleComplete}
                        width={dimensions.width}
                        height={dimensions.height}
                        image={scratch_foreground}      
                        >
                        <div className="reward-content">
                            <img
                                src={noReward ? nothing : scratchBackground}
                                alt="reward"
                                className= "scratch-background"
                            />
                            {
                            noReward 
                            ? (
                                <div className="no-reward">
                                    {/* <h2>NO REWARD</h2>
                                    <h2>Try again next time!</h2> */}
                                </div>
                            )
                            : (
                                <>
                                    <div className="reward-details">
                                        <img 
                                            src={rewardImage} 
                                            alt="reward type" 
                                            className="reward-type-image"
                                        />
                                        <span className="reward-amount">{rewardAmount}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </ScratchCard>

                    
                </div>
            )}
        </>
    );
};

export default Ticket2;
