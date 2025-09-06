import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import './Share.css';

import MainView from './MainView';
import Tasks from './Tasks';
import CheckIn from './CheckIn';
import Profile from './Profile';
import FSLIDTest from './FSLIDTest';
import FSLID from './FSLID';
import Frens from './Frens';
import ScratchTest from './ScratchTest';
import Ticket from './Ticket';
import BankSteps from './BankSteps';
import FreezeStreakStatusPopup from './FreezeStreakStatusPopup';
import { 
  trackSectionView, 
  trackNavigation, 
  trackOverlayView,
  trackOverlayExit,
  trackUserAction,
  trackSessionStart,
  trackDeviceInfo
} from './analytics';

import HomeIcon_selected from './images/Home_selected.svg';
import HomeIcon_normal from './images/Home_normal.svg';

import Task_normal from './images/Task_normal.svg';
import Task_selected from './images/Task_selected.svg';

import Friends_normal from './images/Friends_normal.svg';
import Friends_selected from './images/Friends_selected.svg';

import Market_normal from './images/Market_normal.svg';
import Market_selected from './images/Market_selected.svg';
import market_locked from './images/market_locked.png';

import ID_normal from './images/ID_normal.svg';
import ID_selected from './images/ID_selected.svg';

// import background from './images/background.svg';
// import background from './images/background.png';
import background from './images/background_2.png';
import checkInAnimation from './images/check_in_animation_540.gif';

import shared from './Shared';
import lock_icon from "./images/lock_trophy.png";
import freezeBG from './images/FreezeStreaksBG.png';
import freezeText from './images/FreezeStreaksText.png';

import loading_background from "./images/GamesHubLoading.png";
// import loading_background_valentine from "./images/GH Valentines Day Post 450-02.png";
// import loading_background_patrick_daysfrom "./images/PatrickDay-AllBrands600-16-9.png";

import { init, initData, miniApp, viewport, swipeBehavior, closingBehavior, retrieveLaunchParams, popup } from '@telegram-apps/sdk';
import { analytics } from './Firebase';
import Market from './Market';
import FlippingStars from './FlippingStars';


