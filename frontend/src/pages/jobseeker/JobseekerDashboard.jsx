import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/shared/DataTable";

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

  // ✅ OFFER ACTION
  const handleOfferAction = (id) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== id));
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/jobseeker/login";
  };

  // ✅ AVAILABILITY TOGGLE
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

  // ✅ TABLE COLUMNS
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
            onClick={() => handleOfferAction(id)}
          >
            Accept
          </button>
          <button
            className="btn-table btn-decline"
            onClick={() => handleOfferAction(id)}
          >
            Decline
          </button>
        </div>
      ),
    },
  ];

  // ✅ OVERVIEW UI
  const renderOverview = () => (
    <div className="dashboard-grid">

      {/* EDIT PROFILE */}
      <div className="card">
        <h3>Profile Completion</h3>
        <button
          className="btn-outline-maroon mt-4"
          onClick={() => setActiveTab("Profile")}
        >
          Edit Profile
        </button>
      </div>

      {/* OFFERS */}
      <div className="card mt-6">
        <h3>Job Offers</h3>
        <DataTable columns={offerColumns} data={offers} />
      </div>

      {/* AVAILABILITY */}
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