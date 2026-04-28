import React, { useContext, useState } from 'react';
import { FormContext } from '../context/FormContext';
import BlockRow from './BlockRow';
import SlashMenu from './SlashMenu';

export default function FormCanvas() {
  const { state, dispatch } = useContext(FormContext);
  const [slashMenu, setSlashMenu] = useState(null);

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
    <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative" onClick={() => !isPreview && dispatch({ type: 'SELECT_BLOCK', payload: null })}>
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
            <BlockRow key={block.id} block={block} />
          ))}

          {!isPreview && (
            <div 
              className="formly-ghost-row-trigger text-on-surface-variant font-body-md text-body-md cursor-text mt-4 ml-md w-max outline-none hover:text-on-surface transition-colors"
              tabIndex={0}
              onKeyDown={handleGhostKey}
            >
              Type / to add a block
            </div>
          )}

          {isPreview && state.blocks.length > 0 && (
            <div className="mt-6">
              <button 
                className="bg-primary hover:bg-inverse-surface text-on-primary rounded-lg px-6 py-2.5 font-body-md text-body-md font-medium transition-colors"
                onClick={() => dispatch({ type: 'SET_TAB', payload: 'submitted' })}
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
