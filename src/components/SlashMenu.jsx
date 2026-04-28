import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BLOCK_TYPES } from '../context/FormContext';

export default function SlashMenu({ onSelect, onClose, position }) {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(() => 
    BLOCK_TYPES.filter(b => b.label.toLowerCase().includes(search.toLowerCase())),
  [search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => (i + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          onSelect(filtered[activeIndex].type);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, activeIndex, onSelect, onClose]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.slash-menu-container')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <div 
      className="slash-menu-container absolute bg-surface-container-lowest border border-surface-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col p-1.5 z-50 w-[260px]" 
      style={{ top: position.y, left: position.x }}
    >
      <div className="px-2.5 py-1.5 font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
        <input 
          ref={inputRef}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setActiveIndex(0);
          }}
          placeholder="Filter blocks..."
          className="bg-transparent border-none outline-none w-full text-on-surface placeholder-on-surface-variant"
        />
      </div>
      <div className="flex flex-col max-h-[300px] overflow-y-auto">
        {filtered.map((block, i) => (
          <button 
            key={block.type}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-left w-full transition-colors group ${i === activeIndex ? 'bg-surface-container-low' : 'hover:bg-surface-container-low'}`}
            onClick={() => onSelect(block.type)}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <div className={`w-8 h-8 rounded border bg-surface-container-lowest flex items-center justify-center ${i === activeIndex ? 'border-outline' : 'border-surface-variant group-hover:border-outline'}`}>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{block.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-medium text-on-surface leading-tight">{block.label}</span>
              <span className="font-caption text-caption text-on-surface-variant mt-0.5">{block.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
