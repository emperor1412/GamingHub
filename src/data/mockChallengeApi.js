// Mock API Response - Challenge Badge Data
// This simulates the API response structure for challenge badges with all 6 states

export const mockChallengeBadgeApiResponse = {
  weekly: [
    // State 0: Incoming (locked + nextbadge)
    { id: 1001, name: "Mount Olympus Trek", type: "weekly", state: 0 },
    
    // State 1: Ongoing (unlocked + on-going)
    { id: 1002, name: "Trolltunga Out-and-Back", type: "weekly", state: 1 },
    
    // State 2: Completed with reward (unlocked + done-and-unclaimed)
    { id: 1003, name: "Cinque Terre Classic Segment", type: "weekly", state: 2, hasReward: true },
    
    // State 3: Completed and claimed (unlocked + done-and-claimed)
    { id: 1004, name: "Table Mountain Panorama Loop", type: "weekly", state: 3, hasReward: false },
    
    // // State 4: Failed (locked + unfinished)
    // { id: 1005, name: "Arthur's Seat & Coast Loop", type: "weekly", state: 4 },
    
    // // State 5: Missed (locked + unjoined)
    // { id: 1006, name: "Mount Takao & Jimba Ridge", type: "weekly", state: 5 }
  ],
  
  monthly: [
    // State 0: Incoming (locked + nextbadge)
    { id: 10001, name: "Athens Riviera plus Saronic Stitches", type: "monthly", state: 0 },
    
    // State 1: Ongoing (unlocked + on-going)
    { id: 10002, name: "Camino Portugués Coastal Sampler", type: "monthly", state: 1 },
    
    // State 2: Completed with reward (unlocked + done-and-unclaimed)
    { id: 10003, name: "Kyoto to Koyasan Pilgrim Mix", type: "monthly", state: 2, hasReward: true },
    
    // State 3: Completed and claimed (unlocked + done-and-claimed)
    { id: 10004, name: "Cape Town Coastal plus Winelands", type: "monthly", state: 3, hasReward: false },
    
    // State 4: Failed (locked + unfinished)
    { id: 10005, name: "Patagonia Lakes District Link", type: "monthly", state: 4 },
    
    // State 5: Missed (locked + unjoined)
    { id: 10006, name: "Iceland South Coast Waterfalls", type: "monthly", state: 5 }
  ],
  
  yearly: [
    // State 0: Incoming (locked + nextbadge)
    { id: 100001, name: "Trans-Europe Ribbon", type: "yearly", state: 0 },
    
    // State 1: Ongoing (unlocked + on-going)
    { id: 100002, name: "Great Rift Traverse", type: "yearly", state: 1 },
    
    // State 2: Completed with reward (unlocked + done-and-unclaimed)
    { id: 100003, name: "Pacific Ring Sampler", type: "yearly", state: 2, hasReward: true }
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

// State mapping helper
export const mapApiStateToVisualState = (apiState, hasReward = false) => {
  switch (apiState) {
    case 0: // Incoming
      return {
        visualType: 'unknown',
        logicState: 'nextbadge'
      };
    case 1: // Ongoing
      return {
        visualType: 'unlocked',
        logicState: 'on-going'
      };
    case 2: // Completed with reward
      return {
        visualType: 'unlocked',
        logicState: 'done-and-unclaimed'
      };
    case 3: // Completed and claimed
      return {
        visualType: 'unlocked',
        logicState: 'done-and-claimed'
      };
    case 4: // Failed
      return {
        visualType: 'locked',
        logicState: 'unfinished'
      };
    case 5: // Missed
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
