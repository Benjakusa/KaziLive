import '@testing-library/jest-dom';
import React from 'react';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

Object.defineProperty(window, 'location', {
  value: {
    pathname: '/',
    origin: 'http://localhost',
    href: 'http://localhost/'
  },
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
});