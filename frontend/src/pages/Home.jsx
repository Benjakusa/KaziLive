import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Shield, UserCheck, MessageSquare } from 'lucide-react';

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
      <section className="hero-section">
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
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works py-5">
        <div className="section-container">
          <div className="section-header text-center mb-5">
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

      <footer className="footer py-4">
        <div className="footer-bottom text-center">
          <p>&copy; {new Date().getFullYear()} KaziLive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;