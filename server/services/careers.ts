import { storage } from "../storage";
import type { Career, PersonalityAssessment, JournalEntry } from "@shared/schema";

// Initialize the careers database with sample data
export async function initializeCareers(): Promise<void> {
  try {
    const existingCareers = await storage.getAllCareers();
    if (existingCareers.length > 0) return; // Already initialized

    const careers = [
      {
        title: "UX Designer",
        description: "Create intuitive and beautiful user experiences for digital products",
        salaryMin: 65000,
        salaryMax: 120000,
        growthRate: 0.22,
        educationLevel: "Bachelor's",
        remoteWork: true,
        skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Usability Testing", "Design Systems"],
        interests: ["creativity", "technology", "problem_solving", "design"],
        personalityVector: {
          openness: 0.8,
          conscientiousness: 0.7,
          extraversion: 0.6,
          agreeableness: 0.7,
          neuroticism: 0.3,
        },
        roadmapYear1: "• Learn design fundamentals (color theory, typography, layout)\n• Master design tools (Figma, Adobe XD, Sketch)\n• Build first portfolio with 3-5 projects\n• Take online courses (Google UX Design Certificate)\n• Join design communities and follow industry blogs",
        roadmapYear2: "• Focus on UX research methods and usability testing\n• Learn prototyping and interaction design\n• Work on real client projects or internships\n• Develop expertise in mobile and web design\n• Network with professionals and attend design events",
        roadmapYear3: "• Apply for junior UX designer positions\n• Lead design projects from concept to completion\n• Develop business acumen and strategy skills\n• Mentor other aspiring designers\n• Consider pursuing advanced certifications",
        iconClass: "fas fa-palette",
        colorScheme: "gradient-bg",
      },
      {
        title: "Software Developer",
        description: "Build applications and systems that solve real-world problems",
        salaryMin: 70000,
        salaryMax: 130000,
        growthRate: 0.25,
        educationLevel: "Bachelor's",
        remoteWork: true,
        skills: ["Programming", "Problem Solving", "Software Architecture", "Database Design", "Testing", "Version Control"],
        interests: ["technology", "problem_solving", "learning", "logic"],
        personalityVector: {
          openness: 0.7,
          conscientiousness: 0.8,
          extraversion: 0.4,
          agreeableness: 0.6,
          neuroticism: 0.3,
        },
        roadmapYear1: "• Learn programming fundamentals (Python, JavaScript)\n• Build basic projects and portfolio\n• Study computer science concepts\n• Practice on coding platforms\n• Join coding communities",
        roadmapYear2: "• Master web development frameworks\n• Learn database management\n• Contribute to open source projects\n• Build complex applications\n• Network with developers",
        roadmapYear3: "• Apply for junior developer positions\n• Specialize in specific technologies\n• Lead development projects\n• Mentor junior developers\n• Consider advanced certifications",
        iconClass: "fas fa-code",
        colorScheme: "gradient-card",
      },
      {
        title: "Graphic Designer",
        description: "Create visual content to communicate messages and engage audiences",
        salaryMin: 45000,
        salaryMax: 85000,
        growthRate: 0.08,
        educationLevel: "Bachelor's",
        remoteWork: true,
        skills: ["Visual Design", "Typography", "Branding", "Adobe Creative Suite", "Layout Design", "Color Theory"],
        interests: ["creativity", "art", "communication", "visual"],
        personalityVector: {
          openness: 0.9,
          conscientiousness: 0.6,
          extraversion: 0.5,
          agreeableness: 0.6,
          neuroticism: 0.4,
        },
        roadmapYear1: "• Master Adobe Creative Suite\n• Learn design principles\n• Build portfolio with diverse projects\n• Study typography and color theory\n• Follow design trends and inspiration",
        roadmapYear2: "• Specialize in branding or digital design\n• Work with real clients\n• Develop business understanding\n• Network with other creatives\n• Expand technical skills",
        roadmapYear3: "• Apply for designer positions\n• Build strong client relationships\n• Consider freelance opportunities\n• Mentor aspiring designers\n• Explore creative direction roles",
        iconClass: "fas fa-paint-brush",
        colorScheme: "bg-accent",
      },
      {
        title: "Data Scientist",
        description: "Extract insights from data to drive business decisions and solve complex problems",
        salaryMin: 85000,
        salaryMax: 150000,
        growthRate: 0.35,
        educationLevel: "Bachelor's",
        remoteWork: true,
        skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization", "SQL", "Critical Thinking"],
        interests: ["analysis", "mathematics", "problem_solving", "research"],
        personalityVector: {
          openness: 0.8,
          conscientiousness: 0.9,
          extraversion: 0.4,
          agreeableness: 0.5,
          neuroticism: 0.2,
        },
        roadmapYear1: "• Learn statistics and mathematics\n• Master Python and R programming\n• Study machine learning basics\n• Work with real datasets\n• Build analytical projects",
        roadmapYear2: "• Advanced machine learning techniques\n• Data visualization mastery\n• Domain expertise development\n• Internships or projects\n• Kaggle competitions",
        roadmapYear3: "• Apply for data scientist roles\n• Specialize in specific industries\n• Lead data projects\n• Present findings to stakeholders\n• Consider advanced degrees",
        iconClass: "fas fa-chart-bar",
        colorScheme: "bg-secondary",
      },
      {
        title: "Marketing Specialist",
        description: "Create and execute marketing strategies to promote products and services",
        salaryMin: 50000,
        salaryMax: 90000,
        growthRate: 0.18,
        educationLevel: "Bachelor's",
        remoteWork: true,
        skills: ["Digital Marketing", "Content Creation", "SEO/SEM", "Social Media", "Analytics", "Communication"],
        interests: ["communication", "creativity", "psychology", "business"],
        personalityVector: {
          openness: 0.7,
          conscientiousness: 0.7,
          extraversion: 0.8,
          agreeableness: 0.7,
          neuroticism: 0.3,
        },
        roadmapYear1: "• Learn digital marketing fundamentals\n• Master social media platforms\n• Study consumer psychology\n• Create content portfolio\n• Get marketing certifications",
        roadmapYear2: "• Specialize in specific channels\n• Work on real campaigns\n• Learn analytics tools\n• Build professional network\n• Gain industry experience",
        roadmapYear3: "• Apply for marketing positions\n• Lead campaign strategies\n• Develop team leadership skills\n• Focus on ROI optimization\n• Consider specialization areas",
        iconClass: "fas fa-bullhorn",
        colorScheme: "bg-primary",
      },
    ];

    for (const career of careers) {
      await storage.createCareer(career);
    }

    console.log("Careers database initialized with sample data");
  } catch (error) {
    console.error("Error initializing careers:", error);
  }
}

