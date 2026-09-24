# Job Aggregator

A Next.js application for aggregating job listings from multiple sources.

## Project Structure

```
src/
  ├── app/           # Next.js App Router pages
  ├── components/    # Reusable React components
  ├── lib/          # Utility functions and helpers
  └── styles/       # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Code Formatting

Format all files:
```bash
npm run format
```

Check formatting:
```bash
npm run format:check
```

## Configuration

- **TypeScript**: Configured in `tsconfig.json` with path aliases
- **ESLint**: Extends `next/core-web-vitals`
- **Prettier**: Configured in `.prettierrc` for consistent code style

## Path Aliases

- `@/*` - Root directory
- `@components/*` - Components directory
- `@lib/*` - Library directory
- `@styles/*` - Styles directory
