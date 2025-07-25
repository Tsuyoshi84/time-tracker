# Time Tracker - Freelance Time Management

A professional time tracking application built for freelance engineers with flexible hours and multiple work sessions per day.

## Features

### 🕐 Flexible Timer System

- **Start/Pause functionality** - No stop button, only pause to allow resuming
- **Multiple sessions per day** - Track several work periods with breaks
- **Real-time display** - Live updates of current session and total daily time
- **Cross-midnight support** - Automatic date handling for night work

### ✏️ Editable Time Entries

- **Click-to-edit** - Edit start and end times directly in the interface
- **Manual session creation** - Add sessions retroactively
- **Delete sessions** - Remove individual sessions
- **Validation** - Prevents overlapping time entries and invalid time ranges

### 📊 Analytics & Tracking

- **Daily totals** - See total hours worked per day
- **Weekly overview** - 7-day summary with daily breakdowns
- **Session management** - List all sessions with durations
- **Visual indicators** - Clear distinction between active and completed sessions

### 💾 Data Persistence

- **IndexedDB storage** - All data stored locally in your browser
- **Automatic backup** - No data loss between sessions
- **Fast queries** - Efficient date-based data retrieval

## Technical Stack

- **Framework**: Nuxt 3 with TypeScript
- **Styling**: Tailwind CSS 3 + daisyUI
- **Icons**: Lucide Vue Next
- **Database**: IndexedDB (via Dexie library)
- **Architecture**: SPA mode for GitHub Pages deployment

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
# Generate static files for deployment
pnpm generate

# Preview the production build
pnpm preview
```

## Usage

### Starting a Work Session

1. Click the green "Start" button on the dashboard
2. The timer begins tracking your current session
3. Work as needed with the timer running

### Pausing Work

1. Click the orange "Pause" button
2. The session is saved with an end time
3. You can resume work by clicking "Start" again (creates a new session)

### Editing Time Entries

1. Go to the daily sessions list
2. Click on any start or end time to edit it
3. Enter time in HH:MM format (24-hour)
4. Press Enter to save or Escape to cancel

### Adding Manual Sessions

1. Click "Add Session" in the sessions list
2. A default 1-hour session is created
3. Edit the start and end times as needed

### Weekly Overview

1. Navigate to the "Weekly" tab
2. View 7-day summary with daily breakdowns
3. Click on any day to see detailed sessions
4. Use navigation arrows to view different weeks

## Data Storage

All data is stored locally in your browser's IndexedDB. This means:

- ✅ No internet connection required
- ✅ Complete privacy - data never leaves your device
- ✅ Fast performance
- ⚠️ Data is tied to your browser/device
- ⚠️ Clearing browser data will remove all sessions

## Architecture

### Key Components

- **TimerDisplay** - Main timer interface with start/pause controls
- **SessionList** - Displays and manages daily sessions
- **WeeklyView** - Week overview with daily statistics
- **TimeInput** - Inline time editing component

### Data Flow

1. **Timer State** - Managed by `useTimeTracker` composable
2. **IndexedDB** - Persistent storage via `database.ts` utility
3. **Reactive Updates** - Real-time UI updates with Vue 3 reactivity

### File Structure

```
app/
├── components/          # Vue components
├── composables/         # Composable functions
├── layouts/            # Layout components
├── pages/              # Route pages
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/css/         # Stylesheets
```

## CI/CD

### GitHub Actions Workflows

This project uses GitHub Actions for continuous integration and deployment:

#### CI Workflow (`.github/workflows/ci.yml`)

- Runs on pull requests to the main branch
- Performs type checking, testing, linting, and building
- Automatically commits linting fixes
- Includes auto-merge functionality for Dependabot PRs

#### Deploy Workflow (`.github/workflows/sourcemaps.yml`)

- Runs on pushes to the main branch
- Builds the application with sourcemaps enabled
- Automatically uploads sourcemaps to Sentry for error tracking
- Requires `SENTRY_AUTH_TOKEN` and `SENTRY_DSN` secrets to be configured in repository settings

### Sentry Integration

Sourcemaps are automatically uploaded to Sentry when:

- Code is pushed to the main branch
- `SENTRY_AUTH_TOKEN` is provided as a repository secret
- The build process completes successfully

This enables better error tracking and debugging in production.

#### Environment Variables

The following environment variables can be configured:

- `SENTRY_DSN` - Your Sentry DSN for error tracking (required for server-side Sentry, optional for client-side which defaults to the project's DSN)
- `SENTRY_AUTH_TOKEN` - Sentry authentication token for sourcemap uploads (required for CI/CD)

**Note**: Server-side Sentry requires the `SENTRY_DSN` environment variable to be set, as `useRuntimeConfig` cannot be used in the server configuration file due to technical limitations.

## Contributing

This is a single-user application focused on simplicity and core functionality. If you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for your own projects.

## Support

This application is designed to work in modern browsers with IndexedDB support. If you encounter issues:

1. Check browser console for errors
2. Ensure IndexedDB is available in your browser
3. Try clearing browser data and refreshing

---

Built with ❤️ for freelance engineers who need flexible time tracking without the complexity of enterprise solutions.
