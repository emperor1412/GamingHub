import React from 'react';
import './TicketAllResults.css';
import { shareStory, popup } from '@telegram-apps/sdk';
import shared from './Shared';
import { trackStoryShare } from './analytics';

const TicketAllResults = ({ rewards, onClose }) => {
    const [showShareStory, setShowShareStory] = React.useState(true);

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

    return (
        <div className="results-container">
            <h1 className="results-title">RESULTS</h1>
            <div className="results-subtitle">
                CONGRATULATIONS! CLAIM YOUR WINNINGS BELOW
            </div>
            
            <div className="rewards-wrapper">
                <div className="rewards-content">
                    <div className="rewards-container">
                        <div className="rewards-container-border"></div>
                        <div className="rewards-grid">
                            {rewards.map((reward, index) => (
                                <div key={index} className="reward-item">
                                    <img 
                                        src={shared.mappingIcon[reward.type]} 
                                        alt="reward" 
                                        className="reward-icon"
                                    />
                                    <span className="reward-amount">
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

            <div className="buttons-container">
                {showShareStory && (
                    <button className="share-story-button" onClick={onClickShareStory}>
                        SHARE STORY
                    </button>
                )}
                
                <button className="claim-all-button" onClick={onClose}>
                    CLAIM
                </button>
            </div>
        </div>
    );
};

export default TicketAllResults; 