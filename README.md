# TimeTracker2400

A modern time tracking application that integrates with Google Calendar to automatically track your project hours.

## Features

- 📅 Google Calendar Integration
- 📊 Project-based Time Tracking
- 💰 Budget and Rate Management
- 📈 Activity Analytics
- 👥 Team Member Management
- 🎨 Customizable Activity Colors

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Google Calendar API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/timetracker2400.git
cd timetracker2400
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Log in with your Google account
2. Create calendar events with the format: "projectname#activity description"
   - Example: "marvel#design making the homepage"
3. The app will automatically track your hours and categorize them by project and activity

## License

MIT
