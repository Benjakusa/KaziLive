import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarOpen: true,
    activeRole: null, // 'jobseeker', 'employer', 'admin'
    jobseekerData: {
        profileCompletion: 75,
        verificationStatus: 'Verified',
        recentViews: 12,
        unreadMessages: 3,
        newOffers: 2,
    },
    employerData: {
        creditBalance: 500,
        activeJobs: 5,
        savedTalent: 18,
        unreadMessages: 7,
    },
    adminData: {
        pendingVerifications: 14,
        newSupportTickets: 5,
        totalRevenue: 125000,
    },
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        setActiveRole: (state, action) => {
            state.activeRole = action.payload;
        },
        // Add more reducers as needed for dashboard data updates
    },
});

export const { toggleSidebar, setSidebarOpen, setActiveRole } = dashboardSlice.actions;
export default dashboardSlice.reducer;
