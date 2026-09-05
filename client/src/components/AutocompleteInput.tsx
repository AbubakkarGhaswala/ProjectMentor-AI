import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import clsx from 'clsx';

interface AutocompleteInputProps {
  id?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
}

const AutocompleteInput = ({ id, required, value, onChange, placeholder, suggestions }: AutocompleteInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const filteredSuggestions = value.trim() 
    ? suggestions.filter(s => s.toLowerCase().includes(value.trim().toLowerCase()) && s.toLowerCase() !== value.trim().toLowerCase())
    : suggestions.slice(0, 5); // Show first 5 when empty but focused

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

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setIsFocused(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
        selectSuggestion(filteredSuggestions[activeSuggestionIndex]);
      } else {
        setIsFocused(false);
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
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        id={id}
        required={required}
        type="text"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setActiveSuggestionIndex(-1);
          setIsFocused(true);
        }}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
      />

      {showSuggestions && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto py-1">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => selectSuggestion(suggestion)}
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

export default AutocompleteInput;
