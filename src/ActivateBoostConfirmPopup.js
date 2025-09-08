import React, { useEffect, useState, useRef } from 'react';
import './ActivateBoostConfirmPopup.css';
import iconStepBoostx1_5 from './images/Icon_StepBoosts_x1_5.png';
import iconStepBoostx2 from './images/Icon_StepBoosts_x2.png';
import iconPopStepBoostx1_5 from './images/Icon_Pop_Stepboosts_1_5X.png';
import iconPopStepBoostx2 from './images/Icon_Pop_Stepboosts_2X.png';
import stepBoostsPurchasedBg from './images/Icon_Status_Stepboosts.png';

const ActivateBoostConfirmPopup = ({ 
  isOpen, 
  onClose, 
  selectedBoostType,
  onActivate 
}) => {
  // Step boost assets mapping
  const stepBoostAssets = {
    1: { icon: iconPopStepBoostx1_5 },
    2: { icon: iconPopStepBoostx2 },
  };

  // Track confirmation after clicking YES
  const [confirmed, setConfirmed] = useState(false);
  // Preserve popup size when confirming so it doesn't change
  const popupRef = useRef(null);
  const [fixedHeight, setFixedHeight] = useState(null);
  const [fixedWidth, setFixedWidth] = useState(null);

  // Reset confirmation only when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmed(false);
      setFixedHeight(null);
      setFixedWidth(null);
    }
  }, [isOpen]);

  // Adjust background image when button margin changes
  useEffect(() => {
    if (confirmed && popupRef.current) {
      const actionsElement = popupRef.current.querySelector('.activate-boost-actions');
      if (actionsElement) {
        const updateBackgroundPosition = () => {
          const computedStyle = window.getComputedStyle(actionsElement);
          const marginBottom = parseInt(computedStyle.marginBottom) || 0;
          const marginTop = parseInt(computedStyle.marginTop) || 0;
          const totalMargin = marginBottom + marginTop;
          
          // Update CSS custom property for dynamic calculation
          popupRef.current.style.setProperty('--button-margin', `${totalMargin}px`);
        };
        
        // Initial update
        updateBackgroundPosition();
        
        // Watch for style changes
        const observer = new MutationObserver(updateBackgroundPosition);
        observer.observe(actionsElement, { 
          attributes: true, 
          attributeFilter: ['style'] 
        });
        
        return () => observer.disconnect();
      }
    }
  }, [confirmed]);

  const handleNoThanks = () => {
    onClose();
  };

  const handleActivate = () => {
    // Capture current popup size before content changes
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setFixedHeight(rect.height);
      setFixedWidth(rect.width);
    }
    onActivate(selectedBoostType);
    setConfirmed(true);
  };

  const handleBackToBankSteps = () => {
    onClose();
  };

  // Only render when open and a boost type is selected
  if (!isOpen || !selectedBoostType) return null;

  // Get display amount and icon based on selected boost type
  const displayAmount = selectedBoostType === '1.5x' ? '1.5X' : '2X';
  const stepBoostId = selectedBoostType === '1.5x' ? 1 : 2;
  const stepBoostIcon = stepBoostAssets[stepBoostId]?.icon || iconStepBoostx1_5;

  return (
    <div className="activate-boost-popup-overlay" onClick={onClose}>
      <div
        className={`activate-boost-popup ${confirmed ? 'confirmed' : ''}`}
        ref={popupRef}
        style={
          fixedHeight || fixedWidth
            ? {
                height: fixedHeight,
                minHeight: fixedHeight,
                maxHeight: fixedHeight,
                width: fixedWidth,
                minWidth: fixedWidth,
                maxWidth: fixedWidth,
                boxSizing: 'border-box',
                overflow: 'hidden',
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >

    {!confirmed ? (
    <>
        {/* Corner borders */}
        <div className="mk-corner mk-top-left"></div>
        <div className="mk-corner mk-top-right"></div>
        <div className="mk-corner mk-bottom-left"></div>
        <div className="mk-corner mk-bottom-right"></div>
        {/* Body: header + content grouped */}
        <div className="activate-boost-body">
          {/* Header: show only one icon for the selected step boost */}

          <div className="activate-boost-header">
            <div className="activate-boost-icons">
              <img
                src={stepBoostIcon}
                alt={`${displayAmount} Step Boost icon`}
                className="activate-boost-icon"
              />
            </div>
          </div>

          
          {/* Content area */}
          <div className="activate-boost-content">
            <div className="activate-boost-message">
                <div className="activate-boost-line activate-boost-line-top">ACTIVATE BOOST</div>
                <div className="activate-boost-line activate-boost-line-top">AND MULTIPLY</div>
                <div className="activate-boost-line activate-boost-line-top">YOUR STARLET</div>
                <div className="activate-boost-line activate-boost-line-top">CLAIM TODAY</div>
            </div>
          </div>
        </div>
    </>
     ) : 
     <>
         {/* Background image with floating coins */}
         <div className="activate-boost-purchased-bg">
             <img 
                 src={stepBoostsPurchasedBg} 
                 alt="Floating coins background" 
                 className="activate-boost-bg-image"
             />
         </div>
         
        <div className="mk-corner mk-top-left-purchased"></div>
        <div className="mk-corner mk-top-right-purchased"></div>
        <div className="mk-corner mk-bottom-left-purchased"></div>
        <div className="mk-corner mk-bottom-right-purchased"></div>
         <div className="activate-boost-body">
             <div className="activate-boost-content">
                 <div className="activate-boost-purchased-message">
                     <div className="activate-boost-purchased-main">{displayAmount}</div>
                     <div className="activate-boost-purchased-sub">MULTIPLIER</div>
                     <div className="activate-boost-purchased-sub">ACTIVATED!</div>
                 </div>
             </div>
         </div>
     </>
    }
        
        {/* Action buttons */}
        <div className="activate-boost-actions">
          {!confirmed ? (
            <>
              <button className="activate-boost-no-thanks" onClick={handleNoThanks}>
                NO THANKS
              </button>
              <button 
                className="activate-boost-yes" 
                onClick={handleActivate}
              >
                ACTIVATE
              </button>
            </>
          ) : (
            <button className="activate-boost-yes activate-boost-back-button" onClick={handleBackToBankSteps}>
              BACK TO BANK STEPS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateBoostConfirmPopup;
