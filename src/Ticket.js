import React, { useEffect, useState, useRef } from 'react';
import shared from './Shared';
import './Ticket.css';
import './Share.css';
import Ticket1 from './Ticket1';
import back from './images/back.svg';
import ticketIcon from './images/ticket.svg';
// import kmIcon from './images/km.svg';
import starletIcon from './images/starlet.png';
import scratch_ticket from './images/scratch_ticket.svg';
import bank_ticket from './images/bank_ticket.svg';
import burn_ticket from './images/burn_ticket.svg';
import scratch_ticket_button_bg from './images/scratch_ticket_button_bg.png';
import scratch_ticket_button_bg_disabled from './images/scratch_ticket_button_bg_disabled.png';

import { t } from './utils/localization';

const Ticket = ({ onClose, getProfileData }) => {
    const [ticket, setTicket] = useState(0);
    const [starlets, setStarlets] = useState(0);
    const [showTicket1, setShowTicket1] = useState(false);
    const [loading, setLoading] = useState(false);

    const setupProfileData = async () => {
        setLoading(true);
        await getProfileData();

        if (!shared.userProfile || !shared.userProfile.UserToken) {
            setLoading(false);
            return;
        }
        const userTicket = shared.getTicket();
        const userStarlets = shared.getStarlets();

        setStarlets(userStarlets);
        setTicket(userTicket);
        setLoading(false);
    };

    useEffect(() => {
        setupProfileData();
    }, [showTicket1]);

    const handleTicketSelect = (ticketType) => {

        if (ticketType === 'scratch') {
            setShowTicket1(true);
        }
    };

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    LOADING...
                </div>
            )}
            {showTicket1 ? (
                <Ticket1 starletsData={starlets} getProfileData={getProfileData} onClose={() => {
                    setShowTicket1(false);
                }} />
            ) : (
                <div className="ticket-container">
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
                                <img src={starletIcon} alt="Starlets" />
                                <span className='stat-item-main-text'>{starlets}</span>
                            </div>
                            {/*
                            <div className="stat-item">
                                <img src={ticketIcon} alt="Tickets" />
                                <span>3</span>
                            </div> */}
                        </div>
                    </header>

                    <div className="tickets-wrapper">
                        <div className="tickets-content">
                            <button 
                                className="scratch-ticket-button" 
                                onClick={() => handleTicketSelect('scratch')}
                            >
                                <div className='scratch-ticket-button-image-container'>
                                    {/* <img src={scratch_ticket} alt="Scratch Ticket" className="scratch-ticket-button-image" /> */}
                                    <img src={scratch_ticket_button_bg} alt="Scratch Ticket" className="scratch-ticket-button-image" />
                                    
                                    <div className='scratch-ticket-button-container-border'></div>
                                    <h3 className="scratch-event-card-title">{t('SCRATCH_TICKET')}</h3>
                                    <p className="scratch-event-card-subtitle">{t('SCRATCH_REWARDS')}</p>
                                    <div className="scratch-check-out-button">
                                        {t('SCRATCH_TICKETS')}
                                    </div>
                                </div>
                            </button>

                            <button 
                                className="scratch-ticket-button disabled" 
                                onClick={() => handleTicketSelect('bank')}
                            >
                                <div className='scratch-ticket-button-image-container'>
                                    <img src={scratch_ticket_button_bg_disabled} alt="Bank Ticket" className="scratch-ticket-button-image" />
                                    <div className='scratch-ticket-button-container-border disabled'></div>
                                    <h3 className="scratch-event-card-title">{t('BANK_TICKET')}</h3>
                                    <p className="scratch-event-card-subtitle">{t('LUCKY_DRAW')}</p>
                                    <div className="scratch-check-out-button disabled">
                                        {t('COMING_SOON')}
                                    </div>
                                </div>
                            </button>

                            <button 
                                className="scratch-ticket-button disabled"
                                onClick={() => handleTicketSelect('burn')}
                            >
                                <div className='scratch-ticket-button-image-container'>
                                    <img src={scratch_ticket_button_bg_disabled} alt="Burn Ticket" className="scratch-ticket-button-image" />
                                    <div className='scratch-ticket-button-container-border disabled'></div>
                                    <h3 className="scratch-event-card-title">{t('BURN_TICKET')}</h3>
                                    <p className="scratch-event-card-subtitle">{t('GOLDEN_TICKET')}</p>
                                    <div className="scratch-check-out-button disabled">
                                        {t('COMING_SOON')}
                                    </div>
                                </div>
                            </button>

                            <div className="info-box-ticket">
                                {t('EARN_EXTRA_TICKETS')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Ticket;
