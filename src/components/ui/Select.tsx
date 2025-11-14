import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option...',
  className = '',
  name,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const baseClasses =
    'w-full rounded-lg px-4 py-2 font-primary text-base transition-all duration-200 cursor-pointer flex items-center justify-between';

  const stateClasses = error
    ? 'border-2 border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20'
    : 'border border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100';

  const disabledClasses = disabled
    ? 'bg-neutral-100 cursor-not-allowed text-neutral-500'
    : 'bg-white text-neutral-900 hover:border-primary-300';

  const combinedClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block mb-2 text-sm font-medium text-neutral-700 font-primary"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative" ref={selectRef}>
        <div
          id={selectId}
          className={combinedClasses}
          onClick={handleToggle}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${selectId}-listbox`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg overflow-hidden"
            >
              {options.length > 5 && (
                <div className="p-2 border-b border-neutral-200">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <ul
                id={`${selectId}-listbox`}
                role="listbox"
                className="max-h-60 overflow-y-auto"
                aria-label={label || 'Select options'}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={option.value === value}
                      className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                        option.value === value
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-900 hover:bg-neutral-50'
                      }`}
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-neutral-500 text-center">No options found</li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-1.5 text-sm text-red-500 font-primary"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
