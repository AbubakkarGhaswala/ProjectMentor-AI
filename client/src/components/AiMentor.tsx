import { useState, useEffect, useRef } from 'react';
import type { MentorMessage, StudentProfile } from '../types';
import { askMentor } from '../services/api';
import { Send, Bot, User, Loader2, AlertCircle, Maximize2, Minimize2, Copy, Check, X, FastForward } from 'lucide-react';
import clsx from 'clsx';
import { useProjectContext } from '../context/ProjectContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AiMentor = () => {
  const { selectedProject } = useProjectContext();
  const [messages, setMessages] = useState<MentorMessage[]>([
    { role: 'model', content: `Hi! I'm your AI Mentor for "${selectedProject?.title}". How can I help you scope, plan, or build this project?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [fullPendingContent, setFullPendingContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamIntervalRef = useRef<number | null>(null);

  const getProfile = (): StudentProfile | null => {
    try {
      const saved = localStorage.getItem('projectmentor_student_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, isExpanded, streamedContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && inputRef.current && !isStreaming) {
      inputRef.current.focus();
    }
  }, [isExpanded, isStreaming]);

  // Clean Markdown function
  const cleanMarkdownForCopy = (markdown: string) => {
    let text = markdown;
    // Remove headings
    text = text.replace(/^#{1,6}\s+/gm, '');
    // Remove bold/italic
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');
    // Remove backticks (inline and blocks)
    text = text.replace(/`{3}[\s\S]*?`{3}/g, (match) => match.replace(/`{3}.*\n/, '').replace(/`{3}/, ''));
    text = text.replace(/`(.+?)`/g, '$1');
    return text;
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      const cleanText = cleanMarkdownForCopy(text);
      await navigator.clipboard.writeText(cleanText);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Streaming logic
  useEffect(() => {
    if (isStreaming && fullPendingContent) {
      let index = 0;
      const chunks = fullPendingContent.split(/(\s+)/); // split by whitespace keeping whitespace
      
      streamIntervalRef.current = window.setInterval(() => {
        if (index < chunks.length) {
          setStreamedContent(prev => prev + (chunks[index] || ''));
          index++;
        } else {
          finishStreaming();
        }
      }, 30); // ~30ms per word/chunk for a fast but readable feel

      return () => {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
      };
    }
  }, [isStreaming, fullPendingContent]);

  const finishStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
    setIsStreaming(false);
    setMessages(prev => [...prev, { role: 'model', content: fullPendingContent }]);
    setStreamedContent('');
    setFullPendingContent('');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleSkip = () => {
    if (isStreaming) {
      finishStreaming();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedProject || loading || isStreaming) return;

    const profile = getProfile();
    if (!profile) {
      setError('Student profile not found. Please complete your profile first.');
      return;
    }

    const userMsg: MentorMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const historyForApi = messages.slice(1); // Exclude the initial greeting
      const replyText = await askMentor(selectedProject, profile, historyForApi, userMsg.content);
      
      setLoading(false);
      setFullPendingContent(replyText);
      setStreamedContent('');
      setIsStreaming(true);
      
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
      setLoading(false);
    }
  };

  if (!selectedProject) return null;

  const renderMentorInterface = (isModal = false) => (
    <div className={clsx(
      "flex flex-col bg-white overflow-hidden transition-all duration-300",
      isModal ? "w-full h-full rounded-none" : "h-[650px] rounded-2xl shadow-sm border border-slate-200"
    )}>
      {/* Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex justify-between items-center shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <Bot size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 truncate">Project Mentor AI</h3>
            <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[200px] sm:max-w-md">Context: {selectedProject.title}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title={isExpanded ? "Collapse" : "Expand"}
          aria-label={isExpanded ? "Collapse Mentor Workspace" : "Expand Mentor Workspace"}
        >
          {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
      
      {/* Messages */}
      <div className={clsx("flex-1 overflow-y-auto bg-slate-50/50", isModal ? "p-6 md:p-12" : "p-4 sm:p-6")}>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={clsx(
              "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out", 
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "group relative"
            )}>
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === 'user' ? "bg-slate-200 text-slate-700" : "bg-primary text-primary-foreground shadow-sm"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={clsx(
                "rounded-2xl text-sm leading-relaxed shadow-sm relative transition-all",
                msg.role === 'user' 
                  ? "bg-slate-800 text-white rounded-tr-sm p-4 whitespace-pre-wrap max-w-[85%]" 
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm p-5 w-full sm:max-w-[85%]"
              )}>
                {msg.role === 'model' && (
                  <button
                    onClick={() => copyToClipboard(msg.content, idx)}
                    className={clsx(
                      "absolute top-3 right-3 p-1.5 rounded-md border transition-all duration-200",
                      copiedIndex === idx 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 opacity-100" 
                        : "bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100"
                    )}
                    aria-label="Copy response"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}

                {msg.role === 'model' ? (
                  <div className="markdown-body text-sm overflow-x-auto pr-8">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-slate-900" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2 text-slate-900" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold mt-3 mb-2 text-slate-900" {...props} />,
                        p: ({node, ...props}) => <p className="mb-3 last:mb-0 text-slate-700 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-700 marker:text-slate-400" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-700 marker:text-slate-400" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) => {
                          return inline ? (
                            <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-slate-800 text-slate-50 p-4 rounded-lg overflow-x-auto my-3 text-xs font-mono shadow-inner border border-slate-900">
                              <code {...props}>{children}</code>
                            </pre>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {/* Streaming Message State */}
          {isStreaming && (
            <div className="flex gap-3 group relative animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-primary text-primary-foreground shadow-sm">
                <Bot size={16} />
              </div>
              <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm p-5 w-full sm:max-w-[85%] shadow-sm relative">
                <button
                  onClick={handleSkip}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors border border-transparent hover:border-slate-200"
                  title="Skip to full response"
                >
                  <FastForward size={14} /> Skip
                </button>
                <div className="markdown-body text-sm pr-16 opacity-90">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-slate-900" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2 text-slate-900" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold mt-3 mb-2 text-slate-900" {...props} />,
                        p: ({node, ...props}) => <p className="mb-3 last:mb-0 text-slate-700 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-700 marker:text-slate-400" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-700 marker:text-slate-400" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) => {
                          return inline ? (
                            <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-slate-800 text-slate-50 p-4 rounded-lg overflow-x-auto my-3 text-xs font-mono shadow-inner border border-slate-900">
                              <code {...props}>{children}</code>
                            </pre>
                          );
                        }
                      }}
                    >
                      {streamedContent}
                    </ReactMarkdown>
                    <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse align-middle"></span>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-primary text-primary-foreground shadow-sm">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-sm flex items-center gap-3 shadow-sm">
                <Loader2 className="animate-spin text-primary" size={16} />
                <span className="text-sm font-medium text-slate-500">Thinking...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center my-4 animate-in fade-in duration-300">
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg flex items-center gap-2 max-w-full shadow-sm">
                <AlertCircle size={14} className="shrink-0" />
                <span className="truncate">{error}</span>
                <button onClick={handleSend} className="px-3 py-1 bg-white border border-red-200 hover:bg-red-100 rounded-md font-bold ml-2 shrink-0 transition-colors">Retry</button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
      {/* Input */}
      <div className={clsx("bg-white border-t border-slate-200 shrink-0 sticky bottom-0 z-10", isModal ? "p-6 md:p-8" : "p-4")}>
        <div className="max-w-4xl mx-auto flex gap-2 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isStreaming ? "Wait for response..." : "Ask your mentor anything..."}
            disabled={loading || isStreaming}
            className="flex-1 pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={loading || isStreaming || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-foreground text-background rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            aria-label="Send message"
          >
            <Send size={18} className={clsx(input.trim() && !loading && !isStreaming ? "translate-x-0.5" : "")} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Standard Compact View */}
      <div className={clsx("transition-opacity duration-300", isExpanded ? "opacity-0 invisible h-[650px] overflow-hidden absolute" : "opacity-100 visible h-auto relative")}>
        {renderMentorInterface()}
      </div>

      {/* Expanded Modal Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
          <div 
            className="bg-white w-full h-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentor-modal-title"
          >
            {renderMentorInterface(true)}
            
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 md:hidden bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 z-50 shadow-sm"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiMentor;
