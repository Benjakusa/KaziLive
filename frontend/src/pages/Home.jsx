import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, Search, CheckCircle, Shield, 
  Zap, MessageSquare, CreditCard, TrendingUp,
  ArrowRight, MapPin, Mail, Phone,
  Star, Award, Building, UserCheck
} from 'lucide-react';

const featuredTalents = [
  { id: 1, name: 'Amina Ochieng', role: 'Software Engineer', skills: ['React', 'Node.js', 'Python'], experience: '5 years', location: 'Nairobi', verified: true },
  { id: 2, name: 'David Mwangi', role: 'UX Designer', skills: ['Figma', 'UI/UX', 'Research'], experience: '4 years', location: 'Kisumu', verified: true },
  { id: 3, name: 'Grace Njoroge', role: 'Data Analyst', skills: ['SQL', 'Python', 'Tableau'], experience: '3 years', location: 'Nairobi', verified: true },
  { id: 4, name: 'James Kiprotich', role: 'Marketing Manager', skills: ['SEO', 'Content', 'Social Media'], experience: '7 years', location: 'Mombasa', verified: true },
];

const testimonials = [
  { id: 1, text: "KaziLive helped us hire 3 qualified engineers in just 2 weeks. The verification process gave us confidence in every candidate.", author: "Sarah K.", role: "HR Director, TechHub Kenya" },
  { id: 2, text: "After creating my profile, I got contacted by 2 employers within the first week. The verification badge made all the difference.", author: "Michael O.", role: "Frontend Developer" },
  { id: 3, text: "As a small business owner, I needed quality hires without the recruitment agency fees. KaziLive delivered exactly that.", author: "Jennifer M.", role: "Founder, GreenTech Solutions" },
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
              <Link to="/register" className="btn btn-secondary">
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

      {/* Key Features */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Why KaziLive</span>
            <h2>Platform Features</h2>
            <p>Everything you need for smarter hiring</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <h3>Verified Profiles Only</h3>
              <p>Every profile is vetted by our team. No fake accounts, no spam.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Search size={24} />
              </div>
              <h3>Smart Search & Filters</h3>
              <p>Filter by skills, salary expectations, availability, and location.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MessageSquare size={24} />
              </div>
              <h3>Direct Contact</h3>
              <p>Employers and job seekers connect directly. No intermediaries.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard size={24} />
              </div>
              <h3>Secure Payments</h3>
              <p>M-Pesa integration via Safaricom Daraja API for seamless transactions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Profile Promotion</h3>
              <p>Boost your visibility with our SEO-powered promotion features.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3>Real-Time Updates</h3>
              <p>Instant notifications when you're matched or contacted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Job Seekers */}
      <section className="cta-section jobseeker-cta">
        <div className="section-container">
          <div className="cta-content">
            <div className="cta-text">
              <h2>Stop Applying Endlessly.</h2>
              <h3>Let Employers Find You.</h3>
              <ul className="benefits-list">
                <li><CheckCircle size={18} /> Free profile creation</li>
                <li><CheckCircle size={18} /> Showcase skills and qualifications</li>
                <li><CheckCircle size={18} /> Set availability and salary expectations</li>
                <li><CheckCircle size={18} /> Get verified and stand out</li>
              </ul>
              <Link to="/register" className="btn btn-primary">
                Create Your Profile <ArrowRight size={18} />
              </Link>
            </div>
            <div className="cta-visual">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="profile-preview">
                    <div className="profile-avatar">JM</div>
                    <div className="profile-info">
                      <span className="name">James M.</span>
                      <span className="role">Software Engineer</span>
                      <span className="verified-badge">✓ Verified</span>
                    </div>
                  </div>
                  <div className="profile-stats">
                    <div className="stat">
                      <span className="value">12</span>
                      <span className="label">Profile Views</span>
                    </div>
                    <div className="stat">
                      <span className="value">5</span>
                      <span className="label">Messages</span>
                    </div>
                    <div className="stat">
                      <span className="value">3</span>
                      <span className="label">Offers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="cta-section employer-cta">
        <div className="section-container">
          <div className="cta-content reverse">
            <div className="cta-visual">
              <div className="dashboard-mockup">
                <div className="dashboard-screen">
                  <div className="dash-header">
                    <span className="dash-title">Candidate Search</span>
                    <span className="dash-count">247 found</span>
                  </div>
                  <div className="dash-filters">
                    <span className="filter-pill">Software Engineer</span>
                    <span className="filter-pill">Verified Only</span>
                    <span className="filter-pill">Nairobi</span>
                  </div>
                  <div className="dash-results">
                    <div className="result-item active">
                      <div className="avatar">AO</div>
                      <div className="result-info">
                        <span className="name">Amina Ochieng</span>
                        <span className="role">React Developer • 5 yrs exp</span>
                      </div>
                      <span className="verified">✓</span>
                    </div>
                    <div className="result-item">
                      <div className="avatar">GN</div>
                      <div className="result-info">
                        <span className="name">Grace Njoroge</span>
                        <span className="role">Full Stack • 4 yrs exp</span>
                      </div>
                      <span className="verified">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cta-text">
              <h2>Skip the Noise.</h2>
              <h3>Find Exactly Who You Need.</h3>
              <ul className="benefits-list">
                <li><CheckCircle size={18} /> Access verified candidates only</li>
                <li><CheckCircle size={18} /> Filter by skills, salary, availability</li>
                <li><CheckCircle size={18} /> Direct communication</li>
                <li><CheckCircle size={18} /> Pay-per-access model</li>
              </ul>
              <Link to="/employer/login" className="btn btn-accent">
                Start Hiring <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Talent */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Featured</span>
            <h2>Meet Our Verified Talent</h2>
            <p>Top professionals ready to contribute to your team</p>
          </div>
          <div className="talent-grid">
            {featuredTalents.map((talent) => (
              <div key={talent.id} className="talent-card">
                <div className="talent-header">
                  <div className="talent-avatar">
                    {talent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {talent.verified && <span className="verified-badge"><CheckCircle size={14} /> Verified</span>}
                </div>
                <h3 className="talent-name">{talent.name}</h3>
                <p className="talent-role">{talent.role}</p>
                <div className="talent-skills">
                  {talent.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="talent-meta">
                  <span><MapPin size={14} /> {talent.location}</span>
                  <span>{talent.experience}</span>
                </div>
                <Link to={`/employer/profile/${talent.id}`} className="btn btn-outline">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/employer/search" className="btn btn-secondary">
              View All Candidates <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Success Stories</span>
            <h2>What People Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="quote-icon"><Star size={20} /></div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.author[0]}</div>
                  <div className="author-info">
                    <span className="author-name">{testimonial.author}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Verified Professionals</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Employers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Profile Approval Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2,500+</span>
              <span className="stat-label">Successful Hires</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="section-container">
          <div className="final-cta-content">
            <h2>Ready to Change How Hiring Works?</h2>
            <p>Join thousands of professionals and employers already on KaziLive</p>
            <div className="final-cta-buttons">
              <Link to="/register" className="btn btn-white">
                Join as Job Seeker
              </Link>
              <Link to="/employer/login" className="btn btn-outline-white">
                Join as Employer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <Briefcase size={24} style={{ color: "var(--accent)" }} />
                <span>Kazi<span style={{ color: "var(--accent)", fontWeight: "800" }}>Live</span></span>
              </Link>
              <p>Connecting verified talent with leading employers across Kenya and Africa.</p>
            </div>
            <div className="footer-links">
              <h4>For Job Seekers</h4>
              <Link to="/register">Create Profile</Link>
              <Link to="/jobseeker/login">Login</Link>
              <Link to="#">Browse Jobs</Link>
              <Link to="#">Profile Promotion</Link>
            </div>
            <div className="footer-links">
              <h4>For Employers</h4>
              <Link to="/employer/login">Post a Job</Link>
              <Link to="/employer/search">Search Candidates</Link>
              <Link to="#">Pricing</Link>
              <Link to="#">Verification</Link>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <Link to="#">About Us</Link>
              <Link to="#">Contact</Link>
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p><MapPin size={16} /> Nairobi, Kenya</p>
              <p><Mail size={16} /> hello@kazilive.com</p>
              <p><Phone size={16} /> +254 700 000000</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 KaziLive. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="#">Privacy</Link>
              <Link to="#">Terms</Link>
              <Link to="#">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;