import React, { useState, useEffect } from 'react';
import { Search, Filter, Lock, CreditCard } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import EmployerFilters from '../components/EmployerFilters.jsx';
import defaultAvatar from '../assets/default-avatar.png';

export default function EmployerSearch() {
  const navigate = useNavigate();
  const { user, token, isLoading: authLoading } = useSelector((state) => state.auth);
  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    salaryRange: ''
  });

  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        navigate('/employer/login');
      } else {
        fetchJobseekers();
      }
    }
  }, [token, authLoading, navigate]);

  // Refetch when filters change (auto-apply filters)
  useEffect(() => {
    if (token && !authLoading) {
      fetchJobseekers();
    }
  }, [filters]);

  const fetchJobseekers = async () => {
    setLoading(true);
    setError('');
    setPaymentRequired(false);

    try {
      let url = `/api/employer/jobseekers?q=${encodeURIComponent(searchTerm)}`;

      if (filters.category) {
        url += `&job_category=${encodeURIComponent(filters.category)}`;
      }

      if (filters.salaryRange) {
        if (filters.salaryRange === '200000+') {
          url += `&min_salary=200000`;
        } else {
          const [min, max] = filters.salaryRange.split('-');
          if (min) url += `&min_salary=${min}`;
          if (max) url += `&max_salary=${max}`;
        }
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setJobseekers(data.jobseekers);
      } else if (response.status === 402) {
        setPaymentRequired(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to fetch jobseekers');
      }
    } catch (err) {
      setError('Network error: Could not fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    fetchJobseekers();
  };

  if (authLoading) return <div className="loading-state">Loading Auth...</div>;

  if (paymentRequired) {
    return (
      <div className="empty-state card py-8 text-center" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ background: 'var(--maroon-lightest)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CreditCard size={40} color="var(--maroon)" />
        </div>
        <h2 className="text-maroon">Subscription Required</h2>
        <p className="mt-4 text-muted">A valid payment is required to view full talent profiles. Get verified today to unlock unlimited access to jobseekers.</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/employer/dashboard')}
          >
            Go to Payments & Top Up
          </button>
          <p className="small text-muted">Access starts from as low as KSh 500.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <Search size={24} />
          <h2>Find Jobseekers</h2>
        </div>
        <div className="card-body">
          <form className="filters" onSubmit={handleSearchClick}>
            <div className="input-icon-wrapper" style={{ flex: 1 }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, skill, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <EmployerFilters filters={filters} setFilters={setFilters} />

      {error && (
        <div className="alert alert-error m-4">
          {error}
          <button onClick={fetchJobseekers} className="btn-text-maroon underline ml-4 font-bold">Retry</button>
        </div>
      )}

      <div className="jobseeker-list mt-8">
        {loading ? (
          <div className="text-center py-8">Searching for candidates...</div>
        ) : jobseekers.length === 0 ? (
          <div className="empty-state py-8">
            <Search size={48} className="text-muted mb-4" />
            <p className="text-center text-muted">No jobseekers found matching your criteria.</p>
            <button onClick={() => { setSearchTerm(''); setFilters({ category: '', salaryRange: '' }); }} className="btn-text-maroon mt-2">Clear all filters</button>
          </div>
        ) : (
          jobseekers.map((js) => (
            <div key={js.id} className="jobseeker-card">
              <div className="avatar">
                <img
                  src={js.profile_picture || defaultAvatar}
                  alt={js.full_name}
                  className="avatar-img"
                />
              </div>
              <div className="jobseeker-info">
                <div className="jobseeker-name">{js.full_name || 'Incomplete Profile'}</div>
                <div className="jobseeker-category">{js.job_category || 'Candidate'}</div>
                <div className="jobseeker-salary">Expected: {js.expected_salary ? `KSh ${js.expected_salary.toLocaleString()}` : 'Not set'}</div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/employer/profile/${js.id}`)}
              >
                View Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
