import React from 'react';
import './TicketAllResults.css';
import { shareStory, popup } from '@telegram-apps/sdk';
import shared from './Shared';
import { trackStoryShare } from './analytics';
import back from './images/back.svg';
import ticketIcon from './images/ticket.svg';

const TicketAllResults = ({ rewards, totalTicketsUsed, onClose }) => {
    const [showShareStory, setShowShareStory] = React.useState(true);
    const [remainingTickets, setRemainingTickets] = React.useState(0);

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
        { type: 10010, position: { top: '5%', left: '7%' } },      // Ticket
        { type: 20020, position: { top: '5%', right: '7%' } },     // GMT
        { type: 30020, position: { top: '38%', left: '7%' } },      // MOOAR
        { type: 10030, position: { top: '38%', right: '7%' } },     // FSL
        { type: 20010, position: { top: '70%', left: '7%' } },   // Starlet
        { type: 30010, position: { top: '70%', right: '7%' } }   // Plus
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

    const onClickShareStory = () => {
        if (shareStory.isSupported()) {
            const inviteLink = `${shared.app_link}?startapp=invite_${shared.loginData.link}`;
            const url = "https://fsl-minigame-res.s3.ap-east-1.amazonaws.com/miniGameHub/2543.png";

            shareStory(url, {
                text: 'I just scratched all my tickets and claimed rewards!',
            });

            trackStoryShare('ticket_all', {
                reward_claimed: true,
                invite_link: inviteLink,
                rewards_count: rewards.length
            }, shared.loginData?.userId);

            setShowShareStory(false);
            claimRewardFromSharingStory();
        }
    };

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
                if (data.code === 0) {
                    console.log('Reward claimed successfully');
                }
                else if (data.code === 102002 || data.code === 102001) {
                    console.log('Token expired, attempting to re-login');
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        claimRewardFromSharingStory(depth + 1);
                    }
                }
            }
        }
        catch (error) {
            console.error('claimRewardFromSharingStory error:', error);
        }
    };

    const handleClaim = () => {
        console.log('Claiming rewards...');
        onClose();
    };

    return (
        <div className="sa_results-container">
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
                                        // style={{ background: getRewardBackground(item.type) }}
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
                    </div>
                    
                </div>
            </div>

            <div className="sa_buttons-container">
                {showShareStory && (
                    <button className="sa_share-story-button" onClick={onClickShareStory}>
                        SHARE TO STORY
                        <div className="sa_share-story-reward">
                            <span>×40</span>
                            <img src={shared.mappingIcon[10020]} alt="Starlet" />
                        </div>
                    </button>
                )}
                
                <button className="sa_claim-all-button" onClick={handleClaim}>
                    CLAIM LOOT
                </button>
            </div>
        </div>
    );
};

export default TicketAllResults; 