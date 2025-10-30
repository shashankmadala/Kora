Kora is an AI-powered app that leverages an advanced convolutional neural network(CNN) to accurately detect emotions in autistic children with a proven accuracy of 87.83%. Beyond emotion detection, Kora offers a specialized AI assistant, community forums, and local resource directories to comprehensively support caregivers.

## Setup Instructions

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_APIKEY=your_firebase_api_key_here
VITE_FIREBASE_AUTHDOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECTID=your_project_id
VITE_FIREBASE_STORAGEBUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGINGSENDERID=your_messaging_sender_id
VITE_FIREBASE_APPID=your_firebase_app_id

# Google AI (Gemini) API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps API Key (if needed)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Getting API Keys

1. **Firebase Setup:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing project
   - Go to Project Settings > General > Your apps
   - Add a web app and copy the configuration values

2. **Google AI (Gemini) API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key to your `.env` file

3. **Google Maps API Key (optional):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API
   - Create credentials > API Key

### Installation

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```
