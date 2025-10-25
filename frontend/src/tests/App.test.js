import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the contexts
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({ user: null, login: jest.fn(), logout: jest.fn() })
}));

jest.mock('../contexts/SocketContext', () => ({
  SocketProvider: ({ children }) => <div data-testid="socket-provider">{children}</div>,
  useSocket: () => ({ unreadCount: 0 })
}));

jest.mock('../contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }) => <div data-testid="language-provider">{children}</div>,
  useLanguage: () => ({ language: 'en', setLanguage: jest.fn(), t: (key) => key })
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('socket-provider')).toBeInTheDocument();
    expect(screen.getByTestId('language-provider')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Check if the app renders without errors
    expect(document.body).toBeInTheDocument();
  });
});
