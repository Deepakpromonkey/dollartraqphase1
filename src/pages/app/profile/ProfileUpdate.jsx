// ProfileUpdate.jsx
import React, { useState, useEffect } from 'react';
import Main from 'components/Main';
import WdForm from 'components/wd/form/WdForm';
import ProfileSidebar from './ProfileSidebar';

const ProfileUpdate = () => {
    const [accountToken, setAccountToken] = useState(false);
    const [user, setUser] = useState({});
    const [role, setRole] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadData = () => {
            const token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
            const storedUser = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);
            const storedRole = localStorage.getItem('role');
            
            if (token) setAccountToken(token);
            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedRole) {
                try { 
                    setRole(JSON.parse(storedRole)); 
                } catch { 
                    setRole(storedRole); 
                }
            }
        };

        // Load immediately on mount
        loadData();

        // Listen for updates if data is fetched and stored in the background later
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const getInitials = () => {
        const f = user.first_name?.[0] || '';
        const l = user.last_name?.[0] || '';
        return (f + l).toUpperCase() || '?';
    };

    const getRoleLabel = () => {
        // users_of blank/null means this is a top-level account -> admin
        if (!user.users_of) return 'admin';

        // Otherwise use role_names from the load API as the source of truth
        if (user.role_names) return user.role_names;

        // Fallback to whatever was stored locally, in case role_names
        // hasn't loaded yet (e.g. before app/profile/load resolves)
        const currentRole = role || user.role;
        if (!currentRole) return null;

        return typeof currentRole === 'object'
            ? (currentRole.name || currentRole.label || currentRole.role || '')
            : String(currentRole);
    };

    const InfoRow = ({ label, value, icon }) => (
        <div className="flex items-start gap-4 py-4 border-b border-[#f1f5f9] last:border-0">
            <div className="w-8 h-8 rounded-lg bg-[#f0f7ff] flex items-center justify-center text-[#2563eb] flex-shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">{label}</span>
                <span className="text-[15px] font-semibold text-[#0B1E33] break-all">{value || '—'}</span>
            </div>
        </div>
    );

    return (
        <Main
            page="profile"
            active_page="profile"
            error_message={errorMessage}
            success_message={successMessage}
            full_width={true}
        >
            <div className="flex flex-col md:flex-row min-h-screen">

                {/* Sidebar - Kept structural and constant */}
                <ProfileSidebar active="profile_update" />

                {/* Main content */}
                <div className="flex-1 bg-[#F6F7F0] px-4 md:px-10 py-8">
                    <div className="max-w-2xl mx-auto">

                        {/* Hero card */}
                        <div className="relative bg-[#00337C] rounded-2xl overflow-hidden mb-5 px-8 py-8">
                            <div className="absolute inset-0 opacity-[0.07]"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 85% 15%, #ffffff 0%, transparent 55%),
                                                      radial-gradient(circle at 5% 85%, #4fa3ff 0%, transparent 50%)`
                                }}
                            />
                            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">

                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    {user.profile_pic_url ? (
                                        <img
                                            src={user.profile_pic_url}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-white/15 border-4 border-white/20 flex items-center justify-center shadow-lg">
                                            <span className="text-2xl font-extrabold text-white">{getInitials()}</span>
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#00337C]" />
                                </div>

                                {/* Name + role */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-xl font-extrabold text-white tracking-tight">
                                        {user.first_name} {user.last_name} ({getRoleLabel() || '-'})
                                    </h1>
                                    <p className="text-blue-200 text-sm mt-0.5">{user.email}</p>
                                    
                                    {getRoleLabel() && (
                                        <div className="inline-flex items-center gap-2 mt-2.5 bg-white/15 border border-white/20 rounded-full px-3.5 py-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            <span className="text-white text-[11px] font-semibold tracking-wide">
                                                Logged in as&nbsp;<span className="text-green-300">({getRoleLabel()})</span>
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Edit button */}
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="flex-shrink-0 flex items-center gap-2 bg-white text-[#00337C] font-bold text-sm px-5 py-2.5 rounded-xl shadow hover:bg-blue-50 transition-colors"
                                >
                                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                        <path d="M9.5 2L12 4.5L4.5 12H2V9.5L9.5 2Z" stroke="#00337C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Info card */}
                        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm px-6 py-1 mb-5">
                            <InfoRow
                                label="Full Name"
                                value={`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                                icon={
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                }
                            />
                            <InfoRow
                                label="Email Address"
                                value={user.email}
                                icon={
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                }
                            />
                            <InfoRow
                                label="Mobile"
                                value={user.contact}
                                icon={
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <rect x="4" y="1" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                        <circle cx="8" cy="12" r="0.8" fill="currentColor"/>
                                    </svg>
                                }
                            />
                            <InfoRow
                                label="Member Since"
                                value={user.added_on_formatted}
                                icon={
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M5 1v3M11 1v3M1 6h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                }
                            />
                            <InfoRow
                                label="Role"
                                value={getRoleLabel() || '—'}
                                icon={
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4L2 5h4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                                    </svg>
                                }
                            />
                        </div>

                        {/* Security note */}
                        <div className="flex items-center gap-3 bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl px-5 py-3.5">
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                <path d="M8 1L2 4V8C2 11.3 4.6 14.4 8 15C11.4 14.4 14 11.3 14 8V4L8 1Z" stroke="#2563eb" strokeWidth="1.4" strokeLinejoin="round"/>
                                <path d="M5.5 8L7 9.5L10.5 6" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-xs text-[#1d4ed8] font-medium">
                                Contact your administrator to change your email or password.
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* WdForm drawer */}
            <WdForm
                title="Edit Profile"
                drawer={true}
                open={editOpen}
                position="right"
                size={window.innerWidth < 600 ? 'full' : 'medium'}
                onBack={() => setEditOpen(false)}
                submit_url="app/profile/update"
                data_url="app/profile/load"
                onSubmit={(result) => {
                    // app/profile/update returns the same shape as app/profile/load:
                    // { status: true, data: {...updated user...} }
                    const updatedUser = result?.data || result?.user || result?.row;

                    if (result?.status && updatedUser) {
                        localStorage.setItem(import.meta.env.VITE_ACCOUNT_USER, JSON.stringify(updatedUser));
                        setUser(updatedUser);
                        setSuccessMessage('Profile updated successfully.');
                        setTimeout(() => setSuccessMessage(''), 4000);
                    }
                    setEditOpen(false);
                }}
                row_id={user.row_id}
                id="row_id"
                title_field="first_name"
                updated_on="updated_on_formatted"
                fields={{
                    rows: [
                        {
                            fields: [
                                { key: 'profile_pic', type: 'image', name: 'profile_pic', label: 'Profile Picture', validations: ['r'], span: 6, path: 'profile_pic/', formatted_field: 'profile_pic_url', allowed_types: 'jpg,png,webp' }
                            ]
                        },
                        {
                            fields: [
                                { key: 'first_name', type: 'input', name: 'first_name', label: 'First Name', validations: ['r'], span: 3 },
                                { key: 'last_name', type: 'input', name: 'last_name', label: 'Last Name', validations: ['r'], span: 3 }
                            ]
                        },
                        {
                            fields: [
                                { key: 'contact', type: 'input', name: 'contact', label: 'Mobile', validations: ['r', 'num', 'min-10'], span: 6 }
                            ]
                        }
                    ]
                }}
            />
        </Main>
    );
};

export default ProfileUpdate;