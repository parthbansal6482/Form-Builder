import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BLOCK_TYPES } from '../context/FormContext';
import { BlockType } from '../types';

interface SlashMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function SlashMenu({ onSelect, onClose, position }: SlashMenuProps) {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If menu goes off bottom, flip it to show above the trigger
      if (position.y + menuRect.height > viewportHeight) {
        setAdjustedPosition({
          x: position.x,
          y: position.y - menuRect.height - 16 // 16px buffer
        });
      } else {
        setAdjustedPosition(position);
      }
    }
  }, [position]);

  const filtered = useMemo(() => 
    BLOCK_TYPES.filter(b => b.label.toLowerCase().includes(search.toLowerCase())),
  [search]);

  const categories = useMemo(() => {
    const cats: Record<string, BlockType[]> = {
      'Basic Fields': ['short_text', 'long_text', 'email', 'number', 'phone', 'url', 'date'],
      'Choices': ['multiple_choice', 'checkbox', 'dropdown'],
      'Advanced': ['rating'],
      'Layout': ['heading', 'paragraph']
    };
    
    return Object.entries(cats).map(([name, types]) => ({
      name,
      items: filtered.filter(item => types.includes(item.type))
    })).filter(cat => cat.items.length > 0);
  }, [filtered]);

  // Flattened items for keyboard navigation
  const flatItems = useMemo(() => categories.flatMap(cat => cat.items), [categories]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => (i + 1) % flatItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => (i - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[activeIndex]) {
          onSelect(flatItems[activeIndex].type);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flatItems, activeIndex, onSelect, onClose]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.slash-menu-container')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  let globalIdx = 0;

  return (
    <div 
      ref={menuRef}
      className="slash-menu-container fixed bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] flex flex-col z-[100] w-[320px] overflow-hidden backdrop-blur-md bg-opacity-95" 
      style={{ top: adjustedPosition.y, left: adjustedPosition.x }}
    >
      <div className="px-3 py-2 border-b border-surface-variant bg-surface-container-low/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input 
            ref={inputRef}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search blocks..."
            className="bg-transparent border-none outline-none focus:ring-0 w-full text-body-md font-body-md text-on-surface placeholder-on-surface-variant"
          />
        </div>
      </div>
      
      <div className="flex flex-col max-h-[360px] overflow-y-auto p-1.5 no-scrollbar">
        {categories.length === 0 && (
          <div className="px-3 py-6 text-center text-on-surface-variant font-body-md text-body-md italic">
            No results found
          </div>
        )}
        
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col mb-2">
            <div className="px-3 py-1.5 font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-widest">
              {category.name}
            </div>
            {category.items.map((block) => {
              const isSelected = globalIdx === activeIndex;
              const currentIdx = globalIdx;
              globalIdx++;
              
              return (
                <button 
                  key={block.type}
                  className={`flex items-center gap-2.5 p-1.5 rounded-xl cursor-pointer text-left w-full transition-all group ${isSelected ? 'bg-surface-container-high' : 'hover:bg-surface-container-low'}`}
                  onClick={() => onSelect(block.type)}
                  onMouseEnter={() => setActiveIndex(currentIdx)}
                >
                  <div className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-on-primary' : 'bg-surface-container border-surface-variant group-hover:border-on-surface-variant text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[16px]">{block.icon}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-body-md text-body-md font-semibold text-on-surface leading-tight truncate">{block.label}</span>
                    <span className="font-caption text-[10px] text-on-surface-variant line-clamp-1">{block.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
