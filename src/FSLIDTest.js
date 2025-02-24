import React from 'react';
import './FSLIDTest.css';
import FSLAuthorization from 'fsl-authorization';
import shared from './Shared';

const FSLIDTest = () => {
    const onClick_Method_1 = () => {
        console.log('Method 1');

        /*
url: /app/randKey
Request:
	code string  //The token that calls the fslId callback

Response:
{
    "code": 0,
    "data": "h1nvi6zyg2b7nw0aqegso4eubqtb7hq1"//state
}
        */

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


        // const REDIRECT_URL = 'https://t.me/TestFSL_bot/fslhub?startapp=';
        // const REDIRECT_URL = '{code: 0, data: {message: "https://t.me/TestFSL_bot/fslhub?startapp=fslid_"}}';
        
        
        /*
        .then((response) => {
            if (response && response.code) {
                // todo your code
                console.log('FSL Login, Code:', response.code);
            }
        }).catch((error) => {
            console.error('Login error:', error);
        });
        */
    };

    const onClick_Method_2 = () => {
        console.log('Method 2');

        const REDIRECT_URL = window.location.href;

        const fslAuthorization = FSLAuthorization.init({
            responseType: 'code', // 'code' or 'token'
            appKey: 'MiniGame',
            redirectUri: REDIRECT_URL, // https://xxx.xxx.com
            scope: 'basic', // Grant Scope
            state: 'test',
            usePopup: false, // Popup a window instead of jump to
            isApp: true
        });
        /*
        fslAuthorization.signIn().then((code) => {
            if (code) {
                // Implement your code here
                console.log('FSL Login, Code:', code);
            }
        });
        */

        fslAuthorization.signInV2().then((response) => {
            if (response && response.code) {
                // todo your code
                console.log('FSL Login, Code:', response.code);
            }
        }).catch((error) => {
            console.error('Login error:', error);
        });
    };

    const onClick_Method_3 = () => {
        console.log('Method 3');

        const REDIRECT_URL = window.location.href;
        const FSL_ID_URL = 'https://gm3.joysteps.io/login';

        const loginUrl = `${FSL_ID_URL}?` + new URLSearchParams({
            client_id: 'MiniGame',
            redirect_uri: REDIRECT_URL,
            response_type: 'code',
            state: 'test', // Generate random state for security verification
        })

        window.location.href = loginUrl;
    };

    const onClick_Method_4 = () => {
        console.log('Method 4');

        const REDIRECT_URL = 'https://t.me/TestFSL_bot/fslhub?startapp=';
        const FSL_ID_URL = 'https://gm3.joysteps.io/login';

        const loginUrl = `${FSL_ID_URL}?` + new URLSearchParams({
            client_id: 'MiniGame',
            redirect_uri: REDIRECT_URL,
            response_type: 'code',
            state: 'test', // Generate random state for security verification
        })

        window.open(loginUrl, '_blank');
    };

    return (
        <div className="fslid-container">
            <span>Method 1 using FSLAuthorization with use popup = true and telegram link of the app for the REDIRECT_URL</span>
            <span>
                <pre>
                    {`

const REDIRECT_URL = Shared.server_url + '/api/app/fslCallback';

const fslAuthorization = FSLAuthorization.init({
    responseType: 'code', // 'code' or 'token'
    appKey: 'MiniGame',
    redirectUri: REDIRECT_URL, // https://xxx.xxx.com
    scope: 'basic', // Grant Scope
    state: 'test',
    usePopup: true, // Popup a window instead of jump to
    isApp: true
});

fslAuthorization.signInV2().then((response) => {
    if (response && response.code) {
        // todo your code
        console.log('FSL Login, Code:', response.code);
    }
}).catch((error) => {
    console.error('Login error:', error);
});
          `}
                </pre>
            </span>
            <button className="fslid-button" onClick={() => onClick_Method_1()}>Method 1</button>

            <br />
            <span>Method 2 using FSLAuthorization with use popup = false and window.location.href for the REDIRECT_URL</span>            
            <span>
                <pre>
                    {`
const REDIRECT_URL = window.location.href; 

const fslAuthorization = FSLAuthorization.init({
    responseType: 'code', // 'code' or 'token'
    appKey: 'MiniGame',
    redirectUri: REDIRECT_URL,
    scope: 'basic', // Grant Scope
    state: 'test',
    usePopup: false, // Popup a window instead of jump to
    isApp: true
});
fslAuthorization.signInV2().then((response) => {
    if (response && response.code) {
        // Implement your code here
        console.log('FSL Login, Code:', response.code);
    }
}).catch((error) => {
    console.error('Login error:', error);
});
`}
                </pre>
            </span>
            <span>window.location.href looks like this in test environment:
                <pre>
                    {`
http://192.168.1.33:3000/#tgWebAppData=user%3D%257B%2522id%2522%253A5000076292%252C%2522first_name%2522%253A%2522Kaka%2522%252C%2522last_name%2522%253A%2522Lala%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Fa-ttgme.stel.com%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F6thXXo7dg3iQkfglj04aJwahZtMVjVkr1SQ_HG5RoXfTs5kMtuDMMwY75gpkM2-J.svg%2522%257D%26chat_instance%3D8695733394598739372%26chat_type%3Dsender%26auth_date%3D1732254202%26signature%3Dn4GI9Cm6gEtUEBUmVAWpv5aJgNrWrdArO6LMN0JEDrK6X7y4EqZvjRHOVYj4iZ3fWz1wSe23fbEtxB0Z08aDDw%26hash%3D359c66337ea753a701fe7f7cf4f84b738226e53a97bc3e3aec5eec408ea1856e&tgWebAppVersion=8.0&tgWebAppPlatform=tdesktop&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%23168acd%22%2C%22bg_color%22%3A%22%23ffffff%22%2C%22bottom_bar_bg_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%2340a7e3%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23d14e4e%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23999999%22%2C%22link_color%22%3A%22%23168acd%22%2C%22secondary_bg_color%22%3A%22%23f1f1f1%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%23168acd%22%2C%22section_separator_color%22%3A%22%23e7e7e7%22%2C%22subtitle_text_color%22%3A%22%23999999%22%2C%22text_color%22%3A%22%23000000%22%7D
                    `}
                </pre>

                And looks like this in pre-production environment:
                <pre>
                    {`
https://emperor1412.github.io/GamingHub/#tgWebAppData=user%3D%257B%2522id%2522%253A5000076292%252C%2522first_name%2522%253A%2522Kaka%2522%252C%2522last_name%2522%253A%2522Lala%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Fa-ttgme.stel.com%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F6thXXo7dg3iQkfglj04aJwahZtMVjVkr1SQ_HG5RoXfTs5kMtuDMMwY75gpkM2-J.svg%2522%257D%26chat_instance%3D8695733394598739372%26chat_type%3Dsender%26auth_date%3D1732254202%26signature%3Dn4GI9Cm6gEtUEBUmVAWpv5aJgNrWrdArO6LMN0JEDrK6X7y4EqZvjRHOVYj4iZ3fWz1wSe23fbEtxB0Z08aDDw%26hash%3D359c66337ea753a701fe7f7cf4f84b738226e53a97bc3e3aec5eec408ea1856e&tgWebAppVersion=8.0&tgWebAppPlatform=tdesktop&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%23168acd%22%2C%22bg_color%22%3A%22%23ffffff%22%2C%22bottom_bar_bg_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%2340a7e3%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23d14e4e%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23999999%22%2C%22link_color%22%3A%22%23168acd%22%2C%22secondary_bg_color%22%3A%22%23f1f1f1%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%23168acd%22%2C%22section_separator_color%22%3A%22%23e7e7e7%22%2C%22subtitle_text_color%22%3A%22%23999999%22%2C%22text_color%22%3A%22%23000000%22%7D
                    `}
                </pre>
            </span>

            <button className="fslid-button" onClick={() => onClick_Method_2()}>Method 2</button>

            <br />
            <span>Method 3 using login URL and window.location.href for the REDIRECT_URL</span>
            <span>
                <pre>
                    {`const REDIRECT_URL = window.location.href;
const FSL_ID_URL = 'https://gm3.joysteps.io/login';

const loginUrl = {FSL_ID_URL} + new URLSearchParams({
  client_id: 'MiniGame',
  redirect_uri: REDIRECT_URL,
  response_type: 'code',
  state: 'test', // Generate random state for security verification
});

window.location.href = loginUrl;`}
                </pre>
            </span>
            <button className="fslid-button" onClick={() => onClick_Method_3()}>Method 3</button>

            <br />
            <span>Method 4 using login URL and window.open</span>
            <span>
                <pre>
                    {`const REDIRECT_URL = 'https://t.me/TestFSL_bot/fslhub?startapp=';
const FSL_ID_URL = 'https://gm3.joysteps.io/login';

const loginUrl = {FSL_ID_URL} + new URLSearchParams({
  client_id: 'MiniGame',
  redirect_uri: REDIRECT_URL,
  response_type: 'code',
  state: 'test', // Generate random state for security verification
});

window.open(loginUrl, '_blank');`}
                </pre>
            </span>
            <button className="fslid-button" onClick={() => onClick_Method_4()}>Method 4</button>
        </div>
    );
};

export default FSLIDTest;
