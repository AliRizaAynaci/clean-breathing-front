import React from 'react';
import { styles } from '../styles/components';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.footerContent}>
                    <div style={styles.footerSection}>
                        <div style={styles.footerLogo}>
                            <div style={styles.footerLogoIcon}>
                                <i className="fas fa-wind"></i>
                            </div>
                            <h3 style={styles.footerLogoText}>Clean Breathing</h3>
                        </div>
                        <p style={styles.footerText}>
                            Hava kalitesini gerçek zamanlı takip edin ve sağlıklı bir yaşam için bilinçli kararlar alın.
                        </p>
                    </div>

                    <div style={styles.footerSection}>
                        <h4 style={styles.footerTitle}>İletişim</h4>
                        <div style={styles.contactItem}>
                            <i className="fas fa-envelope" style={styles.contactIcon}></i>
                            <span style={styles.contactText}>info@cleanbreathing.com</span>
                        </div>
                        <div style={styles.contactItem}>
                            <i className="fas fa-phone" style={styles.contactIcon}></i>
                            <span style={styles.contactText}>+90 (555) 123 45 67</span>
                        </div>
                        <div style={styles.contactItem}>
                            <i className="fas fa-map-marker-alt" style={styles.contactIcon}></i>
                            <span style={styles.contactText}>İstanbul, Türkiye</span>
                        </div>
                    </div>

                    <div style={styles.footerSection}>
                        <h4 style={styles.footerTitle}>Bizi Takip Edin</h4>
                        <div style={styles.socialLinks}>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <i className="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <p style={styles.copyright}>© 2024 Clean Breathing. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
