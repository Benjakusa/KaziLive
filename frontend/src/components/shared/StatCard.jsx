import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'maroon' }) => {
    return (
        <div className={`stat-card-custom border-${color}`}>
            <div className="stat-card-header">
                <div className={`stat-icon-wrapper bg-${color}-light`}>
                    <Icon size={24} className={`text-${color}`} />
                </div>
                {trend && (
                    <span className={`stat-trend ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}%
                    </span>
                )}
            </div>
            <div className="stat-card-body">
                <h3 className="stat-value">{value}</h3>
                <p className="stat-label">{title}</p>
            </div>
        </div>
    );
};

export default StatCard;
