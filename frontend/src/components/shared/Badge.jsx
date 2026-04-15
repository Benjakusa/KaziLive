import React from 'react';

const Badge = ({ children, variant = 'maroon', size = 'md' }) => {
    const variantClasses = {
        maroon: 'badge-maroon',
        yellow: 'badge-yellow',
        success: 'badge-success',
        danger: 'badge-danger',
        info: 'badge-info',
        black: 'badge-black'
    };

    return (
        <span className={`badge-custom ${variantClasses[variant]} badge-${size}`}>
            {children}
        </span>
    );
};

export default Badge;
