import React, { useEffect, useRef, useState } from 'react';
import { styles } from '../styles/components';

const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) {
        return 'K';
    }

    const parts = nameOrEmail.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const Header = ({ user, loading, onGoogleLogin, onLogout, onNotificationsClick, notificationsStatus }) => {
    const displayName = user?.name || user?.fullName || user?.email || 'Kullanıcı';
    const initials = getInitials(displayName);
    const notificationState = notificationsStatus?.state;
    const hasActiveSubscription = notificationState === 'success';
    const hasError = notificationState === 'error';
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    const closeProfileMenu = () => setProfileMenuOpen(false);

    useEffect(() => {
        if (!isProfileMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                closeProfileMenu();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeProfileMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isProfileMenuOpen]);

    useEffect(() => {
        if (!user) {
            closeProfileMenu();
        }
    }, [user]);

    const handleNotifications = () => {
        if (onNotificationsClick) {
            onNotificationsClick();
        }
        closeProfileMenu();
    };

    const handleProfileToggle = () => {
        setProfileMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        closeProfileMenu();
    };

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                <div style={styles.headerContent}>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>
                            <i className="fas fa-wind"></i>
                        </div>
                        <h1 style={styles.logoText}>Clean Breathing</h1>
                    </div>
                    <div style={styles.userActions}>
                        {loading ? (
                            <div style={styles.loadingIndicator}>
                                <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i>
                                Giriş durumu kontrol ediliyor...
                            </div>
                        ) : user ? (
                            <div style={styles.userSection}>
                                <div style={styles.userInfo}>
                                    <div style={styles.userAvatar}>{initials}</div>
                                    <div style={styles.userDetails}>
                                        <span style={styles.userName}>{displayName}</span>
                                        {user?.email && (
                                            <span style={styles.userEmail}>{user.email}</span>
                                        )}
                                    </div>
                                </div>
                                <nav style={styles.userMenu} aria-label="Kullanıcı menüsü">
                                    <button 
                                        type="button" 
                                        style={styles.menuButton}
                                        onClick={handleNotifications}
                                    >
                                        <i className="fas fa-bell" style={{ marginRight: '6px' }}></i>
                                        Bildirimler
                                        {hasActiveSubscription && (
                                            <span style={styles.notificationDot} aria-hidden="true"></span>
                                        )}
                                        {hasError && (
                                            <span style={{ ...styles.notificationDot, background: '#ff6b6b' }} aria-hidden="true"></span>
                                        )}
                                    </button>
                                    <div style={styles.profileMenuWrapper} ref={profileMenuRef}>
                                        <button
                                            type="button"
                                            style={isProfileMenuOpen ? { ...styles.menuButton, ...styles.menuButtonActive } : styles.menuButton}
                                            onClick={handleProfileToggle}
                                            aria-haspopup="true"
                                            aria-expanded={isProfileMenuOpen}
                                        >
                                            <i className="fas fa-user" style={{ marginRight: '6px' }}></i>
                                            Profil
                                            <i
                                                className={`fas fa-chevron-${isProfileMenuOpen ? 'up' : 'down'}`}
                                                style={{ marginLeft: '6px', fontSize: '12px' }}
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                        {isProfileMenuOpen && (
                                            <div style={styles.profileDropdown} role="menu">
                                                <div style={styles.profileSummary}>
                                                    <div style={styles.profileSummaryAvatar}>{initials}</div>
                                                    <div style={styles.profileSummaryDetails}>
                                                        <span style={styles.profileSummaryName}>{displayName}</span>
                                                        {user?.email && (
                                                            <span style={styles.profileSummaryEmail}>{user.email}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={styles.profileDivider}></div>
                                                <div style={styles.profileActions}>
                                                    <button type="button" style={styles.profileActionButton} onClick={handleNotifications}>
                                                        <i className="fas fa-bell"></i>
                                                        Bildirim tercihleri
                                                    </button>
                                                    <button type="button" style={styles.profileActionButtonSecondary} disabled>
                                                        <i className="fas fa-id-card"></i>
                                                        Profil bilgileri (yakında)
                                                    </button>
                                                </div>
                                                <div style={styles.profileDivider}></div>
                                                <div style={styles.profileFooter}>
                                                    <span style={styles.profileStatus}>
                                                        <i className="fas fa-shield-alt"></i>
                                                        Google ile doğrulandı
                                                    </span>
                                                    <button type="button" style={styles.profileLogoutButton} onClick={handleLogout}>
                                                        <i className="fas fa-sign-out-alt"></i>
                                                        Çıkış Yap
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        ) : (
                            <button
                                onClick={onGoogleLogin}
                                style={styles.loginButton}
                                type="button"
                            >
                                <i className="fab fa-google" style={{ marginRight: '8px' }}></i>
                                Google ile Giriş
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
