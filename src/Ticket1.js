import React, { useEffect, useState, useRef } from 'react';
import ticketIcon from './images/ticket.svg';
import scratch_ticket from './images/ticket_scratch_icon.svg';
import './Ticket1.css';
import locker from './images/locker.png';
import Ticket2 from './Ticket2';

const Ticket1 = ({ ticketCount, onClose }) => {
    const [rowCount, setRowCount] = useState(0);
    const [needsPadding, setNeedsPadding] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showTicket2, setShowTicket2] = useState(false);

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
                        onClick={() => {
                            console.log('Scratch ticket', index);
                            setShowOverlay(true);
                        }}
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
            {showTicket2 ? (
                <Ticket2 ticketCount={ticketCount} onClose={() => {
                    setShowTicket2(false);
                    onClose();
                }} />
            ) : (
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
                        <div className="overlay-ticket1" onClick={() => setShowOverlay(false)}>
                            <div className="overlay-content-ticket1" onClick={e => e.stopPropagation()}>
                                {/* <div className="overlay-text-ticket1">
                                    TEST YOUR KNOWLEDGE OF POPULAR CRYPTO SLANG TERMS! SELECT THE CORRECT MEANING FOR EACH TERM BELOW.
                                </div> */}
                                <img src={scratch_ticket} alt="Scratch Ticket" className="overlay-ticket1-img" />
                                <div className="overlay-buttons-ticket1">
                                    <button className="overlay-button-ticket1 primary" onClick={() => setShowTicket2(true)}>
                                        SCRATCH 1 TICKET
                                    </button>
                                    <button className="overlay-button-ticket1 secondary">
                                        SCRATCH ALL TICKETS
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Ticket1;
