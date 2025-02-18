import React, { useState, useEffect } from 'react';
import shared from './Shared';
import TicketAllResults from './TicketAllResults';
import { trackUserAction } from './analytics';

const TicketAll = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [rewards, setRewards] = useState([]);
    const [error, setError] = useState(null);

    const requestTicketUseAll = async (depth = 0) => {
        if (depth > 3) {
            console.error('Get trophy data failed after 3 attempts');
            return null;
        }

        try {
            console.log('Requesting ticket use all...');
            const response = await fetch(`${shared.server_url}/api/app/ticketUse?token=${shared.loginData.token}&type=2`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },                
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.code === 0) {
                    console.log('All tickets used successfully');
                    console.log('Rewards data:', JSON.stringify(data.data, null, 2));
                    console.log('Scratch completed!');
                    return data.data;
                }
                else if (data.code === 102002 || data.code === 102001) {
                    console.error('Token expired, attempting to re-login');
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        return requestTicketUseAll(depth + 1);
                    }
                    else {
                        throw new Error('Re-login failed');
                    }
                }
                else {
                    throw new Error(`Server returned error code: ${data.code}`);
                }
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Ticket use all error:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const rewardsData = await requestTicketUseAll();
                if (rewardsData) {
                    // Filter out rewards with type 10000 (no rewards)
                    const validRewards = rewardsData.filter(reward => reward.type !== 10000);
                    console.log('Valid rewards after filtering:', validRewards);
                    setRewards(validRewards);
                    trackUserAction('scratch_all_success', {
                        rewards_count: validRewards.length,
                        rewards_types: validRewards.map(r => r.type)
                    }, shared.loginData?.userId);
                }
            } catch (error) {
                setError(error.message);
                trackUserAction('scratch_all_error', {
                    error: error.message
                }, shared.loginData?.userId);
            } finally {
                setLoading(false);
            }
        };

        fetchRewards();
    }, []);

    if (loading) {
        return (
            <div className="loading-overlay">
                LOADING...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={onClose}>CLOSE</button>
            </div>
        );
    }

    return <TicketAllResults rewards={rewards} onClose={onClose} />;
};

export default TicketAll; 