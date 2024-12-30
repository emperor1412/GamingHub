import React from 'react';
import shared from './Shared';
import './FSLID.css';
import FSLAuthorization from 'fsl-authorization';

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
                // return;
                const REDIRECT_URL = shared.server_url + '/api/app/fslCallback';
    
                console.log('State:', state, '\nRedirect URL:', REDIRECT_URL);
    
                const fslAuthorization = FSLAuthorization.init({
                    responseType: 'code', // 'code' or 'token'
                    appKey: 'MiniGame',
                    redirectUri: REDIRECT_URL, // https://xxx.xxx.com
                    scope: 'basic', // Grant Scope
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
                <>
                    <div className="fsl-id">
                        <span>FSL ID: {shared.userProfile.fslId}</span>
                    </div>
                    <div className="fsl-id">
                        <span>FSL Email: {shared.userProfile.email}</span>
                    </div>
                    <div className="fsl-id">
                        <span>FSL Point: {shared.userProfile.flsPoint}</span>
                    </div>
                    <div className="fsl-id">
                        <span>Polygon Address: {shared.userProfile.evmAddr}</span>
                    </div>
                    <div className="fsl-id">
                        <span>Solana Address: {shared.userProfile.solAddr}</span>
                    </div>
                </>
            ) : (
                <button 
                    className="connect-fsl-button"
                    onClick={() => {
                        // Handle FSL ID connection logic here                        
                        connectFSLID();
                    }}
                >
                    Connect FSL ID
                </button>
            )}
        </div>
    );
};

export default FSLID;