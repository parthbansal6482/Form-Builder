# Formly — Minimalist Form Builder

Formly is a high-performance, minimalist, and monochrome form builder inspired by the structural honesty of Notion and the playful simplicity of Tally.so. It provides a clean, "editor-first" canvas that empowers users to build complex forms without the distraction of a cluttered UI.


## ✨ Features

- **Block-Based Editing**: Add, duplicate, delete, and reorder form blocks with ease.
- **Slash Commands (`/`)**: A lightning-fast way to trigger the block menu and insert fields.
- **Minimalist Aesthetics**: A strictly monochromatic theme using a custom design system built with Tailwind CSS.
- **Dual Mode**: Seamlessly switch between **Build** mode and **Preview** mode to test your forms in real-time.
- **Responsive Canvas**: A fluid workspace designed for clarity and focus.
- **Modular Architecture**: Built with a highly organized component structure for easy scalability.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Material Symbols](https://fonts.google.com/icons)
- **State Management**: React Context API + `useReducer`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/parthbansal6482/Form-Builder.git
   cd Form-Builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── components/      # Modular UI components (NavBar, Canvas, SidePanel, etc.)
├── context/         # Global state management (FormContext)
├── App.jsx          # Entry component
├── FormBuilder.jsx  # Main application orchestrator
└── index.css        # Global styles & Tailwind directives
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Parth Bansal](https://github.com/parthbansal6482)
