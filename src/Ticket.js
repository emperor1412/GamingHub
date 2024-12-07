import React, { useEffect, useState, useRef } from 'react';
import shared from './Shared';
import './Ticket.css';
import Ticket1 from './Ticket1';
import back from './images/back.svg';
import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import scratch_ticket from './images/scratch_ticket.svg';

const Ticket = ({ onClose }) => {
    const [ticket, setTicket] = useState(0);
    const [showTicket1, setShowTicket1] = useState(false);

    const setupProfileData = async () => {
        if (!shared.userProfile || !shared.userProfile.UserToken) {
            return;
        }
        const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
        if (userTicket) {
            setTicket(userTicket.num);
        }
    };

    useEffect(() => {
        setupProfileData();
    }, []);

    return (
        <>
            {showTicket1 ? (
                <Ticket1 ticketCount={ticket} onClose={() => {
                    setShowTicket1(false);
                }} />
            ) : (
                <div className="ticket-container">
                    <header className="ticket-header">
                        <button className="back-button" onClick={onClose}>
                            <img src={back} alt="Back" />
                        </button>
                        <div className="header-stats">
                            <div className="stat-item">
                                <img src={ticketIcon} alt="Tickets" />
                                <span>{ticket}</span>
                            </div>
                            {/* <div className="stat-item">
                                <img src={kmIcon} alt="KM" />
                                <span>24.4</span>
                            </div>
                            <div className="stat-item">
                                <img src={ticketIcon} alt="Tickets" />
                                <span>3</span>
                            </div> */}
                        </div>
                    </header>

                    <div className="tickets-wrapper">
                        <div className="tickets-content">
                            <button className="ticket-card-item active" onClick={()=> {
                                setShowTicket1(true);
                            }}>
                                <img src={scratch_ticket} alt="Scratch Ticket" className="ticket-card-image" />
                            </button>

                            <button className="ticket-card-item disabled">
                                <img src={scratch_ticket} alt="Scratch Ticket" className="ticket-card-image" />
                                <div className="coming-soon">Coming Soon</div>
                            </button>

                            <button className="ticket-card-item disabled">
                                <img src={scratch_ticket} alt="Scratch Ticket" className="ticket-card-image" />
                                <div className="coming-soon">Coming Soon</div>
                            </button>

                            <div className="info-box-ticket">
                                STAY IN THE LOOP WITH THE LATEST CRYPTO LINGO! MASTER THE SLANG THAT EVERYONE'S TALKING ABOUT.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Ticket;
