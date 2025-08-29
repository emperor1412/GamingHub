import React, { useEffect, useState } from 'react';
import './Market.css';
import { trackUserAction } from './analytics';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import gmtCard from './images/gmtCard.png';
import merchCouponBg from './images/merch_coupon_bg.png';
import scratch_ticket_button_bg from './images/scratch_ticket_button_bg.png';
import ConfirmPurchasePopup from './ConfirmPurchasePopup';
import Buy from './Buy';
import background from './images/background_2.png';
import arrow_2 from './images/arrow_2.svg';

// url: /app/buyOptions
// Request:
// Response:
// type Type_Init = 0;
//      Type_Weekly = 10;
//      Type_Month = 20;
//      Type_OnlyOnce = 30;
// {
//     "code": 0,
//     "data": [
//         {
//             "id": 2001,
//             "state": 0,
//             "type": 20,
//             "stars": 250,
//             "starlet": 1950,
//             "ticket": 0,
//             "canBuy": true
//         },
//         {
//             "id": 4,
//             "state": 0,
//             "type": 0,
//             "stars": 100,
//             "starlet": 500,
//             "ticket": 0,
//             "canBuy": true
//         }
//     ]
// }

// url: /app/buyStarlets
// Request:
//     optionId int
// Response:
// {
//     "code": 0,
//     "data": "https://t.me/$rSx3fmgFAFZgAQAAuXGU/vcVgAw"
// }

// url: /app/getFreeRewardTime
// Request:
// Response:
// {
//     "code": 0,
//     "data": 1741737600000
// }

// url: /app/claimFreeReward
// Request:
// Response:
// {
//     "code": 0,
//     "data": {
//         "success": true,
//         "time": 1741737600000
//     }
// }

