import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
    return (
        <div className="stat-card">
            <div className="stat-info">
                <h4>{title}</h4>
                <div className="stat-value">{value}</div>
                {trend && (
                    <div className={`mt-2 text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}%
                        <span className="text-secondary font-normal ml-1">vs last month</span>
                    </div>
                )}
            </div>
            <div className="stat-icon-wrapper">
                <Icon size={24} />
            </div>
        </div>
    );
};

export default StatCard;
