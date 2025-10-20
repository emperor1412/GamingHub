// Mock API Response - Challenge Badge Data
// This simulates the API response structure for challenge badges with all 6 states

export const mockChallengeBadgeApiResponse = {
  weekly: [
    // State 0: Incoming (unknown + nextbadge) - Question mark
    { id: 1001, name: "Mount Olympus Trek", type: 1, state: 0 },
    
    // State 1: Ongoing (unlocked + on-going) - Bright normal badge
    { id: 1002, name: "Trolltunga Out-and-Back", type: 1, state: 1 },
    
    // State 2: Completed with reward (unlocked + done-and-unclaimed) - Bright normal badge
    { id: 1003, name: "Cinque Terre Classic Segment", type: 1, state: 2, hasReward: true },
    
    // State 3: Completed and claimed (unlocked + done-and-claimed) - Bright normal badge
    { id: 1004, name: "Table Mountain Panorama Loop", type: 1, state: 3, hasReward: false },
    
    // State 4: Failed (locked + unfinished) - Padlock
    { id: 1005, name: "Arthur's Seat & Coast Loop", type: 1, state: 4 },
    
    // State 5: Missed (locked + unjoined) - Padlock
    { id: 1006, name: "Mount Takao & Jimba Ridge", type: 1, state: 5 }
  ],
  
  monthly: [
    // State 0: Incoming (unknown + nextbadge) - Question mark
    { id: 10001, name: "Athens Riviera plus Saronic Stitches", type: 2, state: 0 },
    
    // State 1: Ongoing (unlocked + on-going) - Bright normal badge
    { id: 10002, name: "Camino Portugués Coastal Sampler", type: 2, state: 1 },
    
    // State 2: Completed with reward (unlocked + done-and-unclaimed) - Bright normal badge
    { id: 10003, name: "Kyoto to Koyasan Pilgrim Mix", type: 2, state: 2, hasReward: true },
    
    // State 3: Completed and claimed (unlocked + done-and-claimed) - Bright normal badge
    { id: 10004, name: "Cape Town Coastal plus Winelands", type: 2, state: 3, hasReward: false },
    
    // State 4: Failed (locked + unfinished) - Padlock
    { id: 10005, name: "Patagonia Lakes District Link", type: 2, state: 4 },
    
    // State 5: Missed (locked + unjoined) - Padlock
    { id: 10006, name: "Iceland South Coast Waterfalls", type: 2, state: 5 }
  ],
  
  yearly: [
    // State 0: Incoming (unknown + nextbadge) - Question mark
    { id: 100001, name: "Trans-Europe Ribbon", type: 3, state: 0 },
    
    // State 1: Ongoing (unlocked + on-going) - Bright normal badge
    { id: 100002, name: "Great Rift Traverse", type: 3, state: 1 },
    
    // State 2: Completed with reward (unlocked + done-and-unclaimed) - Bright normal badge
    { id: 100003, name: "Pacific Ring Sampler", type: 3, state: 2, hasReward: true }
  ]
};

export const mockCurrentChallengeDataApiResponse = {
  weekly: {
    id: 1002, // Trolltunga Out-and-Back
    price: 200,
    type: "weekly"
  },
  monthly: {
    id: 10002, // Camino Portugués Coastal Sampler  
    price: 800,
    type: "monthly"
  },
  yearly: {
    id: 100002, // Great Rift Traverse
    price: 2000,
    type: "yearly"
  }
};