function App() {
  const { initDataRaw } = retrieveLaunchParams();
  

  // const hash = window.location.hash.slice(1);
  // const hash = window.location.hash;
  // const params = new URLSearchParams(hash);
  // const tgWebAppStartParam = params.get('tgWebAppStartParam');
  // console.log('tgWebAppStartParam:', tgWebAppStartParam); // "6.2"

  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [profileItems, setProfileItems] = useState([]);
  // const swipeBehavior = useSwipeBehavior();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckInAnimation, setShowCheckInAnimation] = useState(false);
  const [showCheckInView, setShowCheckInView] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [showTicketView, setShowTicketView] = useState(false);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [buildVersion, setBuildVersion] = useState('');
  const [showBankStepsView, setShowBankStepsView] = useState(false);
  const [showFlippingStarsView, setShowFlippingStarsView] = useState(false);
  const [previousTab, setPreviousTab] = useState(null);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);
  
  // Freeze streak status popup states
  const [showFreezeStreakStatus, setShowFreezeStreakStatus] = useState(false);
  const [freezeStreakData, setFreezeStreakData] = useState({
    missDay: 0,
    remainingFreezeStreaks: 0,
    useStreakFreeze: false
  });

  // Add a ref to track initialization
  const initRef = useRef(false);

  // Add focus/unfocus tracking
  const unfocusTimeRef = useRef(null);
  const FOCUS_TIMEOUT = 60000; // 60 seconds

  const checkIn = async (loginData) => {
    const now = new Date();
    console.log(`Checking in ........: ${now.toLocaleString()}`);
    
    const checkInResult = await shared.checkIn(loginData);
    console.log('CheckIn result:', checkInResult);
    
    if (checkInResult.success) {
        setCheckInData(checkInResult.data);
        console.log('CheckIn data set:', checkInResult.data);
        
        // Check if freeze streak was used OR streak is broken - but still show animation first
        if (checkInResult.data.missDay > 0) {
            console.log('Missed days detected, will show status popup after animation');
            // Ensure profile is loaded before getting freeze streaks
            if (!shared.userProfile) {
                console.log('Profile not loaded, getting profile data first');
                await getProfileData();
            }
            // Store freeze streak data for later use
            const remainingFreezeStreaks = await getRemainingFreezeStreaks();
            setFreezeStreakData({
                missDay: checkInResult.data.missDay,
                remainingFreezeStreaks: remainingFreezeStreaks,
                useStreakFreeze: checkInResult.data.useStreakFreeze
            });
            // Still return 1 to show animation, popup will be shown after animation
            return 1;
        }
        
        if (checkInResult.isCheckIn) {
            console.log('Redirect to checkIn screen');
            return 1;
        }
        return 0;
    } else {
        if (popup.open.isAvailable()) {
            const promise = popup.open({
                title: 'Error Checking-in',
                message: `Error: ${checkInResult.error}`,
                buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
            });
            await promise;
        }
        return 2;
    }
};

  // Function to get remaining freeze streaks from user profile
  const getRemainingFreezeStreaks = async () => {
    try {
      console.log('getRemainingFreezeStreaks - shared.userProfile:', shared.userProfile);
      
      // Check if streakFreeze is directly in userProfile
      if (shared.userProfile && shared.userProfile.streakFreeze !== undefined) {
        console.log('Found streakFreeze:', shared.userProfile.streakFreeze);
        return shared.userProfile.streakFreeze;
      }
      
      // Check if it's in UserToken array (like other tokens)
      if (shared.userProfile && shared.userProfile.UserToken) {
        console.log('Checking UserToken array:', shared.userProfile.UserToken);
        const freezeStreakToken = shared.userProfile.UserToken.find(token => 
          token.prop_id === 10110 || token.prop_id === '10110'
        );
        if (freezeStreakToken) {
          console.log('Found freeze streak in UserToken:', freezeStreakToken);
          return freezeStreakToken.num || freezeStreakToken.ableNum || 0;
        }
      }
      
      console.log('streakFreeze not found, returning 0');
      return 0; // Default fallback
    } catch (error) {
      console.error('Error getting remaining freeze streaks:', error);
      return 0;
    }
  };

  const getProfileData = async (loginDataParam) => {
    const dataToUse = loginDataParam || loginData;
    shared.loginData = dataToUse; // Ensure shared.loginData is set for getProfileWithRetry
    const profileResult = await shared.getProfileWithRetry();
    
    if (profileResult.success) {
        setUserProfile(profileResult.userProfile);
        setProfileItems(profileResult.profileItems);
        return [profileResult.userProfile, profileResult.profileItems];
    } else {
        if (popup.open.isAvailable()) {
            const promise = popup.open({
                title: 'Error Getting Profile Data',
                message: `Error: ${profileResult.error}`,
                buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
            });
            await promise;
        }
        return [null, []];
    }
};

