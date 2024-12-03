import React from 'react';
import ticketIcon from './images/ticket.svg';
import scratch_ticket from './images/ticket_scratch_icon.svg';
import './Ticket1.css';

const Ticket1 = ({ ticketCount, onClose }) => {
    return (
        <div className="ticket-container">
            <header className="ticket-header">
                <button className="back-button" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <div className="header-stats">
                    <div className="stat-item">
                        <img src={ticketIcon} alt="Tickets" />
                        <span>{ticketCount}</span>
                    </div>
                </div>
            </header>

            <div className="scratch-content">
                <div className="scratch-grid-container">
                    <div className="scratch-header">
                        SCRATCH
                    </div>
                    <div className="scratch-grid">
                        {[...Array(9)].map((_, index) => (
                            <button 
                                key={index} 
                                className={`scratch-item ${index < 3 ? 'unlocked' : 'locked'}`}
                            >
                                {index < 3 ? (
                                    <img src={scratch_ticket} alt="Scratch Ticket" />
                                ) : (
                                    <div className="lock-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="info-box-ticket">
                    EARN EXTRA TICKETS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
                </div>
            </div>
        </div>
    );
};

export default Ticket1;
