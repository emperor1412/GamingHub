import React, { useState, useCallback, useEffect } from 'react';
import './ConfirmPurchasePopup.css';
import logo from './images/confirmpurchase.png';
import back from './images/back.svg';
import { handleStarletsPurchase } from './services/telegramPayment';
import SuccessfulPurchasePopup from './SuccessfulPurchasePopup';
import SuccessfulPurchasePremium from './SuccessfulPurchasePremium';
import shared from './Shared';


const ConfirmPurchasePopup = ({ isOpen, onClose, amount, stars, optionId, productId, productName, isStarletProduct, isPremium, isFreeItem, onConfirm, setShowProfileView, setShowBuyView, onPurchaseComplete, onFreeItemComplete, refreshUserProfile, onPurchaseError }) => {
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
    // Đóng Buy view khi có lỗi
    if (setShowBuyView) {
      setShowBuyView(false);
    }
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
  }, [onClose, setShowBuyView]);

  const checkPremiumStatus = useCallback(async () => {
    try {
      const response = await fetch(`${shared.server_url}/api/app/getPremiumStatus?token=${shared.loginData.token}`);
      const data = await response.json();
      console.log('Premium status API response:', data);
      if (data.code === 0) {
        const hasPremium = data.data === true;
        console.log('Has premium result:', hasPremium);
        return hasPremium;
      }
      console.log('Premium status check failed, returning false');
      return false;
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  }, []);

  const handleConfirmAndPay = useCallback(async () => {
    console.log('handleConfirmAndPay called with:', { isStarletProduct, productId, amount, productName, isPremium });
    setIsProcessing(true);
    try {
      let result;
      // Premium membership is now a starlet product - use buyStarletProduct API
      if (isPremium && isStarletProduct) {
        console.log('Making premium membership purchase as starlet product...');
        
        // Check if user has enough starlets
        const currentStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
        
        if (currentStarlets < amount) {
          console.log('Not enough starlets:', { current: currentStarlets, required: amount });
          await showError('Not enough starlets. Please buy more starlets first.');
          return;
        }
        
        // Call buyStarletProduct API with premium membership product ID
        console.log('Calling buyStarletProduct API with productId:', productId);
        const response = await fetch(
          `${shared.server_url}/api/app/buyStarletProduct?token=${shared.loginData.token}&productId=${productId}`, 
          { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        const data = await response.json();
        console.log('buyStarletProduct API response:', data);
        
        if (data.code === 0) {
          // Success - refresh profile to update starlets and premium status
          console.log('Premium purchase successful, refreshing profile...');
          await shared.getProfileWithRetry();
          
          result = {
            status: "paid",
            amount: amount,
            isPremium: true,
            isStarletProduct: true,
            membershipType: productId
          };
        } else if (data.code === 214003) {
          // VIP already exists error
          console.log('VIP already exists error detected, calling parent error handler');
          setIsProcessing(false);
          if (onPurchaseError) {
            console.log('Calling onPurchaseError callback');
            onPurchaseError();
          }
          setTimeout(() => {
            onClose();
            if (setShowBuyView) {
              setShowBuyView(false);
            }
          }, 100);
          return;
        } else if (data.code === 213001) {
          // Not enough starlets error
          console.log('Not enough starlets error from API');
          await showError('Not enough starlets. Please buy more starlets first.');
          return;
        } else if (data.code === 102002 || data.code === 102001) {
          // Token expired, attempt to refresh
          console.log('Token expired, attempting to refresh...');
          const loginResult = await shared.login(shared.initData);
          if (loginResult.success) {
            // Retry the purchase after login
            const retryResponse = await fetch(
              `${shared.server_url}/api/app/buyStarletProduct?token=${shared.loginData.token}&productId=${productId}`, 
              { 
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            const retryData = await retryResponse.json();
            if (retryData.code === 0) {
              await shared.getProfileWithRetry();
              result = {
                status: "paid",
                amount: amount,
                isPremium: true,
                isStarletProduct: true,
                membershipType: productId
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
          throw new Error(data.msg || 'Purchase failed');
        }
        
        // OLD FLOW: Using Telegram Stars (COMMENTED OUT - kept for reference)
        /*
        console.log('Making premium membership purchase using Telegram Stars...');
        // Handle premium membership purchase using Telegram Stars
        const premiumOptionId = productId === 1 ? 4001 : 4002; // 1 = monthly (4001), 2 = yearly (4002)
        const premiumOption = currentOption || { id: premiumOptionId, starlet: amount, stars: productId === 1 ? 1 : 2 };
        
        try {
          result = await handleStarletsPurchase({ 
            amount: premiumOption.starlet, 
            stars: premiumOption.stars,
            optionId: premiumOptionId 
          });
        } catch (purchaseError) {
          // Check if it's a parameter error (code 100001) or VIP already exists error (code 214003)
          console.log('Purchase error caught:', purchaseError);
          console.log('Error code:', purchaseError?.code);
          if (purchaseError?.code === 100001) {
            console.log('Parameter error detected, checking premium status...');
            const hasPremium = await checkPremiumStatus();
            if (hasPremium) {
              console.log('User has active premium, calling parent error handler');
              setIsProcessing(false);
              // Gọi callback để show error popup từ Market.js TRƯỚC KHI đóng popup
              if (onPurchaseError) {
                console.log('Calling onPurchaseError callback for parameter error');
                onPurchaseError();
              }
              // Delay một chút để đảm bảo callback được thực thi
              setTimeout(() => {
                onClose();
                // Đóng Buy view khi user đã có Premium
                if (setShowBuyView) {
                  setShowBuyView(false);
                }
              }, 100);
              return;
            }
          } else if (purchaseError?.code === 214003) {
            console.log('VIP already exists error detected, calling parent error handler');
            console.log('onPurchaseError callback exists:', !!onPurchaseError);
            setIsProcessing(false);
            // Gọi callback để show error popup từ Market.js TRƯỚC KHI đóng popup
            if (onPurchaseError) {
              console.log('Calling onPurchaseError callback');
              onPurchaseError();
            } else {
              console.log('onPurchaseError callback is not available');
            }
            // Delay một chút để đảm bảo callback được thực thi
            setTimeout(() => {
              onClose();
              // Đóng Buy view khi user đã có VIP
              if (setShowBuyView) {
                setShowBuyView(false);
              }
            }, 100);
            return;
          }
          // Re-throw error if it's not the specific case we're handling
          throw purchaseError;
        }
        */
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
        // For premium purchases via Telegram Stars, we need to set the premium data
        if (isPremium) {
          setPurchaseData({ 
            initialStarlets: result.initialStarlets,
            tickets: result.tickets,
            productName: productName,
            amount: amount,
            isStarletProduct: false,
            isPremium: true,
            membershipType: productId,
            membershipPrice: amount
          });
        } else {
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
        }
        setShowSuccessPopup(true);
        
        // Call onPurchaseComplete for starlet products and premium to trigger market reload
        if ((result.isStarletProduct || isPremium) && onPurchaseComplete) {
          onPurchaseComplete();
        }

        if(optionId === 'free' && onPurchaseComplete) {
          onFreeItemComplete();
        }
      } else if (result?.status === "cancelled") {
        onClose();
        // Đóng Buy view giống như khi thanh toán thành công
        if (setShowBuyView) {
          setShowBuyView(false);
        }
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      await showError(error?.message || 'Unable to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [amount, stars, optionId, productId, productName, isStarletProduct, isPremium, showError, onClose, onPurchaseComplete, checkPremiumStatus, currentOption]);

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

    // For free items, show success popup directly
    if (isFreeItem) {
      setPurchaseData({ 
        initialStarlets: amount,
        tickets: 1
      });
      setShowSuccessPopup(true);
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
  }, [isOpen, isFreeItem, amount]);

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
                isFreeItem={isFreeItem}
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
                    <img src={logo} alt="Starlet" />
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