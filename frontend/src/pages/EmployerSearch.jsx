import React, { useState, useEffect } from 'react';
import { Search, Filter, Lock, CreditCard, Loader, Users, MapPin, DollarSign } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { searchJobseekers } from '../services/api';
import EmployerFilters from '../components/EmployerFilters.jsx';
import defaultAvatar from '../assets/default-avatar.png';
import Badge from '../components/shared/Badge';

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
        fetchCandidates();
      }
    }
  }, [token, authLoading, navigate]);

  // Refetch when filters change (auto-apply filters)
  useEffect(() => {
    if (token && !authLoading) {
      fetchCandidates();
    }
  }, [filters]);

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');
    setPaymentRequired(false);

    try {
      const params = {
        q: searchTerm,
        job_category: filters.category
      };

      if (filters.salaryRange) {
        if (filters.salaryRange === '200000+') {
          params.min_salary = 200000;
        } else {
          const [min, max] = filters.salaryRange.split('-');
          if (min) params.min_salary = min;
          if (max) params.max_salary = max;
        }
      }

      const data = await searchJobseekers(params);
      setJobseekers(data.jobseekers);
    } catch (err) {
      if (err.status === 402 || err.message?.includes('Payment required')) {
        setPaymentRequired(true);
      } else {
        setError(err.message || 'Failed to fetch candidates');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader className="animate-spin text-maroon" size={40} />
    </div>
  );

  if (paymentRequired) {
    return (
      <div className="max-w-xl mx-auto mt-20 animate-in fade-in zoom-in duration-500">
        <div className="glass-card p-12 text-center border-t-4 border-maroon">
          <div className="w-20 h-20 bg-maroon/5 text-maroon rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CreditCard size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Access Restricted</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            A verified professional account is required to view our list of qualified jobseekers. Please top up your balance to unlock unlimited talent searching.
          </p>
          <button
            className="glass-button w-full h-16 text-lg !rounded-2xl"
            onClick={() => navigate('/employer/dashboard')}
          >
            Upgrade & Verify Account
          </button>
          <p className="mt-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">Access starts from KSh 500</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="glass-card mb-8">
        <div className="p-6 border-b border-white/20 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-maroon/10 text-maroon">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Discover Talent</h2>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Connect with qualified professionals</p>
          </div>
        </div>
        <div className="p-6">
          <form className="flex gap-4" onSubmit={handleSearchClick}>
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
              <input
                type="text"
                className="glass-input pl-12 h-14"
                placeholder="Search by name, skill, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="glass-button h-14 px-8"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Search Talent'}
            </button>
          </form>
        </div>
      </div>

      <EmployerFilters filters={filters} setFilters={setFilters} />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 mb-8 flex items-center justify-between font-medium text-sm animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span> {error}
          </div>
          <button onClick={fetchCandidates} className="text-[10px] font-black uppercase tracking-widest py-1 px-3 border border-red-200 rounded-lg hover:bg-red-100 transition-all">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <Loader className="animate-spin text-maroon" size={32} />
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Scanning workforce database...</p>
          </div>
        ) : jobseekers.length === 0 ? (
          <div className="col-span-full py-20 glass-card border-dashed flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200"><Users size={32} /></div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900">No candidates found</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => { setSearchTerm(''); setFilters({ category: '', salaryRange: '' }); }}
                className="mt-6 text-[10px] font-black uppercase tracking-widest text-maroon hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          jobseekers.map((js) => (
            <div key={js.id} className="glass-card group hover:shadow-2xl hover:shadow-maroon/5 transition-all duration-500 overflow-hidden border border-white/20">
              <div className="h-2 bg-gradient-to-r from-maroon/20 to-maroon/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center overflow-hidden shadow-inner border-2 border-white group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={js.profile_picture || defaultAvatar}
                      alt={js.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 truncate text-lg tracking-tight capitalize">{js.full_name || 'Incomplete Profile'}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5 truncate">{js.job_category || 'Candidate'}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <MapPin size={14} className="text-maroon" />
                    <span>{js.location || 'Location Pending'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <DollarSign size={14} className="text-emerald-500" />
                    <span>{js.expected_salary ? `KSh ${js.expected_salary.toLocaleString()} /mo` : 'Negotiable'}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-8 overflow-hidden h-6">
                  {(js.skills || []).slice(0, 2).map((skill, i) => (
                    <Badge key={i} variant="maroon" className="text-[9px] px-2 whitespace-nowrap">{skill}</Badge>
                  ))}
                  {(js.skills || []).length > 2 && <span className="text-[10px] text-gray-400 font-bold self-center">+{js.skills.length - 2}</span>}
                </div>

                <button
                  className="glass-button w-full"
                  onClick={() => navigate(`/employer/profile/${js.id}`)}
                >
                  Inspect Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
