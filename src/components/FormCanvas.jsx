import React, { useContext, useState } from 'react';
import { FormContext } from '../context/FormContext';
import BlockRow from './BlockRow';
import SlashMenu from './SlashMenu';

export default function FormCanvas() {
  const { state, dispatch } = useContext(FormContext);
  const [slashMenu, setSlashMenu] = useState(null);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState([]);

  const isPreview = state.activeTab === 'preview';
  const isSubmitted = state.activeTab === 'submitted';

  const handleGhostKey = (e) => {
    if (e.key === '/') {
      e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      setSlashMenu({ x: rect.left, y: rect.bottom + 8, afterId: null });
    }
  };

  const handleInsert = (type) => {
    if (!slashMenu) return;
    dispatch({ type: 'ADD_BLOCK', payload: { type, afterId: slashMenu.afterId } });
    setSlashMenu(null);
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    state.blocks.forEach(block => {
      const val = responses[block.id];
      const isNotEmpty = val && (Array.isArray(val) ? val.length > 0 : val.toString().trim() !== '');

      // 1. Required Check
      if (block.required && !isNotEmpty) {
        newErrors[block.id] = 'This field is required';
        return;
      }

      // 2. Format Check (only if not empty)
      if (isNotEmpty) {
        if (block.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) newErrors[block.id] = 'Please enter a valid email address';
        } else if (block.type === 'url') {
          try { new URL(val); } catch (_) { newErrors[block.id] = 'Please enter a valid URL (including https://)'; }
        } else if (block.type === 'phone') {
          const phoneRegex = /^\+?[\d\s-]{7,20}$/;
          if (!phoneRegex.test(val)) newErrors[block.id] = 'Please enter a valid phone number';
        } else if (block.type === 'number') {
          if (isNaN(val)) newErrors[block.id] = 'Please enter a valid number';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      alert(`Validation Error: ${firstError}`);
      return;
    }

    setErrors({});
    dispatch({ type: 'SET_TAB', payload: 'submitted' });
  };

  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (isPreview || isSubmitted) return;
      
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || 
                       document.activeElement?.isContentEditable;
                       
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        const ghostRow = document.querySelector('.formly-ghost-row-trigger');
        if (ghostRow) {
          const rect = ghostRow.getBoundingClientRect();
          setSlashMenu({ x: rect.left, y: rect.bottom + 8, afterId: null });
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isPreview, isSubmitted]);

  if (isSubmitted) {
    return (
      <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative flex flex-col items-center justify-center p-8">
        <span className="material-symbols-outlined text-[48px] text-primary mb-4">check_circle</span>
        <div className="font-h2 text-h2 text-on-surface mb-6">Response submitted</div>
        <button 
          className="bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg px-6 py-2.5 font-body-md text-body-md font-medium transition-colors"
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'build' })}
        >
          Back to build
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative no-scrollbar" onClick={() => !isPreview && dispatch({ type: 'SELECT_BLOCK', payload: null })}>
      <div className={`mx-auto pt-xl pb-2xl px-lg flex flex-col relative ${isPreview ? 'max-w-[640px]' : 'max-w-[760px]'}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Form Header */}
        <div className="flex flex-col mb-lg ml-md">
          <input
            className="font-display text-display text-on-surface bg-transparent border-none p-0 focus:ring-0 placeholder-on-surface-variant w-full outline-none"
            placeholder="Form Title"
            type="text"
            value={state.title}
            onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
            readOnly={isPreview}
          />
          <input
            className="font-body-lg text-body-lg text-on-surface-variant bg-transparent border-none p-0 mt-2 focus:ring-0 w-full outline-none"
            placeholder="Add a description..."
            type="text"
            value={state.description}
            onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
            readOnly={isPreview}
          />
        </div>

        {/* Block List */}
        <div className="flex flex-col gap-4">
          {state.blocks.length === 0 && !isPreview && (
            <div className="text-center text-on-surface-variant py-10 font-body-md text-body-md">
              Your form is empty. Type / to add your first block.
            </div>
          )}
          {state.blocks.map((block) => (
            <BlockRow 
              key={block.id} 
              block={block} 
              value={responses[block.id]}
              onChange={(val) => setResponses({ ...responses, [block.id]: val })}
              error={errors[block.id]}
            />
          ))}

          {!isPreview && !slashMenu && (
            <div 
              className="formly-ghost-row-trigger text-on-surface-variant font-body-md text-body-md cursor-text mt-4 ml-md w-max outline-none hover:text-on-surface transition-colors"
              tabIndex={0}
              onKeyDown={handleGhostKey}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setSlashMenu({ x: rect.left, y: rect.bottom + 8, afterId: null });
              }}
            >
              Type / to add a block
            </div>
          )}

          {isPreview && state.blocks.length > 0 && (
            <div className="mt-6">
              <button 
                className="bg-primary hover:bg-inverse-surface text-on-primary rounded-lg px-6 py-2.5 font-body-md text-body-md font-medium transition-colors"
                onClick={handleSubmit}
              >
                Submit &rarr;
              </button>
            </div>
          )}
        </div>
        
        {slashMenu && (
          <SlashMenu 
            position={slashMenu} 
            onSelect={handleInsert}
            onClose={() => setSlashMenu(null)}
          />
        )}
      </div>
    </main>
  );
}
