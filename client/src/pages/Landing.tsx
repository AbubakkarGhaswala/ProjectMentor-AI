import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24 space-y-32">
      {/* Hero Section */}
      <section className="max-w-4xl text-left space-y-8">
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
          AI Project Mentor For Students
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1]">
          Turn Your Skills Into <br className="hidden md:block"/> 
          a <span className="text-primary">Meaningful</span> Final-Year Project.
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          ProjectMentor AI turns your skills, interests, constraints, and timeline into practical project ideas — then helps you build one step-by-step.
        </p>
        
        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <button
            onClick={() => navigate('/form?mode=new')}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium text-lg hover:bg-slate-800 hover:scale-[1.02] transition-all duration-300 focus:ring-4 focus:ring-slate-200 shadow-md"
          >
            Create My Project Profile
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="#how-it-works" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center justify-center px-8 py-4 bg-transparent text-foreground font-medium text-lg hover:text-primary transition-colors"
          >
            See How It Works
            <ArrowRight size={18} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </a>
        </div>
      </section>

      {/* Product Preview */}
      <section className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
        <div className="h-10 bg-slate-50 border-b border-border flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
        </div>
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 inline-block uppercase tracking-wider">Project Recommendation</span>
            <h3 className="text-3xl font-bold text-foreground mb-4">AI-Assisted Educational Health Dashboard</h3>
            <p className="text-muted-foreground mb-6">A lightweight, web-based prototype designed for a 2-person team leveraging a Python AI backend and a React frontend within an 8-week timeline.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="text-primary" size={18}/> <span className="font-bold">95%</span> Skill Match (React, Python)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="text-primary" size={18}/> <span className="font-bold">High</span> Feasibility (8 Weeks, Zero Budget)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="text-primary" size={18}/> <span className="font-bold">Clear</span> Team Division (Frontend / Backend)
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner relative flex flex-col justify-end h-full min-h-[280px]">
             <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-bold text-slate-500 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> AI Mentor
             </div>
             
             <div className="space-y-4 w-full">
               <div className="flex justify-end">
                 <p className="text-sm text-foreground bg-white px-4 py-3 rounded-2xl rounded-tr-none border border-slate-200 shadow-sm max-w-[85%]">
                   How should we divide the work between two people?
                 </p>
               </div>
               <div className="flex justify-start">
                 <p className="text-sm text-primary-foreground bg-primary px-4 py-3 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] leading-relaxed">
                   Based on your constraints, Person A should handle the React frontend and UI, while Person B builds the Python API. Focus on the core patient data dashboard first before adding AI features.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section id="how-it-works" className="space-y-24 scroll-mt-32">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold text-foreground mb-4">How ProjectMentor Works</h2>
          <p className="text-xl text-muted-foreground">A guided journey from blank page to a finished, credible final-year project.</p>
        </div>

        <div className="space-y-32">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-12 md:items-center">
            <div className="md:w-1/2 space-y-6">
              <span className="text-5xl font-light text-slate-300">01</span>
              <h3 className="text-3xl font-bold text-foreground">Build Your Profile</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tell us what you know, what interests you, and what you can realistically build. We consider your team size, available weeks, and budget.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-[4/3] sm:aspect-video bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden group">
                 <img src="/assets/step1.jpg" alt="Student working on project profile" className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105" />
                 <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:items-center">
            <div className="md:w-1/2 space-y-6">
              <span className="text-5xl font-light text-slate-300">02</span>
              <h3 className="text-3xl font-bold text-foreground">Get 3 Personalized Ideas</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Gemini generates practical ideas based strictly on your actual skills and constraints. Every idea comes with a concrete explanation of why it fits you perfectly.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-[4/3] sm:aspect-video bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden group">
                 <img src="/assets/step2.jpg" alt="Refining project requirements with AI" className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105" />
                 <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-12 md:items-center">
            <div className="md:w-1/2 space-y-6">
              <span className="text-5xl font-light text-slate-300">03</span>
              <h3 className="text-3xl font-bold text-foreground">Turn One Into a Plan</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore features, architecture, technology, roadmap, challenges, and improvements in a structured, actionable project blueprint.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-[4/3] sm:aspect-video bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden group">
                 <img src="/assets/step3.jpg" alt="Personalized project recommendations" className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105" />
                 <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:items-center">
            <div className="md:w-1/2 space-y-6">
              <span className="text-5xl font-light text-slate-300">04</span>
              <h3 className="text-3xl font-bold text-foreground">Ask Your AI Mentor</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Get contextual guidance while staying within your project's scope. Your mentor understands your skills, timeframe, and project goals.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-[4/3] sm:aspect-video bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden group">
                 <img src="/assets/step4.jpg" alt="Developer building project with roadmap" className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105" />
                 <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 border-t border-border scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Student Success</h2>
          <p className="text-lg text-muted-foreground">Everything you need to confidently choose and execute your final project.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xl font-bold mb-3">Hyper-Personalized</h4>
            <p className="text-muted-foreground leading-relaxed">No generic templates. Every idea is grounded strictly in your team's skills, time, and constraints.</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xl font-bold mb-3">Actionable Blueprints</h4>
            <p className="text-muted-foreground leading-relaxed">Instantly generate a structured roadmap, technical stack, and core feature list to start building immediately.</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xl font-bold mb-3">Contextual Mentor</h4>
            <p className="text-muted-foreground leading-relaxed">An AI mentor that stays within your project scope, preventing feature creep and keeping you on track.</p>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="text-center py-24 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to start building?</h2>
          <p className="text-slate-300 text-lg mb-10">Stop searching for ideas and start executing on a project that matches your exact skills.</p>
          <button
            onClick={() => navigate('/form?mode=new')}
            className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-emerald-500 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-primary/20"
          >
            Create My Project Profile
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 pb-6 border-t border-border mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">P</span>
          </div>
          <span className="font-bold tracking-tight text-foreground">ProjectMentor AI</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
