import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import './Share.css';
import liff from '@line/liff';
import LIFFInspectorPlugin from '@line/liff-inspector';
// import liff from './mock/liff';

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
import { 
  trackSectionView, 
  trackNavigation, 
  trackOverlayView,
  trackOverlayExit,
  trackUserAction,
  trackSessionStart,
  trackDeviceInfo,
  trackLineConversion
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

import loading_background from "./images/GamesHubLoading.png";
// import loading_background_valentine from "./images/GH Valentines Day Post 450-02.png";
// import loading_background_patrick_daysfrom "./images/PatrickDay-AllBrands600-16-9.png";

import { analytics } from './Firebase';
import Market from './Market';
import { lineShare } from './services/lineShare';

function App() {
  const [initDataRaw, setInitDataRaw] = useState(null);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [profileItems, setProfileItems] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckInAnimation, setShowCheckInAnimation] = useState(false);
  const [showCheckInView, setShowCheckInView] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [showTicketView, setShowTicketView] = useState(false);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [buildVersion, setBuildVersion] = useState('');
  const [showBankStepsView, setShowBankStepsView] = useState(false);
  const [previousTab, setPreviousTab] = useState(null);

  // Add a ref to track initialization
  const initRef = useRef(false);

  const checkIn = async (loginData) => {
    const now = new Date();
    console.log(`Checking in ........: ${now.toLocaleString()}`);
    
    const checkInResult = await shared.checkIn(loginData);
    
    if (checkInResult.success) {
        setCheckInData(checkInResult.data);
        
        if (checkInResult.isCheckIn) {
            console.log('Redirect to checkIn screen');
            return 1;
        }
        return 0;
    } else {
        if (checkInResult.needRelogin) {
            const loginResult = await shared.login(initDataRaw);
            if (loginResult.success) {
                setLoginData(loginResult.loginData);
                setIsLoggedIn(true);
                return await checkIn(loginResult.loginData);
            }
        }
        
        window.alert(`Error Checking-in: ${checkInResult.error}`);
        return 2;
    }
  };

  const getProfileData = async (loginDataParam) => {
    const dataToUse = loginDataParam || loginData;
    shared.loginData = dataToUse;
    const profileResult = await shared.getProfileWithRetry();
    
    if (profileResult.success) {
        setUserProfile(profileResult.userProfile);
        setProfileItems(profileResult.profileItems);
        return [profileResult.userProfile, profileResult.profileItems];
    } else {
        window.alert(`Error Getting Profile Data: ${profileResult.error}`);
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
        return true;
      } else {
        let errorMessage = data.msg || 'Failed to bind FSL ID. Please try again later.';
        window.alert(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error binding FSL ID:', error);
      window.alert('Failed to bind FSL ID. Please try again later.');
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

                const result = await checkIn(loginResult.loginData);
                    if(result == 1) {
                        setShowCheckInAnimation(true);
                }
            } else {
                console.log('User is not logged in');
                setIsLoggedIn(false);

                window.alert(`Error: ${loginResult.error}`);
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
    } finally {
        setIsLoading(false);
        initRef.current = false;
    }
};


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
    ];

    preloadImages(imageUrls)
      .then(() => {
        setResourcesLoaded(true);
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        setResourcesLoaded(true);
      });
  }, []);

  useEffect(() => {
    console.log('App useEffect called');
    shared.setActiveTab = setActiveTab;

    const initializeLine = async () => {
      try {
        // // Add LIFF Inspector plugin
        // liff.use(new LIFFInspectorPlugin({
        //   origin: 'wss://f39acd71cac5.ngrok-free.app'
        // }));

        await liff.init({ 
          liffId: '2007739334-1y40PGGg',
          withLoginOnExternalBrowser: true
        });

        trackLineConversion("liff_init");
        
        // Check if user is logged in
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        console.log('Line User:', profile);
        shared.telegramUserData = profile;
        setUser(profile);
        
        var dataRaw = await liff.getIDToken();
        setInitDataRaw(dataRaw);
                
        // Get URL parameters for Line
        const urlParams = new URLSearchParams(window.location.search);
        const startParam = urlParams.get('startParam');
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

        // Track initial device info even before login
        trackDeviceInfo();
      } catch (err) {
        console.error('LIFF initialization failed', err);
        window.alert(`Error: ${err.message}`);
      }
    };

    initializeLine();
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
      trackNavigation(previousTab, activeTab, shared.loginData?.link);
    }
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

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <MainView 
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
          setShowTicketView={setShowTicketView}
          setShowBankStepsView={setShowBankStepsView}
          getProfileData={getProfileData}
        />;      
      case 'tasks':
        return <Tasks 
            checkInData={checkInData}
            setShowCheckInAnimation={setShowCheckInAnimation}
            checkIn={checkIn}
            setShowCheckInView={setShowCheckInView}
            setShowProfileView={setShowProfileView}
            getProfileData={getProfileData}
        />;
      case 'fslid':
        return <FSLID />;
      case 'frens':
        return <Frens />;
      case 'market':
        return <Market 
          showFSLIDScreen={() => setActiveTab('fslid')} 
          setShowProfileView={setShowProfileView}
        />;
      default:
        return <MainView 
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
          setShowTicketView={setShowTicketView}
          setShowBankStepsView={setShowBankStepsView}
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

  useEffect(() => {
    if (initDataRaw) {
      console.log('InitDataRaw updated:', initDataRaw);
      login();
    }
  }, [initDataRaw]);

  return (
    <div className="App">
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      {(isLoading || !resourcesLoaded) ? (
        <>
          <img src={loading_background} alt="Loading" className="loading-background" />
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

              <button onClick={() => setActiveTab('market')} className={activeTab === 'market' ? 'active' : ''}>
                <img src={activeTab === 'market' ? Market_selected : Market_normal} alt="Market" />
              </button>
              <button onClick={() => setActiveTab('fslid')} className={activeTab === 'fslid' ? 'active' : ''}>
                <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
              </button>
            </nav>
          </div>

          <button className="checkin-animation-button" onClick={() => {
            setShowCheckInAnimation(false);
            setShowCheckInView(true);
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

            <button onClick={() => setActiveTab('market')} className={activeTab === 'market' ? 'active' : ''}>
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

