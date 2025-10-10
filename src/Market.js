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
import iconStreak1 from './images/Icon_streak_1_day.png';
import iconStreak2 from './images/Icon_streak_2_day.png';
import iconStreak5 from './images/Icon_streak_5_day.png';
import bgStreak1 from './images/Bg_streak_1.png';
import bgStreak2 from './images/Bg_streak_2.png';
import bgStreak5 from './images/Bg_streak_5.png';
import FreezeStreakPopup from './FreezeStreakPopup';
import fslidIcon from './images/FSLID-ICON.png';
import iconStepBoostx1_5 from './images/Icon_StepBoosts_x1_5.png';
import iconStepBoostx2 from './images/Icon_StepBoosts_x2.png';
import StepBoostsPopup from './StepBoostsPopup';
import premiumIcon from './images/Premium_icon.png';
import premiumBg from './images/Premium_bg.png';
import premiumDiamond from './images/Premium_icon.png';

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
  
  // Premium membership pricing data
  const [membershipData, setMembershipData] = useState({
    typeMonthly: 1,
    typeYearly: 2,
    membershipMonthlyPrice: 100,
    membershipYearlyPrice: 1000
  });
  
  // Premium membership status
  const [premiumType, setPremiumType] = useState(null); // null, 1 (monthly), or 2 (yearly)
  
  // Category expansion states
  const [standardPackExpanded, setStandardPackExpanded] = useState(true);
  const [exclusiveOfferExpanded, setExclusiveOfferExpanded] = useState(true);
  const [monthlyOfferExpanded, setMonthlyOfferExpanded] = useState(true);
  const [weeklyOfferExpanded, setWeeklyOfferExpanded] = useState(true);
  // Freeze Streak expansion state
  const [freezeStreakExpanded, setFreezeStreakExpanded] = useState(true);
  // Merch Coupon expansion state
  const [merchCouponExpanded, setMerchCouponExpanded] = useState(true);
  // Step Boosts expansion state
  const [stepBoostsExpanded, setStepBoostsExpanded] = useState(true);
  const [premiumExpanded, setPremiumExpanded] = useState(true);
  
  // Freeze Streak popup states
  const [showFreezeStreakPopup, setShowFreezeStreakPopup] = useState(false);
  const [selectedFreezeStreakPackage, setSelectedFreezeStreakPackage] = useState(null);

  // Step Boosts popup states
  const [showStepBoostsPopup, setShowStepBoostsPopup] = useState(false);
  const [selectedStepBoost, setSelectedStepBoost] = useState(null);

  // Function to fetch premium membership type
  const fetchPremiumType = async () => {
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for premium type check');
        return;
      }
      
      const url = `${shared.server_url}/api/app/getPremiumDetail?token=${shared.loginData.token}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.code === 0 && data.data) {
          const premiumData = data.data;
          setPremiumType(premiumData.type || null);
          console.log('Premium type updated:', premiumData.type);
        }
      }
    } catch (error) {
      console.error('Error fetching premium type:', error);
    }
  };

  // If navigated from Home with a target tab instruction, switch tabs (no popup)
  useEffect(() => {
    if (shared.marketTargetTab) {
      setActiveTab(shared.marketTargetTab);
      delete shared.marketTargetTab;
    }
  }, []);

  // Fetch premium type on component mount
  useEffect(() => {
    fetchPremiumType();
  }, []);

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
  // NOTE: buyOptions and starletProducts are loaded via refreshMarketContent() to prevent duplicate API calls
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // COMMENTED OUT: Fetch buy options and starlet products on init to prevent duplicate API calls
        // These will be fetched by refreshMarketContent() when needed
        /*
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
        */

        // Check free reward time
        await checkFreeRewardTime();

        // Fetch membership pricing data
        await fetchMembershipPricing();

        // Setup profile data
        const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
          setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
          setTickets(userTicket.num);
        }

        // Load initial market data (buyOptions and starletProducts) to prevent duplicate API calls
        // await refreshMarketContent();
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

  // Fetch membership pricing data from API
  const fetchMembershipPricing = async () => {
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for membership pricing API');
        return;
      }
      
      const url = `${shared.server_url}/api/app/membershipBuyData?token=${shared.loginData.token}`;
      console.log('Fetching membership pricing from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Membership pricing API response:', data);
        
        if (data.code === 0 && data.data) {
          const pricingData = data.data;
          
          setMembershipData({
            typeMonthly: pricingData.type_monthly || 1,
            typeYearly: pricingData.type_yearLy || 2,
            membershipMonthlyPrice: pricingData.membershipMonthlyPrice || 100,
            membershipYearlyPrice: pricingData.membershipYearlyPrice || 1000
          });
          
          console.log('✅ Membership pricing data set:', {
            typeMonthly: pricingData.type_monthly,
            typeYearly: pricingData.type_yearLy,
            monthlyPrice: pricingData.membershipMonthlyPrice,
            yearlyPrice: pricingData.membershipYearlyPrice
          });
        } else {
          console.log('Unexpected membership pricing API response format:', data);
        }
      } else {
        console.error('Membership pricing API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error fetching membership pricing:', error);
    }
  };

  const handleConnectFSLID = () => {
    showFSLIDScreen();
  };

  const showError = async (message) => {
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
  };

  const handleStarletPurchase = (amount, stars, price, optionId = null) => {
    setSelectedPurchase({ amount, stars, optionId });
    setShowBuyView(true);
  };

  const handleFreeItemClick = async () => {
    if (shared.userProfile.fslId === 0) {
      showFSLIDScreen();
      return;
    }
    
    // Call API directly for free items and show success popup
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

        // Show success popup directly
        setSelectedPurchase({ 
          amount: 50, 
          stars: 0, 
          optionId: 'free',
          isFreeItem: true
        });
        setIsPopupOpen(true);
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

            await refreshMarketContent();

            // Show success popup directly
            setSelectedPurchase({ 
              amount: 50, 
              stars: 0, 
              optionId: 'free',
              isFreeItem: true
            });
            setIsPopupOpen(true);
          } else {
            await showError(retryData.msg || 'Claim failed. Please try again.');
          }
        } else {
          await showError('Session expired. Please try again.');
        }
      } else {
        await showError(data.msg || 'Claim failed. Please try again.');
      }
    } catch (error) {
      console.error('Failed to claim free reward:', error);
      await showError('Failed to claim free reward. Please try again.');
    }
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

    // Note: Market content (buyOptions, starletProducts) is loaded by refreshMarketContent()
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
        
        // // Add fake Step Boost products for testing
        // const fakeStepBoosts = [
        //   {
        //     id: 1,            // ID để xác định step boost x1.5
        //     prop: 20010,      // Prop để xác định loại step boosts
        //     name: "X1.5 STEP BOOST",
        //     starlet: 100,
        //     stock: 10,
        //     limitNum: 5,
        //     purchasedQuantity: 0,
        //     state: 0,
        //     canBuy: true
        //   },
        //   {
        //     id: 2,            // ID để xác định step boost x2
        //     prop: 20010,      // Prop để xác định loại step boosts (cùng loại)
        //     name: "X2 STEP BOOST", 
        //     starlet: 200,
        //     stock: 10,
        //     limitNum: 3,
        //     purchasedQuantity: 0,
        //     state: 0,
        //     canBuy: true
        //   }
        // ];
        
        // // Combine API data with fake Step Boosts
        const combinedData = [...starletData.data];
        setStarletProducts(combinedData);
      } else if (starletData.code === 102002 || starletData.code === 102001) {
        // Token expired, attempt to refresh
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          // Retry the fetch after login
          const retryResponse = await fetch(`${shared.server_url}/api/app/starletProducts?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
          if (retryData.code === 0 && Array.isArray(retryData.data)) {
            // // Add fake Step Boost products for testing
            // const fakeStepBoosts = [
            //   {
            //     id: 1,        // ID để xác định step boost x1.5
            //     prop: 20010,      // Prop để xác định loại step boosts
            //     name: "X1.5 STEP BOOST",
            //     starlet: 100,
            //     stock: 10,
            //     limitNum: 5,
            //     purchasedQuantity: 0,
            //     state: 0,
            //     canBuy: true
            //   },
            //   {
            //     id: 2,        // ID để xác định step boost x2
            //     prop: 20010,      // Prop để xác định loại step boosts (cùng loại)
            //     name: "X2 STEP BOOST", 
            //     starlet: 200,
            //     stock: 10,
            //     limitNum: 3,
            //     purchasedQuantity: 0,
            //     state: 0,
            //     canBuy: true
            //   }
            // ];
            
            // // Combine API data with fake Step Boosts
            const combinedData = [...retryData.data];
            setStarletProducts(combinedData);
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
      // Refresh premium type to update membership status
      fetchPremiumType();
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

  const handlePurchasePremium = (type = 'monthly') => {
    const price = type === 'monthly' ? membershipData.membershipMonthlyPrice : membershipData.membershipYearlyPrice;
    const membershipType = type === 'monthly' ? membershipData.typeMonthly : membershipData.typeYearly;
    
    setSelectedPurchase({
      amount: price,
      stars: 0,
      productId: membershipType,
      productName: `Premium Membership ${type === 'monthly' ? 'Monthly' : 'Yearly'}`,
      isStarletProduct: true,
      isPremium: true,
      optionId: null
    });
    setShowBuyView(true);
  };

  // Function to handle membership purchase
  const handleMembershipPurchase = async (type) => {
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for membership purchase');
        return;
      }
      
      const membershipType = type === 'monthly' ? membershipData.typeMonthly : membershipData.typeYearly;
      const price = type === 'monthly' ? membershipData.membershipMonthlyPrice : membershipData.membershipYearlyPrice;
      
      console.log(`🛒 Purchasing ${type} membership:`, {
        type: membershipType,
        price: price
      });
      
      // TODO: Implement actual purchase API call
      // const url = `${shared.server_url}/api/app/purchaseMembership?token=${shared.loginData.token}&type=${membershipType}&price=${price}`;
      // const response = await fetch(url, { method: 'POST' });
      
      console.log('✅ Membership purchase initiated');
      
    } catch (error) {
      console.error('Error purchasing membership:', error);
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

  // Freeze streak assets mapping based on num value
  const getFreezeAssets = (num) => {
    if (num === 1) {
      return { icon: iconStreak1, bg: bgStreak1 };
    } else if (num > 4) {
      return { icon: iconStreak5, bg: bgStreak5 };
    } else if (num > 1) {
      return { icon: iconStreak2, bg: bgStreak2 };
    } else {
      // Fallback to 1 day assets for any other values
      return { icon: iconStreak1, bg: bgStreak1 };
    }
  };

  // // Helper function to get step boost product info
  // const getStepBoostProductInfo = (product) => {
  //   // If API provides name, use it directly
  //   if (product.name) {
  //     return {
  //       name: product.name,
  //       displayAmount: product.name.includes('X1.5') ? 'X1.5' : 'X2',
  //       icon: product.name.includes('X1.5') ? iconStepBoostx1_5 : iconStepBoostx2,
  //       description: 'BOOST YOUR STEPS',
  //       category: 'Step Boosts',
  //       useBackground: false,
  //       productId: product.id,
  //       priceIcon: starlet,
  //       priceIconClass: 'mk-freeze-price-icon'
  //     };
  //   }

  //   // Fallback to hardcoded values if no name from API
  //   // Use product.id to determine specific step boost type
  //   switch (product.id) {
  //     case 1:
  //       return { 
  //         name: 'X1.5 STEP BOOST', 
  //         displayAmount: '1.5X',
  //         icon: iconStepBoostx1_5, // Will be replaced with step boost icon
  //         description: 'BOOST YOUR STEPS',
  //         category: 'Step Boosts',
  //         useBackground: false,
  //         productId: 1,
  //         priceIcon: starlet,
  //         priceIconClass: 'mk-freeze-price-icon'
  //       };
  //     case 2:
  //       return { 
  //         name: 'X2 STEP BOOST', 
  //         displayAmount: '2X',
  //         icon: iconStepBoostx2, // Will be replaced with step boost icon
  //         description: 'BOOST YOUR STEPS',
  //         category: 'Step Boosts',
  //         useBackground: false,
  //         productId: 2,
  //         priceIcon: starlet,
  //         priceIconClass: 'mk-freeze-price-icon'
  //       };
  //     default:
  //       return { 
  //         name: 'Unknown Step Boost', 
  //         icon: starlet,
  //         description: 'BOOST YOUR STEPS',
  //         category: 'Step Boosts',
  //         useBackground: false,
  //         productId: 0,
  //         priceIcon: starlet,
  //         priceIconClass: 'mk-freeze-price-icon'
  //       };
  //   }
  // };

  // Helper function to get starlet product info based on prop ID
  const getStarletProductInfo = (product) => {
    // If API provides name, use it directly
    if (product.name) {
      // Special case for freeze streak (prop 10110)
      if (product.prop === 10110) {
        // Use product.num to determine the appropriate assets
        const num = product.num || 1;
        const assets = getFreezeAssets(num);
        
        return {
          name: product.name,
          displayAmount: 'FREEZE STREAK', // Fixed text like hard-coded version
          icon: assets.icon || starlet, // Use appropriate streak icon
          description: 'Freeze Streak',
          category: 'Freeze Streak',
          useBackground: true,
          backgroundImage: assets.bg || bgStreak1, // Use appropriate background
          productId: `product-${product.id}`,
          designClass: 'mk-freeze-card',
          // Additional properties for freeze card design
          isFreezeCard: true,
          freezeDays: num, // Use product.num as days
          priceIcon: starlet, // Icon for price section
          priceIconClass: 'mk-freeze-price-icon'
        };
      }
      
      if (product.prop === 10120 || product.prop === 10121) {
        return {
          name: product.name,
          displayAmount: product.name.includes('1.5') ? 'X1.5' : 'X2',
          icon: product.name.includes('1.5') ? iconStepBoostx1_5 : iconStepBoostx2,
          description: 'BOOST YOUR STEPS',
          category: 'Step Boosts',
          useBackground: false,
          productId: product.id,
          priceIcon: starlet,
          priceIconClass: 'mk-freeze-price-icon'
        };
      }

      // Default design for other props
      return {
        name: product.name,
        displayAmount: product.name, // Use name for display amount too
        icon: product.prop >= 70000 ? null : gmtCard,
        description: product.prop >= 70000 ? 'Merchandise Coupon' : 'GMT Payment Card',
        category: product.prop >= 70000 ? 'Merchandise' : 'Payment Cards',
        useBackground: product.prop >= 70000 ? true : false,
        backgroundImage: product.prop >= 70000 ? merchCouponBg : null,
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

  const getPremiumMembershipProductInfo = (product) => {
    return {
      name: "PREMIUM MEMBERSHIP",
      displayAmount: "Monthly",
      icon: premiumIcon,
      description: "Premium Membership Monthly",
      useBackground: true,
      backgroundImage: premiumBg,
      productId: `1`
    };
  };

  // const getStepBoostProductInfo = () => {
  //   // Default design for other props
  //   return {
  //     name: "Step Boost",
  //     displayAmount: "x1.5", // Use name for display amount too
  //     icon: iconStepBoostx1_5,
  //     description: 'Step Boost x1.5',
  //     category: 'Step Boosts',
  //     useBackground: true,
  //     backgroundImage: null,
  //     productId: `1`
  //   };
  // };

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
        refreshUserProfile={refreshUserProfile}
      />
    );
  }

  // Handle Freeze Streak package selection
  const handleFreezeStreakClick = (streakPackage) => {
    setSelectedFreezeStreakPackage(streakPackage);
    setShowFreezeStreakPopup(true);
  };

  // Handle Step Boosts click
  const handleStepBoostsClick = (stepBoostPackage) => {
    setSelectedStepBoost(stepBoostPackage);
    setShowStepBoostsPopup(true);
  };


  // Handle Step Boosts purchase
  const handleStepBoostsPurchase = async (stepBoostPackage) => {
    // Here you can implement the actual purchase logic
    console.log('Purchasing Step Boost package:', stepBoostPackage);
    // Refresh user profile to update UI immediately
    await refreshUserProfile();
  };

  // Handle Freeze Streak purchase
  const handleFreezeStreakPurchase = async (streakPackage) => {
    // Here you can implement the actual purchase logic
    console.log('Purchasing Freeze Streak package:', streakPackage);
    // Refresh user profile to update UI immediately
    await refreshUserProfile();
  };


  return (
    <>
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      <header className="stats-header">
        <div className="profile-pic-container">
          <button 
            className="profile-pic-main"
            onClick={() => setShowProfileView(true)}
          >
            <img 
              src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
              alt="Profile" 
            />
          </button>
          {/* Premium icon overlay */}
          {shared.isPremiumMember && (
            <div className="premium-icon-overlay">
              <img src={premiumDiamond} alt="Premium" className="premium-icon" />
            </div>
          )}
        </div>
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
              {/* Corner border element */}
              <div className="mk-corner mk-top-left"></div>
              <div className="mk-corner mk-top-right"></div>
              <div className="mk-corner mk-bottom-left"></div>
              <div className="mk-corner mk-bottom-right"></div>
              <div className="mk-fsl-connect-content">
                <div className="mk-lock-icon"><img src={fslidIcon} alt="FSL ID" /></div>
                <div className="mk-fsl-text">
                  <div className="mk-connect-title">CONNECT YOUR FSL ID</div>
                  <div className="mk-connect-subtitle">STEPN OG SNEAKER HOLDERS CAN</div>
                  <div className="mk-connect-subtitle mk-connect-subtitle-secondary">CLAIM 10 FREE STARLETS DAILY!</div>
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
                              onClick={() => !isFreeItemClaimed && handleFreeItemClick()}
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
                
                    {/* Premium Membership Section */}
                    <div className="mk-market-section">
                      <div 
                        className="mk-section-header"
                        onClick={() => setPremiumExpanded(!premiumExpanded)}
                      >
                        <div className="mk-corner mk-top-left"></div>
                        <div className="mk-corner mk-top-right"></div>

                        <div 
                          className="mk-section-title-container"
                          style={{ backgroundColor: '#ff00f6' }} // #FFD700 is the color of the premium membership section, #ff00f6 is the color of the premium membership section
                        >
                          <span className="mk-section-title">PREMIUM MEMBERSHIP</span>
                          <img src={arrow_2} className={`mk-section-arrow ${premiumExpanded ? 'expanded' : ''}`} alt="arrow" />
                        </div>
                      </div>
                      <div className={`mk-section-content ${premiumExpanded ? 'expanded' : ''}`}>
                        <div className="mk-corner mk-bottom-left"></div>
                        <div className="mk-corner mk-bottom-right"></div>

                        <div className="mk-starlet-grid">
                          {/* Monthly Premium Membership */}
                          {(() => {
                            const hasFSLID = !!shared.userProfile?.fslId;
                            const userLevel = shared.userProfile?.level || 0;
                            const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
                            const isConnectedBankSteps = true; // TODO: Change to true when Bank Steps is connected  
                            
                            // Check conditions for Premium Membership
                            let isDisabled = false;
                            let disabledReason = '';
                            
                            // *. FSL ID not connected
                            if (!hasFSLID) {
                              isDisabled = true;
                              disabledReason = 'FSL ID NOT CONNECTED';
                            }
                            // 1. Level requirement (Level 1 for Premium Membership)
                            else if (userLevel < 1) {
                              isDisabled = true;
                              disabledReason = 'LEVEL 1 REQUIRED';
                            }
                            // 2. Bank Steps Not Connected
                            else if (!isConnectedBankSteps) {
                              isDisabled = true;
                              disabledReason = 'BANK STEPS NOT CONNECTED';
                            }
                            // 3. Already have yearly membership (disable monthly)
                            else if (premiumType === 2) {
                              isDisabled = true;
                              disabledReason = 'YEARLY MEMBERSHIP ACTIVE';
                            }
                            // 4. Not enough starlets
                            else if (userStarlets < membershipData.membershipMonthlyPrice) {
                              isDisabled = true;
                              disabledReason = membershipData.membershipMonthlyPrice.toLocaleString() + ' STARLETS';
                            }
                            
                            const isAvailable = !isDisabled;
                            
                            return (
                              <button 
                                key="premium-monthly"
                                className={`mk-market-ticket-button mk-premium-membership-product ${!isAvailable ? 'sold-out' : ''}`}
                                onClick={() => {
                                  if (isAvailable) {
                                    handlePurchasePremium('monthly');
                                  }
                                }}
                                disabled={!isAvailable}
                              >
                                <div 
                                  className="mk-market-ticket-button-image-container"
                                  style={{
                                    backgroundImage: `url(${premiumBg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                  }}
                                >
                                  <div className="mk-market-ticket-content">
                                    {/* Text Section */}
                                    <div className="mk-market-ticket-info">
                                      <div className="mk-market-ticket-text">
                                        <div className="mk-market-ticket-amount">MONTHLY</div>
                                        <div className="mk-market-ticket-label">PREMIUM</div>
                                        <div className="mk-market-ticket-label">MEMBERSHIP</div>
                                      </div>
                                    </div>
                                    
                                    {/* Diamond Section */}
                                    <div className="mk-market-ticket-icon">
                                      <div className="mk-premium-diamond-bg">
                                        {/* Diamond Image */}
                                        <img 
                                          src={premiumIcon} 
                                          alt="Premium Diamond" 
                                          className="mk-premium-diamond-img"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Price Section */}
                                  <div className={`mk-market-ticket-price ${disabledReason === 'YEARLY MEMBERSHIP ACTIVE' ? 'yearly-membership-active' : ''}`}>
                                    {isAvailable ? (
                                      <span>{membershipData.membershipMonthlyPrice} STARLETS</span>
                                    ) : (
                                      <span>{disabledReason}</span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })()}
                          
                          {/* Yearly Premium Membership */}
                          {(() => {
                            const hasFSLID = !!shared.userProfile?.fslId;
                            const userLevel = shared.userProfile?.level || 0;
                            const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
                            const isConnectedBankSteps = true; // TODO: Change to true when Bank Steps is connected  
                            
                            // Check conditions for Premium Membership
                            let isDisabled = false;
                            let disabledReason = '';
                            
                            // *. FSL ID not connected
                            if (!hasFSLID) {
                              isDisabled = true;
                              disabledReason = 'FSL ID NOT CONNECTED';
                            }
                            // 1. Level requirement (Level 1 for Premium Membership)
                            else if (userLevel < 1) {
                              isDisabled = true;
                              disabledReason = 'LEVEL 1 REQUIRED';
                            }
                            // 2. Bank Steps Not Connected
                            else if (!isConnectedBankSteps) {
                              isDisabled = true;
                              disabledReason = 'BANK STEPS NOT CONNECTED';
                            }
                            // 3. Not enough starlets
                            else if (userStarlets < membershipData.membershipYearlyPrice) {
                              isDisabled = true;
                              disabledReason = membershipData.membershipYearlyPrice.toLocaleString() + ' STARLETS';
                            }
                            
                            const isAvailable = !isDisabled;
                            
                            return (
                              <button 
                                key="premium-yearly"
                                className={`mk-market-ticket-button mk-premium-membership-product ${!isAvailable ? 'sold-out' : ''}`}
                                onClick={() => {
                                  if (isAvailable) {
                                    handlePurchasePremium('yearly');
                                  }
                                }}
                                disabled={!isAvailable}
                              >
                                <div 
                                  className="mk-market-ticket-button-image-container"
                                  style={{
                                    backgroundImage: `url(${premiumBg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                  }}
                                >
                                  <div className="mk-market-ticket-content">
                                    {/* Text Section */}
                                    <div className="mk-market-ticket-info">
                                      <div className="mk-market-ticket-text">
                                        <div className="mk-market-ticket-amount">YEARLY</div>
                                        <div className="mk-market-ticket-label">PREMIUM</div>
                                        <div className="mk-market-ticket-label">MEMBERSHIP</div>
                                      </div>
                                    </div>
                                    
                                    {/* Diamond Section */}
                                    <div className="mk-market-ticket-icon">
                                      <div className="mk-premium-diamond-bg">
                                        {/* Diamond Image */}
                                        <img 
                                          src={premiumIcon} 
                                          alt="Premium Diamond" 
                                          className="mk-premium-diamond-img"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Price Section */}
                                  <div className="mk-market-ticket-price">
                                    {isAvailable ? (
                                      <span>{membershipData.membershipYearlyPrice} STARLETS</span>
                                    ) : (
                                      <span>{disabledReason}</span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {activeTab === 'starlet' && (
                  <div className="mk-starlet-products-container">

                    {/* Freeze Streak Section */}
                    <div className="mk-market-section">
                      <div
                        className="mk-section-header"
                        onClick={() => setFreezeStreakExpanded(!freezeStreakExpanded)}
                      >
                        <div className="mk-corner mk-top-left"></div>
                        <div className="mk-corner mk-top-right"></div>

                        <div
                          className="mk-section-title-container"
                          style={{ backgroundColor: '#00FFFF' }}
                        >
                          <span className="mk-section-title">FREEZE STREAK</span>
                          <img src={arrow_2} className={`mk-section-arrow ${freezeStreakExpanded ? 'expanded' : ''}`} alt="arrow" />
                        </div>
                      </div>
                      <div className={`mk-section-content ${freezeStreakExpanded ? 'expanded' : ''}`}>
                        <div className="mk-corner mk-bottom-left"></div>
                        <div className="mk-corner mk-bottom-right"></div>

                        <div className="mk-starlet-grid">
                          {starletProducts
                            .filter(product => product.prop === 10110)
                            .map((product) => {
                              const productInfo = getStarletProductInfo(product);
                              const hasFSLID = !!shared.userProfile?.fslId;
                              const userLevel = shared.userProfile?.level || 0;
                              const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
                              
                              // Check conditions in order of priority (same as merch coupon)
                              let isDisabled = false;
                              let disabledReason = '';
                              
                              if (userLevel < 10) {
                                isDisabled = true;
                                disabledReason = 'LEVEL 10 REQUIRED';
                              }
                              // 3. Out of stock
                              else if (product.stock != -1 && product.stock <= 0) {
                                isDisabled = true;
                                disabledReason = 'OUT OF STOCK';
                              }
                              // 4. Purchase limit reached
                              else if (product.limitNum != -1 && product.purchasedQuantity >= product.limitNum) {
                                isDisabled = true;
                                disabledReason = 'LIMIT REACHED';
                              }
                              // 5. Not enough starlets
                              else if (userStarlets < product.starlet) {
                                isDisabled = true;
                                disabledReason = product.starlet.toLocaleString() + ' STARLETS';
                              }
                              
                              const isAvailable = !isDisabled;
                              
                              return (
                                <button 
                                  key={product.id}
                                  className={`mk-market-ticket-button ${productInfo.freezeDays === 1 ? 'mk-freeze-card mk-freeze-1-day' : 'mk-freeze-card'} ${!isAvailable ? 'sold-out' : ''}`}
                                  onClick={() => isAvailable && handleFreezeStreakClick({days: product.num, price: product.starlet, productId: product.id})}
                                  disabled={!isAvailable}
                                >
                                  <div 
                                    className="mk-market-ticket-button-image-container"
                                    style={productInfo.useBackground ? {
                                      backgroundImage: `url(${productInfo.backgroundImage})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: productInfo.isFreezeCard ? 'center' : 'calc(50% + 50px) center',
                                      backgroundRepeat: 'no-repeat'
                                    } : {}}
                                  >
                                    <div className="mk-market-ticket-content">
                                      {(!productInfo.useBackground || productInfo.isFreezeCard) && (
                                        <div className="mk-market-ticket-icon">
                                          <img src={productInfo.icon} alt={productInfo.name} style={{ opacity: isAvailable ? 1 : 0.5 }} />
                                        </div>
                                      )}
                                      <div className="mk-market-ticket-info">
                                        <div className="mk-market-ticket-text">
                                          <div className="mk-market-ticket-amount" style={{ opacity: isAvailable ? 1 : 0.5 }}>{productInfo.displayAmount}</div>
                                          {productInfo.isFreezeCard && (
                                            <div className="mk-market-ticket-label" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                              {productInfo.freezeDays} {productInfo.freezeDays === '1' ? 'DAY' : 'DAYS'}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mk-market-ticket-price" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                      {isAvailable ? (
                                        productInfo.isFreezeCard ? (
                                          <>
                                            <span>{product.starlet.toLocaleString()}</span>
                                            <img src={productInfo.priceIcon} alt="Starlet" className={productInfo.priceIconClass} />
                                          </>
                                        ) : (
                                          `${product.starlet} STARLETS`
                                        )
                                      ) : (
                                        disabledReason
                                      )}
                                    </div>
                                    
                                    {/* Limit corner for freeze streak products */}
                                    {product.limitNum != -1 && (
                                    <div className="mk-starlet-limit-corner" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                      <div className="mk-starlet-limit-corner-text">
                                        {product.purchasedQuantity}/{product.limitNum}
                                      </div>
                                    </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          
                          {/* Show message if no freeze streak products available */}
                          {starletProducts.filter(product => product.prop === 10110).length === 0 && (
                            <div className="mk-starlet-packages-placeholder">
                              <div className="mk-placeholder-content">
                                <div className="mk-placeholder-text">FREEZE STREAK</div>
                                <div className="mk-placeholder-subtext">No products available</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Merch Coupon Section */}
                    <div className="mk-market-section">
                      <div
                        className="mk-section-header"
                        onClick={() => setMerchCouponExpanded(!merchCouponExpanded)}
                      >
                        <div className="mk-corner mk-top-left"></div>
                        <div className="mk-corner mk-top-right"></div>

                        <div
                          className="mk-section-title-container"
                          style={{ backgroundColor: '#FF00F6' }}
                        >
                          <span className="mk-section-title">MERCH COUPON</span>
                          <img src={arrow_2} className={`mk-section-arrow ${merchCouponExpanded ? 'expanded' : ''}`} alt="arrow" />
                        </div>
                      </div>
                      <div className={`mk-section-content ${merchCouponExpanded ? 'expanded' : ''}`}>
                        <div className="mk-corner mk-bottom-left"></div>
                        <div className="mk-corner mk-bottom-right"></div>

                        <div className="mk-starlet-grid">
                      {starletProducts
                        .filter(product => product.prop === 70010) // Exclude freeze streak products
                        .map((product) => {
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
                          disabledReason = product.starlet.toLocaleString() + ' STARLETS';
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
                            className={`mk-market-ticket-button ${productInfo.isFreezeCard ? 'mk-freeze-card' : 'mk-starlet-product'} ${!isAvailable ? 'sold-out' : ''} ${productInfo.productId ? `product-${productInfo.productId}` : ''} ${productInfo.designClass || ''}`}
                            onClick={() => isAvailable && handleStarletProductPurchase(product)}
                            disabled={!isAvailable}
                          >
                            {/* Limit corner in top-right for starlet products (not freeze cards) */}
                            {!productInfo.isFreezeCard && (
                              <div className="mk-starlet-limit-corner" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                <div className="mk-starlet-limit-corner-text">
                                  {product.purchasedQuantity}/{product.limitNum}
                                </div>
                              </div>
                            )}
                            <div 
                              className="mk-market-ticket-button-image-container"
                              style={productInfo.useBackground ? {
                                backgroundImage: `url(${productInfo.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: productInfo.isFreezeCard ? 'center' : 'calc(50% + 50px) center',
                                backgroundRepeat: 'no-repeat'
                              } : {}}
                            >
                              <div className="mk-market-ticket-content">
                                {(!productInfo.useBackground || productInfo.isFreezeCard) && (
                                  <div className="mk-market-ticket-icon">
                                    <img src={productInfo.icon} alt={productInfo.name} style={{ opacity: isAvailable ? 1 : 0.5 }} />
                                  </div>
                                )}
                                <div className="mk-market-ticket-info">
                                  <div className="mk-market-ticket-text">
                                    <div className="mk-market-ticket-amount" style={{ opacity: isAvailable ? 1 : 0.5 }}>{productInfo.displayAmount}</div>
                                    {productInfo.isFreezeCard && (
                                      <div className="mk-market-ticket-label" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                        {productInfo.freezeDays} {productInfo.freezeDays === '1' ? 'DAY' : 'DAYS'}
                                      </div>
                                    )}
                                    {!productInfo.isFreezeCard && (
                                      <div className="mk-market-ticket-bonus" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                        <span>Stock:</span>&nbsp;<span>{product.stock}</span>
                                      </div>
                                    )}
                                    {!productInfo.isFreezeCard && (
                                      <div className="mk-market-ticket-bonus" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                        <span>Limit:</span>&nbsp;<span>{product.limitNum}</span>
                                      </div>
                                    )}
                                    {!productInfo.isFreezeCard && (
                                      <div className="mk-market-ticket-bonus" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                        <span>Purchased:</span>&nbsp;<span>{product.purchasedQuantity}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="mk-market-ticket-price" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                {productInfo.isFreezeCard ? (
                                  <>
                                    <span>{product.starlet.toLocaleString()}</span>
                                    <img src={productInfo.priceIcon} alt="Starlet" className={productInfo.priceIconClass} />
                                  </>
                                ) : (
                                  isAvailable ? `${product.starlet} STARLETS` : disabledReason
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      
                      {/* Show message if no products available */}
                      {starletProducts.filter(product => product.prop !== 10110).length === 0 && (
                        <div className="mk-starlet-packages-placeholder">
                          <div className="mk-placeholder-content">
                            <div className="mk-placeholder-text">MERCH COUPON</div>
                            <div className="mk-placeholder-subtext">No products available</div>
                          </div>
                        </div>
                      )}
                        </div>
                      </div>
                    </div>

                    {/* Step Boosts Section */}
                    <div className="mk-market-section">
                      <div 
                        className="mk-section-header"
                        onClick={() => setStepBoostsExpanded(!stepBoostsExpanded)}
                      >
                        <div className="mk-corner mk-top-left"></div>
                        <div className="mk-corner mk-top-right"></div>

                        <div 
                          className="mk-section-title-container"
                          style={{ backgroundColor: '#00FF00' }}
                        >
                          <span className="mk-section-title">STEP BOOSTS</span>
                          <img src={arrow_2} className={`mk-section-arrow ${stepBoostsExpanded ? 'expanded' : ''}`} alt="arrow" />
                        </div>
                      </div>
                      <div className={`mk-section-content ${stepBoostsExpanded ? 'expanded' : ''}`}>
                        <div className="mk-corner mk-bottom-left"></div>
                        <div className="mk-corner mk-bottom-right"></div>

                        <div className="mk-starlet-grid">
                          {starletProducts
                            .filter(product => product.prop === 10120 || product.prop === 10121) // Filter for step boost products (prop 20010 = step boosts)
                            .map((product) => {
                              const productInfo = getStarletProductInfo(product);
                              const hasFSLID = !!shared.userProfile?.fslId;
                              const userLevel = shared.userProfile?.level || 0;
                              const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
                              const isConnectedBankSteps = true; // TODO: Change to true when Bank Steps is connected  
                              
                              // // Check conditions for Step Boosts
                              let isDisabled = false;
                              let disabledReason = '';
                              
                              // *. FSL ID not connected
                              if (!hasFSLID) {
                                isDisabled = true;
                                disabledReason = 'FSL ID NOT CONNECTED';
                              }
                              // 1. Level requirement (Level 10 for Step Boosts)
                              else if (userLevel < 10) {
                                isDisabled = true;
                                disabledReason = 'LEVEL 10 REQUIRED';
                              }
                              // 2. Bank Steps Not Connected
                              else if (!isConnectedBankSteps) {
                                isDisabled = true;
                                disabledReason = 'BANK STEPS NOT CONNECTED';
                              }
                              // 3. Not enough starlets
                              else if (userStarlets < product.starlet) {
                                isDisabled = true;
                                disabledReason = product.starlet.toLocaleString() + ' STARLETS';
                              }
                              
                              const isAvailable = !isDisabled;
                              
                              return (
                                <button 
                                  key={product.id}
                                  className={`mk-market-ticket-button mk-step-boost-product ${!isAvailable ? 'sold-out' : ''}`}
                                  onClick={() => isAvailable && handleStepBoostsClick({name: productInfo.name, starlet: product.starlet, productId: product.id})}
                                  disabled={!isAvailable}
                                >
                                  <div 
                                    className="mk-market-ticket-button-image-container"
                                    style={productInfo.useBackground ? {
                                      backgroundImage: `url(${productInfo.backgroundImage})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      backgroundRepeat: 'no-repeat'
                                    } : {}}
                                  >
                                    <div className="mk-market-ticket-content">
                                      {(!productInfo.useBackground) && (
                                        <div className="mk-market-ticket-icon">
                                          <img src={productInfo.icon} alt={productInfo.name} style={{ opacity: isAvailable ? 1 : 0.5 }} />
                                        </div>
                                      )}
                                      <div className="mk-market-ticket-info">
                                        <div className="mk-market-ticket-text">
                                          <div 
                                            className="mk-market-ticket-amount" 
                                            style={{ 
                                              opacity: isAvailable ? 1 : 0.5,
                                              color: productInfo.displayAmount === 'X1.5' ? '#00FF00' : '#FF0080'
                                            }}
                                          >
                                            {productInfo.displayAmount}
                                          </div>
                                          <div className="mk-market-ticket-label" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                            {productInfo.description}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mk-market-ticket-price" style={{ opacity: isAvailable ? 1 : 0.5 }}>
                                      {isAvailable ? (
                                        <>
                                          <span>{product.starlet.toLocaleString()}</span>
                                          <img src={productInfo.priceIcon} alt="Starlet" className={productInfo.priceIconClass} />
                                        </>
                                      ) : (
                                        disabledReason
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          
                          {/* Show message if no step boost products available */}
                          {starletProducts.filter(product => product.prop === 10120 || product.prop === 10121).length === 0 && (
                            <div className="mk-starlet-packages-placeholder">
                              <div className="mk-placeholder-content">
                                <div className="mk-placeholder-text">STEP BOOSTS</div>
                                <div className="mk-placeholder-subtext">No products available</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
        isFreeItem={selectedPurchase?.isFreeItem}
        onConfirm={handleConfirmPurchase}
        setShowProfileView={setShowProfileView}
        setShowBuyView={setShowBuyView}
        onPurchaseComplete={() => setIsStarletPurchaseComplete(true)}
        onFreeItemComplete={() => {
          checkFreeRewardTime();
          refreshUserProfile();
        }}
      />
      
      {/* Freeze Streak Popup */}
      <FreezeStreakPopup
        isOpen={showFreezeStreakPopup}
        onClose={() => setShowFreezeStreakPopup(false)}
        selectedPackage={selectedFreezeStreakPackage}
        onPurchase={handleFreezeStreakPurchase}
        refreshStarletProduct={refreshStarletProduct}
        refreshUserProfile={refreshUserProfile}
      />

      {/* Step Boosts Popup */}
      <StepBoostsPopup
        isOpen={showStepBoostsPopup}
        onClose={() => setShowStepBoostsPopup(false)}
        selectedPackage={selectedStepBoost}
        onPurchase={handleStepBoostsPurchase}
        refreshStarletProduct={refreshMarketContent}
      />

    </>
  );
};

export default Market; 