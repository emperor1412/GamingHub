import React, { useEffect, useState, useRef } from 'react';
import ticketIcon from './images/ticket.svg';
import scratch_ticket from './images/ticket_scratch_icon.svg';
import './Ticket1.css';
import locker from './images/locker.png';

const Ticket1 = ({ ticketCount, onClose }) => {
    const [rowCount, setRowCount] = useState(0);
    const [needsPadding, setNeedsPadding] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        let row = Math.ceil(ticketCount / 3);
        if (row < 3)
            row = 3;
        setRowCount(row);
        setNeedsPadding(row < 4);
    }, [ticketCount]);

    const renderTicketRow = (startIndex) => (
        <div className="scratch-grid-row" key={startIndex}>
            {[0, 1, 2].map(offset => {
                const index = startIndex + offset;
                const isUnlocked = index < ticketCount;

                return isUnlocked ? (
                    <button 
                        key={index} 
                        className="scratch-item unlocked"
                        onClick={() => setShowOverlay(true)}
                    >
                        <img src={scratch_ticket} alt="Scratch Ticket" />
                    </button>
                ) : (
                    <div 
                        key={index} 
                        className="scratch-item locked"
                    >
                        <div className="lock-icon-ticket">
                            <img src={locker} alt="Lock"/>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            <div className="ticket1-container">
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
                        <div className="scratch-grid" style={needsPadding ? { paddingBottom: '10vh' } : {}}>
                            {[...Array(rowCount)].map((_, i) => renderTicketRow(i * 3))}
                        </div>
                    </div>

                    <div className="info-box-ticket">
                        EARN EXTRA TICKETS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
                    </div>
                </div>
            </div>

            {showOverlay && (
                <div className="overlay">
                    <div className="overlay-content">
                        <div className="overlay-header">
                            <h2>Unlock More Tickets</h2>
                            <button onClick={() => setShowOverlay(false)}>Close</button>
                        </div>
                        <div className="overlay-body">
                            <p>Invite your frens to unlock more tickets!</p>
                            <button>Invite Frens</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Ticket1;
