import React, { useState, useCallback, useEffect } from 'react';
import './ConfirmPurchasePopup.css';
import { t } from './utils/localization';
import starlet from './images/starlet.png';
import back from './images/back.svg';
import { handleStarletsPurchase } from './services/telegramPayment';
import SuccessfulPurchasePopup from './SuccessfulPurchasePopup';
import shared from './Shared';




const ConfirmPurchasePopup = ({ isOpen, onClose, amount, stars, optionId, onConfirm, setShowProfileView, setShowBuyView }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOption, setCurrentOption] = useState(null);

  useEffect(() => {
    const fetchOptionData = async () => {
      if (!optionId) return;
      
      try {
        const response = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
        const data = await response.json();
        if (data.code === 0 && Array.isArray(data.data)) {
          const option = data.data.find(opt => opt.id === optionId);
          if (option) {
            setCurrentOption(option);
          }
        } else if (data.code === 102002 || data.code === 102001) {
          console.log('Token expired, attempting to refresh...');
          const result = await shared.login(shared.initData);
          if (result.success) {
            const retryResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
            if (retryData.code === 0 && Array.isArray(retryData.data)) {
              const option = retryData.data.find(opt => opt.id === optionId);
              if (option) {
                setCurrentOption(option);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch option data:', error);
      }
    };

    if (isOpen) {
      fetchOptionData();
    }
  }, [isOpen, optionId]);

  const showError = useCallback(async (message) => {
    onClose();
    await new Promise(resolve => setTimeout(resolve, 100));

    if (window.Telegram?.WebApp?.showPopup) {
      try {
        await window.Telegram.WebApp.showPopup({
          title: 'Error',
          message: message,
          buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
        });
      } catch (error) {
        console.error('Failed to show popup:', error);
        alert(message);
      }
    } else {
      alert(message);
    }
  }, [onClose]);

  const handleConfirmAndPay = useCallback(async () => {
    setIsProcessing(true);
    try {
      let result;
      if (optionId === 'free') {
        const response = await fetch(`${shared.server_url}/api/app/claimFreeReward?token=${shared.loginData.token}`);
        const data = await response.json();
        if (data.code === 0 && data.data.success) {
          result = {
            status: "paid",
            initialStarlets: 50,
            tickets: 1
          };
        } else if (data.code === 102002 || data.code === 102001) {
          console.log('Token expired, attempting to refresh...');
          const loginResult = await shared.login(shared.initData);
          if (loginResult.success) {
            const retryResponse = await fetch(`${shared.server_url}/api/app/claimFreeReward?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
            if (retryData.code === 0 && retryData.data.success) {
              result = {
                status: "paid",
                initialStarlets: 50,
                tickets: 1
              };
            }
          }
        }
      } else {
        result = await handleStarletsPurchase({ 
          amount, 
          stars,
          optionId 
        });
      }

      if (result?.status === "paid") {
        setPurchaseData({ 
          initialStarlets: result.initialStarlets,
          tickets: result.tickets
        });
        setShowSuccessPopup(true);
      } else if (result?.status === "cancelled") {
        onClose();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      await showError('Unable to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [amount, stars, optionId, showError, onClose]);

  const handleClaim = useCallback(async () => {
    setShowSuccessPopup(false);
    setPurchaseData(null);
    localStorage.removeItem('payment_success');
    
    // Refresh user profile
    await shared.getProfileWithRetry();
    
    onConfirm();
    
    // Navigate directly to Market using shared.setActiveTab
    if (typeof shared.setActiveTab === 'function') {
      shared.setActiveTab('market');
    } else {
      // Fallback: use the old method if setActiveTab is not available
      setShowBuyView(false);
    }
  }, [onConfirm, setShowBuyView]);

  useEffect(() => {
    if (!isOpen) {
      localStorage.removeItem('payment_success');
      setShowSuccessPopup(false);
      setPurchaseData(null);
      return;
    }

    const paymentSuccess = localStorage.getItem('payment_success');
    if (paymentSuccess) {
      try {
        const payment = JSON.parse(paymentSuccess);
        setPurchaseData({ 
          initialStarlets: payment.initialStarlets,
          tickets: payment.tickets
        });
        setShowSuccessPopup(true);
      } catch (error) {
        console.error('Error parsing payment success data:', error);
        localStorage.removeItem('payment_success');
      }
    }
  }, [isOpen]);

  return (
    <>
      {(isOpen || showSuccessPopup) && (
        <>
          {isProcessing && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {showSuccessPopup ? (
            <SuccessfulPurchasePopup 
              isOpen={true}
              onClaim={handleClaim}
              amount={amount}
              tickets={optionId === 'free' ? 1 : (purchaseData?.tickets || currentOption?.ticket || 10)}
              setShowBuyView={setShowBuyView}
            />
          ) : isOpen && (
            <div className="popup-overlay">
              <div className="popup-container">
                <button className="cfm_back-button back-button-alignment" onClick={onClose}>
                  <img src={back} alt="Back" />
                </button>
                <div className="popup-content">
                  <div className="popup-icon">
                    <img src={starlet} alt="Starlet" />
                  </div>
                  <h2 className="popup-title">{t('CONFIRM')}</h2>
                  <div className="popup-subtitle">{t('YOUR_PURCHASE')}</div>
                  
                  <div className="purchase-details">
                    <div className="purchase-text">
                      {t('DO_YOU_WANT_TO_BUY')} <span className="highlight-value">{amount} {t('STARLETS')}</span>
                      {stars > 0 ? (
                        <>
                          {currentOption?.ticket > 0 && (
                            <>
                              <br />
                              {t('AND')} <span className="highlight-value">{currentOption.ticket} {t('TICKETS')}</span>
                            </>
                          )}
                          <br />
                          {t('IN_FSL_GAME_HUB')}
                          <br />
                          {t('FOR')} <span className="highlight-value">{stars} {t('TELEGRAM_STARS')}</span>?
                        </>
                      ) : (
                        <>
                          <br />
                          {t('AND')} <span className="highlight-value">1 {t('TICKET')}</span> {t('IN_FSL_GAME_HUB')}
                          <br />
                          {t('FOR')} <span className="highlight-value">{t('FREE')}</span>?
                        </>
                      )}
                    </div>
                  </div>

                  <button className="confirm-button" onClick={handleConfirmAndPay}>
                    {t('CONFIRM_AND_PAY')}
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

export default ConfirmPurchasePopup; 