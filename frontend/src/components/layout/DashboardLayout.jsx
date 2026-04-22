import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/dashboardSlice';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ children, menuItems, role }) => {
    const { isSidebarOpen } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="dashboard-wrapper">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                menuItems={menuItems}
                role={role}
            />

            <div className={`dashboard-main ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
                <header className="dashboard-header">
                    <div className="header-left">
                        <button
                            className="sidebar-toggle"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <Menu size={24} />
                        </button>
                        <button
                            className="mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="dashboard-title">{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
                    </div>

                    
                </header>

                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
