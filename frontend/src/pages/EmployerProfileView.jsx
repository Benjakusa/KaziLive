import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Briefcase, Mail, Phone, MapPin, Building, FileText, Download, ArrowLeft, CheckCircle, Clock, Loader, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';
import { getJobseekerDetails } from '../services/api';
import defaultAvatar from '../assets/default-avatar.png';
import Badge from '../components/shared/Badge';

export default function EmployerProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const data = await getJobseekerDetails(id);
      setProfile(data);
    } catch (err) {
      if (err.status === 402 || err.message?.includes('Payment required')) {
        setError('Verification Required: You need a verified professional account to view in-depth candidate details including full qualifications and contacts.');
      } else if (err.status === 401) {
        localStorage.removeItem('token');
        navigate('/employer/login');
      } else {
        setError(err.message || 'Failed to load candidate profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-pulse">
        <Loader className="animate-spin text-maroon mb-4" size={48} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing talent data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="glass-card p-10 text-center border-t-4 border-maroon">
          <div className="w-16 h-16 bg-red-50 text-maroon rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Access Required</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="glass-button flex-1 h-14" onClick={() => navigate('/employer/dashboard')}>
              Verify Business Account
            </button>
            <button className="glass-button black flex-1 h-14" onClick={() => navigate(-1)}>
              Return to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 animate-in fade-in duration-700">
      <button
        className="group flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-maroon transition-all"
        onClick={() => navigate(-1)}
      >
        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-maroon/5 group-hover:scale-110 transition-all">
          <ArrowLeft size={14} />
        </div>
        Back to Talent Pool
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-maroon/10 via-maroon/5 to-white" />
            <div className="px-6 pb-8 -mt-12 text-center">
              <div className="w-32 h-32 rounded-[40px] bg-white p-1 shadow-2xl mx-auto mb-4 border border-white/50 overflow-hidden">
                <img
                  src={profile.profile_picture || defaultAvatar}
                  alt={profile.full_name}
                  className="w-full h-full object-cover rounded-[38px]"
                />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight capitalize">{profile.full_name || 'Anonymous Candidate'}</h2>
              <p className="text-maroon font-bold text-sm mb-4">{profile.job_category || 'General Labor'}</p>

              <div className="flex justify-center gap-2 mb-6">
                {profile.profile_verified ? (
                  <Badge variant="success">
                    <CheckCircle size={12} className="mr-1" /> Verified Professional
                  </Badge>
                ) : (
                  <Badge variant="yellow">
                    <Clock size={12} className="mr-1" /> Pending Verification
                  </Badge>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</p>
                    <p className="text-gray-900 font-bold truncate text-sm">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</p>
                    <p className="text-gray-900 font-bold text-sm">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Location</p>
                    <p className="text-gray-900 font-bold text-sm">{profile.location || 'Not Specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a
            href={`tel:${profile.phone}`}
            className="glass-button w-full h-16 text-lg !rounded-3xl"
          >
            <PhoneCall size={20} />
            Quick Call
          </a>
        </div>

        {/* Right Column: Detailed Bio & Qualifications */}
        <div className="lg:col-span-8 space-y-8">
          {/* Bio Section */}
          <div className="glass-card p-10">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-maroon" /> Professional Summary
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              {profile.bio || "No professional summary has been provided for this candidate yet. KaziLive is currently verifying their background and work history to provide a complete profile."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Briefcase size={16} className="text-maroon" /> Expectations
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Industry Preference</p>
                  <p className="text-gray-900 font-bold text-lg">{profile.job_category || 'Unspecified'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Salary Expectation</p>
                  <p className="text-emerald-600 font-black text-2xl">
                    {profile.expected_salary ? `KSh ${profile.expected_salary.toLocaleString()}` : 'Negotiable'}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-500" /> Availability
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                  <div className="mt-1">
                    <Badge variant={profile.availability_status === 'available' ? 'success' : 'yellow'}>
                      {profile.availability_status === 'available' ? 'Actively Seeking Work' : 'Currently Engaged'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification ID</p>
                  <p className="text-gray-900 font-mono text-sm leading-8">JS-{profile.id?.toString().padStart(6, '0')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="glass-card p-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Key Competencies & Skills</h3>
            <div className="flex gap-3 flex-wrap">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-5 py-2.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-maroon/20 hover:bg-maroon/5 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 font-medium italic">No specific skills listed for this profile.</p>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-maroon" /> Verified Credentials
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {profile.documents && profile.documents.length > 0 ? (
                profile.documents.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-maroon/5 text-maroon flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{doc.file_name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.file_type}</p>
                      </div>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button black p-3"
                    >
                      <Download size={14} /> Open
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <CircleSlash size={32} className="text-gray-200" />
                  <p className="text-gray-400 font-medium font-black uppercase tracking-widest text-[10px]">No public documents available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}