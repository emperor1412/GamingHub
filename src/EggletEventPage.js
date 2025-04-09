import React, { useState, useEffect } from 'react';
import './EggletEventPage.css';
import shared from './Shared';
import back from './images/back.svg';
import ticketIcon from './images/ticket.svg';
import starletIcon from './images/starlet.png';
import eggletLogo from './images/Egglets_Logo.png';
import scratching from './images/Egglets_Description_1.png';
import buying from './images/Egglets_Description_2.png';
import inviting from './images/Egglets_Description_3.png';
import levelUp from './images/Egglets_Description_4.png';
import fslLogo from './images/FSLID_Login_Logo.png';
import mooarLogo from './images/MooAR_Login_Logo.png';
import eggIcon from './images/eggs_event-points-icon.png';
import { trackUserAction } from './analytics';

const EggletEventPage = ({ onClose }) => {
    const [eventPoints, setEventPoints] = useState(0);
    const [starlets, setStarlets] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [userLevel, setUserLevel] = useState(1);
    const [eggletsProgress, setEggletsProgress] = useState({
        current: 500000,
        total: 2000000
    });
    const [loading, setLoading] = useState(false);

    const calculateLevelGain = (level) => {
        if (level < 2) return 0;
        if (level > 50) return 109;
        return 15 + (level - 2) * 2;
    };

    useEffect(() => {
        // Initialize data
        setupData();
        
        // Track event page view
        trackUserAction('egglet_event_page_viewed', {}, shared.loginData?.userId);
    }, []);

    const setupData = async () => {
        setLoading(true);
        
        try {
            // Here you would fetch event data from your API
            // For now we'll just use placeholder data
            
            // Get user's tickets and starlets
            if (shared.userProfile && shared.userProfile.UserToken) {
                const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
                const userStarlets = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
                
                if (userTicket) setTicket(userTicket.num);
                if (userStarlets) setStarlets(userStarlets.num);
            }
            
            // Get user's level from shared.userProfile
            if (shared.userProfile) {
                setUserLevel(shared.userProfile.level || 1);
            }
            
            // Placeholder for event points
            setEventPoints(0);
            
        } catch (error) {
            console.error('Error fetching egglet event data:', error);
        } finally {
            setLoading(false);
        }
    };

    const progressPercentage = Math.min((eggletsProgress.current / eggletsProgress.total) * 100, 100);
    const progressPercentageDisplay = Math.min((eggletsProgress.current / eggletsProgress.total) * 100, 97.7);

    return (
        <div className="eggs_egglet-event-container">
            {loading && (
                <div className="eggs_loading-overlay">
                    LOADING...
                </div>
            )}
            
            <header className="eggs_egglet-event-header">
                <button className="back-button back-button-alignment" onClick={onClose}>
                    <img src={back} alt="Back" />
                </button>
                <div className="header-stats">
                    <div className="stat-item-main">
                        <img src={ticketIcon} alt="Tickets" />
                        <span className='stat-item-main-text'>{ticket}</span>
                    </div>
                    <div className="stat-item-main">
                        <img src={starletIcon} alt="Starlets" />
                        <span className='stat-item-main-text'>{starlets}</span>
                    </div>
                </div>
            </header>

            <div className="eggs_egglet-event-content">
                <div className="eggs_event-points-bar">
                    <span className="eggs_event-points-label">EVENT POINTS</span>
                    <div className="eggs_event-points-value-display">
                        <div className="eggs_event-points-icon">
                            <img src={eggIcon} alt="Egglet Event" />
                        </div>
                        <span className="eggs_event-points-value">{eventPoints.toString().padStart(6, '0')}</span>
                    </div>
                    {/* <span className="eggs_event-points-value">{eventPoints.toString().padStart(6, '0')}</span> */}
                </div>
                
                <div className="eggs_global-egglets-section">
                    <div className="eggs_corner-frame">
                        <div className="eggs_corner eggs_top-left"></div>
                        <div className="eggs_corner eggs_top-right"></div>
                        <div className="eggs_corner eggs_bottom-left"></div>
                        <div className="eggs_corner eggs_bottom-right"></div>
                        
                        <div className="eggs_global-egglets-title">
                            GLOBAL EGGLETS CLAIMED
                            <div className="eggs_claim-indicators">
                                <span className="eggs_claim-indicator">
                                    {eggletsProgress.current >= eggletsProgress.total ? (
                                        "✓"
                                    ) : (
                                        <img src={fslLogo} alt="FSL ID" className="eggs_indicator-logo" />
                                    )}
                                </span>
                                <span className="eggs_claim-indicator">
                                    {eggletsProgress.current >= eggletsProgress.total / 2 ? (
                                        "✓"
                                    ) : (
                                        <img src={mooarLogo} alt="MOOAR" className="eggs_indicator-logo" />
                                    )}
                                </span>
                            </div>
                        </div>
                        
                        <div className="eggs_progress-bar-container">
                            <div className="eggs_progress-bar">
                                <div 
                                    className="eggs_progress-fill" 
                                    style={{ 
                                        width: `${progressPercentageDisplay}%`,
                                        clipPath: progressPercentage >= 99 
                                            ? 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' 
                                            : 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
                                        borderRadius: progressPercentage >= 99 
                                            ? '25px'
                                            : '25px 0 0 25px',
                                    }}
                                >
                                    <div className="eggs_progress-text">
                                    {progressPercentage}%
                                </div>
                                </div>
                                
                            </div>
                        </div>
                        
                        <div className="eggs_egglets-info-container">
                            <div className="eggs_egglets-info">
                                <div className="eggs_egglets-balloons">
                                    <img src={eggletLogo} alt="Egglet Logo" className="eggs_egglet-balloons-image" />
                                </div>
                                <h3 className="eggs_egglets-title">GAIN POINTS +</h3>
                                <h3 className="eggs_egglets-title">EARN EGGLETS</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="eggs_points-methods-section">
                    <div className="eggs_points-method">
                        <img src={scratching} alt="Scratching Tickets" className="eggs_method-image" />
                        <h4 className="eggs_method-title">SCRATCHING TICKETS</h4>
                        <div className="eggs_method-details">
                            <div className="eggs_method-detail">1 Ticket = 3</div>
                        </div>
                    </div>
                    
                    <div className="eggs_points-method">
                        <img src={buying} alt="Buying Starlets" className="eggs_method-image" />
                        <h4 className="eggs_method-title">BUYING STARLETS</h4>
                        <div className="eggs_method-details">
                            <div className="eggs_method-detail">500 = 20</div>
                            <div className="eggs_method-detail">1500 = 50</div>
                            <div className="eggs_method-detail">5000 = 120</div>
                        </div>
                    </div>
                    
                    <div className="eggs_points-method">
                        <img src={inviting} alt="Inviting Friends" className="eggs_method-image" />
                        <h4 className="eggs_method-title">INVITING FRIENDS</h4>
                        <div className="eggs_method-details">
                            <div className="eggs_method-detail">NORMAL USER = 5</div>
                            <div className="eggs_method-detail">PREMIUM USER = 15</div>
                        </div>
                    </div>
                    
                    <div className="eggs_points-method">
                        <img src={levelUp} alt="Level Up" className="eggs_method-image" />
                        <h4 className="eggs_method-title">LEVEL UP</h4>
                        <div className="eggs_method-details">
                            <div className="eggs_method-detail">NEXT LEVEL UP</div>
                            <div className="eggs_method-detail">GAIN = {calculateLevelGain(userLevel)}</div>
                        </div>
                    </div>
                </div>
                               
                <div className="eggs_auth-logos">
                    <img src={fslLogo} alt="FSL ID" className="eggs_auth-logo" />
                    <img src={mooarLogo} alt="MOOAR" className="eggs_auth-logo" />
                </div>
            </div>
        </div>
    );
};

export default EggletEventPage; 