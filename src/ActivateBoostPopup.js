import React, { useState } from 'react';
import './ActivateBoostPopup.css';
import popupBackground from './images/Popup_Activate_boost.png';
import boostIcon from './images/Boost_Icon.png';
import boostIcon2 from './images/Icon_Step_Boost.png';
import ActivateBoostConfirmPopup from './ActivateBoostConfirmPopup';

const ActivateBoostPopup = ({ isOpen, onClose, onActivate }) => {
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [selectedBoostType, setSelectedBoostType] = useState(null);

    if (!isOpen) return null;

    const handleActivate = (boostType) => {
        setSelectedBoostType(boostType);
        setShowConfirmPopup(true);
    };

    const handleConfirmActivate = (boostType) => {
        onActivate(boostType);
        setShowConfirmPopup(false);
        onClose();
    };

    const handleCloseConfirmPopup = () => {
        setShowConfirmPopup(false);
        setSelectedBoostType(null);
    };

    return (
        <>
            <div className="abp_overlay">
                <div className="abp_popup-container" style={{ backgroundImage: `url(${popupBackground})` }}>
                    <div className="abp_content">
                        <div className="abp_boost-options">
                            <div className="abp_boost-option">
                                <img src={boostIcon} alt="Boost Icon" className="abp_boost-icon" />
                            <div className="abp_boost-label">1.5X BOOST STEPS</div>
                                <button className="abp_activate-button-small" onClick={() => handleActivate('1.5x')}>
                                    <img src={boostIcon2} alt="Activate" className="abp_activate-icon" />
                                    <span>ACTIVATE</span>
                                </button>
                                <div className="abp_currency-amount">150</div>
                            </div>

                            <div className="abp_boost-option">
                                <img src={boostIcon} alt="Boost Icon" className="abp_boost-icon" />
                                <div className="abp_boost-label">2X BOOST STEPS</div>
                                <button className="abp_activate-button-small" onClick={() => handleActivate('2x')}>
                                    <img src={boostIcon2} alt="Activate" className="abp_activate-icon" />
                                    <span>ACTIVATE</span>
                                </button>
                                <div className="abp_currency-amount">300</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <ActivateBoostConfirmPopup 
                isOpen={showConfirmPopup}
                onClose={handleCloseConfirmPopup}
                selectedBoostType={selectedBoostType}
                onActivate={handleConfirmActivate}
            />
        </>
    );
};

export default ActivateBoostPopup;
