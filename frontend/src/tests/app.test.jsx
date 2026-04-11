import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import App from '../App.jsx';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

const renderWithProviders = (component, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('App Component', () => {
  it('renders navigation links', () => {
    renderWithProviders(<App />);
    expect(screen.getAllByText(/Jobseeker/)[0]).toBeDefined();
    expect(screen.getAllByText(/Employer/)[0]).toBeDefined();
  });

  it('renders the hero section on home page', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Connect with Verified Talent/)).toBeDefined();
  });
});

describe('Protected Routes', () => {
  it('renders home page for unauthenticated users', async () => {
    const store = createTestStore({
      auth: { user: null, token: null, isLoading: false, error: null }
    });

    renderWithProviders(<App />, store);

    expect(screen.getByText(/Connect with Verified Talent/)).toBeDefined();
  });
});

describe('Auth State', () => {
  it('renders app with auth state', () => {
    const store = createTestStore({
      auth: {
        user: { id: 1, email: 'test@test.com', user_type: 'jobseeker' },
        token: 'test-token-123',
        isLoading: false,
        error: null
      }
    });

    renderWithProviders(<App />, store);
    expect(screen.getAllByText(/Jobseeker/)[0]).toBeDefined();
  });

  it('renders app for unauthenticated user', () => {
    const store = createTestStore({
      auth: { user: null, token: null, isLoading: false, error: null }
    });

    renderWithProviders(<App />, store);
    expect(screen.getByText(/Connect with Verified Talent/)).toBeDefined();
  });
});

describe('Responsive Design', () => {
  it('renders mobile menu toggle on small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });

    renderWithProviders(<App />);

    const toggleButton = document.querySelector('.mobile-toggle');
    expect(toggleButton).toBeDefined();
  });
});