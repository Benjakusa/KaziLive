import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Briefcase, Menu, X, User, Search, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setMobileMenuOpen(false);
    };

    const isHome = location.pathname === '/';

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'employer') return '/employer/dashboard';
        return '/jobseeker/dashboard';
    };

    return (
        <nav className={`navbar-global ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                    <Briefcase size={28} className="logo-icon" />
                    <div className="brand-text">
                        <span className="kazi">Kazi</span>
                        <span className="live">Live</span>
                    </div>
                </Link>

                <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                    {user ? (
                        <>
                            <Link to={getDashboardLink()} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="nav-link btn-logout-nav" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/jobseeker/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <User size={18} />
                                Jobseeker
                            </Link>
                            <Link to="/employer/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <User size={18} />
                                Employer
                            </Link>
                            <Link to="/admin/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <Shield size={18} />
                                Admin
                            </Link>
                        </>
                    )}
                    {(!user || user.role === 'employer') && (
                        <Link to="/employer/search" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                            <Search size={18} />
                            Find Talent
                        </Link>
                    )}
                </div>

                <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};


export default Navbar;
