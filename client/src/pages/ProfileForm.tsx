import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import { AlertCircle, User, Code2, Briefcase, ChevronRight, Wand2, Loader2, Check, X, RefreshCw } from 'lucide-react';
import type { StudentProfile } from '../types';
import TagInput from '../components/TagInput';
import AutocompleteInput from '../components/AutocompleteInput';
import { refineRequirements } from '../services/api';

const defaultProfile: StudentProfile = {
  name: '',
  degree: '',
  currentYear: '',
  skills: [],
  interests: [],
  experienceLevel: 'Intermediate',
  teamSize: 1,
  durationWeeks: 12,
  preferredDomain: '',
  additionalRequirements: ''
};

const degreeSuggestions = [
  'B.Tech Computer Science',
  'B.Tech CSE (AI/ML)',
  'B.Tech Information Technology',
  'B.Tech Data Science',
  'B.Tech Artificial Intelligence',
  'B.Tech Software Engineering',
  'BCA',
  'MCA',
  'B.Sc Computer Science',
  'B.Sc Data Science',
  'B.Sc Artificial Intelligence',
  'BE Computer Science',
  'BE Information Technology'
];

const commonSkills = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Next.js', 'Node.js', 
  'Express', 'C++', 'C#', 'Dart', 'Flutter', 'Kotlin', 'Swift', 'SQL', 'PostgreSQL', 'MySQL', 
  'MongoDB', 'Firebase', 'TensorFlow', 'PyTorch', 'OpenCV', 'Scikit-learn', 'FastAPI', 
  'Spring Boot', 'Docker', 'Git', 'HTML', 'CSS'
];

const commonInterests = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Web Development', 
  'Mobile Development', 'Cybersecurity', 'Healthcare', 'Education', 'Finance', 'Agriculture', 
  'Sustainability', 'IoT', 'Robotics', 'Computer Vision', 'NLP', 'Cloud Computing', 
  'Data Engineering', 'Blockchain'
];

