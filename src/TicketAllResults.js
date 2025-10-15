import React from 'react';
import './TicketAllResults.css';
import { shareStory, popup } from '@telegram-apps/sdk';
import shared from './Shared';
import { trackStoryShare } from './analytics';
import back from './images/back.svg';
import ticketIcon from './images/ticket.svg';
import ticketScratchedIcon from './images/ticket_scratched_all.png';

/*- API for Scratching all the current available tickets
    - Request:
        - token
    - Response:
        - List of reward
    
    Use the original interface
    
- API for rewarding the user 40 starlets for sharing telegram story
    - Request:
        - token:
    - Response:
        - success or failed


💡

url: /app/sharingStory
Request:
type int 0.ticket, 1.levelUp 2.ticketAll
Response:
{
"code": 0,
"data": 200
}
*/


const TicketAllResults = ({ rewards, totalTicketsUsed, onClose }) => {
    const [showShareStory, setShowShareStory] = React.useState(true);
    const [remainingTickets, setRemainingTickets] = React.useState(0);
    const [showRewardScreen, setShowRewardScreen] = React.useState(false);

    // Calculate remaining tickets when component mounts
    React.useEffect(() => {
        const initialTickets = shared.getTicket();
        const remaining = initialTickets - totalTicketsUsed;
        setRemainingTickets(remaining);
    }, [totalTicketsUsed]);

    // Calculate total rewards by type
    const calculateTotalRewards = () => {
        const totals = {};
        rewards.forEach(reward => {
            if (!totals[reward.type]) {
                totals[reward.type] = 0;
            }
            totals[reward.type] += reward.amount;
        });
        return totals;
    };

    const totalRewards = calculateTotalRewards();
    console.log('Total rewards by type:', totalRewards);

    // Define reward types and their positions
    const rewardPositions = [
        { type: 10010, position: { top: '65%', right: '10%' }, alignment: 'align-right' },      // Ticket
        { type: 20020, position: { top: '65%', left: '10%' }, size: 'sa-size-gmt', alignment: 'align-left' },     // GMT
        { type: 30020, position: { top: '65%', left: '50%', right: '50%' }, size: 'sa-size-mooar', alignment: 'align-center' },      // MOOAR
        { type: 10030, position: { top: '35%', left: '10%' }, alignment: 'align-left' },     // B$
        { type: 10020, position: { top: '35%', left: '50%', right: '50%' }, alignment: 'align-center' },   //Starlet
        // { type: 10030, position: { top: '25%', right: '7%' } },     // FSL
        // { type: 20010, position: { top: '45%', left: '7%' } },   // Starlet
        // { type: 30010, position: { top: '45%', right: '7%' } }   // Plus
    ];

    // Map reward types to their backgrounds
    const getRewardBackground = (type) => {
        switch(type) {
            case 10010: return 'rgba(255, 0, 255, 0.2)';  // Ticket - Pink
            case 20020: return 'rgba(0, 255, 0, 0.2)';    // GMT - Green
            case 30020: return 'rgba(0, 0, 255, 0.2)';    // MOOAR - Blue
            case 10030: return 'rgba(255, 165, 0, 0.2)';  // FSL - Orange
            case 20010: return 'rgba(255, 0, 255, 0.2)';  // Starlet - Pink
            case 30010: return 'rgba(255, 255, 0, 0.2)';  // Plus - Yellow
            default: return 'rgba(128, 128, 128, 0.2)';
        }
    };

    // Format amount based on type
    const formatAmount = (type, amount) => {
        if (type === 20010 || type === 20020) {
            return amount / 100;
        }
        return amount;
    };

    // Log rewards when component mounts
    React.useEffect(() => {
        console.log('Rewards to display:', rewards.map(reward => ({
            type: reward.type,
            amount: reward.amount,
            displayAmount: (reward.type === 20010 || reward.type === 20020) ? reward.amount / 100 : reward.amount
        })));
    }, [rewards]);

    // If no valid rewards, close the screen
    React.useEffect(() => {
        if (rewards.length === 0) {
            console.log('No valid rewards to display, closing screen');
            onClose();
        }
    }, [rewards, onClose]);

    // If no valid rewards, don't render anything
    if (rewards.length === 0) {
        return null;
    }

    const onClickShareStory = async () => {
        console.log('Share story');

        if (shareStory.isSupported()) {
            const inviteLink = `${shared.app_link}?startapp=invite_${shared.loginData.link}`;
            const url = "https://fsl-minigame-res.s3.ap-east-1.amazonaws.com/miniGameHub/2543.png";

            shareStory(url, {
                text: 'I just scratched tickets and claimed a reward!',
                widgetLink: {
                    url: inviteLink,
                    name: 'Join Now'
                }
              });

            trackStoryShare('ticket_all', {
                reward_claimed: true,
                invite_link: inviteLink
            }, shared.loginData?.userId);

            setShowShareStory(false);
            
            // Complete share story task instead of calling sharingStory API
            shared.completeShareStoryTask(0).then(taskCompleted => {
                if (taskCompleted) {
                    console.log('Share story task completed successfully');
                } else {
                    console.log('No share story task available or task completion failed');
                }
            });
        }
    };   

    /* Removed claimRewardFromSharingStory function as it's no longer needed */

    const handleClaimReward = () => {
        setShowRewardScreen(false);
        setShowShareStory(false);
    };

    const handleClaim = () => {
        console.log('Claiming rewards...');
        onClose();
    };

    return (
        <div className="sa_results-container">
            {showRewardScreen ? (
                <div className="result-container-ticket2">
                    <div className="coin-container">
                        <div className='reward-details'>
                            <img src={shared.mappingIcon[10020]} alt="reward type" className="reward-type-image" />
                            <div className='won-amount'>40</div>
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
                    <p className="reward-message">YOU'VE WON 40 STARLETS!</p>
                    <button className="claim-button" onClick={handleClaimReward}>CLAIM</button>
                </div>
            ) : (
                <>
                    <header className="sa_header">
                        <button className="sa_back-button back-button-alignment" onClick={onClose}>
                            <img src={back} alt="Back" />
                        </button>
                        <div className="sa_header-stats">
                            <div className="sa_stat-item">
                                <img src={ticketIcon} alt="Tickets" />
                                <span>{remainingTickets}</span>
                            </div>
                        </div>
                    </header>

                    {/* <h1 className="sa_results-title">RESULTS</h1>
                    <div className="sa_results-subtitle">
                        CONGRATULATIONS! CLAIM YOUR WINNINGS BELOW
                    </div> */}
                    
                    <div className="sa_rewards-wrapper">
                        <div className="sa_rewards-content">
                            <div className="sa_rewards-container">
                                {/* Main Starlets Reward in center */}
                                <div key={0} className="sa_reward-item" style={{ top: '1%', left: '-1%' }}>
                                    <img 
                                        src={require("./images/FSL Game Hub logo-02.png")}
                                        alt="FSL Game Hub"
                                        className="sa_main-reward-logo"
                                    />
                                </div>
                                <div key={0} className="sa_reward-item" style={{ top: '10%', right: '-7%' }}>
                                    <span className="sa_reward-title">
                                        I SCRATCHED AND WON
                                    </span>
                                </div>
                                {/* <div className="sa_main-reward">
                                    
                                    <img 
                                        src={shared.mappingIcon[10020]} 
                                        alt="Starlets"
                                        className="sa_main-reward-icon"
                                    />
                                    <span className="sa_main-reward-amount">
                                        X{formatAmount(10020, totalRewards[10020] || 0)}
                                    </span>
                                </div> */}

                                {/* Scratched Tickets Count */}
                                <div
                                    className="sa_reward-item align-right"
                                    style={{ top: '35%', right: '10%' }}
                                >
                                    <div className="sa_reward-icon-wrapper">
                                        <img 
                                            src={ticketScratchedIcon}
                                            alt="Scratched Tickets"
                                            className="sa_reward-icon"
                                        />
                                    </div>
                                    <span className="sa_reward-amount-scratched align-right">
                                        X{totalTicketsUsed}
                                    </span>
                                </div>

                                {/* Surrounding Rewards */}
                                {rewardPositions.map((item, index) => {
                                    const amount = totalRewards[item.type] || 0;
                                    return (
                                        <div
                                            key={index}
                                            className={`sa_reward-item ${item.alignment || 'align-center'}`}
                                            style={item.position}
                                        >
                                            <div 
                                                className="sa_reward-icon-wrapper"
                                            >
                                                <img 
                                                    src={shared.mappingIcon[item.type]}
                                                    alt={`Reward ${item.type}`}
                                                    className={`sa_reward-icon ${item.size || ''}`}
                                                />
                                            </div>
                                            <span className="sa_reward-amount">
                                                X{formatAmount(item.type, amount)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Buttons inside rewards container */}
                            <div className="sa_buttons-container">
                                    {showShareStory && (
                                        <button className="sa_share-story-button" onClick={() => onClickShareStory()}>
                                            SHARE TO STORY
                                        </button>
                                    )}
                                    
                                    <button className="sa_claim-all-button" onClick={handleClaim}>
                                        CLAIM LOOT
                                    </button>
                                </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicketAllResults; 