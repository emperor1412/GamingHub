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
        // Calculate remaining tickets using the total tickets used
        const initialTickets = shared.getTicket();
        const remaining = initialTickets - totalTicketsUsed;
        setRemainingTickets(remaining);
        
        console.log('TicketAllResults - Remaining tickets calculation:', {
            initialTickets,
            totalTicketsUsed,
            remaining,
            calculation: `${initialTickets} - ${totalTicketsUsed} = ${remaining}`
        });
    }, []); // Only run once when component mounts

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

            <h1 className="sa_results-title">RESULTS</h1>
            <div className="sa_results-subtitle">
                CONGRATULATIONS! CLAIM YOUR WINNINGS BELOW
            </div>
            
            <div className="sa_rewards-wrapper">
                <div className="sa_rewards-content">
                    <div className="sa_rewards-container">
                        <div className="sa_rewards-container-border"></div>
                        <div className="sa_rewards-grid">
                            {rewards.map((reward, index) => (
                                <div key={index} className="sa_reward-item">
                                    <img 
                                        src={shared.mappingIcon[reward.type]} 
                                        alt="reward" 
                                        className="sa_reward-icon"
                                    />
                                    <span className="sa_reward-amount">
                                        {(reward.type === 20010 || reward.type === 20020) 
                                            ? reward.amount / 100 
                                            : reward.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="sa_buttons-container">
                {showShareStory && (
                    <button className="sa_share-story-button" onClick={onClickShareStory}>
                        SHARE STORY
                    </button>
                )}
                
                <button className="sa_claim-all-button" onClick={handleClaim}>
                    CLAIM
                </button>
            </div>
        </div>
    );
};

export default TicketAllResults; 