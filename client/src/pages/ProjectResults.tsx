import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import { generateProjects } from '../services/api';
import { Clock, ChevronRight, Loader2, Edit3, AlertCircle, Sparkles } from 'lucide-react';
import type { StudentProfile, ProjectIdea } from '../types';
import clsx from 'clsx';

const ProjectResults = () => {
  const navigate = useNavigate();
  const { projects, setProjects, setSelectedProject } = useProjectContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('projectmentor_student_profile');
    if (!saved) {
      navigate('/form');
      return;
    }
    
    try {
      const parsedProfile = JSON.parse(saved) as StudentProfile;
      setProfile(parsedProfile);
      
      if (projects.length === 0) {
        generate(parsedProfile);
      }
    } catch (e) {
      navigate('/form');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const generate = async (p: StudentProfile) => {
    setLoading(true);
    setError(null);
    try {
      const generated = await generateProjects(p);
      setProjects(generated);
    } catch (err: any) {
      setError(err.message || 'Failed to generate projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (project: ProjectIdea) => {
    setSelectedProject(project);
    navigate(`/project/${project.id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  if (!profile) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8 relative z-10 min-h-[60vh]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 relative">
           <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
           <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
           <Loader2 className="animate-spin text-primary opacity-0" size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground text-center tracking-tight">Curating your personalized projects</h2>
        <p className="text-muted-foreground max-w-lg text-center leading-relaxed text-lg">
          Our AI is mapping your skills ({profile.skills.slice(0, 3).join(', ')}) and constraints into practical, high-quality architectures. This usually takes 5-10 seconds.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 relative z-10 max-w-lg mx-auto">
        <div className="bg-white border border-red-200 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-xl">
          <AlertCircle className="text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Something went wrong</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
            <button
              onClick={() => navigate('/form')}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => generate(profile)}
              className="flex-1 px-4 py-3 bg-foreground text-background rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 relative z-10 py-8">
      
      {/* Profile Summary Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">
            Your Project Shortlist
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Skills</span>
              <span>{profile.skills.slice(0, 3).join(', ')}{profile.skills.length > 3 ? '...' : ''}</span>
            </div>
            {profile.interests.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Interests</span>
                <span>{profile.interests.slice(0, 2).join(', ')}{profile.interests.length > 2 ? '...' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Team & Time</span>
              <span>{profile.teamSize} people, {profile.durationWeeks} weeks</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/form')}
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors border border-slate-300 shadow-sm"
        >
          <Edit3 size={16} /> Edit Profile Constraints
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24">
           <p className="text-slate-500 text-lg">No projects found. Try generating again.</p>
           <button onClick={() => generate(profile)} className="mt-6 px-8 py-3 bg-foreground text-background rounded-full font-bold">Generate Projects</button>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div key={project.id || index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col md:flex-row">
              
              {/* Project Core Info */}
              <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-slate-500 text-lg">{project.summary}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-8 flex flex-wrap gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Skill Match</span>
                    <span className={clsx("text-sm font-bold px-3 py-1 rounded-full border inline-flex items-center justify-center", getScoreColor(project.skillMatchScore))}>
                      {project.skillMatchScore}%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Feasibility</span>
                    <span className={clsx("text-sm font-bold px-3 py-1 rounded-full border inline-flex items-center justify-center", getScoreColor(project.feasibilityScore))}>
                      {project.feasibilityScore}%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Difficulty</span>
                    <span className={clsx(
                      "text-sm font-bold px-3 py-1 rounded-full border inline-flex items-center justify-center",
                      project.difficulty === 'Easy' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                      project.difficulty === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                      'text-red-700 bg-red-50 border-red-200'
                    )}>
                      {project.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Duration</span>
                    <span className="text-sm font-bold px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 inline-flex items-center justify-center">
                      <Clock size={14} className="mr-1.5" /> {project.estimatedDurationWeeks} wks
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Fit Reasoning & CTA */}
              <div className="p-8 md:w-1/3 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-1.5 mb-3">
                    <Sparkles size={16} /> Why this fits you
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {project.fitReasoning || "This project is highly feasible given your current skill set, team size, and time constraints. It pushes you just enough to learn without being overwhelming."}
                  </p>
                </div>
                
                <button
                  onClick={() => handleSelectProject(project)}
                  className="w-full py-3 bg-white border border-slate-300 text-slate-900 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  View Blueprint
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectResults;
