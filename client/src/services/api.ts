import axios from 'axios';
import type { StudentProfile, ProjectIdea, MentorMessage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const generateProjects = async (profile: StudentProfile): Promise<ProjectIdea[]> => {
  try {
    const response = await api.post('/generate', profile);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to generate projects. Please try again.');
  }
};

export const askMentor = async (project: ProjectIdea, profile: StudentProfile, messageHistory: MentorMessage[], userMessage: string): Promise<string> => {
  try {
    const response = await api.post('/mentor', {
      project,
      profile,
      messageHistory,
      userMessage
    });
    return response.data.reply;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to communicate with mentor. Please try again.');
  }
};

export const refineRequirements = async (rawRequirements: string, profile: StudentProfile): Promise<string> => {
  try {
    const response = await api.post('/refine-requirements', {
      rawRequirements,
      profile
    });
    return response.data.refined;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to refine requirements. Please try again.');
  }
};
