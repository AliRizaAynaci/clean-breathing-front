import React from 'react';
import { styles } from '../styles/components';

const Header = ({ onGoogleLogin, onLogout }) => {
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
                        <div id="user-info" className="user-info hidden" style={styles.userInfo}>
                            <div style={styles.userAvatar} id="user-avatar">K</div>
                            <span id="user-name" style={styles.userName}>Kullanıcı</span>
                            <button 
                                onClick={onLogout}
                                style={styles.logoutButton}
                                title="Çıkış Yap"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                        <button 
                            id="login-button" 
                            onClick={onGoogleLogin}
                            style={styles.loginButton}
                        >
                            <i className="fab fa-google" style={{marginRight: '8px'}}></i>
                            Google ile Giriş
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
