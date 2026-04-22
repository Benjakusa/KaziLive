import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'md' }) => {
    const variantClasses = {
        primary: 'badge-primary',
        secondary: 'badge-secondary',
        maroon: 'badge-primary',
        yellow: 'badge-warning',
        success: 'badge-success',
        danger: 'badge-danger',
        info: 'badge-info',
        black: 'badge-secondary'
    };

    return (
        <span className={`badge-custom ${variantClasses[variant] || 'badge-primary'} badge-${size}`}>
            {children}
        </span>
    );
};

export default Badge;