const Market = ({ showFSLIDScreen, setShowProfileView, initialTab = 'telegram' }) => {
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showBuyView, setShowBuyView] = useState(false);
  const [isFreeItemClaimed, setIsFreeItemClaimed] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [buyOptions, setBuyOptions] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab); // 'starlet' or 'telegram'
  const [starletProducts, setStarletProducts] = useState([]);
  
  // Add state to track GMT/starlet product purchase completion
  const [isStarletPurchaseComplete, setIsStarletPurchaseComplete] = useState(false);
  
  // Category expansion states
  const [standardPackExpanded, setStandardPackExpanded] = useState(true);
  const [exclusiveOfferExpanded, setExclusiveOfferExpanded] = useState(true);
  const [monthlyOfferExpanded, setMonthlyOfferExpanded] = useState(true);
  const [weeklyOfferExpanded, setWeeklyOfferExpanded] = useState(true);

  // Add body class to prevent iOS overscrolling
  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add('mk-market-open');
    
    // Remove class when component unmounts
    return () => {
      document.body.classList.remove('mk-market-open');
    };
  }, []);

  // Main useEffect to fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch buy options
        const buyOptionsResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
        const buyOptionsData = await buyOptionsResponse.json();
        console.log('Buy Options Response:', buyOptionsData);
        if (buyOptionsData.code === 0 && Array.isArray(buyOptionsData.data)) {
          console.log('Buy Options Data:', buyOptionsData.data);
          setBuyOptions(buyOptionsData.data);
        } else if (buyOptionsData.code === 102002 || buyOptionsData.code === 102001) {
          // Token expired, attempt to refresh
          console.log('Token expired, attempting to refresh...');
          const result = await shared.login(shared.initData);
          if (result.success) {
            // Retry the fetch after login
            const retryResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
            if (retryData.code === 0 && Array.isArray(retryData.data)) {
              setBuyOptions(retryData.data);
            }
          }
        }

        // Fetch starlet products
        const starletResponse = await fetch(`${shared.server_url}/api/app/starletProducts?token=${shared.loginData.token}`);
        const starletData = await starletResponse.json();
        console.log('Starlet Products Response:', starletData);
        if (starletData.code === 0 && Array.isArray(starletData.data)) {
          console.log('Starlet Products Data:', starletData.data);
          setStarletProducts(starletData.data);
        } else if (starletData.code === 102002 || starletData.code === 102001) {
          // Token expired, attempt to refresh
          console.log('Token expired, attempting to refresh...');
          const result = await shared.login(shared.initData);
          if (result.success) {
            // Retry the fetch after login
            const retryResponse = await fetch(`${shared.server_url}/api/app/starletProducts?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
            if (retryData.code === 0 && Array.isArray(retryData.data)) {
              setStarletProducts(retryData.data);
            }
          }
        }

        // Check free reward time
        await checkFreeRewardTime();

        // Setup profile data
        const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
          setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
          setTickets(userTicket.num);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchAllData();
  }, []);

  // Add effect to watch showBuyView changes
  useEffect(() => {
    if (!showBuyView) { // When returning from Buy view
      // Refresh both user profile and market content when returning from Buy view
      // This ensures all data is up-to-date after any purchases or actions
      refreshUserProfile();
      refreshMarketContent();
    }
  }, [showBuyView]);

  // Add useEffect to listen for data refresh trigger from App component
  useEffect(() => {
    // This will run when dataRefreshTrigger changes (after focus/unfocus reload)
    // Only update if we have a userProfile and it's different from current state
    if (shared.userProfile) {
      const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
      const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
      
      // Only update if values actually changed to prevent unnecessary re-renders
      if (userStarlets && userStarlets.num !== starlets) {
        console.log('Market: Updating starlets display after data refresh');
        setStarlets(userStarlets.num);
      }
      
      if (userTicket && userTicket.num !== tickets) {
        console.log('Market: Updating tickets display after data refresh');
        setTickets(userTicket.num);
      }
    }
  }, [shared.userProfile, starlets, tickets]); // This will trigger when shared.userProfile changes

  // Add new function to check free reward time
  const checkFreeRewardTime = async () => {
    try {
      const response = await fetch(`${shared.server_url}/api/app/getFreeRewardTime?token=${shared.loginData.token}`);
      const data = await response.json();
      if (data.code === 0) {
        const currentTime = Date.now();
        const nextTime = data.data;
        setNextClaimTime(nextTime);
        setIsFreeItemClaimed(nextTime > currentTime);
      } else if (data.code === 102002 || data.code === 102001) {
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          const retryResponse = await fetch(`${shared.server_url}/api/app/getFreeRewardTime?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
          if (retryData.code === 0) {
            const currentTime = Date.now();
            const nextTime = retryData.data;
            setNextClaimTime(nextTime);
            setIsFreeItemClaimed(nextTime > currentTime);
          }
        }
      }
    } catch (error) {
      console.error('Failed to check free reward time:', error);
    }
  };

  // Add new function to claim free reward
  const handleClaimFreeReward = async () => {
    try {
      const response = await fetch(`${shared.server_url}/api/app/claimFreeReward?token=${shared.loginData.token}`);
      const data = await response.json();
      if (data.code === 0 && data.data.success) {
        // Update next claim time
        setNextClaimTime(data.data.time);
        setIsFreeItemClaimed(true);
        
        // Update user profile to reflect new starlets and tickets
        await shared.getProfileWithRetry();
        
        // Update local state
        const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
          setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
          setTickets(userTicket.num);
        }

        // Refresh market content to update free reward status
        await refreshMarketContent();

        // Show success popup
        if (window.Telegram?.WebApp?.showPopup) {
          await window.Telegram.WebApp.showPopup({
            title: 'Success',
            message: 'You have successfully claimed your free reward!',
            buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
          });
        }
      } else if (data.code === 102002 || data.code === 102001) {
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          const retryResponse = await fetch(`${shared.server_url}/api/app/claimFreeReward?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
          if (retryData.code === 0 && retryData.data.success) {
            setNextClaimTime(retryData.data.time);
            setIsFreeItemClaimed(true);
            await shared.getProfileWithRetry();
            
            const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
            if (userStarlets) {
              setStarlets(userStarlets.num);
            }

            const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
            if (userTicket) {
              setTickets(userTicket.num);
            }

            // Refresh market content to update free reward status
            await refreshMarketContent();

            if (window.Telegram?.WebApp?.showPopup) {
              await window.Telegram.WebApp.showPopup({
                title: 'Success',
                message: 'You have successfully claimed your free reward!',
                buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to claim free reward:', error);
      if (window.Telegram?.WebApp?.showPopup) {
        await window.Telegram.WebApp.showPopup({
          title: 'Error',
          message: 'Failed to claim free reward. Please try again.',
          buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
        });
      }
    }
  };



  const handleConnectFSLID = () => {
    showFSLIDScreen();
  };

  const handleStarletPurchase = (amount, stars, price, optionId = null) => {
    setSelectedPurchase({ amount, stars, optionId });
    setShowBuyView(true);
  };

  const handleStarletProductPurchase = (product) => {
    const productInfo = getStarletProductInfo(product);
    const purchaseData = { 
      amount: product.starlet,
      stars: 0, // Starlet products are bought with starlets, not telegram stars
      productId: product.id,
      productName: productInfo.name,
      isStarletProduct: true
    };
    console.log('Market handleStarletProductPurchase:', { product, productInfo, purchaseData });
    setSelectedPurchase(purchaseData);
    setIsPopupOpen(true);
  };

  const refreshUserProfile = async () => {
    // Only refresh user profile data, not market content
    await shared.getProfileWithRetry();
    const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
    if (userStarlets) {
      setStarlets(userStarlets.num);
    }

    const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
    if (userTicket) {
      setTickets(userTicket.num);
    }

    // Note: Market content (buyOptions, starletProducts) is only loaded once on mount
    // to avoid duplicate API calls. If you need to refresh market content,
    // use refreshMarketContent() function instead.
  };

  // Add new function to refresh market content (buyOptions and starletProducts)
  const refreshMarketContent = async () => {
    try {
      // Reload buy options to update limited offer status
      const buyOptionsResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
      const buyOptionsData = await buyOptionsResponse.json();
      console.log('Refreshed Buy Options Response:', buyOptionsData);
      if (buyOptionsData.code === 0 && Array.isArray(buyOptionsData.data)) {
        console.log('Refreshed Buy Options Data:', buyOptionsData.data);
        setBuyOptions(buyOptionsData.data);
      } else if (buyOptionsData.code === 102002 || buyOptionsData.code === 102001) {
        // Token expired, attempt to refresh
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          // Retry the fetch after login
          const retryResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
          if (retryData.code === 0 && Array.isArray(retryData.data)) {
            setBuyOptions(retryData.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh buy options:', error);
    }

    try {
      // Reload starlet products to update stock and purchased quantities
      const starletResponse = await fetch(`${shared.server_url}/api/app/starletProducts?token=${shared.loginData.token}`);
      const starletData = await starletResponse.json();
      console.log('Refreshed Starlet Products Response:', starletData);
      if (starletData.code === 0 && Array.isArray(starletData.data)) {
        console.log('Refreshed Starlet Products Data:', starletData.data);
        setStarletProducts(starletData.data);
      } else if (starletData.code === 102002 || starletData.code === 102001) {
        // Token expired, attempt to refresh
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          // Retry the fetch after login
          const retryResponse = await fetch(`${shared.server_url}/api/app/starletProducts?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
          if (retryData.code === 0 && Array.isArray(retryData.data)) {
            setStarletProducts(retryData.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh starlet products:', error);
    }

    // Also refresh free reward status to ensure free option availability is up-to-date
    try {
      await checkFreeRewardTime();
    } catch (error) {
      console.error('Failed to refresh free reward status:', error);
    }
  };

  // Add new function to refresh only a specific starlet product
  const refreshStarletProduct = async (productId) => {
    try {
      const response = await fetch(`${shared.server_url}/api/app/starletProductData?token=${shared.loginData.token}&productId=${productId}`);
      const data = await response.json();
      console.log('Refreshed Starlet Product Response:', data);
      if (data.code === 0 && data.data) {
        console.log('Refreshed Starlet Product Data:', data.data);
        // Update the specific product in starletProducts array
        setStarletProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId ? data.data : product
          )
        );
      } else if (data.code === 102002 || data.code === 102001) {
        // Token expired, attempt to refresh
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          const retryResponse = await fetch(`${shared.server_url}/api/app/starletProductData?token=${shared.loginData.token}&productId=${productId}`);
          const retryData = await retryResponse.json();
          if (retryData.code === 0 && retryData.data) {
            setStarletProducts(prevProducts => 
              prevProducts.map(product => 
                product.id === productId ? retryData.data : product
              )
            );
          } else {
            // Show error popup for retry failure
            if (window.Telegram?.WebApp?.showPopup) {
              await window.Telegram.WebApp.showPopup({
                title: 'Error',
                message: 'Failed to refresh product data. Please try again.',
                buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
              });
            }
          }
        } else {
          // Show error popup for login failure
          if (window.Telegram?.WebApp?.showPopup) {
            await window.Telegram.WebApp.showPopup({
              title: 'Error',
              message: 'Session expired. Please try again.',
              buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
            });
          }
        }
      } else {
        // Show error popup for API error
        if (window.Telegram?.WebApp?.showPopup) {
          await window.Telegram.WebApp.showPopup({
            title: 'Error',
            message: data.msg || 'Failed to refresh product data. Please try again.',
            buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
          });
        }
      }
    } catch (error) {
      console.error('Failed to refresh starlet product:', error);
      // Show error popup for network/other errors
      if (window.Telegram?.WebApp?.showPopup) {
        await window.Telegram.WebApp.showPopup({
          title: 'Error',
          message: 'Network error. Please check your connection and try again.',
          buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
        });
      }
    }
  };

  // Add new function to refresh user profile only (without reloading market content)
  const refreshUserProfileOnly = async () => {
    try {
      await shared.getProfileWithRetry();
      const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
      if (userStarlets) {
        setStarlets(userStarlets.num);
      }

      const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
      if (userTicket) {
        setTickets(userTicket.num);
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      // Show error popup for profile refresh failure
      if (window.Telegram?.WebApp?.showPopup) {
        await window.Telegram.WebApp.showPopup({
          title: 'Error',
          message: 'Failed to refresh user data. Please try again.',
          buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
        });
      }
    }
  };

  // Add useEffect to watch for starlet purchase completion and reload only the specific product
  useEffect(() => {
    if (isStarletPurchaseComplete) {
      console.log('Market: Starlet purchase completed, refreshing specific product and user profile');
      // Refresh user profile to update starlets count
      refreshUserProfileOnly();
      // Refresh market content to update all product statuses
      refreshMarketContent();
      setActiveTab('starlet');
      setIsStarletPurchaseComplete(false); // Reset the flag
    }
  }, [isStarletPurchaseComplete]);

  const handleConfirmPurchase = async () => {
    const wasStarletProduct = !!selectedPurchase?.isStarletProduct;
    if (!shared.loginData?.fslId) {
      setIsPopupOpen(false);
      setSelectedPurchase(null);
      showFSLIDScreen();
      return;
    }

    if (selectedPurchase) {
      trackUserAction('market_purchase_click', {
        amount: selectedPurchase.amount,
        stars: selectedPurchase.stars,
        price: selectedPurchase.stars === 0 ? 'FREE' : null
      }, shared.loginData?.link);
    }
    
    // Reset states
    setIsPopupOpen(false);
    setSelectedPurchase(null);
    setShowBuyView(false);

    // After purchasing a Starlet product (e.g., GMT packages), trigger reload
    if (wasStarletProduct) {
      setIsStarletPurchaseComplete(true);
    } else {
      // For regular purchases, refresh market content to update availability
      await refreshMarketContent();
    }
  };

  // Helper function to get category title and color based on type
  const getCategoryInfo = (type) => {
    switch (type) {
      case 0:
        return { title: 'STANDARD PACK', color: '#00FF00', bgColor: 'rgba(0, 255, 0, 0.1)' };
      case 10:
        return { title: 'LIMITED WEEKLY OFFER', color: '#FF69B4', bgColor: 'rgba(255, 105, 180, 0.1)' };
      case 20:
        return { title: 'LIMITED MONTHLY OFFER', color: '#9370DB', bgColor: 'rgba(147, 112, 219, 0.1)' };
      case 30:
        return { title: 'EXCLUSIVE ONE-TIME OFFER', color: '#FFA500', bgColor: 'rgba(255, 165, 0, 0.1)' };
      default:
        return { title: 'STANDARD PACK', color: '#00FF00', bgColor: 'rgba(0, 255, 0, 0.1)' };
    }
  };

  // Helper function to get starlet product info based on prop ID
  const getStarletProductInfo = (product) => {
    // If API provides name, use it directly
    if (product.name) {
      return {
        name: product.name,
        displayAmount: product.name, // Use name for display amount too
        icon: product.prop === 0 ? null : gmtCard,
        description: product.prop === 0 ? 'Merchandise Coupon' : 'GMT Payment Card',
        category: product.prop === 0 ? 'Merchandise' : 'Payment Cards',
        useBackground: product.prop === 0 ? true : false,
        backgroundImage: product.prop === 0 ? merchCouponBg : null,
        productId: `product-${product.id}`
      };
    }

    // Fallback to hardcoded values if no name from API
    switch (product.prop) {
      case 60010:
        return { 
          name: '$50 GMT PAY CARD', 
          displayAmount: '$50',
          icon: gmtCard,
          description: 'GMT Payment Card',
          category: 'Payment Cards',
          useBackground: false,
          productId: 'gmt-50'
        };
      case 60020:
        return { 
          name: '$100 GMT PAY CARD', 
          displayAmount: '$100',
          icon: gmtCard,
          description: 'GMT Payment Card',
          category: 'Payment Cards',
          useBackground: false,
          productId: 'gmt-100'
        };
      case 60030:
        return { 
          name: '$200 GMT PAY CARD', 
          displayAmount: '$200',
          icon: gmtCard,
          description: 'GMT Payment Card',
          category: 'Payment Cards',
          useBackground: false,
          productId: 'gmt-200'
        };
      case 70010:
        return { 
          name: '$79 MERCH COUPON', 
          displayAmount: '$79 MERCH COUPON', 
          backgroundImage: merchCouponBg,
          description: 'Merchandise Coupon',
          category: 'Merchandise',
          useBackground: true
        };
      case 70020:
        return { 
          name: '$199 MERCH COUPON', 
          displayAmount: '$199 MERCH COUPON', 
          backgroundImage: merchCouponBg,
          description: 'Merchandise Coupon',
          category: 'Merchandise',
          useBackground: true
        };
      default:
        return { 
          name: 'Unknown Product', 
          icon: starlet,
          description: 'Product',
          category: 'Other',
          useBackground: false
        };
    }
  };

  // Helper function to get expansion state based on type
  const getExpansionState = (type) => {
    switch (type) {
      case 0:
        return standardPackExpanded;
      case 10:
        return weeklyOfferExpanded;
      case 20:
        return monthlyOfferExpanded;
      case 30:
        return exclusiveOfferExpanded;
      default:
        return standardPackExpanded;
    }
  };

  // Helper function to set expansion state based on type
  const setExpansionState = (type, value) => {
    switch (type) {
      case 0:
        setStandardPackExpanded(value);
        break;
      case 10:
        setWeeklyOfferExpanded(value);
        break;
      case 20:
        setMonthlyOfferExpanded(value);
        break;
      case 30:
        setExclusiveOfferExpanded(value);
        break;
      default:
        setStandardPackExpanded(value);
    }
  };

  // Group buy options by type
  const groupedOptions = buyOptions.reduce((acc, option) => {
    if (!acc[option.type]) {
      acc[option.type] = [];
    }
    acc[option.type].push(option);
    return acc;
  }, {});

  // Ensure all category types exist
  [0, 10, 20, 30].forEach(type => {
    if (!groupedOptions[type]) {
      groupedOptions[type] = [];
    }
  });

  // Sort categories by type order: 0 (Standard), 30 (Exclusive), 20 (Monthly), 10 (Weekly)
  const categoryOrder = [0, 30, 20, 10];

  if (showBuyView) {
    return (
      <Buy
        selectedPurchase={selectedPurchase}
        setShowBuyView={setShowBuyView}
        showFSLIDScreen={showFSLIDScreen}
        setSelectedPurchase={setSelectedPurchase}
        setShowProfileView={setShowProfileView}
      />
    );
  }

  return (
    <>
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      <header className="stats-header">
        <button 
          className="profile-pic-main"
          onClick={() => setShowProfileView(true)}
        >
          <img 
            src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
            alt="Profile" 
          />
        </button>
        <div className="stat-item-main-text" onClick={() => setShowProfileView(true)}>
          GM {shared.telegramUserData?.firstName || 'User'}!
        </div>
        <div className="stats-main">
          <button 
            className="stat-item-main"
            onClick={() => setShowProfileView(true)}
          >
            <img src={ticketIcon} alt="Tickets" />
            <span className="stat-item-main-text">{tickets}</span>
          </button>
          <button 
            className="stat-item-main"
            onClick={() => setShowProfileView(true)}
          >
            <img src={starlet} alt="Starlets" />
            <span className="stat-item-main-text">{starlets}</span>
          </button>
        </div>
      </header>

      <div className="mk-market-container">
        <div className="mk-market-content">
          <div className="mk-market-title">MARKET</div>

          {!shared.userProfile?.fslId && (
            <div className="mk-fsl-connect-section" onClick={handleConnectFSLID}>
              <div className="mk-fsl-connect-content">
                <div className="mk-lock-icon">🔒</div>
                <div className="mk-fsl-text">
                  <div className="mk-connect-title">CONNECT YOUR FSL ID</div>
                  <div className="mk-connect-subtitle">STEPN OG SNEAKER HOLDERS CAN CLAIM 10 FREE STARLETS DAILY!</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mk-market-inner-content">
            <div className="mk-market-tab-container" data-active-tab={activeTab}>
              <div className="mk-tabs">
                <button
                  className={`mk-tab ${activeTab === 'telegram' ? 'active' : ''}`}
                  onClick={() => setActiveTab('telegram')}
                >
                  <div>TELEGRAM</div>
                  <div>PACKAGES</div>
                </button>
                <button
                  className={`mk-tab ${activeTab === 'starlet' ? 'active' : ''}`}
                  onClick={() => setActiveTab('starlet')}
                >
                  <div>STARLET</div>
                  <div>PACKAGES</div>
                </button>
              </div>
              
              <div className="mk-scrollable-market-content">
                {/* Show content based on active tab */}
                {activeTab === 'telegram' && (
                  <>
                    {/* Render each category in order */}
                    {categoryOrder.map((type) => {
                      const categoryInfo = getCategoryInfo(type);
                      const isExpanded = getExpansionState(type);
                      const options = groupedOptions[type] || [];
                      
                      // Skip empty sections except Standard Pack (type 0) which should always show for free item
                      if (options.length === 0 && type !== 0) {
                        return null;
                      }
                      
                      return (
                        <div key={type} className="mk-market-section">
                      <div 
                        className="mk-section-header"
                        onClick={() => setExpansionState(type, !isExpanded)}
                      >
                        {/* Corner borders */}
                        <div className="mk-corner mk-top-left"></div>
                        <div className="mk-corner mk-top-right"></div>
                        
                        <div 
                          className="mk-section-title-container"
                          style={{ backgroundColor: categoryInfo.color }}
                        >
                          <span className="mk-section-title">
                            {categoryInfo.title}
                          </span>
                          <img src={arrow_2} className={`mk-section-arrow ${isExpanded ? 'expanded' : ''}`} alt="arrow" />
                        </div>
                      </div>
                      <div className={`mk-section-content ${isExpanded ? 'expanded' : ''}`}>
                        {/* Corner borders for content */}
                        <div className="mk-corner mk-bottom-left"></div>
                        <div className="mk-corner mk-bottom-right"></div>
                        
                        <div className="mk-starlet-grid">
                          {/* Show free item only in Standard Pack (type 0) */}
                          {type === 0 && (
                            <button 
                              className={`mk-market-ticket-button ${isFreeItemClaimed ? 'sold-out' : ''}`} 
                              onClick={() => !isFreeItemClaimed && handleStarletPurchase(50, 0, 'FREE', 'free')}
                              disabled={isFreeItemClaimed}
                            >
                              <div className="mk-market-ticket-button-image-container">
                                <div className="mk-market-ticket-content">
                                  <div className="mk-market-ticket-icon">
                                    <img src={starlet} alt="Starlet" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }} />
                                  </div>
                                  <div className="mk-market-ticket-info">
                                    <div className="mk-market-ticket-text">
                                      <div className="mk-market-ticket-amount" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }}>50</div>
                                      <div className="mk-market-ticket-label" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }}>STARLETS</div>
                                    </div>
                                    <div className="mk-market-ticket-bonus">
                                      <span>X1</span>&nbsp;<span>TICKETS</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mk-market-ticket-price">
                                  {isFreeItemClaimed ? 'SOLD OUT' : 'FREE'}
                                </div>
                              </div>
                            </button>
                          )}
                          
                          {/* Show regular options */}
                          {options.map((option) => {
                            // Check if option is available (state 0 = available, 1 = unavailable)
                            const isAvailable = option.state === 0 && option.canBuy;
                            
                            // Calculate bonus for special offers
                            let bonusText = null;
                            if (type === 30) { // Exclusive One-Time Offer
                              if (option.stars === 0) bonusText = "BONUS: 50";
                              else if (option.stars === 5) bonusText = "BONUS: 325";
                              else if (option.stars === 10) bonusText = "BONUS: 325";
                            } else if (type === 10) { // Limited Weekly Offer
                              if (option.stars === 0) bonusText = "BONUS: 25";
                              else if (option.stars === 5) {
                                if (option.starlet === 100) bonusText = "BONUS: 195";
                                else bonusText = "BONUS: 675";
                              }
                            } else if (type === 20) { // Limited Monthly Offer
                              if (option.stars === 0) bonusText = "50% VALUE";
                              else if (option.stars === 5) bonusText = "100% VALUE";
                            }
                            
                            return (
                              <button 
                                key={option.id}
                                className={`mk-market-ticket-button ${!isAvailable ? 'sold-out' : ''}`}
                                onClick={() => isAvailable && handleStarletPurchase(option.starlet, option.stars, null, option.id)}
                                disabled={!isAvailable}
                              >
                                {/* Bonus box in top-left corner */}
                                {option.bonus > 0 && type !== 0 && (
                                  <div className="mk-market-ticket-bonus-corner" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                    <div className="mk-market-ticket-bonus-corner-text">
                                      {type === 20 ? `${option.bonusPercentage}% VALUE` : `BONUS: ${option.bonus}`}
                                    </div>
                                  </div>
                                )}
                                <div className="mk-market-ticket-button-image-container">
                                  <div className="mk-market-ticket-content">
                                    <div className="mk-market-ticket-icon">
                                      <img src={starlet} alt="Starlet" style={{ opacity: isAvailable ? 1 : 0.5 }} />
                                    </div>
                                    <div className="mk-market-ticket-info">
                                      {bonusText && (
                                        <div className="mk-market-ticket-bonus-text" style={{ opacity: isAvailable ? 1 : 0.5 }}>{bonusText}</div>
                                      )}
                                      <div className="mk-market-ticket-text">
                                        <div className="mk-market-ticket-amount" style={{ opacity: isAvailable ? 1 : 0.5 }}>{option.starlet}</div>
                                        <div className="mk-market-ticket-label" style={{ opacity: isAvailable ? 1 : 0.5 }}>STARLETS</div>
                                      </div>
                                      {option.ticket > 0 && (
                                        <div className="mk-market-ticket-bonus" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                          <span>X{option.ticket}</span>&nbsp;<span>TICKETS</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mk-market-ticket-price" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                    {!isAvailable ? 'SOLD OUT' : `${option.stars} TELEGRAM STARS`}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                  </>
                )}
                
                {activeTab === 'starlet' && (
                  <div className="mk-starlet-products-container">
                    <div className="mk-starlet-grid">
                      {starletProducts.map((product) => {
                        const productInfo = getStarletProductInfo(product);
                        const hasFSLID = !!shared.userProfile?.fslId;
                        const userLevel = shared.userProfile?.level || 0;
                        const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
                        
                        // Check conditions in order of priority
                        let isDisabled = false;
                        let disabledReason = '';
                        
                        // 1. FSL ID not connected
                        if (!hasFSLID) {
                          isDisabled = true;
                          disabledReason = 'FSL ID NOT CONNECTED';
                        }
                        // 2. Level requirement (Level 10)
                        else if (userLevel < 10) {
                          isDisabled = true;
                          disabledReason = 'LEVEL 10 REQUIRED';
                        }
                        // 3. Out of stock
                        else if (product.stock <= 0) {
                          isDisabled = true;
                          disabledReason = 'OUT OF STOCK';
                        }
                        // 4. Not enough starlets
                        else if (userStarlets < product.starlet) {
                          isDisabled = true;
                          disabledReason = 'NOT ENOUGH STARLETS';
                        }
                        // 5. Limit reached
                        else if (product.purchasedQuantity >= product.limitNum) {
                          isDisabled = true;
                          disabledReason = 'LIMIT REACHED';
                        }
                        // 6. Product state unavailable
                        else if (product.state !== 0) {
                          isDisabled = true;
                          disabledReason = 'UNAVAILABLE';
                        }
                        
                        const isAvailable = !isDisabled;
                        
                        return (
                          <button 
                            key={product.id}
                            className={`mk-market-ticket-button mk-starlet-product ${!isAvailable ? 'sold-out' : ''} ${productInfo.productId ? `product-${productInfo.productId}` : ''}`}
                            onClick={() => isAvailable && handleStarletProductPurchase(product)}
                            disabled={!isAvailable}
                          >
                            {/* Limit corner in top-right for starlet products */}
                            <div className="mk-starlet-limit-corner" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                              <div className="mk-starlet-limit-corner-text">
                                {product.purchasedQuantity}/{product.limitNum}
                              </div>
                            </div>
                            <div 
                              className="mk-market-ticket-button-image-container"
                              style={productInfo.useBackground ? {
                                backgroundImage: `url(${productInfo.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'calc(50% + 50px) center',
                                backgroundRepeat: 'no-repeat'
                              } : {}}
                            >
                              <div className="mk-market-ticket-content">
                                {!productInfo.useBackground && (
                                  <div className="mk-market-ticket-icon">
                                    <img src={productInfo.icon} alt={productInfo.name} style={{ opacity: isAvailable ? 1 : 0.5 }} />
                                  </div>
                                )}
                                <div className="mk-market-ticket-info">
                                  <div className="mk-market-ticket-text">
                                    <div className="mk-market-ticket-amount" style={{ opacity: isAvailable ? 1 : 0.5 }}>{productInfo.displayAmount}</div>
                                    {/* <div className="mk-market-ticket-label" style={{ opacity: isAvailable ? 1 : 0.5 }}>{productInfo.description}</div> */}
                                  </div>
                                  <div className="mk-market-ticket-bonus" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                    <span>Stock:</span>&nbsp;<span>{product.stock}</span>
                                  </div>
                                  <div className="mk-market-ticket-bonus" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                    <span>Limit:</span>&nbsp;<span>{product.limitNum}</span>
                                  </div>
                                  <div className="mk-market-ticket-bonus" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                    <span>Purchased:</span>&nbsp;<span>{product.purchasedQuantity}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mk-market-ticket-price" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                {isAvailable ? `${product.starlet} STARLETS` : disabledReason}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      
                      {/* Show message if no products available */}
                      {starletProducts.length === 0 && (
                        <div className="mk-starlet-packages-placeholder">
                          <div className="mk-placeholder-content">
                            <div className="mk-placeholder-text">STARLET PACKAGES</div>
                            <div className="mk-placeholder-subtext">No products available</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmPurchasePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        amount={selectedPurchase?.amount}
        stars={selectedPurchase?.stars}
        optionId={selectedPurchase?.optionId}
        productId={selectedPurchase?.productId}
        productName={selectedPurchase?.productName}
        isStarletProduct={selectedPurchase?.isStarletProduct}
        onConfirm={handleConfirmPurchase}
        setShowProfileView={setShowProfileView}
        setShowBuyView={setShowBuyView}
        onPurchaseComplete={() => setIsStarletPurchaseComplete(true)}
      />
    </>
  );
};

export default Market; 