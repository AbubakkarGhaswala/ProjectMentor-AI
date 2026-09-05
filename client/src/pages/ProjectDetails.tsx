import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import AiMentor from '../components/AiMentor';
import { ArrowLeft, Clock } from 'lucide-react';
import clsx from 'clsx';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, selectedProject, setSelectedProject } = useProjectContext();

  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      const proj = projects.find(p => p.id === id || p.title === id);
      if (proj) {
        setSelectedProject(proj);
      } else {
        navigate('/results');
      }
    } else if (projects.length === 0) {
      navigate('/form');
    }
  }, [id, projects, selectedProject, navigate, setSelectedProject]);

  if (!selectedProject) {
    return <div className="text-center py-24 text-slate-500">Loading Blueprint...</div>;
  }

  const project = selectedProject;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-7xl mx-auto relative z-10 py-8">
      <button
        onClick={() => navigate('/results')}
        className="mb-8 inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back to Shortlist
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Blueprint */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Header */}
          <div className="space-y-6 border-b border-border pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">{project.title}</h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">{project.summary}</p>
            
            <div className="flex flex-wrap gap-6 pt-4">
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
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Timeline</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 inline-flex items-center justify-center">
                  <Clock size={14} className="mr-1.5" /> {project.estimatedDurationWeeks} wks
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            <section>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-3">
                <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">01</span> The Problem
              </h3>
              <p className="text-slate-800 text-lg leading-relaxed">{project.problemStatement}</p>
            </section>
            
            <section>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-3">
                <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">02</span> Proposed Solution
              </h3>
              <p className="text-slate-800 text-lg leading-relaxed">{project.proposedSolution}</p>
            </section>

            <section>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-3">
                <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">03</span> Target Users
              </h3>
              <p className="text-slate-800 text-lg leading-relaxed">{project.targetUsers}</p>
            </section>

            <section>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-3">
                <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">04</span> Tech Stack & Skills
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Recommended Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.recommendedTechStack.map(tech => (
                      <span key={tech} className="px-4 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-sm font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.requiredSkills?.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-3">
                  <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">05</span> Core Features
                </h3>
                <ul className="space-y-3">
                  {project.coreFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-3">
                  <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">06</span> Advanced Features
                </h3>
                <ul className="space-y-3">
                  {project.advancedFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-3">
                <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">07</span> Development Roadmap
              </h3>
              <div className="space-y-0 pl-4 relative">
                <div className="absolute left-6 top-2 bottom-6 w-0.5 bg-slate-200"></div>
                {project.developmentPhases.map((phase, idx) => {
                  const parts = phase.split(':');
                  const title = parts[0];
                  const desc = parts.length > 1 ? parts.slice(1).join(':') : '';
                  return (
                    <div key={idx} className="flex gap-6 relative pb-8">
                      <div className="w-5 h-5 rounded-full bg-white border-4 border-primary z-10 shrink-0 mt-1"></div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{title}</h4>
                        {desc && <p className="text-slate-600 mt-2 leading-relaxed max-w-2xl">{desc.trim()}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
              <div>
                 <h3 className="text-sm font-bold tracking-widest text-red-500 uppercase mb-4 flex items-center gap-3">
                  <span className="text-red-500 font-mono bg-red-100 px-2 py-0.5 rounded text-xs">08</span> Challenges & Risks
                </h3>
                <ul className="space-y-3">
                  {project.expectedChallenges.map((challenge, i) => (
                    <li key={i} className="text-sm text-slate-700 bg-red-50 p-4 rounded-xl border border-red-100">
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                 <h3 className="text-sm font-bold tracking-widest text-violet-500 uppercase mb-4 flex items-center gap-3">
                  <span className="text-violet-500 font-mono bg-violet-100 px-2 py-0.5 rounded text-xs">09</span> Future Polish
                </h3>
                <ul className="space-y-3">
                  {project.futureImprovements?.map((imp, i) => (
                    <li key={i} className="text-sm text-slate-700 bg-violet-50 p-4 rounded-xl border border-violet-100">
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: AI Mentor */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <AiMentor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
