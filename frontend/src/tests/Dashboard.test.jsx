import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { LayoutDashboard, User } from 'lucide-react';

describe('Sidebar Component', () => {
    const menuItems = [
        { label: 'Overview', icon: LayoutDashboard, path: '/overview', id: 'Overview' },
        { label: 'Profile', icon: User, path: '/profile', id: 'Profile' },
    ];

    it('renders sidebar menu items', () => {
        render(
            <MemoryRouter>
                <Sidebar
                    isSidebarOpen={true}
                    isMobileMenuOpen={false}
                    setIsMobileMenuOpen={() => { }}
                    menuItems={menuItems}
                    role="jobseeker"
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Overview')).toBeDefined();
        expect(screen.getByText('Profile')).toBeDefined();
        expect(screen.getByText('JOBSEEKER')).toBeDefined();
    });

    it('collapses when isSidebarOpen is false', () => {
        const { container } = render(
            <MemoryRouter>
                <Sidebar
                    isSidebarOpen={false}
                    isMobileMenuOpen={false}
                    setIsMobileMenuOpen={() => { }}
                    menuItems={menuItems}
                    role="jobseeker"
                />
            </MemoryRouter>
        );

        expect(container.querySelector('.dashboard-sidebar').classList.contains('collapsed')).toBe(true);
    });
});
