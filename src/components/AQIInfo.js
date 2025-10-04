import React from 'react';
import { styles } from '../styles/components';

const AQIInfo = () => {
    const saveSettings = () => {
        const threshold = document.getElementById("threshold").value;
        alert(
            `Bildirim eşiği ${threshold} AQI olarak ayarlandı. Hava kalitesi bu değeri aştığında e-posta bildirimi alacaksınız.`
        );
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <i className="fas fa-chart-line" style={styles.cardIcon}></i>
                <h2 style={styles.cardTitle}>Hava Kalitesi Bilgileri</h2>
            </div>
            <div style={styles.aqiInfo}>
                <div style={styles.aqiValueContainer}>
                    <div className="aqi-value aqi-good" id="aqi-value" style={styles.aqiValue}>25</div>
                    <p style={styles.aqiLabel}>Hava Kalitesi İndeksi</p>
                </div>
                
                <div style={styles.aqiDetails}>
                    <div style={styles.detailItem}>
                        <div style={styles.detailIcon} className="icon-float">
                            <i className="fas fa-thermometer-half"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>Sıcaklık</span>
                            <span style={styles.detailValue} id="temperature-value">20°C</span>
                            <span style={styles.detailDesc}>Temperature</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.1s'}} className="icon-float">
                            <i className="fas fa-tint"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>Nem</span>
                            <span style={styles.detailValue} id="humidity-value">65%</span>
                            <span style={styles.detailDesc}>Humidity</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.2s'}} className="icon-float">
                            <i className="fas fa-smog"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>PM2.5</span>
                            <span style={styles.detailValue} id="pm25-value">12 µg/m³</span>
                            <span style={styles.detailDesc}>İnce Partiküller</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.3s'}} className="icon-float">
                            <i className="fas fa-cloud"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>PM10</span>
                            <span style={styles.detailValue} id="pm10-value">24 µg/m³</span>
                            <span style={styles.detailDesc}>Kaba Partiküller</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.4s'}} className="icon-float">
                            <i className="fas fa-wind"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>NO2</span>
                            <span style={styles.detailValue} id="no2-value">18 µg/m³</span>
                            <span style={styles.detailDesc}>Azot Dioksit</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.5s'}} className="icon-float">
                            <i className="fas fa-fire"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>SO2</span>
                            <span style={styles.detailValue} id="so2-value">15 µg/m³</span>
                            <span style={styles.detailDesc}>Kükürt Dioksit</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.6s'}} className="icon-float">
                            <i className="fas fa-car"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>CO</span>
                            <span style={styles.detailValue} id="co-value">2.1 mg/m³</span>
                            <span style={styles.detailDesc}>Karbon Monoksit</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.7s'}} className="icon-float">
                            <i className="fas fa-city"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>Yoğunluk</span>
                            <span style={styles.detailValue} id="density-value">5,000 /km²</span>
                            <span style={styles.detailDesc}>Density</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.8s'}} className="icon-float">
                            <i className="fas fa-users"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>Nüfus</span>
                            <span style={styles.detailValue} id="population-value">250,000</span>
                            <span style={styles.detailDesc}>Population</span>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{...styles.detailIcon, animationDelay: '0.9s'}} className="icon-float">
                            <i className="fas fa-industry"></i>
                        </div>
                        <div style={styles.detailContent}>
                            <span style={styles.detailLabel}>Sanayi Mesafesi</span>
                            <span style={styles.detailValue} id="proximity-value">5 km</span>
                            <span style={styles.detailDesc}>Industrial Proximity</span>
                        </div>
                    </div>
                </div>

                <div className="notification-settings hidden" id="notification-settings" style={styles.notificationSettings}>
                    <div style={styles.notificationHeader}>
                        <i className="fas fa-bell" style={styles.bellIcon}></i>
                        <h3 style={styles.notificationTitle}>Bildirim Ayarları</h3>
                    </div>
                    <p style={styles.notificationDesc}>
                        Hava kalitesi belirli bir seviyenin üzerine çıktığında e-posta bildirimi alın
                    </p>
                    <div style={styles.notificationForm}>
                        <div style={styles.formGroup}>
                            <label htmlFor="threshold" style={styles.formLabel}>
                                <i className="fas fa-sliders-h" style={{marginRight: '8px'}}></i>
                                Bildirim Eşiği (AQI)
                            </label>
                            <select id="threshold" style={styles.formSelect}>
                                <option value="50">50 - İyi</option>
                                <option value="100">100 - Orta</option>
                                <option value="150">150 - Hassas Gruplar İçin Sağlıksız</option>
                                <option value="200">200 - Sağlıksız</option>
                                <option value="300">300 - Çok Sağlıksız</option>
                            </select>
                        </div>
                        <button style={styles.btnPrimary} onClick={saveSettings}>
                            <i className="fas fa-save" style={{marginRight: '8px'}}></i>
                            Ayarları Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AQIInfo;
