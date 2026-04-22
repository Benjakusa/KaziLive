import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/shared/DataTable";
import { BASE_URL } from "../../services/api";

import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import JobseekerProfileView from "../../components/dashboard/JobseekerProfileView";
import JobseekerDocumentsView from "../../components/dashboard/JobseekerDocumentsView";
import JobseekerApplicationsView from "../../components/dashboard/JobseekerApplicationsView";
import JobseekerNotificationsView from "../../components/dashboard/JobseekerNotificationsView";
import JobseekerSettingsView from "../../components/dashboard/JobseekerSettingsView";

const JobseekerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  // ✅ OFFERS STATE
  const [offers, setOffers] = useState([
    {
      id: 1,
      company: "Tech Corp",
      position: "Frontend Developer",
      salary: "KSh 120,000",
      date: "2024-04-10",
    },
    {
      id: 2,
      company: "Innovate Solutions",
      position: "React Specialist",
      salary: "KSh 150,000",
      date: "2024-04-12",
    },
  ]);

  // ✅ REAL ACCEPT / DECLINE HANDLER
  const handleOfferAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/jobseeker/offers/${id}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 remove instantly from UI
      setOffers((prev) => prev.filter((offer) => offer.id !== id));

    } catch (err) {
      console.error("Offer action failed:", err);
      alert("Failed to process offer");
    }
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/jobseeker/login";
  };

  // ✅ AVAILABILITY
  const [available, setAvailable] = useState(true);

  // ✅ MENU
  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, id: "Overview", onClick: () => setActiveTab("Overview") },
    { label: "My Profile", icon: User, id: "Profile", onClick: () => setActiveTab("Profile") },
    { label: "My Documents", icon: FileText, id: "Documents", onClick: () => setActiveTab("Documents") },
    { label: "Application Status", icon: Briefcase, id: "Status", onClick: () => setActiveTab("Status") },
    { label: "Notifications", icon: Bell, id: "Notifications", onClick: () => setActiveTab("Notifications") },
    { label: "Settings", icon: Settings, id: "Settings", onClick: () => setActiveTab("Settings") },
    { label: "Logout", icon: LogOut, id: "Logout", onClick: handleLogout },
  ];

  // ✅ TABLE
  const offerColumns = [
    { header: "Company", accessor: "company" },
    { header: "Position", accessor: "position" },
    { header: "Salary", accessor: "salary" },
    { header: "Date", accessor: "date" },
    {
      header: "Actions",
      accessor: "id",
      render: (id) => (
        <div className="table-actions">
          <button
            className="btn-table btn-accept"
            onClick={() => handleOfferAction(id, "accept")}
          >
            Accept
          </button>

          <button
            className="btn-table btn-decline"
            onClick={() => handleOfferAction(id, "decline")}
          >
            Decline
          </button>
        </div>
      ),
    },
  ];

  // ✅ OVERVIEW
  const renderOverview = () => (
    <div className="dashboard-grid">

      <div className="card">
        <h3>Profile Completion</h3>
        <button
          className="btn-outline-maroon mt-4"
          onClick={() => setActiveTab("Profile")}
        >
          Edit Profile
        </button>
      </div>

      <div className="card mt-6">
        <h3>Job Offers</h3>
        <DataTable columns={offerColumns} data={offers} />
      </div>

      <div className="card mt-6">
        <h3>Availability</h3>
        <label>
          <input
            type="checkbox"
            checked={available}
            onChange={() => setAvailable(!available)}
          />
          Available for Work
        </label>
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
      {activeTab === "Overview" && renderOverview()}
      {activeTab === "Profile" && <JobseekerProfileView />}
      {activeTab === "Documents" && <JobseekerDocumentsView />}
      {activeTab === "Status" && <JobseekerApplicationsView />}
      {activeTab === "Notifications" && <JobseekerNotificationsView />}
      {activeTab === "Settings" && <JobseekerSettingsView />}
    </DashboardLayout>
  );
};

export default JobseekerDashboard; 