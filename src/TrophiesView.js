import React, { useEffect, useState } from 'react';
import './TrophiesView.css';
import backIcon from './images/back.svg';
import shared from './Shared';

// Import trophy icons from Frens.js
import trophy_1 from './images/trophy_1_200px.png';
import trophy_2 from './images/trophy_2_200px.png';
import trophy_3 from './images/trophy_3_200px.png';
import trophy_4 from './images/trophy_4_200px.png';
import trophy_5 from './images/trophy_5_200px.png';
import trophy_6 from './images/trophy_6_200px.png';
import trophy_10000 from './images/trophy_10000_200px.png';
import trophy_10000_locked from './images/trophy_10000_locked.png';
import trophy_10010 from './images/Trophy-ALPHA_TESTER_Unlocked.png';
import trophy_10010_locked from './images/Trophy-ALPHA_TESTER2-Locked.png';
import trophy_10020 from './images/Runner-Trophy_Colour.png';
import trophy_10020_locked from './images/Runner-Trophy_Bw.png';
import trophy_10030 from './images/FSLGAMES-newtrophyicons_1360.png';
import trophy_10030_locked from './images/FSLGAMES-newtrophyicons_1360_1.png';
import trophy_10040 from './images/TheFirstHunded_Unlocked.png';
import trophy_10040_locked from './images/TheFirstHunded_Locked.png';
import trophy_10041 from './images/TwoHundredStrong_Unlocked.png';
import trophy_10041_locked from './images/TwoHundredStrong_Locked.png';
import trophy_10042 from './images/Spartan_Unlocked.png';
import trophy_10042_locked from './images/Spartan_Locked.png';
import trophy_10043 from './images/UnbrokenYear_Unlocked.png';
import trophy_10043_locked from './images/UnbrokenYear_Locked.png';
import trophy_10050 from './images/stepBoost_trophy_unlocked.png';
import trophy_10050_locked from './images/stepBoost_trophy_locked.png';
import trophy_10060 from './images/BToken.png';
import trophy_10060_locked from './images/BToken_Locked.png';
import trophy_10070 from './images/FSLGamesHub_PremiumMembership_1441.png';
import trophy_10070_locked from './images/FSLGamesHub_PremiumMembership_1441_1.png';

