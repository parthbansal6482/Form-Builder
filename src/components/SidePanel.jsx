import React, { useContext } from 'react';
import { FormContext, BLOCK_TYPES } from '../context/FormContext';

export default function SidePanel() {
  const { state, dispatch } = useContext(FormContext);
  const block = state.blocks.find(b => b.id === state.selectedId);
  
  if (!block) {
    return (
      <aside className="w-[300px] border-l border-surface-variant bg-surface-container-lowest flex flex-col flex-shrink-0 relative z-40 shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
        <div className="p-6 flex flex-col gap-1 bg-surface-container-lowest border-b border-surface-variant">
          <h2 className="font-h3 text-h3 text-on-surface">Block Settings</h2>
          <p className="font-caption text-caption text-on-surface-variant">Select a block to edit its settings</p>
        </div>
      </aside>
    );
  }

  const typeConfig = BLOCK_TYPES.find(b => b.type === block.type);

  const update = (changes) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id: block.id, changes } });
  };

  const handleOptionChange = (idx, val) => {
    const newOptions = [...block.options];
    newOptions[idx] = val;
    update({ options: newOptions });
  };

  const removeOption = (idx) => {
    const newOptions = block.options.filter((_, i) => i !== idx);
    update({ options: newOptions });
  };

  const addOption = () => {
    update({ options: [...block.options, `Option ${block.options.length + 1}`] });
  };



  return (
    <aside className="w-[300px] border-l border-surface-variant bg-surface-container-lowest flex flex-col flex-shrink-0 relative z-40 shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
      {/* Panel Header */}
      <div className="p-6 border-b border-surface-variant flex flex-col gap-1 bg-surface-container-lowest">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-on-surface">{typeConfig?.icon}</span>
          <h2 className="font-h3 text-h3 text-on-surface">{typeConfig?.label}</h2>
        </div>
        <p className="font-caption text-caption text-on-surface-variant">Configure element properties</p>
      </div>

      {/* Settings Content */}
      <div className="p-6 flex flex-col gap-8 overflow-y-auto">
            {/* Required Toggle */}
            {block.type !== 'heading' && block.type !== 'paragraph' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-body-md text-body-md font-medium text-on-surface">Required</span>
                  <button 
                    className={`w-[36px] h-[20px] rounded-full relative cursor-pointer transition-colors focus:outline-none ${block.required ? 'bg-primary' : 'bg-surface-variant'}`}
                    onClick={() => update({ required: !block.required })}
                  >
                    <div className={`w-3.5 h-3.5 bg-surface-container-lowest rounded-full absolute top-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-transform ${block.required ? 'right-[3px]' : 'left-[3px]'}`}></div>
                  </button>
                </div>
                <div className="w-full h-px bg-surface-variant"></div>
              </>
            )}

            {/* Field Label */}
            <div className="flex flex-col gap-2.5">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Field Label</label>
              <input 
                className="border border-surface-variant rounded-lg px-3 py-2 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md bg-surface-container-lowest text-on-surface shadow-sm" 
                type="text" 
                value={block.label}
                onChange={e => update({ label: e.target.value })}
              />
            </div>

            {/* Placeholder */}
            {block.type !== 'heading' && block.type !== 'paragraph' && block.type !== 'multiple_choice' && block.type !== 'checkbox' && block.type !== 'rating' && block.type !== 'date' && (
              <div className="flex flex-col gap-2.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Placeholder / Help Text</label>
                <input 
                  className="border border-surface-variant rounded-lg px-3 py-2 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant shadow-sm" 
                  type="text" 
                  value={block.placeholder || ''}
                  onChange={e => update({ placeholder: e.target.value })}
                  placeholder="Add a hint..."
                />
              </div>
            )}

            {/* Rows (for long text) */}
            {block.type === 'long_text' && (
              <div className="flex flex-col gap-2.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Rows</label>
                <input 
                  type="number"
                  min={2}
                  max={10}
                  className="border border-surface-variant rounded-lg px-3 py-2 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md bg-surface-container-lowest text-on-surface shadow-sm"
                  value={block.rows || 3}
                  onChange={e => update({ rows: parseInt(e.target.value) || 3 })}
                />
              </div>
            )}

            {/* Options (for multiple choice/dropdown) */}
            {(block.type === 'multiple_choice' || block.type === 'dropdown') && (
              <div className="flex flex-col gap-2.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Options</label>
                <div className="flex flex-col gap-2">
                  {block.options.map((opt, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', i.toString())}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                        if (!isNaN(fromIdx) && fromIdx !== i) {
                          const newOptions = [...block.options];
                          const [moved] = newOptions.splice(fromIdx, 1);
                          newOptions.splice(i, 0, moved);
                          update({ options: newOptions });
                        }
                      }}
                    >
                      <div className="cursor-grab text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
                      </div>
                      <input 
                        className="border border-surface-variant rounded-lg px-3 py-2 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md bg-surface-container-lowest text-on-surface shadow-sm"
                        value={opt}
                        onChange={e => handleOptionChange(i, e.target.value)}
                      />
                      <button 
                        className="text-on-surface-variant hover:text-error" 
                        onClick={() => removeOption(i)}
                        disabled={block.options.length <= 1}
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                  <button 
                    className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-body-md text-body-md mt-2" 
                    onClick={addOption}
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span> Add option
                  </button>
                </div>
              </div>
            )}
        {/* Settings Content Ends */}

      </div>
    </aside>
  );
}
