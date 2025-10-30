# Kora App - Vercel Deployment Guide

## Prerequisites
1. A Vercel account (sign up at vercel.com)
2. Your app code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your App

### Fix TypeScript Errors
Before deploying, you need to fix the TypeScript errors. The main issues are:

1. **Motion Component Issues**: Replace `motion(Component)` with `motion.div` or `motion.button`
2. **Unused Imports**: Remove unused imports to clean up the code
3. **Type Mismatches**: Fix type errors in components

### Environment Variables
Create a `.env.local` file with your environment variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your app:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project

### Option B: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add environment variables in the Vercel dashboard
6. Click "Deploy"

## Step 3: Configure Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the variables from your `.env.local` file
4. Make sure to set them for Production, Preview, and Development

## Step 4: Configure Build Settings

Make sure your `vercel.json` is configured correctly:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Step 5: Test Your Deployment

1. After deployment, Vercel will provide you with a URL
2. Test all the main features:
   - User authentication
   - Camera functionality
   - Chatbot
   - Community features
   - Profile management

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in Vercel dashboard
2. **Environment Variables**: Ensure all required variables are set
3. **Routing Issues**: Make sure SPA routing is configured with rewrites
4. **API Errors**: Check that all API keys are valid and have proper permissions

### Firebase Configuration:
- Make sure your Firebase project allows your Vercel domain
- Check CORS settings if you have API endpoints

### Google Maps:
- Ensure your API key has the correct restrictions
- Add your Vercel domain to allowed origins

## Post-Deployment

1. **Custom Domain**: You can add a custom domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics for performance monitoring
3. **Monitoring**: Set up error tracking and monitoring
4. **Updates**: Push to your main branch to trigger automatic deployments

## Notes

- The app uses Capacitor for mobile features, but Vercel deployment is for web only
- For mobile deployment, you'll need to use Capacitor's build process
- Make sure all external APIs (Firebase, Google Maps, Gemini) are properly configured









