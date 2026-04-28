import React, { useContext, useState } from 'react';
import { FormContext } from '../context/FormContext';

const InputPreview = ({ block, disabled, value, onChange }) => {
  switch (block.type) {
    case 'short_text':
    case 'email':
    case 'url':
    case 'phone':
    case 'number':
      return (
        <input
          type={block.type === 'short_text' ? 'text' : block.type}
          className="border border-surface-variant rounded-xl px-3 py-2.5 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md bg-transparent"
          placeholder={block.placeholder}
          disabled={disabled}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
        />
      );
    case 'long_text':
      return (
        <textarea
          className="border border-surface-variant rounded-xl px-3 py-2.5 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md min-h-[120px] resize-none bg-surface-container-lowest shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          placeholder={block.placeholder}
          rows={block.rows || 3}
          disabled={disabled}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
        />
      );
    case 'date':
      return (
        <input
          type="date"
          className="border border-surface-variant rounded-xl px-3 py-2.5 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md bg-transparent"
          disabled={disabled}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
        />
      );
    case 'multiple_choice':
      return (
        <div className="flex flex-col gap-2">
          {block.options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2">
              <input 
                type="radio" 
                name={`mc_${block.id}`} 
                className="w-4 h-4 text-primary border-surface-variant focus:ring-primary"
                disabled={disabled}
                checked={value === opt}
                onChange={() => onChange?.(opt)}
              />
              <span className="font-body-md text-body-md">{opt}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            className="w-4 h-4 text-primary border-surface-variant focus:ring-primary rounded"
            disabled={disabled}
            checked={!!value}
            onChange={e => onChange?.(e.target.checked)}
          />
          <span className="font-body-md text-body-md">{block.label}</span>
        </label>
      );
    case 'dropdown':
      return (
        <select 
          className="border border-surface-variant rounded-xl px-3 py-2.5 w-full focus:border-on-surface focus:outline-none transition-colors font-body-md text-body-md bg-transparent"
          disabled={disabled}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
        >
          <option value="" disabled>{block.placeholder || 'Select an option'}</option>
          {block.options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );
    case 'rating':
      return (
        <div className="flex gap-1 text-surface-variant">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`material-symbols-outlined ${!disabled ? 'cursor-pointer' : ''} ${value >= star ? 'text-[#ffb400]' : ''}`}
              style={{ fontVariationSettings: value >= star ? "'FILL' 1" : "'FILL' 0" }}
              onClick={() => !disabled && onChange?.(star)}
            >
              star
            </span>
          ))}
        </div>
      );
    case 'heading':
      return <div className="font-h2 text-h2 text-on-surface">{block.label}</div>;
    case 'paragraph':
      return <div className="font-body-md text-body-md text-on-surface-variant">{block.label}</div>;
    default:
      return null;
  }
};

export default function BlockRow({ block }) {
  const { state, dispatch } = useContext(FormContext);
  const isSelected = state.selectedId === block.id;
  const isPreview = state.activeTab === 'preview';
  
  const [val, setVal] = useState('');

  const handleLabelChange = (e) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id: block.id, changes: { label: e.currentTarget.textContent } } });
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', block.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (state.dragOverId !== block.id) {
      dispatch({ type: 'SET_DRAG_OVER', payload: block.id });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData('text/plain');
    if (fromId && fromId !== block.id) {
      dispatch({ type: 'REORDER_BLOCKS', payload: { fromId, toId: block.id } });
    } else {
      dispatch({ type: 'SET_DRAG_OVER', payload: null });
    }
  };

  if (isPreview) {
    const isTextOnly = block.type === 'heading' || block.type === 'paragraph';
    return (
      <div className="mb-6">
        {!isTextOnly && (
          <div className="font-body-md text-body-md font-medium text-on-surface mb-2">
            {block.label}
            {block.required && <span className="text-error ml-1">*</span>}
          </div>
        )}
        <InputPreview block={block} disabled={false} value={val} onChange={setVal} />
      </div>
    );
  }

  return (
    <React.Fragment>
      {state.dragOverId === block.id && <div className="h-0.5 bg-primary w-full my-1" />}
      <div 
        className={`group flex flex-col gap-2 p-md border rounded-xl transition-colors ${isSelected ? 'bg-surface border-surface-variant border-l-[3px] border-l-primary rounded-l-none z-10' : 'border-transparent hover:border-surface-variant cursor-pointer'}`}
        onClick={() => dispatch({ type: 'SELECT_BLOCK', payload: block.id })}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ opacity: state.dragOverId === block.id ? 0.4 : 1 }}
      >
        
        {block.type !== 'heading' && block.type !== 'paragraph' && (
          <div className="flex items-center gap-1">
            <span
              className="font-body-md text-body-md font-medium text-on-surface outline-none border border-transparent hover:border-surface-variant focus:border-surface-variant focus:bg-surface-container-lowest px-1 -ml-1 rounded"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleLabelChange}
              data-placeholder="Block Label"
            >
              {block.label}
            </span>
            <span 
              className="text-error cursor-pointer select-none text-sm font-bold" 
              title="Toggle required"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'UPDATE_BLOCK', payload: { id: block.id, changes: { required: !block.required } } });
              }}
            >
              {block.required ? '*' : ''}
            </span>
          </div>
        )}
        <InputPreview block={block} disabled={true} />
        
        {/* Actions - visible on hover or selected */}
        <div className={`flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 ${isSelected ? 'opacity-100' : ''} transition-opacity`}>
           <div 
            className="flex items-center justify-center w-6 h-6 text-on-surface-variant cursor-grab hover:text-on-surface hover:bg-surface-variant rounded" 
            draggable 
            onDragStart={handleDragStart}
          >
            <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
          </div>
          <button 
            className="flex items-center justify-center w-6 h-6 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded" 
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'DUPLICATE_BLOCK', payload: block.id });
            }}
            title="Duplicate"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
          </button>
          <button 
            className="flex items-center justify-center w-6 h-6 text-on-surface-variant hover:text-error hover:bg-error-container rounded" 
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'DELETE_BLOCK', payload: block.id });
            }}
            title="Delete"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
