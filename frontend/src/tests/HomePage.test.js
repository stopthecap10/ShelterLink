import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

// Mock the language context
jest.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({ 
    language: 'en', 
    setLanguage: jest.fn(), 
    t: (key) => key 
  })
}));

describe('HomePage Component', () => {
  test('renders hero section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Connecting Hope, One Match at a Time')).toBeInTheDocument();
    expect(screen.getByText('Find immediate shelter and sustainable job opportunities in Los Angeles.')).toBeInTheDocument();
  });

  test('renders feature cards', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Instant Shelter Access')).toBeInTheDocument();
    expect(screen.getByText('Job Placement Support')).toBeInTheDocument();
    expect(screen.getByText('Community & Resources')).toBeInTheDocument();
  });

  test('renders statistics section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Impact in Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('156+')).toBeInTheDocument();
    expect(screen.getByText('Lives Impacted')).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Find Shelters')).toBeInTheDocument();
    expect(screen.getByText('Find Jobs')).toBeInTheDocument();
  });
});
