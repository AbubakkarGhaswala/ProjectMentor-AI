import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface TagInputProps {
  label: string;
  placeholder: string;
  suggestions: string[];
  tags: string[];
  onChange: (tags: string[]) => void;
  colorScheme?: 'primary' | 'secondary';
}

const TagInput = ({ label, placeholder, suggestions, tags, onChange, colorScheme = 'primary' }: TagInputProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const filteredSuggestions = input.trim() 
    ? suggestions.filter(s => s.toLowerCase().includes(input.trim().toLowerCase()) && !tags.includes(s))
    : suggestions.filter(s => !tags.includes(s)).slice(0, 5); // Show first 5 when empty but focused

  const showSuggestions = isFocused && filteredSuggestions.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && trimmed.length <= 50 && !tags.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setActiveSuggestionIndex(-1);
    setIsFocused(true); // Keep focus after adding
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
        addTag(filteredSuggestions[activeSuggestionIndex]);
      } else {
        addTag(input);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions) {
        setActiveSuggestionIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions) {
        setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
      }
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const colorClasses = colorScheme === 'primary' 
    ? {
        tag: 'bg-primary/10 border-primary/20 text-emerald-800',
        hover: 'hover:bg-primary/20 hover:text-emerald-900',
        ring: 'focus-within:ring-primary focus-within:border-primary'
      }
    : {
        tag: 'bg-secondary/10 border-secondary/20 text-violet-800',
        hover: 'hover:bg-secondary/20 hover:text-violet-900',
        ring: 'focus-within:ring-secondary focus-within:border-secondary'
      };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label} *</label>
      
      <div className={clsx(
        "min-h-[42px] p-2 bg-white border border-slate-200 rounded-lg transition-all flex flex-wrap gap-2 items-center",
        colorClasses.ring
      )}>
        {tags.map(tag => (
          <span 
            key={tag} 
            className={clsx("inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm font-medium shadow-sm transition-colors", colorClasses.tag)}
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
              className={clsx("focus:outline-none p-0.5 rounded-full", colorClasses.hover)}
              aria-label={`Remove ${tag}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setActiveSuggestionIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none text-slate-900 outline-none focus:ring-0 placeholder:text-slate-400 py-1"
        />
      </div>

      {showSuggestions && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto py-1">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => addTag(suggestion)}
              className={clsx(
                "px-4 py-2 cursor-pointer text-sm text-slate-700 transition-colors",
                index === activeSuggestionIndex ? "bg-slate-100 text-slate-900 font-medium" : "hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
