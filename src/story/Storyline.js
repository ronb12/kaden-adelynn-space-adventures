// Enhanced Storyline for Kaden & Adelynn Space Adventures
export const Storyline = {
  // Character Profiles
  characters: {
    kaden: {
      name: "Kaden",
      gender: "boy",
      age: 12,
      personality: "Brave, curious, and adventurous",
      description: "A young space explorer with a passion for discovery and protecting the galaxy",
      ship: "Thunderbolt Fighter",
      abilities: ["Rapid Fire", "Shield Boost", "Speed Burst"],
      backstory: "Kaden grew up on the space station watching the stars and dreaming of adventure. When the alien threat emerged, he was the first to volunteer for the defense fleet."
    },
    adelynn: {
      name: "Adelynn", 
      gender: "girl",
      age: 11,
      personality: "Smart, strategic, and determined",
      description: "A brilliant young pilot with exceptional tactical skills and a heart for justice",
      ship: "Starlight Defender",
      abilities: ["Double Shot", "Energy Shield", "Wing Fighters"],
      backstory: "Adelynn was a child prodigy in engineering and combat simulation. When the alien invasion began, she modified her training ship into a formidable battle craft."
    }
  },

  // Story Chapters
  chapters: {
    intro: {
      title: "The Call to Adventure",
      description: "Kaden and Adelynn receive a distress signal from the outer colonies. An alien armada is approaching, and only they can save the galaxy!",
      dialogue: [
        "Commander: 'Kaden, Adelynn, we need your help! The alien armada is approaching the outer colonies!'",
        "Kaden: 'We're ready, Commander! Adelynn and I won't let them take our galaxy!'",
        "Adelynn: 'Let's show them what Earth's finest young pilots can do!'"
      ]
    },
    
    mission1: {
      title: "First Contact",
      description: "Kaden and Adelynn engage their first wave of alien fighters. The battle begins!",
      dialogue: [
        "Kaden: 'Here they come! Let's take them down!'",
        "Adelynn: 'Stay sharp, Kaden! These aliens are faster than we expected!'"
      ]
    },

    mission2: {
      title: "The Alien Mothership",
      description: "A massive alien mothership appears, launching waves of enemy fighters. The ultimate test begins!",
      dialogue: [
        "Adelynn: 'Kaden, look at the size of that thing! How are we supposed to stop it?'",
        "Kaden: 'Together, Adelynn! We've got this! Aim for the weak points!'"
      ]
    },

    victory: {
      title: "Victory for the Galaxy",
      description: "Kaden and Adelynn successfully defend the galaxy and become heroes!",
      dialogue: [
        "Commander: 'Outstanding work, cadets! You've saved the galaxy!'",
        "Kaden: 'We couldn't have done it without working together!'",
        "Adelynn: 'This is just the beginning of our adventures!'"
      ]
    }
  },

  // Mission Objectives
  missions: [
    {
      id: 1,
      title: "Defend the Colonies",
      description: "Protect the outer space colonies from alien invasion",
      objectives: [
        "Eliminate 50 alien fighters",
        "Survive for 5 minutes",
        "Collect 10 power-ups"
      ],
      rewards: ["New ship upgrade", "Achievement badge"]
    },
    {
      id: 2,
      title: "Destroy the Mothership",
      description: "Take down the massive alien mothership",
      objectives: [
        "Destroy the mothership's core",
        "Survive the boss battle",
        "Use special abilities 10 times"
      ],
      rewards: ["Hero status", "Galaxy defender medal"]
    }
  ],

  // Character Interactions
  interactions: {
    kaden_encouragement: [
      "Kaden: 'Come on, Adelynn! We've got this!'",
      "Kaden: 'That was amazing! You're the best pilot I know!'",
      "Kaden: 'Don't give up! We're almost there!'"
    ],
    adelynn_strategy: [
      "Adelynn: 'Kaden, try attacking from the left side!'",
      "Adelynn: 'Watch out for their energy blasts!'",
      "Adelynn: 'Perfect timing! Now let's finish them off!'"
    ],
    teamwork: [
      "Kaden & Adelynn: 'Together we're unstoppable!'",
      "Kaden: 'Your strategy is brilliant, Adelynn!'",
      "Adelynn: 'Your courage inspires me, Kaden!'"
    ]
  },

  // Story Events
  events: {
    power_up_collected: {
      kaden: "Kaden: 'Great! This will give us an edge!'",
      adelynn: "Adelynn: 'Excellent! Our ship is getting stronger!'"
    },
    enemy_defeated: {
      kaden: "Kaden: 'Another one down! Keep it up!'",
      adelynn: "Adelynn: 'Nice shot! We're making progress!'"
    },
    boss_defeated: {
      kaden: "Kaden: 'We did it! The mothership is destroyed!'",
      adelynn: "Adelynn: 'Incredible teamwork! We saved the galaxy!'"
    },
    game_over: {
      kaden: "Kaden: 'We'll get them next time, Adelynn!'",
      adelynn: "Adelynn: 'Let's try a different strategy, Kaden!'"
    }
  }
};

export default Storyline;
