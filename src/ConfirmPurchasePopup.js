import React, { useState, useCallback, useEffect } from 'react';
import './ConfirmPurchasePopup.css';
import starlet from './images/starlet.png';
import back from './images/back.svg';
import { handleStarletsPurchase } from './services/telegramPayment';
import SuccessfulPurchasePopup from './SuccessfulPurchasePopup';
import SuccessfulPurchasePremium from './SuccessfulPurchasePremium';
import shared from './Shared';


const ConfirmPurchasePopup = ({ isOpen, onClose, amount, stars, optionId, productId, productName, isStarletProduct, isPremium, onConfirm, setShowProfileView, setShowBuyView, onPurchaseComplete, refreshUserProfile }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOption, setCurrentOption] = useState(null);

  // Debug log to check premium data
  useEffect(() => {
    console.log('ConfirmPurchasePopup - Premium data:', {
      isPremium,
      amount,
      productName,
      productId,
      isStarletProduct
    });
  }, [isPremium, amount, productName, productId, isStarletProduct]);

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
    console.log('handleConfirmAndPay called with:', { isStarletProduct, productId, amount, productName, isPremium });
    setIsProcessing(true);
    try {
      let result;
      if (isPremium) {
        console.log('Making premium membership purchase API call...');
        // Handle premium membership purchase
        const response = await fetch(`${shared.server_url}/api/app/buyMembership?token=${shared.loginData.token}&type=${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Premium membership API response:', data);
        if (data.code === 0) {
          result = {
            status: "paid",
            productName: productName,
            amount: amount,
            isPremium: true,
            membershipType: productId,
            membershipPrice: amount
          };
        } else if (data.code === 102002 || data.code === 102001) {
          console.log('Token expired, attempting to refresh...');
          const loginResult = await shared.login(shared.initData);
          if (loginResult.success) {
            const retryResponse = await fetch(`${shared.server_url}/api/app/buyMembership?token=${shared.loginData.token}&type=${productId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const retryData = await retryResponse.json();
            if (retryData.code === 0) {
              result = {
                status: "paid",
                productName: productName,
                amount: amount,
                isPremium: true,
                membershipType: productId,
                membershipPrice: amount
              };
            } else {
              console.log('Retry failed:', retryData);
              await showError(retryData.msg || 'Premium purchase failed. Please try again.');
              return;
            }
          } else {
            await showError('Session expired. Please try again.');
            return;
          }
        } else {
          console.log('Premium API call failed:', data);
          await showError(data.msg || 'Premium purchase failed. Please try again.');
          return;
        }
      } else if (isStarletProduct && productId) {
        console.log('Making starlet product purchase API call...');
        // Handle starlet product purchase
        const response = await fetch(`${shared.server_url}/api/app/buyStarletProduct?token=${shared.loginData.token}&productId=${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('API response:', data);
        if (data.code === 0) {
          // Extract package type and value from productName
          let packageType = 'unknown';
          let packageValue = '';
          
          if (productName && typeof productName === 'string') {
            if (productName.toLowerCase().includes('merch')) {
              packageType = 'merch';
              // Extract value from productName (e.g., "$79 MERCH COUPON" -> "79")
              const valueMatch = productName.match(/\$(\d+)/);
              packageValue = valueMatch ? valueMatch[1] : '';
            } else if (productName.toLowerCase().includes('gmt') || productName.toLowerCase().includes('pay')) {
              packageType = 'gmt';
              // Extract value from productName (e.g., "$50 GMT PAY CARD" -> "50")
              const valueMatch = productName.match(/\$(\d+)/);
              packageValue = valueMatch ? valueMatch[1] : '';
            }
          }
          
          result = {
            status: "paid",
            productName: productName,
            amount: amount,
            isStarletProduct: true,
            packageType: packageType,
            packageValue: packageValue
          };
        } else if (data.code === 102002 || data.code === 102001) {
          console.log('Token expired, attempting to refresh...');
          const loginResult = await shared.login(shared.initData);
          if (loginResult.success) {
            const retryResponse = await fetch(`${shared.server_url}/api/app/buyStarletProduct?token=${shared.loginData.token}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productId: productId
              })
            });
            const retryData = await retryResponse.json();
            if (retryData.code === 0) {
              result = {
                status: "paid",
                productName: productName,
                amount: amount,
                isStarletProduct: true
              };
            } else {
              console.log('Retry failed:', retryData);
              await showError(retryData.msg || 'Payment failed. Please try again.');
              return;
            }
          } else {
            await showError('Session expired. Please try again.');
            return;
          }
        } else {
          console.log('API call failed:', data);
          await showError(data.msg || 'Payment failed. Please try again.');
          return;
        }
      } else if (optionId === 'free') {
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
            } else {
              await showError(retryData.msg || 'Claim failed. Please try again.');
              return;
            }
          } else {
            await showError('Session expired. Please try again.');
            return;
          }
        } else {
          await showError(data.msg || 'Claim failed. Please try again.');
          return;
        }
      } else {
        result = await handleStarletsPurchase({ 
          amount, 
          stars,
          optionId 
        });
      }

      console.log('Final result:', result);
      if (result?.status === "paid") {
        setPurchaseData({ 
          initialStarlets: result.initialStarlets,
          tickets: result.tickets,
          productName: result.productName,
          amount: result.amount,
          isStarletProduct: result.isStarletProduct,
          isPremium: result.isPremium,
          membershipType: result.membershipType,
          membershipPrice: result.membershipPrice,
          packageType: result.packageType,
          packageValue: result.packageValue
        });
        setShowSuccessPopup(true);
        
        // Call onPurchaseComplete for starlet products and premium to trigger market reload
        if ((result.isStarletProduct || result.isPremium) && onPurchaseComplete) {
          onPurchaseComplete();
        }
      } else if (result?.status === "cancelled") {
        onClose();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      await showError(error?.message || 'Unable to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [amount, stars, optionId, productId, productName, isStarletProduct, showError, onClose, onPurchaseComplete]);

  const handleClaim = useCallback(async () => {
    setShowSuccessPopup(false);
    setPurchaseData(null);
    localStorage.removeItem('payment_success');
    
    // Refresh user profile
    await shared.getProfileWithRetry();
    
    // Navigate directly to Market using shared.setActiveTab
    if (typeof shared.setActiveTab === 'function') {
      shared.setInitialMarketTab('telegram');
      shared.setActiveTab('market');
    } else {
      // Fallback: use the old method if setActiveTab is not available
      setShowBuyView(false);
    }
  }, [setShowBuyView]);

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
            isPremium ? (
              <SuccessfulPurchasePremium 
                isOpen={true}
                onClaim={handleClaim}
                onClose={onClose}
                setShowBuyView={setShowBuyView}
              />
            ) : (
              <SuccessfulPurchasePopup 
                isOpen={true}
                onClaim={handleClaim}
                onClose={onClose}
                amount={purchaseData?.isStarletProduct ? null : amount}
                tickets={optionId === 'free' ? 1 : (purchaseData?.tickets || currentOption?.ticket || 10)}
                productName={purchaseData?.productName}
                isStarletProduct={purchaseData?.isStarletProduct}
                packageType={purchaseData?.packageType}
                packageValue={purchaseData?.packageValue}
                setShowBuyView={setShowBuyView}
              />
            )
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
                  <h2 className="popup-title">CONFIRM</h2>
                  <div className="popup-subtitle">YOUR PURCHASE</div>
                  
                  <div className="purchase-details">
                    <div className="purchase-text">
                      {isPremium ? (
                        <>
                          DO YOU WANT TO BUY <span className="highlight-value">{productName}</span>
                          <br />
                          IN FSL GAME HUB
                          <br />
                          FOR <span className="highlight-value">{amount} STARLETS</span>?
                        </>
                      ) : isStarletProduct ? (
                        <>
                          DO YOU WANT TO BUY A <span className="highlight-value">{productName}</span>
                          <br />
                          IN FSL GAME HUB
                          <br />
                          FOR <span className="highlight-value">{amount} STARLETS</span>?
                        </>
                      ) : (
                        <>
                          DO YOU WANT TO BUY <span className="highlight-value">{amount} STARLETS</span>
                          {stars > 0 ? (
                            <>
                              {currentOption?.ticket > 0 && (
                                <>
                                  <br />
                                  AND <span className="highlight-value">{currentOption.ticket} TICKETS</span>
                                </>
                              )}
                              <br />
                              IN FSL GAME HUB
                              <br />
                              FOR <span className="highlight-value">{stars} TELEGRAM STARS</span>?
                            </>
                          ) : (
                            <>
                              <br />
                              AND <span className="highlight-value">1 TICKET</span> IN FSL GAME HUB
                              <br />
                              FOR <span className="highlight-value">FREE</span>?
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <button className="cfp_confirm-button" onClick={handleConfirmAndPay}>
                    CONFIRM & PAY
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