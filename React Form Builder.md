# Form Builder — Agent Reference

> Minimal, high-quality Tally.so-inspired form builder in React.
> Single `.jsx` file. Black, white, grey only. No Tailwind. No extra libraries.

---

## Stack & Constraints

- Single `.jsx` file, default export
- Only allowed external dependency: `lucide-react`
- No Tailwind, no CSS-in-JS libraries, no routing
- All styles via a single `<style>` tag injected in the component
- Inline styles only for dynamic/conditional values
- State managed with `useReducer` + `useContext`

---

## Design Tokens

Define at the top of the file as `const TOKENS`:

```js
const TOKENS = {
  bg: '#ffffff',
  surface: '#f9f9f9',
  border: '#e8e8e8',
  borderHover: '#d0d0d0',
  text: '#0a0a0a',
  textSecondary: '#5c5c5c',
  textPlaceholder: '#b8b8b8',
  accent: '#0a0a0a',
  accentHover: '#2a2a2a',
  danger: '#cc0000',
  radius: '7px',
  radiusSm: '4px',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  shadow: '0 4px 20px rgba(0,0,0,0.07)',
  shadowMd: '0 8px 32px rgba(0,0,0,0.12)',
  transition: 'all 0.15s ease',
}
```

---

## Block Types

Define as `const BLOCK_TYPES` — array of config objects:

```js
{ type, label, icon, description, defaultLabel, defaultPlaceholder }
```

### Supported Types

| Type | Label | Input Preview |
|---|---|---|
| `short_text` | Short Text | `<input>` |
| `long_text` | Long Text | `<textarea>` |
| `email` | Email | `<input type="email">` |
| `number` | Number | `<input type="number">` |
| `phone` | Phone | `<input type="tel">` |
| `url` | URL | `<input type="url">` |
| `date` | Date | `<input type="date">` |
| `multiple_choice` | Multiple Choice | Radio list |
| `checkbox` | Checkbox | Checkbox + label |
| `dropdown` | Dropdown | `<select>` |
| `rating` | Rating | 5 star row |
| `heading` | Heading | Large bold text |
| `paragraph` | Paragraph | Grey body text |

---

## App State Shape

```js
{
  title: 'Untitled Form',
  description: '',
  blocks: [
    {
      id: string,           // uid: Math.random().toString(36).slice(2,9)
      type: string,
      label: string,
      placeholder: string,
      required: boolean,
      options: string[],    // for multiple_choice, dropdown, checkbox group
      rows: number,         // for long_text (default: 3)
    }
  ],
  selectedId: string | null,
  activeTab: 'build' | 'preview',
  dragOverId: string | null,
}
```

### Reducer Actions

| Action | Payload |
|---|---|
| `SET_TITLE` | `string` |
| `SET_DESCRIPTION` | `string` |
| `ADD_BLOCK` | `{ type, afterId? }` |
| `UPDATE_BLOCK` | `{ id, changes }` |
| `DELETE_BLOCK` | `id` |
| `DUPLICATE_BLOCK` | `id` |
| `REORDER_BLOCKS` | `{ fromId, toId }` |
| `SELECT_BLOCK` | `id \| null` |
| `SET_TAB` | `'build' \| 'preview'` |
| `SET_DRAG_OVER` | `id \| null` |

---

## Layout

```
┌──────────────── TOP BAR (52px, sticky) ─────────────────┐
├──────────────────────────────────┬──────────────────────┤
│   CANVAS (flex-grow)             │  SIDE PANEL (300px)  │
│   max-width: 700px, centered     │  border-left         │
│   padding: 64px top, 120px bot   │                      │
├──────────────────────────────────┴──────────────────────┤
```

### Top Bar

- Left: App name **"Formly"** — bold, 15px
- Right: `Build` | `Preview` tab switcher (pill, black active) + `Share` button (outlined)
- Height: 52px, sticky, white bg, border-bottom `#e8e8e8`

### Canvas

- Editable `<div contenteditable>` for **title** — 30px, 700 weight, no border, outline none
- Editable `<div contenteditable>` for **description** — 15px, secondary color
- Placeholder via CSS: `[contenteditable]:empty::before { content: attr(data-placeholder); color: #b8b8b8 }`
- Block list renders below
- **Ghost row** at bottom: `+ Type / to add a block` — clicking opens slash menu

### Side Panel

- Fixed right, full height, `border-left: 1px solid #e8e8e8`
- Hidden when `activeTab === 'preview'` (canvas goes full width)
- Shows block settings when `selectedId` is set
- Shows empty hint when no block is selected

---

## Block Row

```
[drag-handle]   [label + input preview]   [action icons]
```

### Drag Handle
- `GripVertical` icon (lucide), 16px, `color: #b8b8b8`
- Visible only on row hover
- `cursor: grab`

### Block Content
- **Label line:** `<span contenteditable>` — editable inline, no border until focused
- **Required asterisk:** clickable `*` next to label, `color: #cc0000`, toggles `required`
- **Input preview:** disabled/non-interactive version of the input (see types table above)

