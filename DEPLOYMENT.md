# Deployment Guide

This guide will help you deploy the Shelter Match application to production.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Heroku account (for backend)
- Vercel account (for frontend)
- Git repository

## Backend Deployment (Heroku)

### 1. Prepare Backend for Deployment

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your production environment variables:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shelter-match?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=production

# CORS
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### 2. Deploy to Heroku

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create a new Heroku app:
```bash
heroku create your-app-name-backend
```

3. Set environment variables:
```bash
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"
heroku config:set CLIENT_URL="https://your-frontend-domain.vercel.app"
```

4. Deploy:
```bash
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

5. Open your app:
```bash
heroku open
```

## Frontend Deployment (Vercel)

### 1. Prepare Frontend for Deployment

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your production environment variables:
```bash
REACT_APP_API_URL=https://your-backend-app.herokuapp.com
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Set the following:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. Add environment variable:
   - `REACT_APP_API_URL`: `https://your-backend-app.herokuapp.com`

6. Click "Deploy"

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

### 2. Database Collections

The application will automatically create the following collections:
- `users` - User accounts
- `shelters` - Shelter information
- `individuals` - Individual profiles
- `jobs` - Job postings
- `messages` - Messages between users
- `conversations` - Conversation metadata
- `ratings` - Shelter ratings and reviews

## Environment Variables Summary

### Backend (Heroku)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shelter-match
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-app.herokuapp.com
```

## Post-Deployment Checklist

- [ ] Backend is accessible at Heroku URL
- [ ] Frontend is accessible at Vercel URL
- [ ] Database connection is working
- [ ] Authentication is working
- [ ] Real-time messaging is working
- [ ] File uploads are working (if applicable)
- [ ] SSL certificates are active
- [ ] Environment variables are set correctly

## Monitoring and Maintenance

### Heroku
- Monitor app performance in Heroku dashboard
- Set up log monitoring
- Configure auto-scaling if needed

### Vercel
- Monitor build logs
- Set up analytics
- Configure custom domain if needed

### MongoDB Atlas
- Monitor database performance
- Set up alerts for high usage
- Regular backups

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CLIENT_URL` is set correctly in backend
2. **Database Connection**: Verify MongoDB URI and network access
3. **Build Failures**: Check Node.js version compatibility
4. **Environment Variables**: Ensure all required variables are set

### Logs

- Heroku logs: `heroku logs --tail`
- Vercel logs: Available in dashboard
- MongoDB logs: Available in Atlas dashboard

## Security Considerations

1. Use strong JWT secrets
2. Enable MongoDB Atlas security features
3. Use HTTPS in production
4. Implement rate limiting
5. Regular security updates
6. Monitor for suspicious activity

## Scaling Considerations

1. **Database**: Consider MongoDB Atlas scaling options
2. **Backend**: Use Heroku dyno scaling
3. **Frontend**: Vercel handles scaling automatically
4. **CDN**: Consider additional CDN for static assets

## Support

For deployment issues:
1. Check logs for error messages
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity
5. Review CORS settings
