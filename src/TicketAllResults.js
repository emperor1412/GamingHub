import React from 'react';
import './TicketAllResults.css';
import { popup } from '@telegram-apps/sdk';
import shared from './Shared';
import { trackStoryShare } from './analytics';
import back from './images/back.svg';
import ticketIcon from './images/ticket.svg';
import { lineShare } from './services/lineShare';
import { t } from './utils/localization';

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

Note: sharingStory API has been replaced with task type 5 completion
Share story rewards are now handled through task completion instead of direct API calls
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
        { type: 10010, position: { top: '50%', left: '50%', right: '50%' } },      // Ticket
        { type: 20020, position: { top: '50%', left: '7%' } },     // GMT
        { type: 30020, position: { top: '50%', right: '7%' } },      // MOOAR
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
        try {
            const success = await lineShare.shareToLine({
                amount: '40', // Reward amount for all tickets
                type: 'ticket_all'
            }, shared.loginData?.link);

            if (success) {
                setShowShareStory(false);
                // Complete share story task instead of calling sharingStory API
                const taskCompleted = await shared.completeShareStoryTask(0);
                if (taskCompleted) {
                    console.log('Share story task completed successfully');
                } else {
                    console.log('No share story task available or task completion failed');
                }
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

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
                    <h2 className="congratulations">{t('CONGRATULATIONS')}</h2>
                    <p className="reward-message">{t('YOU_HAVE_WON')} 40 STARLETS!</p>
                    <button className="claim-button" onClick={handleClaimReward}>{t('CLAIM')}</button>
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
                                <div key={0} className="sa_reward-item" style={{ top: '1%', right: '-2%' }}>
                                    <img 
                                        src={require("./images/FSL Game Hub logo-02.png")}
                                        alt="FSL Game Hub"
                                        className="sa_main-reward-logo"
                                    />
                                </div>
                                <div className="sa_main-reward">
                                    
                                    <img 
                                        src={shared.mappingIcon[10020]} 
                                        alt="Starlets"
                                        className="sa_main-reward-icon"
                                    />
                                    <span className="sa_main-reward-amount">
                                        X{formatAmount(10020, totalRewards[10020] || 0)}
                                    </span>
                                </div>

                                {/* Surrounding Rewards */}
                                {rewardPositions.map((item, index) => {
                                    const amount = totalRewards[item.type] || 0;
                                    return (
                                        <div
                                            key={index}
                                            className="sa_reward-item"
                                            style={item.position}
                                        >
                                            <div 
                                                className="sa_reward-icon-wrapper"
                                            >
                                                <img 
                                                    src={shared.mappingIcon[item.type]}
                                                    alt={`Reward ${item.type}`}
                                                    className="sa_reward-icon"
                                                />
                                            </div>
                                            <span className="sa_reward-amount">
                                                X{formatAmount(item.type, amount)}
                                            </span>
                                        </div>
                                    );
                                })}

                                {/* Buttons inside rewards container */}
                                <div className="sa_buttons-container">
                                    {showShareStory && (
                                        <button className="sa_share-story-button" onClick={onClickShareStory}>
                                            {t('SHARE_TO_STORY')}
                                        </button>
                                    )}
                                    
                                    <button className="sa_claim-all-button" onClick={handleClaim}>
                                        {t('CLAIM_LOOT')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicketAllResults; 