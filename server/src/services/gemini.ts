import { GoogleGenAI } from '@google/genai';
import type { StudentProfile, ProjectIdea, MentorMessage } from '../types';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  // Officially initialize with API key
  return new GoogleGenAI({ apiKey });
};

export class TransientGeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransientGeminiError';
  }
}

const isTransientError = (error: any): boolean => {
  const msg = (error?.message || '').toLowerCase();
  const status = error?.status || error?.response?.status;
  
  return (
    status === 503 ||
    status === 429 ||
    msg.includes('unavailable') ||
    msg.includes('temporarily') ||
    msg.includes('high demand') ||
    msg.includes('overloaded')
  );
};

const withRetry = async <T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (!isTransientError(error) || attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 0s, 1s, 2s (approx)
      const delayMs = attempt === 1 ? 0 : Math.pow(2, attempt - 2) * 1000 + Math.random() * 500;
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
};

export const generateProjects = async (profile: StudentProfile): Promise<ProjectIdea[]> => {
  const prompt = `You are an expert technical mentor for final year university students.
Generate exactly 3 practical, production-ready final year project ideas based on the following student profile:

Degree/Specialization: ${profile.degree}
Skills: ${profile.skills.join(', ')}
Interests: ${profile.interests.join(', ')}
Experience Level: ${profile.experienceLevel}
Preferred Domain: ${profile.preferredDomain || 'Any'}
Team Size: ${profile.teamSize}
Available Duration: ${profile.durationWeeks} weeks
Budget/Resources: ${profile.budget || 'Minimal'}
Additional Requirements: ${profile.additionalRequirements || 'None'}

CRITICAL DOMAIN RULES:
For projects in healthcare, finance, legal, or safety-critical domains, frame them as educational/student prototypes. Do NOT frame them as diagnostic, production-level, or authoritative systems. Example: use "AI-assisted educational prototype for organizing medical information" instead of "AI diagnoses patients". Ensure scope is achievable for the stated team size and duration.

Return the response STRICTLY as a JSON array containing exactly 3 project objects.
Do not include markdown blocks like \`\`\`json or any other text before or after the JSON array.
Each object in the array MUST follow this exact schema:
{
  "id": "A unique slug, e.g. project-123",
  "title": "String",
  "summary": "String (one-line summary)",
  "problemStatement": "String",
  "proposedSolution": "String",
  "targetUsers": "String",
  "innovationScore": Number (0-100),
  "skillMatchScore": Number (0-100),
  "feasibilityScore": Number (0-100),
  "fitReasoning": "String. Concrete explanation of why this fits the student based heavily on their specific skills, interests, experience, team size, duration, and budget. Avoid generic statements.",
  "difficulty": "Easy" | "Medium" | "Hard",
  "estimatedDurationWeeks": Number,
  "requiredSkills": ["String", ...],
  "recommendedTechStack": ["String", ...],
  "coreFeatures": ["String", ...],
  "advancedFeatures": ["String", ...],
  "developmentPhases": ["String", ...],
  "expectedChallenges": ["String", ...],
  "futureImprovements": ["String", ...]
}`;

  try {
    const ai = getAiClient();
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    }));

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }
    
    // Parse the JSON array
    const projects: ProjectIdea[] = JSON.parse(text);
    if (!Array.isArray(projects) || projects.length !== 3) {
      throw new Error('Invalid response structure from Gemini');
    }
    return projects;
  } catch (error: any) {
    if (isTransientError(error)) {
      throw new TransientGeminiError('Gemini is temporarily busy. Please try again in a moment.');
    }
    console.error('Error in generateProjects:', error);
    throw error;
  }
};

export const refineRequirements = async (rawRequirements: string, profile: StudentProfile): Promise<string> => {
  const prompt = `You are an expert technical product manager assisting a student.
The student has drafted some rough additional requirements for their final-year project:
"${rawRequirements}"

Here is the student's profile context:
Skills: ${profile.skills.join(', ')}
Interests: ${profile.interests.join(', ')}
Team Size: ${profile.teamSize}
Duration: ${profile.durationWeeks} weeks
Budget: ${profile.budget || 'None specified'}

Refine the student's rough requirements into a clear, concise, and implementation-oriented paragraph. 
- Do NOT invent new requirements.
- Preserve their original intent.
- Ensure the refinement respects their team size, budget, and duration constraints.
- Make it sound professional and actionable.
Return ONLY the refined text, nothing else.`;

  try {
    const ai = getAiClient();
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    }));
    
    return response.text?.trim() || rawRequirements;
  } catch (error: any) {
    if (isTransientError(error)) {
      throw new TransientGeminiError('Gemini is temporarily busy. Please try again in a moment.');
    }
    console.error('Error in refineRequirements:', error);
    throw error;
  }
};

export const askMentor = async (project: ProjectIdea, profile: StudentProfile, messageHistory: MentorMessage[], userMessage: string): Promise<string> => {
  const systemInstruction = `You are an expert AI Mentor helping a final-year student build their project.

PROJECT CONTEXT:
Title: ${project.title}
Summary: ${project.summary}
Tech Stack: ${project.recommendedTechStack.join(', ')}

STUDENT PROFILE CONTEXT:
Experience Level: ${profile.experienceLevel}
Skills: ${profile.skills.join(', ')}
Team Size: ${profile.teamSize}
Duration: ${profile.durationWeeks} weeks
Budget: ${profile.budget || 'Minimal'}

GUIDELINES FOR YOUR RESPONSES:
- Provide concise and useful answers. Default target: 150-350 words for normal questions.
- Avoid repeating the entire project blueprint.
- Prioritize practical execution and avoid unnecessary complexity.
- Your recommendations MUST align with the student's skills, team size, timeline, and budget.

FORMATTING TEMPLATES (use when applicable):
For scope questions:
BUILD NOW
- [Item 1]
- [Item 2]

POSTPONE
- [Item 1]

For team questions:
MEMBER A
- [Tasks]

MEMBER B
- [Tasks]

For timeline questions:
WEEK 1-2
- [Tasks]

WEEK 3-4
- [Tasks]

- For most questions, start with a direct recommendation, then provide 2-5 concrete bullet points.
- Use markdown headings (##) and bullets only when they improve readability.
- DO NOT invent new project requirements.
- Distinguish between CORE (build now) and FUTURE (postpone) for scope questions.
- Keep answers concise and structured. DO NOT output long essays.`;

  const contents = messageHistory.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const ai = getAiClient();
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction,
      }
    }));
    
    return response.text || 'I am unable to provide a response at this time.';
  } catch (error: any) {
    if (isTransientError(error)) {
      throw new TransientGeminiError('Gemini is temporarily busy. Please try again in a moment.');
    }
    console.error('Error in askMentor:', error);
    throw error;
  }
};