### Action Icons (right side, on row hover)
- `Copy` icon — duplicates block
- `Trash2` icon — deletes block, turns red on hover
- Both 16px, `color: #b8b8b8`, transition to darker on hover

### Selected Block Styles
```css
border-left: 2.5px solid #0a0a0a;
background: #f9f9f9;
transition: all 0.15s ease;
```

---

## Input Previews

| Type | Preview Element |
|---|---|
| `short_text`, `email`, `url`, `phone`, `number` | `<input disabled placeholder={block.placeholder}>` |
| `long_text` | `<textarea disabled rows={block.rows \|\| 3}>` |
| `date` | `<input type="date" disabled>` |
| `multiple_choice` | List of `<input type="radio" disabled>` + editable option labels |
| `checkbox` | `<input type="checkbox" disabled>` + label |
| `dropdown` | `<select disabled>` with options |
| `rating` | Row of 5 `☆` characters, interactive in Preview mode |
| `heading` | `<div>` styled large bold text |
| `paragraph` | `<div>` styled grey body text |

---

## Slash Command Menu

### Trigger
- User types `/` in ghost add row OR presses Enter at end of last block

### Appearance
- `position: fixed`, floats below trigger point
- Width: 320px
- White bg, `border: 1px solid #e8e8e8`, `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`
- `border-radius: 7px`

### Structure
- Search `<input>` at top (auto-focused) — filters block types
- Each row: icon (20px) + bold name (13px) + grey description (12px) — 44px tall
- Hover background: `#f5f5f5`
- Stagger animation on open: `opacity 0→1`, `translateY 4px→0`, 20ms per item

### Keyboard Navigation
- `↑` / `↓` — move selection
- `Enter` — insert selected block
- `Escape` — close menu

### After Insert
- Close menu
- Select new block (`SELECT_BLOCK`)
- Focus block label

### Close Behavior
- Outside click (`useEffect` with `mousedown` listener)

---

## Side Panel — Block Settings

### Header
- Block type icon + type name

### Common Fields
- **Label** — text input, syncs with `block.label`
- **Placeholder** — text input (where applicable)
- **Required** — custom toggle switch, black when on

### Type-specific Fields

| Type | Extra Setting |
|---|---|
| `long_text` | Rows input (min: 2, max: 10) |
| `multiple_choice`, `dropdown`, `checkbox` | Option list editor (see below) |

### Option List Editor
- Each option: text input + delete button
- `+ Add option` button at bottom
- Options reorderable via HTML5 drag

### Footer
- `Delete block` — red text, no background, no border

---

## Drag and Drop

- HTML5 native drag API only — no libraries
- `onDragStart` → store dragging block id
- `onDragOver` → dispatch `SET_DRAG_OVER`
- `onDrop` → dispatch `REORDER_BLOCKS`
- **Insertion line:** `2px solid #0a0a0a`, full width, shown between blocks during drag
- **Dragged block:** `opacity: 0.4` while dragging

---

## Preview Mode

When `activeTab === 'preview'`:

- Side panel hidden, canvas expands full width, `max-width: 640px`, centered
- Title and description render as static text
- All blocks render as **real interactive inputs** (not disabled)
- Submit button: `max-width: 200px`, black bg, white text, label `"Submit →"`
- On submit: show thank you state — centered checkmark icon + `"Response submitted"` message

---

## Code Structure

```
TOKENS                    ← design constants
BLOCK_TYPES               ← config array
uid()                     ← id generator
reducer()                 ← all state logic
FormContext                ← context provider

App (default export)
  ├── TopBar
  ├── Canvas
  │     ├── BlockList
  │     │     └── BlockRow
  │     │           └── InputPreview
  │     └── GhostAddRow
  ├── SlashMenu
  └── SidePanel
        └── OptionEditor
```

---

## Code Quality Rules

- `useCallback` on all event handlers passed as props
- `useMemo` for filtered block types in slash menu
- No `// TODO` comments — everything must be implemented
- No `alert()` or `console.log` in final output
- Impossible to generate duplicate block IDs
- Accessible: all inputs have labels, buttons have `aria-label`, fully keyboard navigable
- Empty form state: centered text `"Your form is empty. Type / to add your first block."`

---

## Micro-interactions & Polish

- All interactive elements: `transition: all 0.15s ease`
- Input focus ring: `outline: 1.5px solid #0a0a0a`, `outline-offset: 2px`
- Button hover: slight background shift
- Block row hover: drag handle + action icons fade in (`opacity 0 → 1`)
- Required asterisk: red, `cursor: pointer`, `title="Toggle required"`
- Slash menu items: stagger in with `opacity` + `translateY` animation

---

## Final Checklist Before Output

- [ ] All block types implemented and render correctly
- [ ] Slash menu filters, navigates with keyboard, closes on outside click
- [ ] Drag and drop works for blocks and options
- [ ] Side panel syncs live with selected block
- [ ] Preview mode renders real interactive inputs
- [ ] Submit shows thank you state
- [ ] No colors used — black, white, grey only
- [ ] Single `.jsx` file, default export, zero placeholder logic
