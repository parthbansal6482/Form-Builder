export type BlockType = 
  | 'short_text' 
  | 'long_text' 
  | 'email' 
  | 'number' 
  | 'phone' 
  | 'url' 
  | 'date' 
  | 'multiple_choice' 
  | 'checkbox' 
  | 'dropdown' 
  | 'rating' 
  | 'heading' 
  | 'paragraph';

export interface Block {
  id: string;
  type: BlockType;
  label: string;
  placeholder?: string;
  required: boolean;
  options: string[];
  rows?: number;
}

export type TabType = 'build' | 'preview' | 'submitted';
export type SidePanelTabType = 'content' | 'design' | 'logic' | 'settings';

export interface FormState {
  title: string;
  description: string;
  blocks: Block[];
  selectedId: string | null;
  activeTab: TabType;
  dragOverId: string | null;
  sidePanelTab: SidePanelTabType;
}

export type FormAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'ADD_BLOCK'; payload: { type: BlockType; afterId?: string | null } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; changes: Partial<Block> } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'DUPLICATE_BLOCK'; payload: string }
  | { type: 'REORDER_BLOCKS'; payload: { fromId: string; toId: string } }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'SET_TAB'; payload: TabType }
  | { type: 'SET_DRAG_OVER'; payload: string | null }
  | { type: 'SET_SIDE_PANEL_TAB'; payload: SidePanelTabType };

export interface BlockTypeConfig {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
  defaultLabel: string;
  defaultPlaceholder: string;
  options?: string[];
}
