import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/shared/DataTable";
import { getOffers, acceptOffer, declineOffer } from "../../services/api";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Loader,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import JobseekerProfileView from "../../components/dashboard/JobseekerProfileView";
import JobseekerDocumentsView from "../../components/dashboard/JobseekerDocumentsView";
import JobseekerApplicationsView from "../../components/dashboard/JobseekerApplicationsView";
import JobseekerNotificationsView from "../../components/dashboard/JobseekerNotificationsView";
import JobseekerSettingsView from "../../components/dashboard/JobseekerSettingsView";
import Badge from "../../components/shared/Badge";

const JobseekerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState(true);

  // ✅ FETCH REAL OFFERS
  const fetchOffers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOffers();
      setOffers(data);
    } catch (err) {
      console.error("FETCH OFFERS ERROR:", err);
      setError("Failed to load your latest job offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ✅ HANDLERS
  const handleOfferAction = async (id, action) => {
    try {
      if (action === "accept") {
        await acceptOffer(id);
      } else {
        await declineOffer(id);
      }
      // Re-fetch to get updated statuses or remove if filtered
      fetchOffers();
    } catch (err) {
      console.error("OFFER ACTION ERROR:", err);
      alert(err.message || "Failed to process offer action.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/jobseeker/login";
  };

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, id: "Overview", onClick: () => setActiveTab("Overview") },
    { label: "My Profile", icon: User, id: "Profile", onClick: () => setActiveTab("Profile") },
    { label: "My Documents", icon: FileText, id: "Documents", onClick: () => setActiveTab("Documents") },
    { label: "Job Status", icon: Briefcase, id: "Status", onClick: () => setActiveTab("Status") },
    { label: "Alerts", icon: Bell, id: "Notifications", onClick: () => setActiveTab("Notifications") },
    { label: "Account", icon: Settings, id: "Settings", onClick: () => setActiveTab("Settings") },
    { label: "Sign Out", icon: LogOut, id: "Logout", onClick: handleLogout },
  ];

  const renderOverview = () => (
    <div className="animate-in fade-in duration-500">
      <div className="section-header-flex mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight capitalize">Dashboard Overview</h2>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Track your professional status and offers</p>
        </div>
        <div className="flex items-center gap-3 glass-card py-2 px-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Availability</span>
          <button
            onClick={() => setAvailable(!available)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${available ? 'bg-emerald-500' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${available ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-[10px] font-black uppercase tracking-widest ${available ? 'text-emerald-500' : 'text-gray-300'}`}>
            {available ? 'Active' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-maroon/5 text-maroon flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Offers</span>
            <h4 className="text-xl font-black text-gray-900">{offers.length}</h4>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pending</span>
            <h4 className="text-xl font-black text-gray-900">{offers.filter(o => o.status === 'pending').length}</h4>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Accepted</span>
            <h4 className="text-xl font-black text-gray-900">{offers.filter(o => o.status === 'accepted').length}</h4>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-col space-y-8">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-maroon" /> Recent Job Offers
              </h3>
              {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Company</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Position</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Salary</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Received</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr><td colSpan="6" className="p-20 text-center"><Loader className="animate-spin mx-auto text-maroon" /></td></tr>
                  ) : offers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <MessageSquare size={32} className="text-gray-100" />
                          <p className="text-gray-400 font-medium text-sm">No job offers received yet. Your profile is visible to employers.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    offers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{offer.company || 'Direct Employment'}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-gray-600">{offer.position}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-black text-emerald-600">KSh {(offer.salary || 0).toLocaleString()}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant={offer.status === 'accepted' ? 'success' : offer.status === 'declined' ? 'red' : 'yellow'}>
                            <span className="uppercase text-[9px] font-black tracking-widest">{offer.status || 'Pending'}</span>
                          </Badge>
                        </td>
                        <td className="p-4 text-xs font-medium text-gray-400">
                          {new Date(offer.created_at || offer.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          {offer.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOfferAction(offer.id, 'accept')}
                                className="glass-button p-2"
                                title="Accept Offer"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleOfferAction(offer.id, 'decline')}
                                className="glass-button black p-2"
                                title="Decline Offer"
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dashboard-right-col space-y-8">
          <div className="glass-card p-6 bg-gradient-to-br from-maroon/5 to-transparent border-l-4 border-maroon">
            <h4 className="font-bold text-gray-900">Finalize Profile</h4>
            <p className="text-xs font-medium text-gray-500 mt-1 mb-4">Complete your details to increase hire visibility.</p>
            <button
              className="glass-button w-full mt-auto"
              onClick={() => setActiveTab("Profile")}
            >
              Edit Profile &rarr;
            </button>
          </div>

          <div className="glass-card p-6 border-l-4 border-emerald-500 bg-emerald-50/20">
            <h4 className="font-bold text-emerald-600 text-sm uppercase tracking-widest">Active Search</h4>
            <p className="text-xs font-medium text-emerald-800 mt-2">Your profile is currently active in the talent pool.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      menuItems={menuItems.map((item) => ({
        ...item,
        isActive: activeTab === item.id,
      }))}
      role="jobseeker"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {activeTab === "Overview" && renderOverview()}
        {activeTab === "Profile" && <JobseekerProfileView />}
        {activeTab === "Documents" && <JobseekerDocumentsView />}
        {activeTab === "Status" && <JobseekerApplicationsView />}
        {activeTab === "Notifications" && <JobseekerNotificationsView />}
        {activeTab === "Settings" && <JobseekerSettingsView />}
      </div>
    </DashboardLayout>
  );
};

export default JobseekerDashboard;