// Simple challenges data
export const challengesData = [
  // Weekly Challenges
  {
    id: 1001,
    type: "weekly",
    title: "Mount Olympus Trek",
    shortTitle: "Olympus",
    distance: 20,
    steps: 25000,
    location: "Olympus NP, Greece",
    blurb: "Forested switchbacks into myth country and big Aegean views.",
    failBlurb: "The heat and endless switchbacks leave you wilted before the views appear.",
    reward: 200,
    levelRequired: 5,
    dateStart: "10/8/2025",
    dateEnd: "10/15/2025"
  },
  {
    id: 1002,
    type: "weekly", 
    title: "Trolltunga Out-and-Back",
    shortTitle: "Trolltunga",
    distance: 27,
    steps: 33750,
    location: "Hordaland, Norway",
    blurb: "Alpine lakes, granite slabs, and that iconic cliff finale.",
    failBlurb: "Clouds roll in, hiding the lakes and turning the slab scramble into a trudge.",
    reward: 200,
    levelRequired: 8,
    dateStart: "10/16/2025",
    dateEnd: "10/23/2025"
  },

  // Monthly Challenge
  {
    id: 2001,
    type: "monthly",
    title: "The Grand Canyon Rim-to-Rim",
    shortTitle: "Grand Canyon",
    distance: 24,
    steps: 30000,
    location: "Arizona, USA",
    blurb: "Descend into geological time through layers of ancient rock.",
    failBlurb: "Heat exhaustion and dehydration make every step a struggle.",
    reward: 600,
    levelRequired: 15,
    needPremium: true,
    dateStart: "11/1/2025",
    dateEnd: "11/30/2025"
  },

  // Yearly Challenge
  {
    id: 3001,
    type: "yearly",
    title: "The Silk Road Expedition",
    shortTitle: "Silk Road",
    distance: 200,
    steps: 250000,
    location: "Multiple Countries",
    blurb: "Epic journey across continents following ancient trade routes.",
    failBlurb: "Political unrest and extreme weather make this journey impossible.",
    reward: 2000,
    levelRequired: 25,
    dateStart: "01/01/2026",
    dateEnd: "12/31/2026"
  }
];

// Helper functions
export const getChallengesByType = (type) => {
  return challengesData.filter(challenge => challenge.type === type);
};

export const getCurrentChallenge = (type) => {
  const challenges = getChallengesByType(type);
  return challenges[0]; // Return first challenge of each type
};
