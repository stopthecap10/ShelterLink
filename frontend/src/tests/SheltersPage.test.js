import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SheltersPage from '../pages/SheltersPage';

// Mock the mock data service
jest.mock('../api/mockData', () => ({
  mockShelterService: {
    getShelters: jest.fn(() => Promise.resolve({
      shelters: [
        {
          _id: '1',
          name: 'Union Rescue Mission',
          description: 'Emergency shelter and services',
          address: { city: 'Los Angeles', state: 'CA' },
          capacity: { availableBeds: 5, totalBeds: 20 },
          rating: { average: 4.5, count: 10 },
          contact: { phone: '(213) 347-6300', email: 'info@urm.org' },
          services: [{ name: 'Emergency Shelter' }, { name: 'Meals' }]
        }
      ],
      pagination: { pages: 1 }
    }))
  }
}));

describe('SheltersPage Component', () => {
  test('renders shelter search page', async () => {
    render(
      <BrowserRouter>
        <SheltersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Find Shelters')).toBeInTheDocument();
    expect(screen.getByText('Search for shelters in your area and find the support you need')).toBeInTheDocument();
  });

  test('renders search and filter controls', () => {
    render(
      <BrowserRouter>
        <SheltersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText('Search shelters...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  test('renders view mode buttons', () => {
    render(
      <BrowserRouter>
        <SheltersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
  });

  test('handles search input', () => {
    render(
      <BrowserRouter>
        <SheltersPage />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search shelters...');
    fireEvent.change(searchInput, { target: { value: 'Union Rescue' } });
    
    expect(searchInput.value).toBe('Union Rescue');
  });

  test('handles filter changes', () => {
    render(
      <BrowserRouter>
        <SheltersPage />
      </BrowserRouter>
    );
    
    const cityInput = screen.getByPlaceholderText('City');
    fireEvent.change(cityInput, { target: { value: 'Los Angeles' } });
    
    expect(cityInput.value).toBe('Los Angeles');
  });
});
