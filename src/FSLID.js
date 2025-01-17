import React from 'react';
import shared from './Shared';
import './FSLID.css';
import FSLAuthorization from 'fsl-authorization';
// import fsl_logo from './images/fsl_logo.png';
import fsl_logo from './images/FSLID_Masterlogo_logo_version1_color_white_nobg.png';
import fsl_point from './images/fsl_point.png';
import starletIcon from './images/starlet.png';
import gmtIcon from './images/GMT_1.png';
import ID_selected from './images/ID_selected.svg';

const FSLID = () => {
    const connectFSLID = () => {
        console.log('Connect FSL ID clicked');

        const fetchKey = async () => {
            const randKeyApi = shared.server_url + `/api/app/randKey?token=${shared.loginData.token}`;
            console.log('RandKey API:', randKeyApi);

            fetch(randKeyApi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json()).then(async data => {
                console.log('RandKey Response:', data);

                if (data.code === 102001 || data.code === 102002) {
                    console.log('Token expired, re-login');
                    const loginResult = await shared.login(shared.initData);
                    if (loginResult.success) {
                        console.log('Login success, fetch key again');
                        fetchKey();
                    }
                    return;
                }
                
                const state = data.data;
                const REDIRECT_URL = shared.server_url + '/api/app/fslCallback';
    
                console.log('State:', state, '\nRedirect URL:', REDIRECT_URL);
    
                const fslAuthorization = FSLAuthorization.init({
                    responseType: 'code', // 'code' or 'token'
                    appKey: 'MiniGame',
                    redirectUri: REDIRECT_URL, // https://xxx.xxx.com
                    scope: 'basic,wallet,stepn', // Grant Scope
                    state: state,
                    usePopup: true, // Popup a window instead of jump to
                    isApp: true,
                    domain: 'https://gm3.joysteps.io/'
                });
    
                fslAuthorization.signInV2();
            });
        };

        fetchKey();
    };

    return (
        <div className="fsl-id-container">
            {shared.userProfile.fslId !== 0 ? (
                <div className="fsl-id-connected">
                    <div className="fsl-id-header">
                        <div className="fsl-id-user">
                            <div className="fsl-id-avatar">
                                <img src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} alt="avatar" />
                            </div>
                            <div className="fsl-id-name">
                                <div className="name-with-level">
                                    {shared.user.firstName}
                                    <span className="level-tag">Lv.{shared.userProfile.level || 0}</span>
                                </div>
                                <div className="fsl-id-hash">
                                    <img src={ID_selected} className="fsl-id-icon-1" alt="fsl" />
                                    {shared.userProfile.email}
                                </div>
                            </div>
                        </div>
                        <div className="fsl-id-emails">
                            <div className="fsl-id-email">
                                <img src={ID_selected} className="fsl-id-icon" alt="fsl" />
                                <div className="fsl-id-email-content">
                                    <div className="email-text">{shared.userProfile.email}</div>
                                    <div className="wallet-text">{shared.userProfile.evmAddr}</div>
                                </div>
                            </div>
                            <div className="email-separator"></div>
                            <div className="fsl-id-email">
                                <img src={ID_selected} className="fsl-id-icon" alt="fsl" />
                                <div className="fsl-id-email-content">
                                    <div className="email-text">{shared.userProfile.email}</div>
                                    <div className="wallet-text">{shared.userProfile.solAddr}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fsl-id-stats">
                        <div className="fsl-id-stat">
                            <img src={starletIcon} className="fsl-stat-icon" alt="starlet" />
                            <span className="fsl-stat-label">Starlets</span>
                            <span className="stat-value">{shared.getStarlets()}</span>
                        </div>
                        <div className="fsl-id-stat">
                            <img src={fsl_point} className="fsl-stat-icon" alt="fsl" />
                            <span className="fsl-stat-label">FSL Point</span>
                            <span className="stat-value">{shared.userProfile.flsPoint}</span>
                        </div>
                        <div className="fsl-id-stat">
                            <img src={gmtIcon} className="fsl-stat-icon" alt="gmt" />
                            <span className="fsl-stat-label">GMT</span>
                            <span className="stat-value">0</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="fsl-id-signup">
                    <img src={fsl_logo} className="fsl-id-logo" alt="fsl"></img>
                    {/* <div className="fsl-id-logo-circle"> */}
                        {/* <span className="fsl-id-logo-text">FSL ID</span> */}
                    {/* </div> */}
                    <div className="fsl-id-message">
                        <p className='fsl-id-note-title'>Create a New FSL Account?</p>
                        <p className='fsl-id-note-1'>THIS EMAIL IS NOT YET REGISTERED. WOULD YOU LIKE TO CREATE A NEW FSL ACCOUNT?</p>
                        <p className="fsl-id-note">PLEASE NOTE: IF YOU HAVE A DAS HERO OR MOOAR FSL ACCOUNT, YOU CAN LOG IN USING THOSE CREDENTIALS.</p>
                    </div>
                    <div className="fsl-id-buttons">
                        <button 
                            className="fsl-id-signup-button"
                            onClick={connectFSLID}
                        >
                            SIGN UP
                        </button>
                        <button 
                            className="fsl-id-connect-button"
                            onClick={connectFSLID}
                        >
                            CONNECT FSL ID
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FSLID;