const ProfileForm = () => {
  const navigate = useNavigate();
  const { setProjects } = useProjectContext();
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [error, setError] = useState<string | null>(null);

  // AI Refinement State
  const [aiRefining, setAiRefining] = useState(false);
  const [refinedText, setRefinedText] = useState<string | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const isNewMode = searchParams.get('mode') === 'new';

  useEffect(() => {
    if (isNewMode) return;
    
    try {
      const saved = localStorage.getItem('projectmentor_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile({ ...defaultProfile, ...parsed }); 
      }
    } catch (e) {
      console.warn("Failed to parse saved profile, starting fresh.");
      localStorage.removeItem('projectmentor_student_profile');
    }
  }, [isNewMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.degree || profile.skills.length === 0) {
      setError('Please provide your degree and at least one skill.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      localStorage.setItem('projectmentor_student_profile', JSON.stringify(profile));
      setProjects([]); 
      navigate('/results');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile. Please try again.');
    }
  };

  const handleRefineRequirements = async () => {
    if (!profile.additionalRequirements?.trim()) return;
    
    setAiRefining(true);
    setRefineError(null);
    try {
      const refined = await refineRequirements(profile.additionalRequirements, profile);
      setRefinedText(refined);
    } catch (err: any) {
      setRefineError(err.message || 'Failed to refine requirements.');
    } finally {
      setAiRefining(false);
    }
  };

  const applyRefinement = () => {
    if (refinedText) {
      setProfile({ ...profile, additionalRequirements: refinedText });
      setRefinedText(null);
    }
  };

  const cancelRefinement = () => {
    setRefinedText(null);
    setRefineError(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold text-foreground mb-4">Build Your Student Profile</h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          The better we understand your skills and constraints, the better your project recommendations will be.
        </p>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Missing Information</p>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-16">
        
        {/* Section 1: About You */}
        <section className="space-y-8">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <User size={16} /> About You
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="name">Name (Optional)</label>
              <input
                id="name"
                type="text"
                value={profile.name || ''}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Alex"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="degree">Degree / Specialization *</label>
              <AutocompleteInput
                id="degree"
                required
                value={profile.degree}
                onChange={(val) => setProfile({ ...profile, degree: val })}
                placeholder="e.g. B.Tech Computer Science"
                suggestions={degreeSuggestions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="currentYear">Current Year/Semester (Optional)</label>
              <input
                id="currentYear"
                type="text"
                value={profile.currentYear || ''}
                onChange={e => setProfile({ ...profile, currentYear: e.target.value })}
                placeholder="e.g. Final Year, 8th Semester"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="experience">Experience Level</label>
              <select
                id="experience"
                value={profile.experienceLevel}
                onChange={e => setProfile({ ...profile, experienceLevel: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Technical Profile */}
        <section className="space-y-8">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Code2 size={16} /> Skills & Interests
            </h3>
          </div>
          <div className="space-y-8">
            <TagInput
              label="Skills"
              placeholder="Type a skill and press Enter (e.g. React, Python)"
              suggestions={commonSkills}
              tags={profile.skills}
              onChange={skills => setProfile({ ...profile, skills })}
              colorScheme="primary"
            />
            
            <TagInput
              label="Interests (Optional)"
              placeholder="Type an interest and press Enter (e.g. AI, Finance)"
              suggestions={commonInterests}
              tags={profile.interests}
              onChange={interests => setProfile({ ...profile, interests })}
              colorScheme="secondary"
            />
          </div>
        </section>

        {/* Section 3: Constraints */}
        <section className="space-y-8">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Briefcase size={16} /> Project Constraints
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="teamSize">Team Size</label>
              <input
                id="teamSize"
                type="number"
                min="1"
                max="10"
                required
                value={profile.teamSize}
                onChange={e => setProfile({ ...profile, teamSize: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="duration">Duration (Weeks)</label>
              <input
                id="duration"
                type="number"
                min="1"
                max="52"
                required
                value={profile.durationWeeks}
                onChange={e => setProfile({ ...profile, durationWeeks: parseInt(e.target.value) || 12 })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="budget">Budget / Resources</label>
              <input
                id="budget"
                type="text"
                value={profile.budget || ''}
                onChange={e => setProfile({ ...profile, budget: e.target.value })}
                placeholder="e.g. Free Tier only"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div className="md:col-span-3 space-y-4">
              <div className="flex justify-between items-end">
                <label className="block text-sm font-medium text-slate-700" htmlFor="additional">Additional Requirements (Optional)</label>
                {!refinedText && profile.additionalRequirements && profile.additionalRequirements.trim().length > 10 && (
                  <button
                    type="button"
                    onClick={handleRefineRequirements}
                    disabled={aiRefining}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:text-emerald-700 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
                  >
                    {aiRefining ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    {aiRefining ? 'Refining...' : 'Improve with AI'}
                  </button>
                )}
              </div>
              
              <textarea
                id="additional"
                value={profile.additionalRequirements}
                onChange={e => setProfile({ ...profile, additionalRequirements: e.target.value })}
                placeholder="e.g. I want something with AI maybe healthcare but not too difficult, Python and React, low budget, and we only have 8 weeks"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all min-h-[120px] placeholder:text-slate-400 resize-y"
                disabled={aiRefining || !!refinedText}
              />
              
              {refineError && (
                <p className="text-sm text-destructive">{refineError}</p>
              )}

              {refinedText && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Wand2 size={16} /> AI Refined Suggestion:
                  </div>
                  <p className="text-slate-700 text-sm">{refinedText}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-200/50">
                    <button
                      type="button"
                      onClick={applyRefinement}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      <Check size={16} /> Use This
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfile({ ...profile, additionalRequirements: refinedText });
                        setRefinedText(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleRefineRequirements}
                      disabled={aiRefining}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                    >
                      <RefreshCw size={14} className={aiRefining ? "animate-spin" : ""} /> Try Again
                    </button>
                    <button
                      type="button"
                      onClick={cancelRefinement}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors ml-auto"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-border">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-200 shadow-xl shadow-slate-200"
          >
            Save Profile & Continue
            <ChevronRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
