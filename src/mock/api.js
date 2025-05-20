import shared from '../Shared';

// Mock API responses
const mockResponses = {
  // Login
  '/api/app/login': {
    success: true,
    code: 0,
    data: {
      link: '21201',
      token: 'mock-token-123',
      inviter: 0
    }
  },

  // Check-in
  '/api/app/checkIn': {
    success: true,
    isCheckIn: true,
    data: {
      streakDay: 1,
      reward: {
        type: 'ticket',
        amount: 1
      }
    }
  },

  // User data
  '/api/app/userData': {
    success: true,
    code: 0,
    data: {
      level: 1,
      exp: 0,
      tickets: 10,
      starlets: 100,
      avatar: 0,
      userId: 'mock-user-id-123',
      displayName: 'Mock User',
      pictureUrl: 'https://example.com/mock-profile.jpg',
      statusMessage: 'Hello from mock!',
      UserToken: [
        {
          prop_id: 10010,
          num: 10
        },
        {
          prop_id: 10020,
          num: 100
        }
      ],
      claimRecord: []
    },
    profileItems: []
  },

  // Tasks
  '/api/app/taskList': {
    success: true,
    tasks: [
      {
        id: 1,
        title: 'Daily Task 1',
        description: 'Complete this task to earn rewards',
        reward: {
          type: 'ticket',
          amount: 1
        }
      }
    ]
  },

  '/api/app/taskComplete': {
    success: true,
    reward: {
      type: 'ticket',
      amount: 1
    }
  },

  '/api/app/taskData': {
    success: true,
    task: {
      id: 1,
      title: 'Daily Task 1',
      description: 'Complete this task to earn rewards',
      reward: {
        type: 'ticket',
        amount: 1
      }
    }
  },

  // Market
  '/api/app/buyOptions': {
    success: true,
    code: 0,
    data: [
      {
        id: 1,
        state: 0,
        stars: 1,
        starlet: 10,
        ticket: 1
      },
      {
        id: 2,
        state: 0,
        stars: 2,
        starlet: 30,
        ticket: 2
      },
      {
        id: 3,
        state: 0,
        stars: 5,
        starlet: 100,
        ticket: 5
      }
    ]
  },

  '/api/app/buyStarlets': {
    success: true,
    code: 0,
    data: "https://pay.line.me/linepay/payment/123456789"
  },

  '/api/app/getFreeRewardTime': {
    success: true,
    code: 0,
    data: Date.now() + 24 * 60 * 60 * 1000 // Next day
  },

  '/api/app/claimFreeReward': {
    success: true,
    code: 0,
    data: {
      success: true,
      time: Date.now() + 24 * 60 * 60 * 1000
    }
  },

  // LINE Pay endpoints
  '/api/app/createLinePayPayment': {
    success: true,
    code: 0,
    data: {
      returnCode: "0000",
      returnMessage: "Success",
      info: {
        paymentUrl: {
          web: "https://pay.line.me/linepay/payment/123456789",
          app: "line://pay/123456789"
        },
        paymentAccessToken: "mock_token_123",
        transactionId: "mock_payment_123"
      }
    }
  },

  '/api/app/confirmLinePayPayment': {
    success: true,
    code: 0,
    data: {
      returnCode: "0000",
      returnMessage: "Success",
      info: {
        transactionId: "mock_payment_123",
        orderId: "mock_order_123",
        status: "COMPLETED"
      }
    }
  },

  // Events
  '/api/app/getEvents': {
    success: true,
    events: [
      {
        id: 1,
        title: 'Special Event',
        description: 'Join this event to earn rewards',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },

  '/api/app/eventPointData': {
    success: true,
    data: {
      points: 100,
      level: 1
    }
  },

  '/api/app/globalEggletsProgress': {
    success: true,
    data: {
      totalEgglets: 1000,
      currentEgglets: 500
    }
  },

  // Tickets
  '/api/app/ticketSlot': {
    success: true,
    data: {
      reward: {
        type: 'ticket',
        amount: 1
      }
    }
  },

  '/api/app/ticketUse': {
    success: true,
    data: {
      reward: {
        type: 'starlet',
        amount: 100
      }
    }
  },

  // Sharing
  '/api/app/sharingStory': {
    success: true,
    data: {
      reward: {
        type: 'ticket',
        amount: 1
      }
    }
  },

  '/api/app/sharingTrophy': {
    success: true,
    data: {
      reward: {
        type: 'ticket',
        amount: 1
      }
    }
  },

  // Profile
  '/api/app/changePicture': {
    success: true,
    data: {
      avatar: 1
    }
  },

  // Referral
  '/api/app/handleReferral': {
    success: true,
    data: {
      reward: {
        type: 'ticket',
        amount: 1
      }
    }
  },

  '/api/app/getReferralInfo': {
    success: true,
    data: {
      referrals: 0,
      rewards: []
    }
  },

  // Bank Steps
  '/api/app/claimBankSteps': {
    success: true,
    data: {
      reward: {
        type: 'ticket',
        amount: 1
      }
    }
  },

  '/api/app/getBankSteps': {
    success: true,
    data: {
      steps: 1000,
      rewards: []
    }
  },

  // Frens
  '/api/app/trophiesData': {
    success: true,
    data: {
      trophies: []
    }
  },

  '/api/app/unlockTrophy': {
    success: true,
    data: {
      trophy: {
        id: 1,
        name: 'First Trophy'
      }
    }
  },

  '/api/app/frensData': {
    success: true,
    data: {
      frens: [],
      total: 0
    }
  }
};

// Mock API service
const mockApi = {
  async fetch(url, options = {}) {
    console.log('Mock API called:', url, options);
    
    // Extract the API endpoint from the URL
    const endpoint = url.split('?')[0].split(shared.server_url)[1];
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response if available
    if (mockResponses[endpoint]) {
      return {
        ok: true,
        json: async () => mockResponses[endpoint]
      };
    }
    
    // Default response for unknown endpoints
    return {
      ok: true,
      json: async () => ({
        success: true,
        message: 'Mock response for unknown endpoint'
      })
    };
  }
};

// Override global fetch
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  if (url.startsWith(shared.server_url)) {
    return mockApi.fetch(url, options);
  }
  return originalFetch(url, options);
};

export default mockApi; 