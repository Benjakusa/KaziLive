import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen, menuItems, role }) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'collapsed'} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-area">
                        <LayoutDashboard className="logo-icon" size={28} />
                        <span className="role-text">{role.toUpperCase()}</span>
                    </div>
                    <button
                        className="mobile-close"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => {
                        const isAction = item.path === '#' || !item.path;
                        const Component = isAction ? 'button' : NavLink;
                        const className = `sidebar-link ${item.isActive ? 'active' : ''}`;

                        const props = isAction
                            ? {
                                onClick: () => {
                                    if (item.onClick) item.onClick();
                                    setIsMobileMenuOpen(false);
                                },
                                className: className,
                                type: 'button',
                                style: { background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }
                            }
                            : {
                                to: item.path,
                                className: ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`,
                                onClick: () => setIsMobileMenuOpen(false)
                            };

                        return (
                            <Component key={index} {...props}>
                                <item.icon size={20} className="nav-icon" />
                                <span className="nav-text">{item.label}</span>
                            </Component>
                        );
                    })}
                </nav>


                <div className="sidebar-footer">
                    <div className="footer-content">
                        <p className="footer-version">KaziLive v1.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
