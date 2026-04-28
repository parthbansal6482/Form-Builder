import React, { createContext, useReducer } from 'react';

export const BLOCK_TYPES = [
  { type: 'short_text', label: 'Short Text', icon: 'short_text', description: 'Single line text input', defaultLabel: 'Short text', defaultPlaceholder: 'Enter your answer' },
  { type: 'long_text', label: 'Long Text', icon: 'notes', description: 'Multi-line text input', defaultLabel: 'Long text', defaultPlaceholder: 'Enter your answer' },
  { type: 'email', label: 'Email', icon: 'mail', description: 'Email address input', defaultLabel: 'Email', defaultPlaceholder: 'Enter your email' },
  { type: 'number', label: 'Number', icon: '123', description: 'Number input', defaultLabel: 'Number', defaultPlaceholder: 'Enter a number' },
  { type: 'phone', label: 'Phone', icon: 'call', description: 'Phone number input', defaultLabel: 'Phone', defaultPlaceholder: 'Enter your phone number' },
  { type: 'url', label: 'URL', icon: 'link', description: 'Website link input', defaultLabel: 'Website', defaultPlaceholder: 'https://' },
  { type: 'date', label: 'Date', icon: 'calendar_month', description: 'Date picker', defaultLabel: 'Date', defaultPlaceholder: '' },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: 'radio_button_checked', description: 'Select one option', defaultLabel: 'Multiple Choice', defaultPlaceholder: '', options: ['Option 1', 'Option 2'] },
  { type: 'checkbox', label: 'Checkbox', icon: 'check_box', description: 'Single checkbox', defaultLabel: 'Checkbox', defaultPlaceholder: '' },
  { type: 'dropdown', label: 'Dropdown', icon: 'arrow_drop_down_circle', description: 'Select from a dropdown', defaultLabel: 'Dropdown', defaultPlaceholder: 'Select an option', options: ['Option 1', 'Option 2'] },
  { type: 'rating', label: 'Rating', icon: 'star', description: '5 star rating', defaultLabel: 'Rating', defaultPlaceholder: '' },
  { type: 'heading', label: 'Heading', icon: 'match_case', description: 'Large bold text', defaultLabel: 'Heading', defaultPlaceholder: '' },
  { type: 'paragraph', label: 'Paragraph', icon: 'segment', description: 'Grey body text', defaultLabel: 'Paragraph', defaultPlaceholder: '' },
];

export const uid = () => Math.random().toString(36).slice(2, 9);

const initialState = {
  title: '',
  description: '',
  blocks: [],
  selectedId: null,
  activeTab: 'build', // 'build' | 'preview' | 'submitted'
  dragOverId: null,
  sidePanelTab: 'content', // 'content' | 'design' | 'logic' | 'settings'
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'ADD_BLOCK': {
      const typeConfig = BLOCK_TYPES.find((b) => b.type === action.payload.type);
      const newBlock = {
        id: uid(),
        type: typeConfig.type,
        label: typeConfig.defaultLabel,
        placeholder: typeConfig.defaultPlaceholder,
        required: false,
        options: typeConfig.options ? [...typeConfig.options] : [],
        rows: 3,
      };
      
      if (action.payload.afterId) {
        const index = state.blocks.findIndex(b => b.id === action.payload.afterId);
        if (index >= 0) {
          const newBlocks = [...state.blocks];
          newBlocks.splice(index + 1, 0, newBlock);
          return { ...state, blocks: newBlocks, selectedId: newBlock.id, sidePanelTab: 'content' };
        }
      }
      return { ...state, blocks: [...state.blocks, newBlock], selectedId: newBlock.id, sidePanelTab: 'content' };
    }
    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id ? { ...block, ...action.payload.changes } : block
        ),
      };
    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.payload),
        selectedId: state.selectedId === action.payload ? null : state.selectedId,
      };
    case 'DUPLICATE_BLOCK': {
      const blockToCopy = state.blocks.find((b) => b.id === action.payload);
      if (!blockToCopy) return state;
      const newBlock = { ...blockToCopy, id: uid() };
      const index = state.blocks.indexOf(blockToCopy);
      const newBlocks = [...state.blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      return { ...state, blocks: newBlocks, selectedId: newBlock.id };
    }
    case 'REORDER_BLOCKS': {
      const { fromId, toId } = action.payload;
      const fromIndex = state.blocks.findIndex((b) => b.id === fromId);
      const toIndex = state.blocks.findIndex((b) => b.id === toId);
      if (fromIndex === -1 || toIndex === -1) return state;
      
      const newBlocks = [...state.blocks];
      const [removed] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, removed);
      return { ...state, blocks: newBlocks, dragOverId: null };
    }
    case 'SELECT_BLOCK':
      return { ...state, selectedId: action.payload, sidePanelTab: 'content' };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload, selectedId: action.payload === 'preview' ? null : state.selectedId };
    case 'SET_DRAG_OVER':
      return { ...state, dragOverId: action.payload };
    case 'SET_SIDE_PANEL_TAB':
      return { ...state, sidePanelTab: action.payload };
    default:
      return state;
  }
}

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};
