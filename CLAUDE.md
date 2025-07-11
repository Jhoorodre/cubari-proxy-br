# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cubari Proxy is a React-based manga reader application that provides a clean interface for reading manga from multiple sources. It's a Brazilian Portuguese localized version of a Cubari-inspired proxy that aggregates manga content through various external sources.

## Common Development Commands

### Development Server
```bash
npm start        # Start development server (localhost:3000)
npm run dev      # Alternative development command
vercel dev       # Start with Vercel functions (recommended for full proxy functionality)
```

### Build Commands
```bash
npm run build    # Production build
npm run winBuild # Windows-specific build command
```

### Testing
```bash
npm test         # Run React tests
```

### Type Checking
The project uses TypeScript. Run type checking with:
```bash
npx tsc --noEmit  # Check types without emitting files
```

## Architecture Overview

### Core Structure
- **Frontend**: React 16.13.1 application with React Router for navigation
- **Styling**: Tailwind CSS with Headless UI components
- **State Management**: React class components with immutability-helper for state updates
- **Internationalization**: i18next for multi-language support (Portuguese/English)
- **Proxy System**: Vercel serverless function at `/api/proxy.js` for CORS bypass

### Key Architectural Components

#### Sources System (`src/sources/`)
- **Dynamic Source Loading**: External manga sources loaded via jsDelivr CDN
- **Source Configuration**: `Sources.ts` contains source mappings with commit-specific references
- **NSFW Toggle**: Conditional source loading based on localStorage "hentai" setting
- **Paperback Extensions**: Uses Paperback ecosystem extensions for source implementations

#### Main Application Flow (`src/App.js`)
- **App State**: Centralized state management for discover sections, search results, navigation
- **Source Initialization**: Loads external sources asynchronously before rendering main UI
- **Deduplication**: Intelligent manga deduplication across different sources
- **View More**: Pagination system for discover sections

#### Routing (`src/Router.js`)
- **Navigation Object**: Centralized route definitions with i18n keys
- **Page Components**: Discover, Search, History, Saved, Settings containers
- **Dynamic Component Rendering**: Routes pass app state to page components

#### Proxy System (`api/proxy.js`)
- **CORS Bypass**: Serverless function to proxy requests to external manga sources
- **Request Types**: Handles both JSON API requests and image fetching
- **Error Handling**: Comprehensive error handling with detailed logging
- **Header Management**: Strips problematic headers while preserving necessary ones

### Data Flow
1. **Source Loading**: External sources loaded from GitHub via jsDelivr
2. **Content Discovery**: Sources provide homepage sections with manga listings
3. **Search**: Multi-source search with result aggregation and deduplication
4. **Content Access**: Manga URLs mapped through source-specific slug mappers
5. **History/Favorites**: Local storage with optional RemoteStorage sync

## Development Practices

### File Organization
- `/src/components/` - Reusable UI components
- `/src/containers/` - Page-level components
- `/src/sources/` - Source management system
- `/src/locales/` - Translation files
- `/src/utils/` - Utility functions
- `/api/` - Vercel serverless functions

### State Management Patterns
- Class components with setState and immutability-helper
- Centralized app state passed down through props
- LocalStorage for persistence (favorites, history, settings)
- Optional RemoteStorage for cross-device sync

### Source Integration
- Sources are external Paperback extensions loaded dynamically
- Source state can be configured in `Sources.ts`
- Each source provides a slugMapper for URL generation
- Sources are loaded conditionally based on SFW/NSFW mode

### Styling Conventions
- Tailwind CSS utility classes
- Headless UI for interactive components
- Dark/light theme support via CSS classes
- Responsive design patterns

## Important Implementation Details

### External Source Loading
Sources are loaded from specific GitHub commits to ensure stability. When adding new sources or updating existing ones:
1. Update the commit hash in `Sources.ts`
2. Verify the source's file path structure
3. Test both SFW and NSFW configurations if applicable

### Proxy Function Requirements
The `/api/proxy.js` function is essential for the application to work in production due to CORS restrictions. It handles:
- Image requests via GET with `isImage=true` parameter
- API requests via POST with target URL and headers in body
- Proper error handling and status code mapping

### Internationalization
- Translation keys defined in `/src/locales/ptBR/translation.json`
- Navigation items use i18nKey references
- Default language is Portuguese Brazilian (pt-BR)

### Build Configuration
- Source maps disabled for production builds
- Cross-env used for environment variable consistency
- TypeScript strict mode enabled with specific compiler options