const TrophiesView = ({ onBack }) => {
    const [trophies, setTrophies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const trophyIcon = {
        1: trophy_1,
        2: trophy_2,
        3: trophy_3,
        4: trophy_4,
        5: trophy_5,
        6: trophy_6,
        10000: trophy_10000,
        10010: trophy_10010,
        10020: trophy_10020,
        10030: trophy_10030,
        10040: trophy_10040,
        10041: trophy_10041,
        10042: trophy_10042,
        10043: trophy_10043,
        10050: trophy_10050,
        10060: trophy_10060,
        10070: trophy_10070,
    };

    const trophyIconLocked = {
        10000: trophy_10000_locked,
        10010: trophy_10010_locked,
        10020: trophy_10020_locked,
        10030: trophy_10030_locked,
        10040: trophy_10040_locked,
        10041: trophy_10041_locked,
        10042: trophy_10042_locked,
        10043: trophy_10043_locked,
        10050: trophy_10050_locked,
        10060: trophy_10060_locked,
        10070: trophy_10070_locked,
    };

    // Create locked versions of social trophies (1-6) since they don't have locked versions
    const createLockedTrophy = (trophyId, trophyName, description, min, max) => {
        return {
            id: trophyId,
            name: trophyName,
            description: description,
            min: min,
            max: max,
            state: 0,
            status: 'locked',
            icon: trophyIcon[trophyId],
            isLocked: true
        };
    };

    const getTrophyData = async (depth = 0) => {
        if (depth > 3) {
            console.error('Get trophy data failed after 3 attempts');
            return;
        }

        try {
            const response = await fetch(`${shared.server_url}/api/app/trophiesData?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Trophies data:', data);
                if (data.code === 0) {
                    const trophiesData = data.data.map(trophy => ({
                        id: trophy.id,
                        name: trophy.id === 10000 && trophy.state === 2 ? "STARLETS CHAMPION" : trophy.name,
                        description: trophy.description,
                        min: trophy.min,
                        max: trophy.max,
                        state: trophy.state,
                        status: trophy.state === 0 ? 'locked' : trophy.state === 1 ? 'ready' : 'unlocked',
                        icon: trophy.id === 10000 && trophy.state === 0 ? trophy_10000_locked : 
                              trophy.id === 10010 && trophy.state === 0 ? trophy_10010_locked :
                              trophy.id === 10020 && trophy.state === 0 ? trophy_10020_locked :
                              trophy.id === 10030 && trophy.state === 0 ? trophy_10030_locked :
                              trophy.id === 10040 && trophy.state === 0 ? trophy_10040_locked :
                              trophy.id === 10041 && trophy.state === 0 ? trophy_10041_locked :
                              trophy.id === 10042 && trophy.state === 0 ? trophy_10042_locked :
                              trophy.id === 10043 && trophy.state === 0 ? trophy_10043_locked :
                              trophy.id === 10050 && trophy.state === 0 ? trophy_10050_locked :
                              trophy.id === 10060 && trophy.state === 0 ? trophy_10060_locked :
                              trophy.id === 10070 && trophy.state === 0 ? trophy_10070_locked :
                              trophyIcon[trophy.id],
                        isLocked: false
                    }));

                    // Add locked versions of social trophies (1-6) if they don't exist
                    const socialTrophyIds = [1, 2, 3, 4, 5, 6];
                    const existingIds = trophiesData.map(t => t.id);
                    
                    socialTrophyIds.forEach(id => {
                        if (!existingIds.includes(id)) {
                            const lockedTrophy = createLockedTrophy(
                                id,
                                id === 1 ? "ROOKIE RECRUITER" :
                                id === 2 ? "JUNIOR AMBASSADOR" :
                                id === 3 ? "SENIOR AMBASSADOR" :
                                id === 4 ? "MASTER CONNECTOR" :
                                id === 5 ? "ELITE INFLUENCER" :
                                id === 6 ? "LEGENDARY LUMINARY" : "UNKNOWN",
                                "Complete achievements to unlock this trophy",
                                id === 1 ? 1 : id === 2 ? 5 : id === 3 ? 10 : id === 4 ? 20 : id === 5 ? 50 : 100,
                                id === 1 ? 4 : id === 2 ? 9 : id === 3 ? 19 : id === 4 ? 49 : id === 5 ? 99 : -1
                            );
                            trophiesData.push(lockedTrophy);
                        }
                    });

                    setTrophies(trophiesData);
                } else if (data.code === 102002 || data.code === 102001) {
                    console.error('Trophies data error:', data.msg);
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        getTrophyData(depth + 1);
                    } else {
                        console.error('Login failed:', result.error);
                    }
                }
            } else {
                console.error('Trophies data error:', response);
            }
        } catch (error) {
            console.error('Error fetching trophies:', error);
        }
    };

    useEffect(() => {
        getTrophyData();
    }, []);

    // Group trophies into 3 groups of 6 trophies each
    const groupTrophies = (trophies) => {
        const groups = [];
        for (let i = 0; i < trophies.length; i += 6) {
            groups.push(trophies.slice(i, i + 6));
        }
        return groups;
    };

    const trophyGroups = groupTrophies(trophies);

    // Define group names based on trophy types
    const getGroupName = (groupIndex) => {
        const groupNames = ['SOCIAL', 'ACHIEVEMENT', 'SPECIAL'];
        return groupNames[groupIndex] || `GROUP ${groupIndex + 1}`;
    };

    const renderTrophyGroup = (group, groupIndex) => {              
        return (
            <div key={groupIndex} className="trophy-group">
                <div className="trophy-group-header">
                    <h3 className="trophy-group-title">{getGroupName(groupIndex)}</h3>
                </div>
                <div className="trophy-group-content">
                    <div className="trophy-group-corner trophy-group-top-left"></div>
                    <div className="trophy-group-corner trophy-group-top-right"></div>
                    <div className="trophy-group-corner trophy-group-bottom-left"></div>
                    <div className="trophy-group-corner trophy-group-bottom-right"></div>
                    
                    <div className="pf_trophies-grid">
                        {group.map((trophy, index) => (
                            <div key={trophy.id} className={`trophy-item ${trophy.status}`}>
                                <div className="trophy-content">
                                    <div className="pf_trophy-icon">
                                        <img src={trophy.icon} alt={trophy.name} />
                                    </div>
                                    <div className="trophy-name">{trophy.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="trophies-view-container">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={onBack}>
                <img src={backIcon} alt="Back" />
            </button>

            {/* Header */}
            <div className="trophies-view-header">
                <div className="trophy-badge">
                    <div className="trophy-badge-icon">
                        <img src={trophy_4} alt="Master Connector" />
                    </div>
                    <div className="trophy-badge-text">
                    </div>
                </div>
                <h1 className="trophies-view-title">TROPHIES</h1>
            </div>

            {/* Trophy Groups */}
            <div className="trophies-view-content">
                {trophyGroups.map((group, index) => renderTrophyGroup(group, index))}
            </div>
        </div>
    );
};

export default TrophiesView;