// State mapping helper - Updated according to design guide
export const mapApiStateToVisualState = (apiState, hasReward = false) => {
  switch (apiState) {
    case 0: // Incoming - next challenge (start time > current time)
      return {
        visualType: 'unknown', // Shows question mark icon
        logicState: 'nextbadge'
      };
    case 1: // Ongoing - bright normal badge
      return {
        visualType: 'unlocked',
        logicState: 'on-going'
      };
    case 2: // Completed with reward - bright normal badge
      return {
        visualType: 'unlocked',
        logicState: 'done-and-unclaimed'
      };
    case 3: // Completed and claimed - bright normal badge
      return {
        visualType: 'unlocked',
        logicState: 'done-and-claimed'
      };
    case 4: // Failed - padlock icon
      return {
        visualType: 'locked',
        logicState: 'unfinished'
      };
    case 5: // Missed (didn't join) - padlock icon
      return {
        visualType: 'locked',
        logicState: 'unjoined'
      };
    default:
      return {
        visualType: 'unknown',
        logicState: 'nextbadge'
      };
  }
};

// Helper function to get challenge data by ID from JSON files
export const getChallengeDataById = (challengeId, challengeType) => {
  // Import JSON data
  const weeklyChallenges = require('./weeklyChallenges.json');
  const monthlyChallenges = require('./monthlyChallenges.json');
  const yearlyChallenges = require('./yearlyChallenges.json');
  
  if (challengeId >= 1001 && challengeId <= 1030) {
    // Weekly challenges
    const challenge = weeklyChallenges.find(c => c.id === challengeId);
    if (challenge) {
      return {
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        shortTitle: challenge.shortTitle,
        distanceKm: challenge.distanceKm,
        stepsEst: challenge.stepsEst,
        location: challenge.location,
        description: challenge.blurb,
        failDescription: challenge.failBlurb,
        dateStart: challenge.dateStart,
        dateEnd: challenge.dateEnd
      };
    }
  } else if (challengeId >= 10001 && challengeId <= 10012) {
    // Monthly challenges
    const challenge = monthlyChallenges.find(c => c.id === challengeId);
    if (challenge) {
      return {
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        shortTitle: challenge.shortTitle,
        distanceKm: challenge.distanceKm,
        stepsEst: challenge.stepsEst,
        location: challenge.location,
        description: challenge.blurb,
        failDescription: challenge.failBlurb,
        dateStart: challenge.dateStart,
        dateEnd: challenge.dateEnd
      };
    }
  } else if (challengeId >= 100001 && challengeId <= 100003) {
    // Yearly challenges
    const challenge = yearlyChallenges.find(c => c.id === challengeId);
    if (challenge) {
      return {
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        shortTitle: challenge.shortTitle,
        distanceKm: challenge.distanceKm,
        stepsEst: challenge.stepsEst,
        region: challenge.region,
        description: challenge.blurb,
        failDescription: challenge.failBlurb,
        dateStart: challenge.dateStart,
        dateEnd: challenge.dateEnd
      };
    }
  }
  
  return null;
};

// ----------------------------------------------------------------------------
// Mock API: Flat list of challenges for Badge Collection view
// ----------------------------------------------------------------------------
// This simulates a real API that returns a flat list of challenges with only
// essential fields used to render the Badge Collection grid.
//
// Response shape (array of 12 items):
// [
//   {
//     id: number,
//     name: string,
//     type: 'weekly' | 'monthly' | 'yearly',
//     state: 0 | 1 | 2 | 3 | 4 | 5
//   },
//   ...
// ]
// ----------------------------------------------------------------------------

const buildFlatBadgeChallenges = () => {
  const flat = [
    ...(mockChallengeBadgeApiResponse.weekly || []),
    ...(mockChallengeBadgeApiResponse.monthly || []),
    ...(mockChallengeBadgeApiResponse.yearly || []),
  ];

  // Normalize fields to the minimal contract used by the collection view
  const normalized = flat.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    state: item.state,
  }));

  // Return first 12 items to match requested sample size
  return normalized.slice(0, 12);
};

// Synchronous builder (useful for tests or non-async contexts)
export const getMockBadgeChallenges = () => buildFlatBadgeChallenges();

// Async fetcher to mimic real API behavior
export const fetchBadgeChallenges = async () => {
  return new Promise((resolve) => {
    // Simulate small network delay
    setTimeout(() => {
      resolve(buildFlatBadgeChallenges());
    }, 150);
  });
};