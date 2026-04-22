import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/dashboardSlice';
import { logout } from '../../features/auth/authSlice';
import { useProfile } from '../../features/auth/useProfile';
import Sidebar from './Sidebar';
import { Menu, Bell, User, LogOut } from 'lucide-react';

const DashboardLayout = ({ children, menuItems, role }) => {
    const { isSidebarOpen } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { profile, loading } = useProfile();

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = '/';
    };

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

                    <div className="header-right">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="notification-badge"></span>
                        </button>
                        <div className="user-profile-header">
                            <span className="user-name">
                                {loading ? 'Loading...' : (profile?.displayName || 'User')}
                            </span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout} title="Logout">
                            <LogOut size={20} />
                        </button>
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
