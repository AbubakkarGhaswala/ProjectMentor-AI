import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import Landing from './pages/Landing';
import ProfileForm from './pages/ProfileForm';
import ProjectResults from './pages/ProjectResults';
import ProjectDetails from './pages/ProjectDetails';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">ProjectMentor AI</h1>
        </div>

        {isLandingPage && (
          <>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Home</a>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">How it works</a>
              <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
              <a href="#for-students" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">For Students</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">FAQ</a>
            </nav>

            {/* Desktop CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/form?mode=new')}
                className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:scale-105 shadow-sm"
              >
                Get Started
              </button>
              <button 
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Nav */}
      {isLandingPage && mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-border shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-base font-medium text-slate-800 py-2 border-b border-slate-100">Home</a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-base font-medium text-slate-800 py-2 border-b border-slate-100">How it works</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-base font-medium text-slate-800 py-2 border-b border-slate-100">Features</a>
          <a href="#for-students" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-800 py-2 border-b border-slate-100">For Students</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-800 py-2 border-b border-slate-100">FAQ</a>
          <button 
            onClick={() => { navigate('/form?mode=new'); setMobileMenuOpen(false); }}
            className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-full text-base font-medium hover:bg-slate-800 transition-all shadow-sm"
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <ProjectProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary flex flex-col">
          <Header />
          
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/form" element={<ProfileForm />} />
                <Route path="/results" element={<ProjectResults />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App;
