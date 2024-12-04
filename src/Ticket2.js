import React, { useState, useEffect } from 'react';
import './Ticket2.css';
import particle from './images/particle.svg';
import shared from './Shared';
import { ScratchCard } from 'next-scratchcard';
// import rewardImage from './images/FSL Games Scratch Animation-02.png'; // Adjust path as needed
import scratchBackground from './images/scratch_ticket_background_full.png'; // Adjust path as needed
import scratch_foreground from './images/FSL Games Scratch Animation-01.png'; // Adjust path as needed
import km from './images/km.svg';
import { shareStory } from '@telegram-apps/sdk';

const Ticket2 = ({ ticketCount, onClose }) => {
    const [dimensions, setDimensions] = useState({ width: 400, height: 700 });
    const [showResult, setShowResult] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [rewardImage, setRewardImage] = useState(null);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [rewardText, setRewardText] = useState('');
    const [noReward, setNoReward] = useState(false);
    const [showShareStory, setShowShareStory] = useState(true);
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
*/

    const onClickShareStory = () => {
        console.log('Share story');

        if (shareStory.isSupported()) {
            const inviteLink = `${shared.app_link}?startapp=invite_${shared.loginData.link}`;
            const url = 'https://storage.googleapis.com/text2image-118de.appspot.com/Test/FSL.png';
            // const url = 'https://firebasestorage.googleapis.com/v0/b/text2image-118de.appspot.com/o/Test%2FFSL.png?alt=media&token=1c0da5c9-e748-4916-96b5-d28ff99e7a6a' 

        // only premium users can share stories with links
        /*
            const url = `https://t.me/TestFSL_bot/fslhub?startapp=invite_${shared.loginData.link}`;
            shareStory('https://firebasestorage.googleapis.com/v0/b/text2image-118de.appspot.com/o/Test%2FFSL.png?alt=media&token=1c0da5c9-e748-4916-96b5-d28ff99e7a6a', 
            {
                text: 'Yay! I just unlocked a trophy on FSL! 🏆',
                widgetLink: {
                url:url,
                name: 'FSL Hub'
                }
            });
            */
            shareStory(url, {
                text: `Yay! I just got a reward from scratching a ticket in FSL Gaming Hub! 🎉\n${inviteLink}`,
            });

            setShowShareStory(false);
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
        const rewards = await requestTicketUse(ticketCount);
        if (rewards && rewards.length === 1) {
            // Process rewards
            const reward = rewards[0];
            console.log('Reward[0]:', JSON.stringify(reward, null, 2));
            setNoReward(reward.type === 10000);
            setRewardImage(shared.mappingIcon[reward.type]);
            setRewardAmount(reward.amount);
            setRewardText(shared.mappingText[reward.type]);
        }
        else {
            console.error('Ticket use failed');
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
        }, 2000);
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
                        <button className="claim-button" onClick={handleClaim}>Done</button>
                    )
                    : 
                    (
                        <>
                            <div className="coin-container">
                                <img src={particle} className="particle" alt="" />
                                <div className='reward-details'>
                                    <img src={rewardImage} alt="reward type" className="reward-type-image" />
                                </div>
                            </div>
                            <h2 className="congratulations">CONGRATULATIONS</h2>
                            <p className="reward-message">YOU'VE WON {rewardAmount} {rewardText}!</p>

                            {showShareStory && (
                                <button className="share-button" onClick={() => onClickShareStory()}>
                                    SHARE TO STORY
                                    <div className='share-story-reward'>
                                        <img src={km} alt="KM"/>
                                        <span>24.4</span>
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
                                src={scratchBackground}
                                alt="reward"
                                className="scratch-background"
                            />
                            {
                            noReward 
                            ? (
                                <div className="no-reward">
                                    <h2>NO REWARD</h2>
                                    <h2>Try again next time!</h2>
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
