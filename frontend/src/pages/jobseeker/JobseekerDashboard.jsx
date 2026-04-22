import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
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

  // ===============================
  // OFFERS (NOW BACKEND POWERED)
  // ===============================
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/jobseeker/offers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setOffers(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error("OFFERS LOAD ERROR:", err);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchOffers();
  }, []);

  // ===============================
  // FIXED OFFER ACTION HANDLER
  // ===============================
  const handleOfferAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/jobseeker/offers/${id}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to process offer");
      }

      // remove locally ONLY after backend success
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("OFFER ERROR:", err);
      alert(err.message || "Offer action failed");
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/jobseeker/login";
  };

  // ===============================
  // AVAILABILITY
  // ===============================
  const [available, setAvailable] = useState(true);

  // ===============================
  // MENU
  // ===============================
  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, id: "Overview", onClick: () => setActiveTab("Overview") },
    { label: "My Profile", icon: User, id: "Profile", onClick: () => setActiveTab("Profile") },
    { label: "My Documents", icon: FileText, id: "Documents", onClick: () => setActiveTab("Documents") },
    { label: "Application Status", icon: Briefcase, id: "Status", onClick: () => setActiveTab("Status") },
    { label: "Notifications", icon: Bell, id: "Notifications", onClick: () => setActiveTab("Notifications") },
    { label: "Settings", icon: Settings, id: "Settings", onClick: () => setActiveTab("Settings") },
    { label: "Logout", icon: LogOut, id: "Logout", onClick: handleLogout },
  ];

  // ===============================
  // OFFERS TABLE
  // ===============================
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
            className="btn-accept"
            onClick={() => handleOfferAction(id, "accept")}
          >
            Accept
          </button>

          <button
            className="btn-decline"
            onClick={() => handleOfferAction(id, "decline")}
          >
            Decline
          </button>
        </div>
      ),
    },
  ];

  // ===============================
  // OVERVIEW
  // ===============================
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

        {loadingOffers ? (
          <p>Loading offers...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                {offerColumns.map((col) => (
                  <th key={col.header}>{col.header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td>{offer.company}</td>
                  <td>{offer.position}</td>
                  <td>{offer.salary}</td>
                  <td>{offer.date}</td>
                  <td>
                    <button onClick={() => handleOfferAction(offer.id, "accept")}>
                      Accept
                    </button>

                    <button onClick={() => handleOfferAction(offer.id, "decline")}>
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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