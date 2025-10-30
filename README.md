# Shelter Link - Congressional App Challenge 2025

**Breaking the Cycle of Homelessness Through Technology**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Mission Statement

Shelter Link is an AI-powered platform that connects individuals experiencing homelessness with available shelter beds, job opportunities, and comprehensive support services. Our mission is to break the cycle of homelessness through technology that serves humanity.

## Key Features

### AI-Powered Matching
- Intelligent algorithm matches individuals with suitable shelters
- Real-time bed availability tracking
- GPS-enabled location services with accessibility information

### Career Development
- Comprehensive job board with training programs
- Mentorship opportunities and career advancement resources
- Direct application system with shelter support

### Real-Time Communication
- 24/7 crisis support and peer networks
- Instant messaging between individuals and shelter staff
- Anonymous options for privacy protection

### Inclusive Design
- Fully accessible interface with screen reader support
- Voice navigation and multi-language options
- Mobile-first responsive design

### Progress Tracking
- Goal setting and milestone celebration
- Success metrics and achievement system
- Long-term stability planning

### Emergency & Crisis Support
- Quick access to crisis hotlines (911, 988, 211)
- Emergency contact information
- Crisis intervention resources
- Offline emergency information

### Multilingual Support
- English and Spanish interfaces
- Cultural sensitivity and inclusive language
- Accessibility for diverse communities

### Security & Privacy
- End-to-end encryption for all communications
- GDPR compliance with data protection
- Secure authentication with multi-factor support
- Privacy controls and data portability

### Community Features
- Peer support groups and mentorship
- Success story sharing and inspiration
- Community forums and resource sharing
- Peer-to-peer support networks

### Progressive Web App
- Installable from browser (no app store needed)
- Offline functionality for critical features
- Push notifications for real-time updates
- Native app-like experience

### Advanced Accessibility
- Screen reader support with ARIA labels
- Keyboard navigation for all functionality
- High contrast mode for visual impairments
- Adjustable font sizes and audio descriptions
- Voice navigation and hands-free operation

## Live Demo

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5001  
**Health Check**: http://localhost:5001/api/health

## Technology Stack

### **Frontend**
- **React 18** - Modern UI framework
- **Material-UI (MUI)** - Accessible component library
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Helmet** - Security middleware

### **DevOps & Deployment**
- **Vercel** - Frontend hosting
- **Heroku** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub** - Version control

## Impact Metrics

- **4 Active Shelters** with real-time bed tracking
- **28 Available Beds** across all locations
- **5 Job Opportunities** with training support
- **100% Free** and open source
- **24/7 Support** through real-time messaging

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│◄──►│  Node.js API    │◄──►│   MongoDB       │
│   (Port 3000)   │    │  (Port 5001)    │    │   Atlas        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │   Socket.io     │
│   (Production)  │    │  (Real-time)    │
└─────────────────┘    └─────────────────┘
```

## Quick Start

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/shelter-match.git
cd shelter-match
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Start development servers**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

4. **Open your browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## User Experience

### **For Individuals Experiencing Homelessness**
1. **Quick Access**: Find nearby shelters with available beds
2. **Job Opportunities**: Browse employment with training support
3. **Real-time Support**: 24/7 messaging with shelter staff
4. **Progress Tracking**: Set goals and celebrate milestones

### **For Shelter Administrators**
1. **Bed Management**: Real-time availability updates
2. **Job Posting**: Create and manage employment opportunities
3. **Communication**: Direct messaging with individuals
4. **Analytics**: Track impact and success metrics

## Security & Privacy

- **End-to-end encryption** for sensitive communications
- **JWT authentication** with secure token management
- **Data anonymization** options for user privacy
- **GDPR compliance** with data protection measures
- **Secure API** with rate limiting and CORS protection

## Accessibility Features

- **Screen reader support** with ARIA labels
- **Keyboard navigation** for all functionality
- **High contrast mode** for visual impairments
- **Voice navigation** for hands-free operation
- **Multi-language support** for diverse communities

## Scalability & Performance

- **Microservices architecture** for horizontal scaling
- **Real-time updates** with WebSocket connections
- **CDN integration** for global performance
- **Database optimization** with efficient queries
- **Caching strategies** for improved response times

## Social Impact

### **Problem We're Solving**
- 580,000+ Americans experience homelessness nightly
- 28% can't find available shelter beds
- 40% of shelter beds remain empty due to poor coordination
- 60% want to work but lack access to opportunities

### **Our Solution**
- **Unified Platform**: Single point of access for all resources
- **AI Matching**: Intelligent connection between needs and services
- **Real-time Coordination**: Eliminate empty beds and missed opportunities
- **Comprehensive Support**: Beyond shelter to long-term stability

## Congressional App Challenge Criteria

### **Excellence in Programming (25%)**
- Clean, well-documented code  
- Modern technology stack (React, Node.js, MongoDB)  
- Efficient algorithms and data structures  
- Real-time communication implementation  

### **App Concept (25%)**
- Addresses real social problem (homelessness)  
- Innovative solution approach (AI matching)  
- Clear value proposition (unified platform)  
- Scalable impact potential (nationwide)  

### **App Design (25%)**
- Intuitive user interface  
- Accessible design principles  
- Responsive across devices  
- Professional visual design  

### **App Implementation (25%)**
- Fully functional application  
- Real-time features working  
- Data persistence and management  
- Error handling and edge cases  

## Contributing

We welcome contributions from developers, designers, and advocates!

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Congressional App Challenge** for inspiring innovation
- **Open source community** for amazing tools and libraries
- **Shelter organizations** for their tireless work
- **Individuals experiencing homelessness** for their courage and resilience

## Contact

- **Project Lead**: Avyay Sadhu
- **Email**: avyay.sadhu@gmail.com
- **GitHub**: [StopTheCap10](https://github.com/stopthecap10)


---

**Together, we can break the cycle of homelessness through technology that serves humanity.**

*Built for the Congressional App Challenge 2025*