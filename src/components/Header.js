import React from 'react';
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
                                        onClick={() => onNotificationsClick && onNotificationsClick()}
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
                                    <button type="button" style={styles.menuButton}>
                                        <i className="fas fa-user" style={{ marginRight: '6px' }}></i>
                                        Profil
                                    </button>
                                </nav>
                                <button
                                    onClick={onLogout}
                                    style={styles.logoutButton}
                                    title="Çıkış Yap"
                                    type="button"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
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
