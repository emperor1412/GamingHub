// Mock LIFF object
const mockLiff = {
  init: async ({ liffId }) => {
    console.log('Mock LIFF init called with liffId:', liffId);
    return Promise.resolve();
  },

  isLoggedIn: () => true,

  login: () => {
    console.log('Mock LIFF login called');
  },

  getProfile: async () => {
    return {
      userId: 'mock-user-id-123',
      displayName: 'Mock User',
      pictureUrl: 'https://example.com/mock-profile.jpg',
      statusMessage: 'Hello from mock!'
    };
  },

  getOS: () => 'ios',

  getLanguage: () => 'en',

  getVersion: () => '2.22.3',

  getLineVersion: () => '13.0.0',

  getContext: () => ({
    type: 'utou',
    viewType: 'compact',
    userId: 'mock-user-id-123'
  }),

  showPopup: ({ title, message, buttons }) => {
    console.log('Mock LIFF popup:', { title, message, buttons });
  }
};

export default mockLiff; 