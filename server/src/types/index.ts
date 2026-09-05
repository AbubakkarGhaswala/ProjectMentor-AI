export interface StudentProfile {
  name?: string;
  degree: string;
  currentYear?: string;
  skills: string[];
  interests: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredDomain?: string;
  teamSize: number;
  durationWeeks: number;
  budget?: string;
  additionalRequirements?: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  summary: string;
  problemStatement: string;
  proposedSolution: string;
  targetUsers: string;
  innovationScore: number;
  skillMatchScore: number;
  feasibilityScore: number;
  fitReasoning: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedDurationWeeks: number;
  requiredSkills: string[];
  recommendedTechStack: string[];
  coreFeatures: string[];
  advancedFeatures: string[];
  developmentPhases: string[];
  expectedChallenges: string[];
  futureImprovements: string[];
}

export interface MentorMessage {
  role: 'user' | 'model';
  content: string;
}
