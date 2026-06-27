// ProfilePassword.jsx
import React, { useState, useEffect } from 'react';
import Main from 'components/Main';
import Api from 'api/Api';
import ProfileSidebar from './ProfileSidebar';

const EyeIcon = ({ show }) => show ? (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
) : (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M1 1l14 14M6.5 6.6A2 2 0 0010.4 9.5M4 4.2C2.3 5.3 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M6 3.1C6.6 3 7.3 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.8 2.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
);

const PasswordField = ({ label, value, onChange, error, show, onToggle, placeholder, name, autoComplete }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>
            {label}
        </label>
        <div style={{
            display: 'flex', alignItems: 'center',
            backgroundColor: error ? '#fef2f2' : '#fff',
            border: `1px solid ${error ? '#f87171' : '#e2e8f0'}`,
            borderRadius: 12, padding: '12px 16px', gap: 10,
        }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: '#94a3b8', flexShrink: 0 }}>
                <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="1" fill="currentColor"/>
            </svg>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                name={name}
                autoComplete={autoComplete}
                style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 14, fontWeight: 500, color: '#0B1E33',
                }}
            />
            <button
                type="button"
                onClick={onToggle}
                style={{ color: '#94a3b8', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', padding: 0, flexShrink: 0 }}
            >
                <EyeIcon show={show} />
            </button>
        </div>
        {error && (
            <p style={{ margin: 0, fontSize: 11, color: '#ef4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                {error}
            </p>
        )}
    </div>
);

const ProfilePassword = () => {
    const [accountToken, setAccountToken] = useState(false);
    const [rowId, setRowId] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);
        if (!token) token = localStorage.getItem('cnc_employees_chip');
        if (!user) user = localStorage.getItem('cnc_employees_user');
        if (token && user) {
            setAccountToken(token);
            setRowId(JSON.parse(user)?.row_id || false);
        } else {
            setErrorMessage('Login details not found.');
        }
    }, []);

    const submit = () => {
        let hasError = false;
        if (!oldPassword) { setOldPasswordError('Current password is required.'); hasError = true; } else setOldPasswordError('');
        if (!password || password.length < 6) { setPasswordError('Password must be at least 6 characters.'); hasError = true; } else setPasswordError('');
        if (!confirmPassword || confirmPassword !== password) { setConfirmPasswordError('Must match new password.'); hasError = true; } else setConfirmPasswordError('');
        if (!rowId) { setErrorMessage('User not found.'); hasError = true; }

        if (!hasError) {
            const formData = new FormData();
            formData.append('row_id', rowId);
            formData.append('old_password', oldPassword);
            formData.append('new_password', password);
            formData.append('password', confirmPassword);
            formData.append('account_token', accountToken);
            setLoading(true); 
            Api.post('app/profile/update/password', formData, (data) => {
                setLoading(false);
                if (data.status) {
                    localStorage.setItem('flash_success_message', data.message);
                    window.location = '/logout';
                } else {
                    setErrorMessage(data.message);
                    setTimeout(() => setErrorMessage(''), 5000);
                }
            });
        }
    };

    return (
        <Main
            page="profile"
            active_page="profile"
            error_message={errorMessage}
            success_message={successMessage}
            full_width={true}
        >
            {/* ✅ FIXED: Removed minHeight restriction here to prevent pushing content down layout components */}
            <div style={{ display: 'flex', width: '100%' }}>

                <ProfileSidebar active="profile_change_password" />

                {/* ✅ FIXED: Updated container heights and padding context to correctly eliminate excess top spacing */}
                <div style={{ 
                    flex: 1, 
                    backgroundColor: '#F6F7F0', 
                    padding: '60px 40px', // Uniform padding to look completely balanced
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start', // Keeps layout crisp and top-aligned cleanly rather than hanging too low
                    minHeight: 'calc(100vh - 70px)' // Compensates for the navbar area height beautifully
                }}>
                    <div style={{ width: '100%', maxWidth: 500 }}>

                        <div style={{ marginBottom: 28, textAlign: 'center' }}>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1E33', margin: 0, letterSpacing: '-0.02em' }}>
                                Change Password
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: 13, margin: '6px 0 0' }}>
                                You'll be logged out after a successful password change.
                            </p>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                            <input
                                type="text"
                                name="username"
                                autoComplete="username"
                                value=""
                                readOnly
                                style={{ display: 'none' }}
                                aria-hidden="true"
                                tabIndex={-1}
                            />

                            <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #edf2f7', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                                <PasswordField
                                    label="Current Password"
                                    value={oldPassword}
                                    onChange={(val) => { setOldPassword(val); if (oldPasswordError) setOldPasswordError(''); }}
                                    error={oldPasswordError}
                                    show={showOld}
                                    onToggle={() => setShowOld(v => !v)}
                                    placeholder="Enter current password"
                                    name="current-password"
                                    autoComplete="current-password"
                                />

                                <div style={{ borderTop: '1px solid #f1f5f9' }} />

                                <PasswordField
                                    label="New Password"
                                    value={password}
                                    onChange={(val) => {
                                        setPassword(val);
                                        if (passwordError) setPasswordError('');
                                        if (confirmPasswordError && confirmPassword && val === confirmPassword) setConfirmPasswordError('');
                                    }}
                                    error={passwordError}
                                    show={showNew}
                                    onToggle={() => setShowNew(v => !v)}
                                    placeholder="Min. 6 characters"
                                    name="new-password"
                                    autoComplete="new-password"
                                />

                                <PasswordField
                                    label="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(val) => { setConfirmPassword(val); if (confirmPasswordError) setConfirmPasswordError(''); }}
                                    error={confirmPasswordError}
                                    show={showConfirm}
                                    onToggle={() => setShowConfirm(v => !v)}
                                    placeholder="Re-enter new password"
                                    name="confirm-password"
                                    autoComplete="new-password"
                                />

                                {/* Strength bar */}
                                {password.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {[1,2,3,4].map(i => (
                                            <div key={i} style={{
                                                height: 4, flex: 1, borderRadius: 999,
                                                backgroundColor: password.length >= i * 3
                                                    ? i <= 2 ? '#fb923c' : '#4ade80'
                                                    : '#e2e8f0',
                                                transition: 'background-color 0.2s'
                                            }} />
                                        ))}
                                        <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginLeft: 4, whiteSpace: 'nowrap' }}>
                                            {password.length < 6 ? 'Weak' : password.length < 10 ? 'Fair' : 'Strong'}
                                        </span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        backgroundColor: loading ? '#94a3b8' : '#00337C',
                                        color: '#fff', fontWeight: 700, fontSize: 14,
                                        padding: '14px 24px', borderRadius: 12,
                                        border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                        marginTop: 4, width: '100%'
                                    }}
                                >
                                    {loading ? 'Updating…' : 'Reset Password'}
                                </button>
                            </div>
                        </form>

                        <div style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            backgroundColor: '#fffbeb', border: '1px solid #fde68a',
                            borderRadius: 14, padding: '14px 20px', marginTop: 16
                        }}>
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                                <circle cx="8" cy="8" r="7" stroke="#d97706" strokeWidth="1.4"/>
                                <path d="M8 5v4M8 10.5v.5" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                            <p style={{ margin: 0, fontSize: 12, color: '#92400e', fontWeight: 500, lineHeight: 1.5 }}>
                                After resetting your password you will be automatically logged out and redirected to the login page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default ProfilePassword;