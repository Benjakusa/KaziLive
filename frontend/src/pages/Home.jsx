import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Badge from '../components/shared/Badge';

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
  Mail,
  Phone,
  ChevronRight,
  Zap,
  Target,
} from 'lucide-react';

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

  const handleStartHiring = () => {
    if (user && user.role === 'employer') navigate('/employer/dashboard');
    else if (user && user.role === 'jobseeker') navigate('/jobseeker/dashboard');
    else navigate('/employer/register');
  };

  const handleJoinJobseeker = () => {
    if (user && user.role === 'jobseeker') navigate('/jobseeker/dashboard');
    else if (user && user.role === 'employer') navigate('/employer/dashboard');
    else navigate('/jobseeker/register');
  };

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-noise" />
        <div className="section-container hero-container">
          <div className="hero-tag">Kenya&apos;s Premier Talent Platform</div>
          <h1 className="hero-title">
            The Smarter Way to<br />
            <span className="hero-accent">Hire in Kenya</span>
          </h1>
          <p className="hero-subtitle">
            Direct access to pre-verified professional talent.<br />
            No public noise. No application floods. Just quality matches.
          </p>
          <div className="hero-buttons">
            <button onClick={handleStartHiring} className="btn-primary-hero">
              Hire Verified Talent
              <ArrowRight size={18} />
            </button>
            <button onClick={handleJoinJobseeker} className="btn-glass-hero">
              Join as Job Seeker
            </button>
          </div>

          {/* Stats strip */}
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div key={i} className="hero-stat-item">
                <span className="hero-stat-number">{s.number}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="problem-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">The Problem We Solve</span>
            <h2>Public job posts are broken</h2>
            <p>Traditional hiring methods waste time and resources. KaziLive offers a smarter way.</p>
          </div>
          <div className="ps-grid">
            <div className="ps-card problem-card">
              <h3 className="ps-card-title">The Old Way</h3>
              {[
                { title: '500+ applications per role', desc: 'HR teams waste weeks filtering unqualified candidates and spam.' },
                { title: 'Privacy concerns', desc: 'Executive roles often need discreet hiring without public exposure.' },
                { title: 'Months to hire', desc: 'Lost productivity while positions remain empty for 60+ days.' },
              ].map((item, i) => (
                <div key={i} className="ps-item problem-item">
                  <div className="ps-dot problem-dot" />
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ps-card solution-card">
              <h3 className="ps-card-title">The KaziLive Way</h3>
              {[
                'Pre-verified professional profiles only',
                'Direct contact with candidates',
                'Focus on quality, not quantity',
                'Fill roles in days, not months',
              ].map((feat, i) => (
                <div key={i} className="ps-item solution-item">
                  <CheckCircle size={20} className="check-icon" />
                  <span>{feat}</span>
                </div>
              ))}
              <button onClick={handleStartHiring} className="btn-primary-block">
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Platform Features</span>
            <h2>Everything you need to hire smarter</h2>
            <p>Built specifically for Kenyan companies and professionals who value quality.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: Shield, title: 'Verified Only', desc: 'Every professional undergoes rigorous verification before appearing in search results.' },
              { icon: Search, title: 'Precision Search', desc: 'Filter by skills, experience, salary expectations, and real-time availability.' },
              { icon: MessageSquare, title: 'Direct Access', desc: 'Connect immediately via phone, email, or message — no intermediaries.' },
              { icon: CreditCard, title: 'M-Pesa Payments', desc: 'Seamless pay-as-you-go access via Safaricom M-Pesa. Fast and secure.' },
              { icon: TrendingUp, title: 'Profile Boosts', desc: 'Candidates can enhance their visibility to land their dream role faster.' },
              { icon: Bell, title: 'Smart Alerts', desc: 'Instant notifications for new matches, profile views, and direct offers.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrap">
                  <Icon size={26} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2>How KaziLive Works</h2>
            <p>Get started in four simple steps and hire with confidence.</p>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', icon: UserCheck, title: 'Create Profile', desc: 'Job seekers build detailed profiles showcasing their verified skills and professional history.' },
              { num: '02', icon: Shield, title: 'Verification', desc: 'Our team manually reviews every profile to ensure authenticity and professional quality.' },
              { num: '03', icon: CreditCard, title: 'Browse & Access', desc: 'Employers browse the verified talent pool and pay a small fee for full profile access.' },
              { num: '04', icon: MessageSquare, title: 'Hire Directly', desc: 'Connect directly with candidates. No middlemen, no commissions — just successful hires.' },
            ].map(({ num, icon: Icon, title, desc }, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{num}</div>
                <div className="step-icon-wrap">
                  <Icon size={30} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Trusted by Kenyan Companies</span>
            <h2>What our users say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#E05C1A" color="#E05C1A" />
                  ))}
                </div>
                <p className="testimonial-content">&ldquo;{t.content}&rdquo;</p>
                <div className="testimonial-author">
                  <img src={t.image} alt={t.name} className="author-img" />
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE APPS ── */}
      <section className="apps-section">
        <div className="section-container apps-content">
          <div className="apps-text">
            <span className="section-tag">Coming Soon</span>
            <h2>Mobile Apps for <span className="apps-accent">Professionals</span></h2>
            <p>Take KaziLive with you. Get instant notifications when employers view your profile, send messages, or extend offers.</p>
            <button className="app-store-btn">
              <Smartphone size={20} />
              <span>Get on Google Play</span>
            </button>
          </div>
          <div className="phone-mockup">
            <div className="mockup-screen">
              <div className="mockup-header">
                <Briefcase size={16} className="mo-accent" />
                <span>KaziLive</span>
              </div>
              <div className="mockup-notif">
                <Bell size={12} className="mo-accent" />
                <div>
                  <strong>New profile view!</strong>
                  <small>TechCorp viewed your profile</small>
                </div>
              </div>
              <div className="mockup-notif">
                <Mail size={12} className="mo-accent" />
                <div>
                  <strong>Direct offer received</strong>
                  <small>Innovate Labs sent you an offer</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <Briefcase size={26} className="footer-logo-icon" />
                <span>KaziLive</span>
              </div>
              <p>The smarter way to hire in Kenya. Browse verified talent, connect directly, and fill positions faster.</p>
              <div className="mpesa-wrap">
                <span>Secure payments via:</span>
                <span className="mpesa-badge">M-Pesa</span>
              </div>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
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
              <p className="footer-contact"><Mail size={14} /> support@kazilive.com</p>
              <p className="footer-contact"><Phone size={14} /> +254 700 000 000</p>
              <p className="footer-contact">Nairobi, Kenya</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} KaziLive. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        :root {
          --maroon: #7B1B2E;
          --maroon-deep: #4E0E1C;
          --maroon-light: rgba(123,27,46,0.12);
          --orange: #E05C1A;
          --orange-light: rgba(224,92,26,0.15);
          --black: #0C0C0C;
          --offblack: #171717;
          --white: #FFFFFF;
          --white90: rgba(255,255,255,0.9);
          --white60: rgba(255,255,255,0.6);
          --white20: rgba(255,255,255,0.18);
          --white10: rgba(255,255,255,0.08);
          --gray: #f3f0ef;
          --text-dark: #1a0a0e;
          --text-mid: #5a3840;
          --border-light: rgba(123,27,46,0.15);
          --glass-bg: rgba(255,255,255,0.65);
          --glass-border: rgba(255,255,255,0.4);
          --shadow-card: 0 8px 32px rgba(123,27,46,0.12);
          --shadow-lg: 0 20px 60px rgba(123,27,46,0.18);
          --radius: 20px;
          --radius-sm: 12px;
          --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home-page {
          font-family: 'DM Sans', sans-serif;
          color: var(--text-dark);
          background: var(--white);
          overflow-x: hidden;
        }

        .section-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--text-dark);
          margin-bottom: 16px;
          line-height: 1.15;
        }

        .section-header p {
          font-size: 1.1rem;
          color: var(--text-mid);
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .section-tag {
          display: inline-block;
          padding: 6px 18px;
          background: var(--maroon-light);
          color: var(--maroon);
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
          border: 1px solid var(--border-light);
        }

        /* ── HERO ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 140px 0 100px;
          background-image: url('https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1800&q=80');
          background-size: cover;
          background-position: center top;
          background-attachment: fixed;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(10,3,6,0.95) 0%,
            rgba(30,8,15,0.92) 50%,
            rgba(5,2,4,0.97) 100%
          );
          z-index: 1;
        }

        .hero-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          z-index: 2;
        }

        .hero-container {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-tag {
          display: inline-block;
          padding: 8px 22px;
          background: rgba(224,92,26,0.2);
          border: 1px solid rgba(224,92,26,0.5);
          color: #f5a97a;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 28px;
          backdrop-filter: blur(8px);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 5.5rem;
          font-weight: 900;
          line-height: 1.05;
          color: var(--white);
          margin-bottom: 28px;
          letter-spacing: -0.02em;
          max-width: 900px;
        }

        .hero-accent {
          color: var(--orange);
          display: block;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.65;
          margin-bottom: 48px;
          max-width: 620px;
        }

        .hero-buttons {
          display: flex;
          gap: 18px;
          margin-bottom: 80px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-primary-hero {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: var(--orange);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 8px 30px rgba(224,92,26,0.4);
        }

        .btn-primary-hero:hover {
          background: #c94f13;
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(224,92,26,0.5);
        }

        .btn-glass-hero {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: rgba(255,255,255,0.12);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          backdrop-filter: blur(12px);
        }

        .btn-glass-hero:hover {
          background: rgba(255,255,255,0.22);
          transform: translateY(-3px);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--radius);
          overflow: hidden;
          backdrop-filter: blur(16px);
          width: 100%;
          max-width: 860px;
        }

        .hero-stat-item {
          padding: 28px 20px;
          text-align: center;
          background: rgba(255,255,255,0.06);
          transition: var(--transition);
        }

        .hero-stat-item:hover {
          background: rgba(255,255,255,0.12);
        }

        .hero-stat-number {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 900;
          color: var(--orange);
          margin-bottom: 6px;
        }

        .hero-stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* ── PROBLEM / SOLUTION ── */
        .problem-section {
          padding: 110px 0;
          background: var(--gray);
        }

        .ps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .ps-card {
          padding: 48px;
          border-radius: var(--radius);
          border: 1px solid transparent;
        }

        .problem-card {
          background: white;
          border-color: var(--border-light);
          box-shadow: var(--shadow-card);
        }

        .solution-card {
          background: var(--maroon);
          color: white;
          box-shadow: var(--shadow-lg);
        }

        .ps-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 36px;
          padding-bottom: 20px;
          border-bottom: 2px solid;
        }

        .problem-card .ps-card-title { border-color: var(--border-light); color: var(--text-dark); }
        .solution-card .ps-card-title { border-color: rgba(255,255,255,0.2); color: white; }

        .ps-item {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .ps-item:last-of-type { margin-bottom: 0; }

        .ps-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #dc2626;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .problem-item h4 {
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text-dark);
          font-size: 1rem;
        }

        .problem-item p {
          color: var(--text-mid);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .solution-item {
          align-items: center;
          margin-bottom: 20px;
        }

        .solution-item span {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          font-size: 0.98rem;
        }

        .check-icon { color: #f5a97a; flex-shrink: 0; }

        .btn-primary-block {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 36px;
          padding: 15px 28px;
          background: var(--orange);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition);
          width: 100%;
          justify-content: center;
        }

        .btn-primary-block:hover {
          background: #c94f13;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(224,92,26,0.35);
        }

        /* ── FEATURES ── */
        .features-section {
          padding: 110px 0;
          background: white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .feature-card {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius);
          padding: 40px 36px;
          transition: var(--transition);
          box-shadow: var(--shadow-card);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-light);
        }

        .feature-icon-wrap {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: var(--maroon-light);
          color: var(--maroon);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid var(--border-light);
        }

        .feature-card h3 {
          font-weight: 700;
          font-size: 1.15rem;
          margin-bottom: 12px;
          color: var(--text-dark);
        }

        .feature-card p {
          color: var(--text-mid);
          font-size: 0.92rem;
          line-height: 1.65;
        }

        /* ── HOW IT WORKS ── */
        .how-section {
          padding: 110px 0;
          background: var(--maroon-deep);
          position: relative;
          overflow: hidden;
        }

        .how-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(224,92,26,0.12) 0%, transparent 60%);
        }

        .how-section .section-header h2,
        .how-section .section-header p {
          color: white;
        }

        .how-section .section-header p { color: rgba(255,255,255,0.65); }

        .how-section .section-tag {
          background: rgba(224,92,26,0.2);
          color: #f5a97a;
          border-color: rgba(224,92,26,0.35);
        }

        .steps-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .step-card {
          text-align: center;
          padding: 44px 28px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius);
          backdrop-filter: blur(12px);
          transition: var(--transition);
        }

        .step-card:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-6px);
        }

        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          color: rgba(224,92,26,0.25);
          line-height: 1;
          margin-bottom: 16px;
        }

        .step-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--orange);
        }

        .step-card h3 {
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          margin-bottom: 12px;
        }

        .step-card p {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          line-height: 1.65;
        }

        /* ── TESTIMONIALS ── */
        .testimonials-section {
          padding: 110px 0;
          background: var(--gray);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .testimonial-card {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius);
          padding: 40px;
          box-shadow: var(--shadow-card);
          transition: var(--transition);
        }

        .testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }

        .testimonial-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }

        .testimonial-content {
          font-size: 1rem;
          color: var(--text-mid);
          line-height: 1.75;
          margin-bottom: 28px;
          font-weight: 500;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .author-img {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-light);
        }

        .author-name {
          font-weight: 700;
          color: var(--text-dark);
          font-size: 0.95rem;
        }

        .author-role {
          font-size: 0.82rem;
          color: var(--text-mid);
          margin-top: 2px;
        }

        /* ── APPS ── */
        .apps-section {
          padding: 110px 0;
          background: white;
        }

        .apps-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .apps-text .section-tag { margin-bottom: 20px; }

        .apps-text h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 900;
          line-height: 1.15;
          color: var(--text-dark);
          margin-bottom: 20px;
        }

        .apps-accent { color: var(--maroon); }

        .apps-text p {
          font-size: 1.05rem;
          color: var(--text-mid);
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .app-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 28px;
          background: var(--offblack);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .app-store-btn:hover {
          background: var(--maroon);
          transform: translateY(-2px);
        }

        .phone-mockup {
          display: flex;
          justify-content: center;
        }

        .mockup-screen {
          width: 270px;
          background: var(--offblack);
          border-radius: 44px;
          padding: 36px 24px;
          border: 6px solid #2a2a2a;
          box-shadow: 0 40px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
          transform: rotate(-4deg);
        }

        .mockup-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
          font-weight: 800;
          color: white;
          font-size: 1.1rem;
        }

        .mo-accent { color: var(--orange); }

        .mockup-notif {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 16px;
          border-radius: 14px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 14px;
          border-left: 3px solid var(--orange);
        }

        .mockup-notif strong {
          display: block;
          font-size: 0.82rem;
          color: white;
          font-weight: 700;
        }

        .mockup-notif small {
          color: rgba(255,255,255,0.5);
          font-size: 0.75rem;
        }

        /* ── FOOTER ── */
        .footer {
          padding: 90px 0 40px;
          background: var(--black);
          color: rgba(255,255,255,0.7);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 56px;
          margin-bottom: 72px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 900;
          color: white;
        }

        .footer-logo-icon { color: var(--orange); }

        .footer-brand p {
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          font-size: 0.92rem;
          margin-bottom: 28px;
        }

        .mpesa-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
        }

        .mpesa-badge {
          padding: 6px 14px;
          background: #059669;
          color: white;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .footer-links h4 {
          color: white;
          font-weight: 700;
          margin-bottom: 22px;
          font-size: 0.92rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .footer-links a {
          display: block;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          margin-bottom: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
        }

        .footer-links a:hover { color: var(--orange); }

        .footer-contact {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .footer-bottom {
          padding-top: 36px;
          border-top: 1px solid rgba(255,255,255,0.08);
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 0.85rem;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .hero-title { font-size: 4rem; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
          .apps-content { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .apps-text { display: flex; flex-direction: column; align-items: center; }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 3rem; }
          .hero-subtitle { font-size: 1.05rem; }
          .hero-buttons { flex-direction: column; width: 100%; }
          .btn-primary-hero, .btn-glass-hero { width: 100%; justify-content: center; }
          .ps-grid { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .section-header h2 { font-size: 2.2rem; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 2.5rem; }
          .hero-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

export default Home;