// Generate career recommendations using cosine similarity
export async function generateCareerRecommendations(userId: string): Promise<void> {
  try {
    const [assessment, journalEntries, careers] = await Promise.all([
      storage.getPersonalityAssessment(userId),
      storage.getJournalEntries(userId, 50),
      storage.getAllCareers(),
    ]);

    if (!assessment || careers.length === 0) return;

    // Create user profile vector
    const userVector = createUserVector(assessment, journalEntries);
    
    // Calculate similarity scores with careers
    const recommendations = careers
      .map(career => ({
        careerId: career.id,
        matchScore: calculateCosineSimilarity(userVector, career),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // Top 10 recommendations

    await storage.saveCareerRecommendations(userId, recommendations);
  } catch (error) {
    console.error("Error generating career recommendations:", error);
  }
}

function createUserVector(assessment: PersonalityAssessment, journalEntries: JournalEntry[]) {
  // Extract interests and themes from journal entries
  const allThemes = journalEntries.flatMap(entry => entry.themes || []);
  const allSkills = journalEntries.flatMap(entry => entry.skills || []);
  
  // Count theme frequencies
  const themeFreq: { [key: string]: number } = {};
  allThemes.forEach(theme => {
    themeFreq[theme] = (themeFreq[theme] || 0) + 1;
  });
  
  // Count skill frequencies
  const skillFreq: { [key: string]: number } = {};
  allSkills.forEach(skill => {
    skillFreq[skill] = (skillFreq[skill] || 0) + 1;
  });

  return {
    personality: {
      openness: assessment.openness,
      conscientiousness: assessment.conscientiousness,
      extraversion: assessment.extraversion,
      agreeableness: assessment.agreeableness,
      neuroticism: assessment.neuroticism,
    },
    interests: themeFreq,
    skills: skillFreq,
  };
}

function calculateCosineSimilarity(userVector: any, career: Career): number {
  let dotProduct = 0;
  let userMagnitude = 0;
  let careerMagnitude = 0;

  // Personality similarity (weighted heavily)
  const personalityWeight = 0.6;
  if (career.personalityVector) {
    const personalityKeys = Object.keys(career.personalityVector) as Array<keyof typeof career.personalityVector>;
    
    for (const key of personalityKeys) {
      const userVal = userVector.personality[key] || 0;
      const careerVal = career.personalityVector[key] || 0;
      
      dotProduct += userVal * careerVal * personalityWeight;
      userMagnitude += Math.pow(userVal * personalityWeight, 2);
      careerMagnitude += Math.pow(careerVal * personalityWeight, 2);
    }
  }

  // Interest similarity
  const interestWeight = 0.3;
  const careerInterests = career.interests || [];
  for (const interest of careerInterests) {
    const totalInterests = Object.values(userVector.interests).reduce((a, b) => (a as number) + (b as number), 0) as number;
    const userVal = (userVector.interests[interest] || 0) / Math.max(totalInterests, 1);
    const careerVal = 1; // Career has this interest
    
    dotProduct += userVal * careerVal * interestWeight;
    userMagnitude += Math.pow(userVal * interestWeight, 2);
    careerMagnitude += Math.pow(careerVal * interestWeight, 2);
  }

  // Skill similarity
  const skillWeight = 0.1;
  const careerSkills = career.skills || [];
  for (const skill of careerSkills) {
    const normalizedSkill = skill.toLowerCase().replace(/[^a-z]/g, '_');
    const totalSkills = Object.values(userVector.skills).reduce((a, b) => (a as number) + (b as number), 0) as number;
    const userVal = (userVector.skills[normalizedSkill] || 0) / Math.max(totalSkills, 1);
    const careerVal = 1; // Career requires this skill
    
    dotProduct += userVal * careerVal * skillWeight;
    userMagnitude += Math.pow(userVal * skillWeight, 2);
    careerMagnitude += Math.pow(careerVal * skillWeight, 2);
  }

  const magnitude = Math.sqrt(userMagnitude) * Math.sqrt(careerMagnitude);
  return magnitude > 0 ? Math.min(dotProduct / magnitude, 1) : 0;
}
