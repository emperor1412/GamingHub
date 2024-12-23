import React, { useEffect, useState, useRef } from 'react';
import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import scratch_ticket_svg from './images/ticket_scratch_icon.svg';
import scratch_ticket from './images/ticket_scratch_icon.png';
import './Ticket1.css';
import locker from './images/locker.png';
import Ticket2 from './Ticket2';
import back from './images/back.svg';
import lock_icon from "./images/ticket_lock_icon.svg";
import shared from './Shared';

const Ticket1 = ({ ticketCount, kmPointData, getProfileData, onClose }) => {
    const [rowCount, setRowCount] = useState(0);
    const [needsPadding, setNeedsPadding] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showTicket2, setShowTicket2] = useState(false);
    const [ticket, setTicket] = useState(0);
    const [kmPoint, setKmPoint] = useState(0);

    const setupProfileData = async () => {
        console.log('Ticket 1 setupProfileData');
        await getProfileData();

        if (!shared.userProfile || !shared.userProfile.UserToken) {
            return;
        }
        const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
        const userKmPoint = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
        if (userTicket) {
            setKmPoint(userKmPoint.num);
            setTicket(userTicket.num);
            // setTicket(1);
            
        }
    };

    useEffect(() => {
        console.log('Ticket 1 useEffect');
        setTicket(ticketCount);
        setKmPoint(kmPointData);

        
        let row = Math.ceil(ticketCount / 3);
        if (row < 3) {
            row = 3;
        }
        setRowCount(row);
        setNeedsPadding(row < 4);
            
    }, []);

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
                        <div className='scratch-item-border'>   </div>
                        <img src={scratch_ticket} alt="Scratch Ticket" className='scratch-item-ticket-icon' />
                        {/* <div className="scratch-item-ticket-wrapper">
                            <img 
                                src={scratch_ticket} 
                                className="scratch-item-ticket-icon" 
                                alt="ticket"
                            />
                        </div> */}

                    </button>
                ) : (
                    <div 
                        key={index} 
                        className="scratch-item locked"
                    >
                        <div className='scratch-item-border'>   
                            <img src={locker} alt="Lock" className='scratch-item-locked-icon'/>
                        </div>
                        
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            {showTicket2 ? (
                <Ticket2 ticketCount={1} onClose={() => {
                    setShowTicket2(false);
                    setShowOverlay(false);
                    setupProfileData();
                    // onClose();
                }} />
            ) : (
                <>
                    <div className="ticket1-container">
                        <header className="ticket-header">
                            <button className="back-button back-button-alignment" onClick={onClose}>
                                <img src={back} alt="Back" />
                            </button>
                            <div className="header-stats">
                                <div className="stat-item-main">
                                    <img src={ticketIcon} alt="Tickets" />
                                    <span className='stat-item-main-text'>{ticket}</span>
                                </div>
                                <div className="stat-item-main">
                                    <img src={kmIcon} alt="KMPoints" />
                                    <span className='stat-item-main-text'>{kmPoint}</span>
                                </div>
                            </div>
                        </header>

                        <div className="scratch-content">
                            <div className="scratch-grid-container">
                                <div className="scratch-header">
                                    SCRATCH
                                </div>
                                <div className="scratch-grid" style={needsPadding ? { paddingBottom: '16vh' } : {}}>
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
                                
                                <img src={scratch_ticket_svg} alt="Scratch Ticket" className="overlay-ticket1-img" />
                                <div className="overlay-buttons-ticket1">
                                    <button className="overlay-button-ticket1 primary" onClick={() => setShowTicket2(true)}>
                                        SCRATCH 1 TICKET
                                    </button>
                                    <button className="overlay-button-ticket1 secondary" disabled='true'>
                                        SCRATCH ALL TICKETS
                                        <img src={lock_icon} alt="Locked" className="overlay-button-ticket1-lock" />
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
