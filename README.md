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

### 🌓 Theme

- **Light/Dark theme toggle** in the top-right of the header
- **Defaults to system preference**, persists explicit choice in localStorage

## Technical Stack

- **Framework**: Nuxt 4 with TypeScript
- **Styling**: Tailwind CSS 3 + daisyUI
- **Icons**: Lucide Vue Next
- **Database**: IndexedDB (via Dexie library)
- **Architecture**: SPA mode for GitHub Pages deployment

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

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

Click the green "Start" button to begin tracking time.

### Pausing Work

Click the orange "Pause" button to save the current session. Click "Start" again to create a new session.

### Editing Time Entries

Click on any start or end time in the sessions list to edit it. Enter time in HH:MM format (24-hour).

### Adding Manual Sessions

Click "Add Session" to create a new session retroactively.

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

### File Structure

```text
app/
├── components/          # Vue components
├── composables/         # Composable functions
├── layouts/            # Layout components
├── pages/              # Route pages
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/css/         # Stylesheets
```

### Theme System

- Managed by VueUse `useColorMode` via a small `useTheme` composable
- DaisyUI reads the current theme from `data-theme` on `<html>`; Tailwind `dark:` utilities are synced using the `dark` class
- Preference persists to `localStorage` under the key `theme-preference`. To follow the system again, clear this key or add an "Auto" option in the UI and call `setPreference(undefined)`

## License

MIT License - feel free to use and modify for your own projects.

---

Built with ❤️ for freelance engineers who need flexible time tracking without the complexity of enterprise solutions.
