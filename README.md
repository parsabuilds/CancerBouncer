# CancerBouncer

A progressive web app that helps users assess their cancer risk through a guided health questionnaire and delivers AI-powered personalized recommendations for screenings and lifestyle changes.

Built in memory of [James Ghambin](https://www.instagram.com/jamesghambin/).

> **Disclaimer:** This app is for educational purposes only and does not constitute medical advice. Always consult a healthcare professional for medical guidance.

## Features

- **AI-Powered Risk Analysis** — Combines statistical risk modeling with Google Gemini AI for nuanced, personalized cancer risk assessment
- **Multi-Step Assessment** — Guided questionnaire covering demographics, lifestyle, medical history, symptoms, and environmental factors
- **Visual Dashboard** — Interactive charts showing risk scores across 5 cancer types with AI-generated reasoning
- **Personalized Recommendations** — Screening schedules and lifestyle changes ranked by priority and impact
- **Secure Backend** — API keys stay server-side; rate limiting and security headers protect the endpoint
- **Progressive Web App** — Install on any device, works offline for cached content, native app feel

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS v4, Recharts, Lucide Icons |
| Backend | Express.js, Google Gemini AI |
| Auth & Database | Firebase Authentication, Cloud Firestore |
| Build | Vite |
| PWA | Service Worker, Web App Manifest |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase project](https://console.firebase.google.com/) with Authentication and Firestore enabled
- A [Google AI Studio API key](https://aistudio.google.com/apikey) for Gemini

### Installation

```bash
git clone https://github.com/yourusername/CancerBouncer.git
cd CancerBouncer
npm install
cd server && npm install && cd ..
```

### Configuration

1. Copy the environment templates:
```bash
cp .env.example .env
cp server/.env.example server/.env
```

2. Fill in your credentials:
   - `.env` — Firebase configuration (client-side, safe to expose)
   - `server/.env` — Gemini API key (secret, server-side only)

### Running Locally

```bash
# Start both frontend and backend
npm run dev:all

# Or run separately:
npm run dev        # Frontend on :3000
npm run server     # Backend on :3001
```

### Building for Production

```bash
npm run build
```

The production build is output to `dist/`. Serve it with any static host and run the Express server behind a reverse proxy.

## Project Structure

```
├── index.html              # Vite entry with PWA meta tags
├── src/
│   ├── main.jsx            # App entry point
│   ├── App.jsx             # Routing and auth state
│   ├── index.css           # Tailwind imports and global styles
│   ├── config/firebase.js  # Firebase initialization
│   ├── services/           # API client and Firestore service
│   ├── components/         # Layout, Navbar, ErrorBoundary
│   ├── pages/              # All app screens
│   └── images/             # Fact screen backgrounds
├── server/
│   └── index.js            # Express API with Gemini integration
├── public/                 # Static assets, PWA icons, manifest
└── extra files/            # Design references (not part of the app)
```

## Security

- API keys for AI services are **never exposed to the client**
- Firebase config values are safe for client-side use (secured by Firebase Security Rules)
- Backend uses Helmet, CORS, and rate limiting
- No sensitive data is stored in the repository

## License

MIT License — see [LICENSE](LICENSE) for details.
