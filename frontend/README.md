# Collaborative Whiteboard

A real-time collaborative whiteboard application built with React, TypeScript, and Canvas API.

## Features

- 🎨 Real-time collaborative drawing
- 🖊️ Multiple drawing tools (pen, eraser, shapes)
- 🎨 Color picker with preset palette
- ↩️ Undo/Redo support
- 👥 Multi-user presence indicators
- 💾 Session persistence with snapshots
- 🌙 Dark mode support
- 📱 Responsive design (mobile-first)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State**: Zustand, React Context
- **Canvas**: Native Canvas API + perfect-freehand
- **Routing**: React Router v7
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd collaborative-whiteboard/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |

## Project Structure

```
src/
├── components/     # React components
│   ├── ui/         # shadcn/ui primitives
│   ├── layout/     # Layout components
│   ├── features/   # Feature-specific components
│   └── common/     # Shared components
├── hooks/          # Custom React hooks
├── contexts/       # React Context providers
├── stores/         # Zustand stores
├── lib/            # Utility functions
├── types/          # TypeScript types
├── pages/          # Page components
└── constants/      # App constants
```

## Deployment

This project is configured for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## License

MIT
