// ProfileSidebar.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

// Brand blue used elsewhere in the app (the "Reset Password" button on the
// password page), so the active state here reads as the same product
// rather than a generic link-blue.
const BRAND_BLUE = '#00337C';
const BRAND_BLUE_TINT = '#EEF3FA';

const ProfileSidebar = ({ active, user }) => {
    const [hoveredItem, setHoveredItem] = useState(null);

    const navItems = [
        {
            key: 'profile_update',
            label: 'Profile Information',
            description: 'Name, email & contact details',
            to: '/profile',
            icon: (
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            )
        },
        {
            key: 'profile_change_password',
            label: 'Change Password',
            description: 'Update your login credentials',
            to: '/profile/password',
            icon: (
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="8" cy="11" r="1" fill="currentColor"/>
                </svg>
            )
        }
    ];

    const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';
    const initial = (user?.first_name || fullName || 'A').charAt(0).toUpperCase();

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRight: '1px solid #eef1f5',
            minHeight: '100vh',
            width: '260px',
            flexShrink: 0,
            padding: '32px 18px',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }}>
            {/* Identity block — only renders the name if we actually have
                one, so it never shows a fake placeholder name */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '4px 10px 24px',
                marginBottom: '8px',
                borderBottom: '1px solid #f1f4f8',
            }}>

                <div style={{ minWidth: 0 }}>
                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {fullName || 'Account Settings'}
                    </p>
                    <p style={{
                        margin: '2px 0 0',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#94a3b8',
                    }}>
                        {fullName ? 'Account settings' : 'Manage your account'}
                    </p>
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navItems.map(item => {
                    const isActive = active === item.key;
                    const isHovered = hoveredItem === item.key;

                    let backgroundColor = 'transparent';
                    let labelColor = '#334155';
                    let descColor = '#94a3b8';
                    let iconColor = '#94a3b8';
                    let iconBg = '#f1f5f9';

                    if (isActive) {
                        backgroundColor = BRAND_BLUE_TINT;
                        labelColor = BRAND_BLUE;
                        descColor = '#5b7aa8';
                        iconColor = '#fff';
                        iconBg = BRAND_BLUE;
                    } else if (isHovered) {
                        backgroundColor = '#f8fafc';
                        labelColor = '#0f172a';
                        iconColor = '#475569';
                        iconBg = '#e2e8f0';
                    }

                    return (
                        <Link
                            key={item.key}
                            to={item.to}
                            onMouseEnter={() => setHoveredItem(item.key)}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                backgroundColor,
                                transition: 'background-color 0.15s ease',
                            }}
                        >
                            <span style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '9px',
                                backgroundColor: iconBg,
                                color: iconColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'background-color 0.15s ease, color 0.15s ease',
                            }}>
                                {item.icon}
                            </span>

                            <span style={{ minWidth: 0 }}>
                                <span style={{
                                    display: 'block',
                                    fontSize: '13.5px',
                                    fontWeight: isActive ? 700 : 600,
                                    color: labelColor,
                                    transition: 'color 0.15s ease',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {item.label}
                                </span>
                                <span style={{
                                    display: 'block',
                                    fontSize: '11.5px',
                                    color: descColor,
                                    marginTop: '1px',
                                    transition: 'color 0.15s ease',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {item.description}
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default ProfileSidebar;