const bind_fslid = async () => {
  const apiLink = `${shared.server_url}/api/app/fslBinding?token=${shared.loginData.token}&code=${shared.fsl_binding_code}`;
  console.log('Calling FSL Binding API:', apiLink);
  try {
    const response = await fetch(apiLink);
    const data = await response.json();
    console.log('FSL Binding finished:', data);
    
    if (data.code === 0) {
      // Success case
      return true;
    } else {
      // Handle different error cases
      let errorMessage = data.msg || 'Failed to bind FSL ID. Please try again later.';
      
      // Show error popup but don't block the app
      shared.showPopup({
        type: 0,
        message: errorMessage
      }).catch(err => console.error('Error showing popup:', err));
      
      return false;
    }
  } catch (error) {
    console.error('Error binding FSL ID:', error);
    // Show error popup but don't block the app
    shared.showPopup({
      type: 0,
      message: 'Failed to bind FSL ID. Please try again later.'
    }).catch(err => console.error('Error showing popup:', err));
    
    return false;
  }
}

  const login = async () => {
    try {
        setIsLoading(true);
        initRef.current = true;

        console.log('Initializing app...');            

        if (initDataRaw) {
            const loginResult = await shared.login(initDataRaw);
            
            if (loginResult.success) {
                if (shared.fsl_binding_code) {
                  await bind_fslid();
                }

                setLoginData(loginResult.loginData);
                setIsLoggedIn(true);

                // Track session start and device info when user logs in
                trackSessionStart(loginResult.loginData?.link);

                await getProfileData(loginResult.loginData);

                if (popup.open.isAvailable()) {
                    const result = await checkIn(loginResult.loginData);
                    if(result == 1) {
                        setShowCheckInAnimation(true);
                    }
                }
            } else {
                console.log('User is not logged in');
                setIsLoggedIn(false);

                if (popup.open.isAvailable()) {
                    const promise = popup.open({
                        title: 'Error',
                        message: loginResult.error,
                        buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                    });
                    const buttonId = await promise;
                }
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
    } finally {
        setIsLoading(false);
        initRef.current = false;
    }
};

  // Function to reload app data
  const reloadAppData = async () => {
    console.log('Reloading app data after long unfocus...');
    console.log('Current shared.loginData:', shared.loginData);
    
    try {
      if (shared.loginData) {
        console.log('Starting getProfileWithRetry...');
        // Use getProfileWithRetry which already has retry logic built-in
        const profileResult = await shared.getProfileWithRetry();
        console.log('getProfileWithRetry result:', profileResult);
        
        if (profileResult.success) {
          // Force a re-render by updating state with the same values
          setUserProfile({...profileResult.userProfile}); // Create new object to trigger re-render
          console.log('UserProfile force updated:', profileResult.userProfile);
          
          // Update shared.userProfile to ensure all components get the new data
          shared.userProfile = profileResult.userProfile;
          console.log('Shared userProfile updated');
          
          if (profileResult.profileItems) {
            setProfileItems([...profileResult.profileItems]); // Create new array to trigger re-render
            console.log('ProfileItems force updated:', profileResult.profileItems);
          }
          
          // Trigger re-render of child components
          setDataRefreshTrigger(prev => prev + 1);
          
          console.log('App data reloaded successfully');
        } else {
          console.error('Failed to reload app data:', profileResult.error);
          // If retry login failed, we might need to show an error or redirect to login
          if (popup.open.isAvailable()) {
            const promise = popup.open({
              title: 'Error Reloading Data',
              message: `Failed to reload data: ${profileResult.error}. Please refresh the app.`,
              buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
            });
            await promise;
          }
        }
      } else {
        console.log('No shared.loginData available for reload');
      }
    } catch (error) {
      console.error('Error reloading app data:', error);
      // Show error popup for unexpected errors
      if (popup.open.isAvailable()) {
        const promise = popup.open({
          title: 'Error',
          message: 'An unexpected error occurred while reloading data. Please refresh the app.',
          buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
        });
        await promise;
      }
    }
  };

  // Focus/Unfocus detection
  useEffect(() => {
    const handleFocus = () => {
      // console.log('App focused');
      
      // Check if app was unfocused for more than 60 seconds
      if (unfocusTimeRef.current) {
        const unfocusDuration = Date.now() - unfocusTimeRef.current;
        // console.log(`App was unfocused for ${unfocusDuration}ms`);
        
        if (unfocusDuration > FOCUS_TIMEOUT) {
          console.log('App was unfocused for more than 60s, reloading data...');
          reloadAppData();
        }
        
        unfocusTimeRef.current = null;
      }
    };

    const handleUnfocus = () => {
      // console.log('App unfocused');
      // console.log('loginData at unfocus:', loginData);
      // console.log('shared.loginData at unfocus:', shared.loginData);
      unfocusTimeRef.current = Date.now();
    };

    // Kiểm tra Telegram WebView environment
    if (window.TelegramWebviewProxy) {
      console.log('TelegramWebviewProxy available, but no focus events - using visibility API');
    }

    // Sử dụng Document Visibility API (hoạt động tốt nhất cho WebView)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleUnfocus();
      } else {
        handleFocus();
      }
    });

    // Backup: Window Focus Events
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleUnfocus);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleFocus);
      document.removeEventListener('visibilitychange', handleUnfocus);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleUnfocus);
    };
  }, [loginData]); // Re-run when loginData changes

  const preloadImages = (imageUrls) => {
    const promises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    const imageUrls = [
      HomeIcon_selected,
      HomeIcon_normal,
      Task_normal,
      Task_selected,
      Friends_normal,
      Friends_selected,
      Market_normal,
      Market_selected,
      market_locked,
      ID_normal,
      ID_selected,
      background,
      checkInAnimation,
      lock_icon,
      freezeBG,
      freezeText,
      // Add any other images you need to preload
    ];

    preloadImages(imageUrls)
      .then(() => {
        setResourcesLoaded(true);
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        setResourcesLoaded(true); // Proceed even if some images fail to load
      });
  }, []);

  useEffect(() => {
    console.log('App useEffect called');
    shared.initData = initDataRaw;
    shared.setActiveTab = setActiveTab;

    // Get the hash without the # symbol
    const hash = window.location.hash.substring(1);

    // Create URLSearchParams object from the hash
    const params = new URLSearchParams(hash);

    // Get tgWebAppData parameter and decode it
    const tgWebAppData = params.get('tgWebAppData');
    const decodedData = decodeURIComponent(tgWebAppData);

    // Create URLSearchParams object from the decoded data
    const webAppParams = new URLSearchParams(decodedData);

    // Get start_param
    const startParam = webAppParams.get('start_param');
    console.log('hash:', hash);
    console.log('startParam:', startParam);

    // get invite code from the start param
    if (startParam) {
        const paramsArray = startParam.split('__');
        for (const param of paramsArray) {
            if (param.startsWith('invite_')) {
              shared.inviteCode = param.split('_')[1];
              console.log('Invite Code:', shared.inviteCode);
            }
            else if(param.startsWith('fslid_')) {
              shared.fsl_binding_code = param.split('_')[1];
              console.log('FSL Binding Code:', shared.fsl_binding_code);
            }
        }
    }

    // Initialize Telegram Mini App
    init();
    miniApp.ready();
    miniApp.mount();
    viewport.expand();

    // Setup behaviors
    // closingBehavior.mount();
    // closingBehavior.enableConfirmation();

    swipeBehavior.mount();        
    swipeBehavior.disableVertical();

    // Get user data
    initData.restore();
    const userData = initData.user();
    console.log('User:', userData);
    shared.telegramUserData = userData;
    setUser(userData);

    // Track initial device info even before login
    trackDeviceInfo();

    console.log("initDataRaw: ", initDataRaw);
    login();
    
  }, []);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/version.txt`)
      .then(response => response.text())
      .then(version => setBuildVersion(version))
      .catch(error => console.error('Error loading version:', error));
  }, []);

  // Track tab changes
  useEffect(() => {
    if (previousTab) {
      // Track navigation flow
      trackNavigation(previousTab, activeTab, shared.loginData?.link);
    }
    // Track entry to new section
    trackSectionView(activeTab, shared.loginData?.link);
    setPreviousTab(activeTab);
  }, [activeTab]);

  // Track overlay views
  useEffect(() => {
    if (showCheckInView) {
      trackOverlayView('checkin', shared.loginData?.link);
    }
    if (showProfileView) {
      trackOverlayView('profile', shared.loginData?.link);
    }
    if (showTicketView) {
      trackOverlayView('ticket', shared.loginData?.link);
    }
    if (showBankStepsView) {
      trackOverlayView('banksteps', shared.loginData?.link);
    }
  }, [showCheckInView, showProfileView, showTicketView, showBankStepsView]);

  // Track overlay exits
  const handleOverlayClose = (overlayName) => {
    trackOverlayExit(overlayName, shared.loginData?.link, activeTab);
  };

  // Modified overlay close handlers
  const handleCheckInClose = () => {
    handleOverlayClose('checkin');
    setShowCheckInView(false);
    setActiveTab('home');
  };

  const handleProfileClose = () => {
    handleOverlayClose('profile');
    setShowProfileView(false);
    setActiveTab('home');
  };

  const handleTicketClose = () => {
    handleOverlayClose('ticket');
    setShowTicketView(false);
    setActiveTab('home');
  };

  const handleBankStepsClose = () => {
    handleOverlayClose('banksteps');
    setShowBankStepsView(false);
    setActiveTab('home');
  };

  const handleFlippingStarsClose = () => {
    handleOverlayClose('flippingstars');
    setShowFlippingStarsView(false);
    setActiveTab('home');
  };

  // Freeze streak status popup handlers
  const handleFreezeStreakStatusClose = () => {
    console.log('Freeze streak popup closed, showing CheckIn view');
    setShowFreezeStreakStatus(false);
    // TH1: User ấn CLOSE -> show CheckIn.js
    setShowCheckInView(true);
  };

  const handlePurchaseAnotherFreezeStreak = () => {
    console.log('Purchase another freeze streak clicked, navigating to market');
    setShowFreezeStreakStatus(false);
    // TH2: User ấn PURCHASE ANOTHER -> gọi onClickMarketplace
    // Set the initial market tab to 'starlet'
    shared.setInitialMarketTab('starlet');
    // Navigate to market tab
    setActiveTab('market');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <MainView 
          key={`mainview-${dataRefreshTrigger}`}
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
          setShowTicketView={setShowTicketView}
          setShowBankStepsView={setShowBankStepsView}
          setShowFlippingStarsView={setShowFlippingStarsView}
          getProfileData={getProfileData}
        />;      
      case 'tasks':
        return <Tasks 
            key={`tasks-${dataRefreshTrigger}`}
            checkInData={checkInData}
            setShowCheckInAnimation={setShowCheckInAnimation}
            checkIn={checkIn}
            setShowCheckInView={setShowCheckInView}
            setShowProfileView={setShowProfileView}
            getProfileData={getProfileData}
        />;
      case 'fslid':
        return <FSLID key={`fslid-${dataRefreshTrigger}`} />;
      case 'frens':
        return <Frens key={`frens-${dataRefreshTrigger}`} />;
      case 'market':
        return <Market 
          key={`market-${dataRefreshTrigger}`}
          showFSLIDScreen={() => setActiveTab('fslid')} 
          setShowProfileView={setShowProfileView}
          initialTab={shared.initialMarketTab}
        />;
      default:
        return <MainView 
          key={`mainview-default-${dataRefreshTrigger}`}
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
          setShowTicketView={setShowTicketView}
          setShowBankStepsView={setShowBankStepsView}
          setShowFlippingStarsView={setShowFlippingStarsView}
          getProfileData={getProfileData}
        />;
    }
  };

  const versionStyle = {
    position: 'fixed',
    bottom: '2px',
    right: '30px',
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1000
  };

  return (
    <div className="App">
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      {(isLoading || !resourcesLoaded) ? (
        <>
          <img src={loading_background} alt="Loading" className="loading-background" />
          {/* <div className="loading">Loading...</div> */}
        </>
      ) 
      : !isLoggedIn ? (
        <div className="login-error">
          <div>Unable to log in. Please try again.</div>
          <button className="retry-button" onClick={login}>
            Retry
          </button>
        </div>
      ) 
      : showCheckInAnimation ? (
        <div>
          <div className="app-container">
            {renderActiveView()}

            <nav className="bottom-nav">
              <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
                <img src={activeTab === 'home' ? HomeIcon_selected : HomeIcon_normal} alt="Home" />
              </button>
              <button onClick={() => setActiveTab('tasks')} className={activeTab === 'tasks' ? 'active' : ''}>
                <img src={activeTab === 'tasks' ? Task_selected : Task_normal} alt="Tasks" />
              </button>
              <button onClick={() => setActiveTab('frens')} className={activeTab === 'frens' ? 'active' : ''}>
                <img src={activeTab === 'frens' ? Friends_selected : Friends_normal} alt="Friends" />
              </button>

              <button onClick={() => {
                shared.setInitialMarketTab('telegram');
                setActiveTab('market');
              }} className={activeTab === 'market' ? 'active' : ''}>
                <img src={activeTab === 'market' ? Market_selected : Market_normal} alt="Market" />
              </button>
              <button onClick={() => setActiveTab('fslid')} className={activeTab === 'fslid' ? 'active' : ''}>
                <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
              </button>
            </nav>
          </div>

          <button className="checkin-animation-button" onClick={() => {
            console.log('Animation button clicked, checkInData:', checkInData);
            setShowCheckInAnimation(false);
            // Check if there are missed days (either freeze streak used or streak broken)
            if (checkInData && checkInData.missDay > 0) {
              console.log('Missed days detected, showing status popup');
              // Show freeze streak status popup
              setShowFreezeStreakStatus(true);
            } else {
              console.log('No missed days, showing check-in view');
              setShowCheckInView(true);
            }
          }}>
            <div className="checkin-content">
              <img src={checkInAnimation} alt="Check In Animation" className="checkin-animation-img"/>
              <div className="checkin-for-text">
                <div>CHECK IN FOR</div>
                <div className="days">
                  {checkInData.streakDay} <span className="days-text-app">DAYS</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      )
      : showFreezeStreakStatus ?
      (
        <FreezeStreakStatusPopup
          isOpen={showFreezeStreakStatus}
          onClose={handleFreezeStreakStatusClose}
          onPurchaseAnother={handlePurchaseAnotherFreezeStreak}
          missDay={freezeStreakData.missDay}
          remainingFreezeStreaks={freezeStreakData.remainingFreezeStreaks}
          useStreakFreeze={freezeStreakData.useStreakFreeze}
        />
      )
      : showCheckInView ?
      (
        <CheckIn 
          checkInData={checkInData} 
          onClose={handleCheckInClose}
        />
      )
      : showProfileView ?
      (
        <Profile 
          onClose={handleProfileClose}
          getProfileData={getProfileData}
          showFSLIDScreen={() => {
            handleOverlayClose('profile');
            setShowProfileView(false);
            setActiveTab('fslid');
          }}
        />
      )
      : showTicketView ?
      (
        <Ticket 
          onClose={handleTicketClose}
          getProfileData={getProfileData}
        />
      )
      : showBankStepsView ?
      (
        <BankSteps 
          showFSLIDScreen={() => {
            handleOverlayClose('banksteps');
            setShowBankStepsView(false);
            setActiveTab('fslid');
          }} 
          onClose={handleBankStepsClose}
        />
      )
      : showFlippingStarsView ?
      (
        <FlippingStars 
          onClose={handleFlippingStarsClose}
          setShowProfileView={setShowProfileView}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
        />
      )
      :
      (
        <div className="app-container">
          {renderActiveView()}

          <nav className="bottom-nav">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
              <img src={activeTab === 'home' ? HomeIcon_selected : HomeIcon_normal} alt="Home" />
            </button>
            <button onClick={() => setActiveTab('tasks')} className={activeTab === 'tasks' ? 'active' : ''}>
              <img src={activeTab === 'tasks' ? Task_selected : Task_normal} alt="Tasks" />
            </button>
            <button onClick={() => setActiveTab('frens')} className={activeTab === 'frens' ? 'active' : ''}>
              <img src={activeTab === 'frens' ? Friends_selected : Friends_normal} alt="Friends" />
            </button>

            <button onClick={() => {
              shared.setInitialMarketTab('telegram');
              setActiveTab('market');
            }} className={activeTab === 'market' ? 'active' : ''}>
              <img src={activeTab === 'market' ? Market_selected : Market_normal} alt="Market" />
            </button>
            <button onClick={() => setActiveTab('fslid')} className={activeTab === 'fslid' ? 'active' : ''}>
              <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
            </button>
          </nav>
        </div>
      )}

      <div style={versionStyle}>{buildVersion}</div>
    </div>
  );
}

export default App;
