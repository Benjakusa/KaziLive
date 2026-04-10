import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Search, CheckCircle, Shield,
  ArrowRight, MapPin, Mail, Phone,
  UserCheck, MessageSquare
} from 'lucide-react';

const featuredTalents = [
  { id: 1, name: 'Amina Ochieng', role: 'Software Engineer', skills: ['React', 'Node.js', 'Python'], experience: '5 years', location: 'Nairobi', verified: true },
  { id: 2, name: 'David Mwangi', role: 'UX Designer', skills: ['Figma', 'UI/UX', 'Research'], experience: '4 years', location: 'Kisumu', verified: true },
  { id: 3, name: 'Grace Njoroge', role: 'Data Analyst', skills: ['SQL', 'Python', 'Tableau'], experience: '3 years', location: 'Nairobi', verified: true },
  { id: 4, name: 'James Kiprotich', role: 'Marketing Manager', skills: ['SEO', 'Content', 'Social Media'], experience: '7 years', location: 'Mombasa', verified: true },
];

function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              <Shield size={14} /> Verified Professionals Only
            </span>
            <h1 className="hero-title">
              Connect with Verified Talent.<br />
              <span className="highlight">Hire Smarter.</span>
            </h1>
            <p className="hero-subtitle">
              KaziLive helps employers discover pre-verified professionals while giving
              job seekers direct access to real opportunities.
            </p>
            <div className="hero-buttons">
              <Link to="/employer/search" className="btn btn-primary">
                <Users size={20} />
                Find Talent
              </Link>
              <Link to="/jobseeker/register" className="btn btn-secondary">
                <UserCheck size={20} />
                Get Discovered
              </Link>
            </div>
            <div className="hero-search">
              <div className="search-bar">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by skills, job category, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn">Search</button>
              </div>
              <div className="search-tags">
                <span>Popular:</span>
                <span className="tag">Software Engineer</span>
                <span className="tag">Marketing</span>
                <span className="tag">Data Analyst</span>
                <span className="tag">Nairobi</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card-float card-1">
                <div className="avatar">AO</div>
                <div className="card-info">
                  <span className="name">Amina O.</span>
                  <span className="role">Verified ✓</span>
                </div>
              </div>
              <div className="card-float card-2">
                <div className="avatar">DM</div>
                <div className="card-info">
                  <span className="name">David M.</span>
                  <span className="role">Verified ✓</span>
                </div>
              </div>
              <div className="card-float card-3">
                <div className="stats-badge">
                  <span className="number">500+</span>
                  <span className="label">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2>How KaziLive Works</h2>
            <p>Get started in minutes with our streamlined process</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <UserCheck size={28} />
                <span className="step-number">1</span>
              </div>
              <h3>Create Profile</h3>
              <p>Job seekers upload their CV and create a detailed profile showcasing skills and experience.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <Shield size={28} />
                <span className="step-number">2</span>
              </div>
              <h3>Get Verified</h3>
              <p>Our team reviews and verifies all profiles to ensure authenticity and quality.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <Search size={28} />
                <span className="step-number">3</span>
              </div>
              <h3>Discover Talent</h3>
              <p>Employers browse filtered profiles and find exactly who they need.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <MessageSquare size={28} />
                <span className="step-number">4</span>
              </div>
              <h3>Connect Instantly</h3>
              <p>Direct contact or job offers. No middlemen, just real connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-bottom">
          <p>&copy; 2024 KaziLive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;