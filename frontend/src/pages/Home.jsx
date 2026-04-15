import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';

import {
  Users,
  Search,
  Shield,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Eye,
  CreditCard,
  Bell,
  CheckCircle,
  ArrowRight,
  Star,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Smartphone,
  Globe,
  Database,
  Mail,
  Lock,
  Phone,
  ChevronRight,
  Play,
  Zap,
  Award,
  BarChart3,
  FileCheck,
  Target,
  Sparkles,
} from 'lucide-react';

const featuredTalents = [
  { id: 1, name: 'Amina Ochieng', role: 'Senior Software Engineer', skills: ['React', 'Node.js', 'Python', 'AWS'], experience: '5 years', location: 'Nairobi', verified: true, salary: 'KES 150K', availability: 'Immediate' },
  { id: 2, name: 'David Mwangi', role: 'Lead UX Designer', skills: ['Figma', 'UI/UX', 'Research', 'Prototyping'], experience: '4 years', location: 'Kisumu', verified: true, salary: 'KES 120K', availability: '2 weeks' },
  { id: 3, name: 'Grace Njoroge', role: 'Senior Data Analyst', skills: ['SQL', 'Python', 'Tableau', 'Power BI'], experience: '3 years', location: 'Nairobi', verified: true, salary: 'KES 130K', availability: 'Immediate' },
  { id: 4, name: 'James Kiprotich', role: 'Marketing Director', skills: ['SEO', 'Content Strategy', 'Social Media', 'Analytics'], experience: '7 years', location: 'Mombasa', verified: true, salary: 'KES 200K', availability: '1 month' },
  { id: 5, name: 'Mary Wanjiku', role: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'], experience: '4 years', location: 'Nairobi', verified: true, salary: 'KES 180K', availability: 'Immediate' },
  { id: 6, name: 'Peter Otieno', role: 'Product Manager', skills: ['Agile', 'Scrum', 'Product Strategy', 'Roadmapping'], experience: '6 years', location: 'Nairobi', verified: true, salary: 'KES 220K', availability: '3 weeks' },
];

const testimonials = [
  { id: 1, name: 'Sarah Kimani', role: 'HR Manager at TechCorp', content: 'KaziLive saved us countless hours. Instead of reviewing 500+ applications, we found our ideal candidate in just 2 days!', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 2, name: 'Michael Omondi', role: 'CTO at Innovate Labs', content: 'The verification process ensures we only see serious, qualified professionals. Best hiring decision we made this year.', rating: 5, image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 3, name: 'Lucy Muthoni', role: 'Founder at Creatives Hub', content: 'As a startup, finding quality talent is crucial. KaziLive delivered exactly what we needed.', rating: 5, image: 'https://randomuser.me/api/portraits/women/3.jpg' },
];

const stats = [
  { number: '10,000+', label: 'Verified Job Seekers', icon: UserCheck },
  { number: '2,500+', label: 'Active Employers', icon: Users },
  { number: '95%', label: 'Placement Rate', icon: Target },
  { number: '< 48hrs', label: 'Average Time to Hire', icon: Clock },
];

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAccessAlert, setShowAccessAlert] = useState(false);
  const categories = ['All', 'Technology', 'Design', 'Marketing', 'Sales', 'Operations'];

  const handleStartHiring = () => {
    if (user && user.role === 'employer') {
      navigate('/employer/dashboard');
    } else if (user && user.role === 'jobseeker') {
      navigate('/jobseeker/dashboard');
    } else {
      navigate('/employer/register');
    }
  };

  const handleJoinJobseeker = () => {
    if (user && user.role === 'jobseeker') {
      navigate('/jobseeker/dashboard');
    } else if (user && user.role === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/jobseeker/register');
    }
  };

  const handleViewTalent = (e) => {
    e.preventDefault();
    if (user && user.role === 'employer') {
      navigate('/employer/search');
    } else if (user && user.role === 'jobseeker') {
      setShowAccessAlert(true);
    } else {
      navigate('/employer/login');
    }
  };

  const filteredTalents = selectedCategory === 'All'
    ? featuredTalents
    : featuredTalents.filter(talent =>
      talent.role.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      talent.skills.some(skill => skill.toLowerCase().includes(selectedCategory.toLowerCase()))
    );


  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-background"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Private Hiring Platform for Kenyan Companies</span>
            </div>
            <h1 className="hero-title">
              Find Verified Talent<br />
              <span className="yellow-text">Without the Public Headaches</span>
            </h1>
            <p className="hero-subtitle">
              Join 2,500+ Kenyan companies who've discovered the smarter way to hire.
              Browse pre-verified professional profiles and contact candidates directly.
              No public postings, no application floods, just quality matches.
            </p>
            <div className="hero-buttons">
              <button onClick={handleStartHiring} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>
                Start Hiring Now
                <ArrowRight size={18} />
              </button>
              <button onClick={handleJoinJobseeker} className="btn-secondary" style={{ border: 'none', cursor: 'pointer' }}>
                <UserCheck size={18} />
                Join as Job Seeker
              </button>
            </div>


            <div className="trust-badge">
              <div className="trust-icons">
                <Shield size={14} />
                <CheckCircle size={14} />
                <Lock size={14} />
              </div>
              <span>Trusted by Kenya's leading companies • 100% verified profiles</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="stats-card">
              <div className="stat-item">
                <Users size={20} className="yellow-icon" />
                <div>
                  <strong>2,500+</strong>
                  <span>Active Employers</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <UserCheck size={20} className="yellow-icon" />
                <div>
                  <strong>10,000+</strong>
                  <span>Verified Professionals</span>
                </div>
              </div>
            </div>
            <div className="talent-preview">
              <div className="preview-header">
                <Eye size={16} />
                <span>Recently Verified Talent</span>
              </div>
              {featuredTalents.slice(0, 3).map((talent, idx) => (
                <div key={talent.id} className={`talent-card ${idx === 0 ? 'featured' : ''}`}>
                  <div className="talent-avatar">{talent.name.charAt(0)}{talent.name.split(' ')[1]?.charAt(0)}</div>
                  <div className="talent-details">
                    <div className="talent-name">
                      {talent.name}
                      <CheckCircle size={14} className="verified-badge" />
                    </div>
                    <div className="talent-role">{talent.role}</div>
                    <div className="talent-meta">
                      <span><MapPin size={12} /> {talent.location}</span>
                      <span><Briefcase size={12} /> {talent.experience}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Problem/Solution Section */}
      <section className="problem-section">
        <div className="section-container">
          <div className="problem-grid">
            <div className="problem-content">
              <span className="section-tag">The Problem We Solve</span>
              <h2>Public job posts are broken</h2>
              <div className="problem-list">
                <div className="problem-item">
                  <div className="problem-icon">😫</div>
                  <div>
                    <h4>500+ applications per role</h4>
                    <p>HR teams waste weeks filtering unqualified candidates</p>
                  </div>
                </div>
                <div className="problem-item">
                  <div className="problem-icon">🔒</div>
                  <div>
                    <h4>Privacy concerns for executive roles</h4>
                    <p>Companies don't want to advertise "we need help"</p>
                  </div>
                </div>
                <div className="problem-item">
                  <div className="problem-icon">⏰</div>
                  <div>
                    <h4>2-3 months average hiring time</h4>
                    <p>Lost productivity and revenue from empty positions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="solution-content">
              <span className="section-tag maroon-tag">Our Solution</span>
              <h2>Browse. Verify. Connect.</h2>
              <p>KaziLive flips the traditional hiring model. Instead of jobs finding candidates, employers find verified professionals ready to work.</p>
              <div className="solution-features">
                <div><CheckCircle size={18} className="yellow-text" /> Pre-verified profiles only</div>
                <div><CheckCircle size={18} className="yellow-text" /> Direct employer access</div>
                <div><CheckCircle size={18} className="yellow-text" /> Pay only to browse talent</div>
                <div><CheckCircle size={18} className="yellow-text" /> No public job postings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Platform Features</span>
            <h2>Everything you need to hire smarter</h2>
            <p>Built specifically for Kenyan companies and professionals</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Shield size={28} /></div>
              <h3>Verified Profiles Only</h3>
              <p>Every job seeker undergoes verification before appearing in search results. No fake profiles, no wasted time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Search size={28} /></div>
              <h3>Advanced Search Filters</h3>
              <p>Filter by skills, experience, salary expectations, location, availability, and job category.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MessageSquare size={28} /></div>
              <h3>Direct Contact</h3>
              <p>View contact details and reach out immediately. No middlemen, no waiting periods.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><CreditCard size={28} /></div>
              <h3>M-Pesa Integration</h3>
              <p>Secure payments via Safaricom Daraja API. Pay as you browse with M-Pesa.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><TrendingUp size={28} /></div>
              <h3>Profile Promotion</h3>
              <p>Job seekers can boost their visibility to top employers for faster matches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Bell size={28} /></div>
              <h3>Instant Notifications</h3>
              <p>Email and push notifications for profile views, messages, and offers.</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Simple Process</span>
            <h2>How KaziLive Works</h2>
            <p>Get started in minutes</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon"><UserCheck size={32} /></div>
              <h3>Create Profile</h3>
              <p>Job seekers upload CVs and create detailed profiles showcasing skills and experience</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon"><Shield size={32} /></div>
              <h3>Verification</h3>
              <p>Our team reviews and verifies all profiles for authenticity and quality</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon"><CreditCard size={32} /></div>
              <h3>Employer Payment</h3>
              <p>Employers pay a fee via M-Pesa to access verified profiles</p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon"><MessageSquare size={32} /></div>
              <h3>Connect & Hire</h3>
              <p>Direct contact or job offers. No middlemen, just real connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Simple Pricing</span>
            <h2>Pay only for what you need</h2>
            <p>No subscriptions, no hidden fees</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-badge">For Job Seekers</div>
              <div className="pricing-price">Free</div>
              <div className="pricing-duration">Forever</div>
              <ul className="pricing-features">
                <li><CheckCircle size={16} className="maroon-check" /> Create professional profile</li>
                <li><CheckCircle size={16} className="maroon-check" /> Upload CV and documents</li>
                <li><CheckCircle size={16} className="maroon-check" /> Get verified status</li>
                <li><CheckCircle size={16} className="maroon-check" /> Receive employer offers</li>
                <li><CheckCircle size={16} className="maroon-check" /> Email notifications</li>
              </ul>
              <Link to="/jobseeker/register" className="btn-secondary full-width">
                Join as Job Seeker
              </Link>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge maroon-badge">For Employers</div>
              <div className="pricing-price">KES 500</div>
              <div className="pricing-duration">per 30-day access</div>
              <ul className="pricing-features">
                <li><CheckCircle size={16} className="maroon-check" /> Browse all verified profiles</li>
                <li><CheckCircle size={16} className="maroon-check" /> Advanced search filters</li>
                <li><CheckCircle size={16} className="maroon-check" /> View contact details</li>
                <li><CheckCircle size={16} className="maroon-check" /> Direct messaging</li>
                <li><CheckCircle size={16} className="maroon-check" /> Pay via M-Pesa</li>
              </ul>
              <Link to="/employer/register" className="btn-primary full-width">
                Start Hiring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Trusted by Kenyan Companies</span>
            <h2>What our users say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#800020" color="#800020" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Apps Section */}
      <section className="apps-section">
        <div className="section-container">
          <div className="apps-content">
            <div>
              <span className="section-tag white-tag">Coming Soon</span>
              <h2>Mobile Apps for <span className="yellow-text">Android</span></h2>
              <p>Access KaziLive on the go. Get instant notifications when employers view your profile or send offers.</p>
              <div className="app-buttons">
                <button className="app-store-btn">
                  <Smartphone size={20} />
                  <span>Get on Google Play</span>
                </button>
              </div>
            </div>
            <div className="phone-mockup">
              <div className="mockup-screen">
                <div className="mockup-header">
                  <Briefcase size={16} className="maroon-text" />
                  <span>KaziLive</span>
                </div>
                <div className="mockup-notification">
                  <Bell size={12} />
                  <div>
                    <strong>New profile view!</strong>
                    <small>TechCorp viewed your profile</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to find your next hire?</h2>
            <p>Join hundreds of Kenyan companies already using KaziLive</p>
            <div className="cta-buttons">
              <button onClick={handleStartHiring} className="btn-primary large" style={{ border: 'none', cursor: 'pointer' }}>
                Get Started as Employer
                <ArrowRight size={18} />
              </button>
              <button onClick={handleJoinJobseeker} className="btn-outline-light large" style={{ border: 'none', cursor: 'pointer' }}>
                Join as Job Seeker
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <Briefcase size={28} className="yellow-text" />
                <span>KaziLive</span>
              </div>
              <p>The smarter way to hire in Kenya. Browse verified talent, connect directly, and fill positions faster.</p>
              <div className="payment-methods">
                <span>Secure payments via:</span>
                <div className="mpesa-badge">M-Pesa</div>
              </div>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
              <a href="/employer/search">Browse Talent</a>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <a href="/help">Help Center</a>
              <a href="/contact">Contact Us</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <p><Mail size={14} /> support@kazilive.com</p>
              <p><Phone size={14} /> +254 700 000 000</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} KaziLive. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Global Styles */
        .home-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1a1a1a;
          overflow-x: hidden;
        }


        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: black;
          overflow: hidden;
          padding: 100px 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(128, 0, 32, 0.3), rgba(0, 0, 0, 0.9));
          z-index: 1;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(128, 0, 32, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 40px;
          color: #800020;
          font-size: 0.875rem;
          margin-bottom: 24px;
          border: 1px solid rgba(128, 0, 32, 0.5);
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .yellow-text {
          color: var(--yellow);
        }

        .maroon-text {
          color: var(--maroon);
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 32px;
          background: #800020;
          color: white;
          text-decoration: none;
          border-radius: 40px;
          font-weight: 600;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(128, 0, 32, 0.3);
        }

        .btn-primary:hover {
          background: #5a0016;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(128, 0, 32, 0.5);
          color: white;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          text-decoration: none;
          border-radius: 40px;
          font-weight: 600;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          width: fit-content;
        }

        .trust-icons {
          display: flex;
          gap: 8px;
          color: var(--yellow);
        }

        .trust-badge span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        /* Hero Visual */
        .stats-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-around;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(128, 0, 32, 0.1);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .yellow-icon {
          color: var(--yellow);
        }

        .stat-item strong {
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .stat-item span {
          font-size: 0.875rem;
          color: #666;
        }

        .stat-divider {
          width: 1px;
          background: #e0e0e0;
        }

        .talent-preview {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
          font-weight: 600;
        }

        .talent-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 12px;
          transition: all 0.3s;
        }

        .talent-card.featured {
          background: #f9f9f9;
          border-left: 3px solid #800020;
        }

        .talent-avatar {
          width: 48px;
          height: 48px;
          background: #800020;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .talent-details {
          flex: 1;
        }

        .talent-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .verified-badge {
          color: #800020;
        }

        .talent-role {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 6px;
        }

        .talent-meta {
          display: flex;
          gap: 12px;
          font-size: 0.75rem;
          color: #999;
        }

        /* Stats Section */
        .stats-section {
          background: var(--maroon);
          padding: 80px 0;
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }

        .stat-card {
          text-align: center;
          padding: 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.1);
        }

        .stat-icon {
          color: var(--yellow);
          margin-bottom: 16px;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          font-weight: 500;
        }

        /* Problem Section */
        .problem-section {
          padding: 100px 0;
          background: white;
          color: var(--black);
        }

        .problem-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .section-tag {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(128, 0, 32, 0.1);
          color: #800020;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .maroon-tag {
          background: #800020;
          color: white;
        }

        .problem-section h2, .solution-content h2 {
          font-size: 2.5rem;
          margin-bottom: 24px;
          color: #1a1a1a;
        }

        .problem-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .problem-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .problem-icon {
          font-size: 2rem;
        }

        .problem-item h4 {
          margin-bottom: 8px;
          color: var(--maroon);
          font-size: 1.25rem;
        }

        .problem-item p {
          color: #666;
        }

        .solution-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 24px;
        }

        .solution-features div {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
        }

        .maroon-check {
          color: #800020;
        }

        /* Features Section */
        .features-section {
          padding: 100px 0;
          background: white;
          color: var(--black);
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header {
          margin-bottom: 48px;
        }

        .section-header.text-center {
          text-align: center;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: #1a1a1a;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          padding: 32px;
          background: #fafafa;
          border-radius: 16px;
          transition: all 0.3s;
          border: 1px solid #e0e0e0;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-color: #800020;
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          background: var(--maroon);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--yellow);
          margin-bottom: 24px;
          box-shadow: 0 8px 20px rgba(128, 0, 32, 0.2);
        }

        .feature-card h3 {
          margin-bottom: 12px;
          color: #1a1a1a;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        /* Browse Section */
        .browse-section {
          padding: 80px 0;
          background: #fafafa;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
        }

        .search-filters {
          background: white;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 32px;
          border: 1px solid #e0e0e0;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
        }

        .category-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 8px 20px;
          background: #fafafa;
          border: 1px solid #e0e0e0;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-btn.active {
          background: #800020;
          color: white;
          border-color: #800020;
        }

        .talents-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .talent-profile-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e0e0e0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .talent-profile-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: var(--maroon);
        }

        .profile-header {
          background: #800020;
          padding: 24px;
          position: relative;
        }

        .profile-avatar {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: #800020;
        }

        .verified-tag {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--yellow);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--black);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .profile-body {
          padding: 20px;
        }

        .profile-body h4 {
          margin-bottom: 4px;
          color: #1a1a1a;
        }

        .profile-role {
          color: #666;
          font-size: 0.875rem;
          margin-bottom: 16px;
        }

        .profile-details {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.75rem;
          color: #666;
        }

        .profile-details span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .profile-skills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .skill-tag {
          padding: 4px 12px;
          background: #f0f0f0;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        .view-profile-btn {
          width: 100%;
          padding: 10px;
          background: #800020;
          color: white;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-profile-btn:hover {
          background: #5a0016;
        }

        /* How It Works */
        .how-it-works {
          padding: 80px 0;
          background: white;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .step-card {
          text-align: center;
          padding: 32px;
          position: relative;
          background: #fafafa;
          border-radius: 16px;
          border: 1px solid #e0e0e0;
        }

        .step-number {
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: #800020;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          background: rgba(128, 0, 32, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--maroon);
          border: 2px solid rgba(128, 0, 32, 0.1);
        }

        /* Pricing Section */
        .pricing-section {
          padding: 80px 0;
          background: #fafafa;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 800px;
          margin: 0 auto;
        }

        .pricing-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          position: relative;
          border: 1px solid #e0e0e0;
        }

        .pricing-card.featured {
          border: 2px solid var(--maroon);
          box-shadow: 0 20px 40px rgba(128, 0, 32, 0.15);
          transform: scale(1.05);
          z-index: 10;
        }

        .pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #800020;
          color: white;
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .maroon-badge {
          background: var(--yellow);
          color: var(--black);
        }

        .pricing-price {
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-top: 24px;
          color: #1a1a1a;
        }

        .pricing-duration {
          text-align: center;
          color: #666;
          margin-bottom: 24px;
        }

        .pricing-features {
          list-style: none;
          padding: 0;
          margin-bottom: 32px;
        }

        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          font-size: 0.875rem;
        }

        .full-width {
          width: 100%;
          text-align: center;
          justify-content: center;
        }

        /* Testimonials */
        .testimonials-section {
          padding: 80px 0;
          background: white;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .testimonial-card {
          padding: 32px;
          background: white;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s;
        }

        .testimonial-card:hover {
          border-color: var(--maroon);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .testimonial-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
        }

        .testimonial-content {
          font-style: italic;
          margin-bottom: 24px;
          line-height: 1.6;
          color: #333;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testimonial-author img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        /* Apps Section */
        .apps-section {
          padding: 80px 0;
          background: black;
          color: white;
        }

        .apps-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .white-tag {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .app-buttons {
          margin-top: 32px;
        }

        .app-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: #800020;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .app-store-btn:hover {
          background: #5a0016;
          transform: translateY(-2px);
        }

        .phone-mockup {
          display: flex;
          justify-content: center;
        }

        .mockup-screen {
          width: 240px;
          background: white;
          border-radius: 32px;
          padding: 16px;
          color: #1a1a1a;
        }

        .mockup-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 16px;
        }

        .mockup-notification {
          background: rgba(128, 0, 32, 0.1);
          padding: 12px;
          border-radius: 12px;
          display: flex;
          gap: 12px;
          font-size: 0.75rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 0;
          background: #1a1a1a;
          color: white;
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 32px;
        }

        .btn-primary.large {
          padding: 16px 40px;
          font-size: 1.125rem;
        }

        .btn-outline-light {
          padding: 16px 40px;
          background: transparent;
          border: 2px solid white;
          color: white;
          text-decoration: none;
          border-radius: 40px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-outline-light:hover {
          background: white;
          color: #1a1a1a;
        }

        /* Footer */
        .footer {
          background: black;
          color: #999;
          padding: 60px 0 20px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-brand .logo {
          margin-bottom: 16px;
        }

        .footer-brand p {
          margin-bottom: 16px;
          color: #999;
        }

        .payment-methods {
          margin-top: 16px;
        }

        .mpesa-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #800020;
          color: white;
          border-radius: 4px;
          font-size: 0.75rem;
          margin-top: 8px;
        }

        .footer-links h4 {
          color: white;
          margin-bottom: 16px;
        }

        .footer-links a {
          display: block;
          color: #999;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: #800020;
        }

        .footer-links p {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #1a1a1a;
        }

        /* Responsive Styles */
        @media (max-width: 1200px) {
          .section-container, .hero-container, .nav-container {
            width: 95%;
            padding: 0 20px;
          }
        }

        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .hero-buttons {
            justify-content: center;
          }

          .trust-badge {
            margin: 0 auto;
          }

          .hero-visual {
            max-width: 600px;
            margin: 0 auto;
          }

          .features-grid, .talents-grid, .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .problem-grid, .apps-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .floating-nav {
            width: 100%;
            top: 0;
            border-radius: 0;
            padding: 10px 20px;
          }

          .desktop-only {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            height: calc(100vh - 70px);
            background: black;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            gap: 24px;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            z-index: 1001;
            overflow-y: auto;
          }

          .nav-links.active {
            transform: translateX(0);
          }

          .nav-links a {
            font-size: 1.25rem;
            width: 100%;
            text-align: center;
            padding: 12px;
          }

          .mobile-only-buttons {
            display: flex;
          }

          .hero-title {
            font-size: 2.75rem;
          }

          .hero-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }

          .stats-grid, .features-grid, .talents-grid, .steps-grid, .pricing-grid, .testimonials-grid, .footer-grid {
            grid-template-columns: 1fr;
          }

          .stats-card {
            flex-direction: column;
            gap: 20px;
          }

          .stat-divider {
            width: 100%;
            height: 1px;
          }

          .section-header h2 {
            font-size: 2rem;
          }
          
          .pricing-card.featured {
            transform: none;
          }
          
          .cta-buttons {
            flex-direction: column;
          }
          
          .btn-primary.large, .btn-outline-light {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.25rem;
          }
          
          .stat-number {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;