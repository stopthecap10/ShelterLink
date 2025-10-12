# Shelter Match App

A comprehensive platform designed to match homeless individuals with available shelter beds and provide access to job opportunities and support services.

## Features

- **User Registration**: Separate registration for shelters and homeless individuals
- **Real-Time Shelter Availability**: Shelters can update bed availability in real-time
- **Job Opportunities**: Shelters can list job opportunities and skills training resources
- **Search & Filter**: Advanced search functionality to find shelters by location, services, and availability
- **Real-Time Communication**: Direct messaging between shelter staff and individuals
- **Feedback & Rating System**: Users can rate shelters and provide feedback

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- TailwindCSS
- React Router
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Socket.io
- JWT Authentication

### Deployment
- Frontend: Vercel
- Backend: Heroku
- Database: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd shelter-match-app
```

2. Install all dependencies
```bash
npm run install-all
```

3. Set up environment variables
```bash
# Backend environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB connection string and JWT secret

# Frontend environment variables
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your backend API URL
```

4. Start the development servers
```bash
npm run dev
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Project Structure

```
shelter-match-app/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── docs/             # Documentation and wireframes
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
