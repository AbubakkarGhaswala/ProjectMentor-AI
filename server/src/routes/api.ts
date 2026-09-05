import { Router } from 'express';
import { generateProjects, askMentor, refineRequirements, TransientGeminiError } from '../services/gemini';
import { StudentProfile, ProjectIdea, MentorMessage } from '../types';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const profile = req.body as StudentProfile;
    // Basic validation
    if (!profile || !profile.degree || !profile.skills || profile.skills.length === 0) {
       res.status(400).json({ error: 'Invalid profile data provided. Degree and skills are required.' });
       return;
    }
    
    const projects = await generateProjects(profile);
    res.json(projects);
  } catch (error: any) {
    if (error instanceof TransientGeminiError) {
      res.status(503).json({ error: error.message });
      return;
    }
    console.error('Error generating projects:', error.message || error);
    // Return a user-friendly error to the client, avoid exposing the stack trace
    res.status(500).json({ error: 'We could not generate your project ideas right now. Please try again.' });
  }
});

router.post('/mentor', async (req, res) => {
  try {
    const { project, profile, messageHistory, userMessage } = req.body as { 
      project: ProjectIdea, 
      profile: StudentProfile,
      messageHistory: MentorMessage[], 
      userMessage: string 
    };
    
    if (!project || !profile || !userMessage) {
      res.status(400).json({ error: 'Project, profile, and user message are required.' });
      return;
    }

    const reply = await askMentor(project, profile, messageHistory || [], userMessage);
    res.json({ reply });
  } catch (error: any) {
    if (error instanceof TransientGeminiError) {
      res.status(503).json({ error: error.message });
      return;
    }
    console.error('Error in AI Mentor:', error.message || error);
    res.status(500).json({ error: 'The AI Mentor is currently unavailable. Please try again.' });
  }
});

router.post('/refine-requirements', async (req, res) => {
  try {
    const { rawRequirements, profile } = req.body as { rawRequirements: string, profile: StudentProfile };
    
    if (!rawRequirements || !profile) {
      res.status(400).json({ error: 'Requirements and profile context are required.' });
      return;
    }

    const refined = await refineRequirements(rawRequirements, profile);
    res.json({ refined });
  } catch (error: any) {
    if (error instanceof TransientGeminiError) {
      res.status(503).json({ error: error.message });
      return;
    }
    console.error('Error refining requirements:', error.message || error);
    res.status(500).json({ error: 'Could not refine requirements right now.' });
  }
});

export default router;
