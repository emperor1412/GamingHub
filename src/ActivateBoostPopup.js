import React, { useState } from 'react';
import './ActivateBoostPopup.css';
import popupBackground from './images/Popup_Activate_boost.png';
import boostIcon from './images/Boost_Icon.png';
import boostIcon2 from './images/Icon_Step_Boost.png';
import ActivateBoostConfirmPopup from './ActivateBoostConfirmPopup';
import shared from './Shared';

const ActivateBoostPopup = ({ isOpen, onClose, onActivate, boostData, stepBoostState, handleOpenMarket }) => {
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [selectedBoostType, setSelectedBoostType] = useState(null);

    if (!isOpen) return null;

    // Determine button state for each boost type
    const getBoostButtonState = (boostType) => {
        const boostItem = boostType === '1.5x' ? boostData?.x1_5 : boostData?.x2;
        const hasBoost = boostItem?.value > 0;
        const boostTypeCode = boostType === '1.5x' ? 10120 : 10121;
        
        if (!hasBoost) {
            return 'buy'; // No boost available, need to buy
        } else if (stepBoostState === boostTypeCode) {
            return 'active'; // This boost is currently active
        } else if (stepBoostState && stepBoostState !== 0) {
            return 'disabled'; // Another boost is active
        } else {
            return 'activate'; // Can activate this boost
        }
    };

    const handleActivate = (boostType) => {
        const buttonState = getBoostButtonState(boostType);
        if (buttonState === 'buy') {
            // Navigate to marketplace with starlet tab
            handleOpenMarket();
            return;
        } else if (buttonState === 'disabled' || buttonState === 'active') {
            // Do nothing for disabled or active state
            return;
        }
        
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
            <div className="abp_overlay" onClick={onClose}>
                <div className="abp_popup-container" style={{ backgroundImage: `url(${popupBackground})` }} onClick={(e) => e.stopPropagation()}>
                    <div className="abp_content">
                        <div className="abp_boost-options">
                            <div className="abp_boost-option">
                                <img src={boostIcon} alt="Boost Icon" className="abp_boost-icon" />
                            <div className="abp_boost-label">1.5X BOOST STEPS</div>
                                <button 
                                    className={`abp_activate-button-small abp_boost-${getBoostButtonState('1.5x')}`}
                                    onClick={() => handleActivate('1.5x')}
                                    disabled={getBoostButtonState('1.5x') === 'disabled'}
                                    style={{
                                        opacity: getBoostButtonState('1.5x') === 'disabled' ? 0.5 : 1,
                                        cursor: (getBoostButtonState('1.5x') === 'disabled' || getBoostButtonState('1.5x') === 'active') ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <img src={boostIcon2} alt="Activate" className="abp_activate-icon" />
                                    <span>
                                        {getBoostButtonState('1.5x') === 'activate' && 'ACTIVATE'}
                                        {getBoostButtonState('1.5x') === 'active' && 'ACTIVE'}
                                        {getBoostButtonState('1.5x') === 'buy' && 'BUY BOOST'}
                                        {getBoostButtonState('1.5x') === 'disabled' && 'DISABLED'}
                                    </span>
                                </button>
                                <div className="abp_currency-amount">{boostData?.x1_5?.value || 0}</div>
                            </div>

                            <div className="abp_boost-option">
                                <img src={boostIcon} alt="Boost Icon" className="abp_boost-icon" />
                                <div className="abp_boost-label">2X BOOST STEPS</div>
                                <button 
                                    className={`abp_activate-button-small abp_boost-${getBoostButtonState('2x')}`}
                                    onClick={() => handleActivate('2x')}
                                    disabled={getBoostButtonState('2x') === 'disabled'}
                                    style={{
                                        opacity: getBoostButtonState('2x') === 'disabled' ? 0.5 : 1,
                                        cursor: (getBoostButtonState('2x') === 'disabled' || getBoostButtonState('2x') === 'active') ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <img src={boostIcon2} alt="Activate" className="abp_activate-icon" />
                                    <span>
                                        {getBoostButtonState('2x') === 'activate' && 'ACTIVATE'}
                                        {getBoostButtonState('2x') === 'active' && 'ACTIVE'}
                                        {getBoostButtonState('2x') === 'buy' && 'BUY BOOST'}
                                        {getBoostButtonState('2x') === 'disabled' && 'DISABLED'}
                                    </span>
                                </button>
                                <div className="abp_currency-amount">{boostData?.x2?.value || 0}</div>
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
