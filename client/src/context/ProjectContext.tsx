import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ProjectIdea } from '../types';

interface ProjectContextType {
  projects: ProjectIdea[];
  setProjects: (projects: ProjectIdea[]) => void;
  selectedProject: ProjectIdea | null;
  setSelectedProject: (project: ProjectIdea | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);

  return (
    <ProjectContext.Provider value={{ projects, setProjects, selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
