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

import { init, initData, miniApp, viewport, swipeBehavior, closingBehavior, retrieveLaunchParams, popup } from '@telegram-apps/sdk';

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

  const getProfileData = async (loginDataParam) => {
    const dataToUse = loginDataParam || loginData;
    const profileResult = await shared.getProfileData(dataToUse);
    
    if (profileResult.success) {
        setUserProfile(profileResult.userProfile);
        setProfileItems(profileResult.profileItems);
        return [profileResult.userProfile, profileResult.profileItems];
    } else {
        if (profileResult.needRelogin) {
            const loginResult = await shared.login(initDataRaw);
            if (loginResult.success) {
                setLoginData(loginResult.loginData);
                setIsLoggedIn(true);
                return await getProfileData(loginResult.loginData);
            } else {
                console.log('User is not logged in');
                setIsLoggedIn(false);
            }
        } else {
            if (popup.open.isAvailable()) {
                const promise = popup.open({
                    title: 'Error Getting Profile Data',
                    message: `Error: ${profileResult.error}`,
                    buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                await promise;
            }
        }
        return [null, []];
    }
};

const bind_fslid = async () => {
  /*
  url: /app/fslBinding
Request:
	code string  //The token that calls the fslId callback
	//For example
	//https://gm3.joysteps.io/login/authorization?response_type=code&appkey=MiniGame&scope=basic&state=&use_popup=true
Response:
{
    "code": 0
}
  */
  const apiLink = `${shared.server_url}/api/app/fslBinding?token=${shared.loginData.token}&code=${shared.fsl_binding_code}`;
  console.log('Calling FSL Binding API:', apiLink);
  const response = await fetch(apiLink);
  const data = await response.json();
  console.log('FSL Binding finished:', data);
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

                await getProfileData(loginResult.loginData);

                if (popup.open.isAvailable()) {
                    // const promise = popup.open({
                    //     title: 'Success',
                    //     message: "Login Success",
                    //     buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                    // });
                    // const buttonId = await promise;
                    
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
        // setIsLoggedIn(false);
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
    // console.log("initDataRaw: ", initDataRaw);

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
    console.log('startParam:', startParam); // Will output: "invite_21201"

    // get invite code from the start param
    // sample param: "invite_21201__referral_1234__otherParam_5678"
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
    closingBehavior.mount();
    closingBehavior.enableConfirmation();
    swipeBehavior.mount();        
    swipeBehavior.disableVertical();

    // Get user data
    initData.restore();
    const userData = initData.user();
    console.log('User:', userData);
    shared.user = userData;
    setUser(userData);

    console.log("initDataRaw: ", initDataRaw);
    login();
    
  }, []);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/version.txt`)
      .then(response => response.text())
      .then(version => setBuildVersion(version))
      .catch(error => console.error('Error loading version:', error));
  }, []);

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
        // return <FSLIDTest />;
        return <FSLID />;
      case 'frens':
        return <Frens />;
      // case 'market':
        // return <ScratchTest />;
      // case 'checkin':
      //   return <CheckIn onClose={() => setActiveTab('home')}/>;
      default:
        return <MainView 
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
          setShowTicketView={setShowTicketView}
          getProfileData={getProfileData}
        />;
    }
  };

  const versionStyle = {
    position: 'fixed',
    bottom: '6px',
    right: '20px',
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

              <button onClick={() => setActiveTab('market')} className={activeTab === 'market' ? 'active' : ''} disabled='true'>
                {/* <img src={activeTab === 'market' ? Market_selected : Market_normal} alt="Market" /> */}
                {/* <img src={lock_icon} alt="Market" className="lock-icon-market" /> */}
                <img src={market_locked} alt="Market" />
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
        <CheckIn checkInData={checkInData} onClose={() => {
          setShowCheckInView(false);
          setActiveTab('home');
        }}/>
      )
      : showProfileView ?
      (
        <Profile onClose={() => {
            setShowProfileView(false);
            setActiveTab('home');
          }}
          getProfileData={getProfileData}/>
      )
      : showTicketView ?
      (
        <Ticket onClose={() => {
            setShowTicketView(false);
            setActiveTab('home');
          }} 
          getProfileData={getProfileData}
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

            <button onClick={() => setActiveTab('market')} className={activeTab === 'market' ? 'active' : ''} disabled='true'>
              {/* <img src={activeTab === 'market' ? Market_selected : Market_normal} alt="Market" /> */}
              {/* <img src={lock_icon} alt="Market" className="lock-icon-market" /> */}
              <img src={market_locked} alt="Market" />
            </button>
            {/* <button onClick={() => setShowProfileView(true)} className={activeTab === 'fslid' ? 'active' : ''}>
              <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
            </button> */}
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
