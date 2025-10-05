import React, { useMemo } from 'react';
import { styles } from '../styles/components';
import { formatMetricValue } from '../utils';

const METRIC_CONFIG = [
    { key: 'temperature', label: 'Sıcaklık', desc: 'Temperature', icon: 'fas fa-thermometer-half' },
    { key: 'humidity', label: 'Nem', desc: 'Humidity', icon: 'fas fa-tint' },
    { key: 'pm25', label: 'PM2.5', desc: 'İnce Partiküller', icon: 'fas fa-smog' },
    { key: 'pm10', label: 'PM10', desc: 'Kaba Partiküller', icon: 'fas fa-cloud' },
    { key: 'no2', label: 'NO₂', desc: 'Azot Dioksit', icon: 'fas fa-wind' },
    { key: 'so2', label: 'SO₂', desc: 'Kükürt Dioksit', icon: 'fas fa-fire' },
    { key: 'co', label: 'CO', desc: 'Karbon Monoksit', icon: 'fas fa-car' },
    { key: 'populationDensity', label: 'Nüfus Yoğunluğu', desc: 'Population Density', icon: 'fas fa-city' },
];

const AQIInfo = ({
    user,
    threshold = '100',
    onThresholdChange,
    onSaveSettings,
    status,
    aqiData,
    aqiLoading,
    aqiError,
    selectedLocation,
}) => {
    const isAuthenticated = Boolean(user);
    const notificationState = status?.state;
    const notificationMessage = status?.message;
    const helperIconClass =
        notificationState === 'error'
            ? 'fas fa-exclamation-circle'
            : notificationState === 'info'
            ? 'fas fa-info-circle'
            : 'fas fa-check-circle';

    const metrics = aqiData?.metrics ?? {};
    const riskClass = aqiData?.riskLevelClassName ?? 'aqi-moderate';
    const riskLabel = aqiData?.riskLevelLabel ?? 'Bilinmiyor';
    const aqiValue = typeof metrics.aqi === 'number' && !Number.isNaN(metrics.aqi) ? Math.round(metrics.aqi) : null;

    const coordinateText = useMemo(() => {
        if (!selectedLocation || typeof selectedLocation.lat !== 'number' || typeof selectedLocation.lng !== 'number') {
            return null;
        }
        return `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`;
    }, [selectedLocation]);

    const lastUpdatedText = useMemo(() => {
        if (!aqiData?.timestamp) {
            return null;
        }

        const date = new Date(aqiData.timestamp);
        if (Number.isNaN(date.getTime())) {
            return aqiData.timestamp;
        }

        return date.toLocaleString('tr-TR');
    }, [aqiData]);

    const mainValue = useMemo(() => {
        if (aqiLoading) {
            return '...';
        }
        if (aqiError) {
            return '—';
        }
        if (aqiValue !== null) {
            return aqiValue;
        }
        return riskLabel;
    }, [aqiLoading, aqiError, aqiValue, riskLabel]);

    const mainSubtitle = useMemo(() => {
        if (aqiLoading) {
            return 'Hava kalitesi verisi yükleniyor';
        }
        if (aqiError) {
            return aqiError;
        }
        if (aqiValue !== null) {
            return `Risk seviyesi: ${riskLabel}`;
        }
        return 'Risk Seviyesi';
    }, [aqiLoading, aqiError, aqiValue, riskLabel]);

    const metaInfoStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '12px',
        color: '#4a5568',
        fontSize: '13px',
    };

    const metaChipStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    const errorBannerStyle = {
        marginTop: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(245, 101, 101, 0.4)',
        background: 'rgba(254, 215, 215, 0.8)',
        color: '#c53030',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const handleThresholdChangeInternal = (event) => {
        if (onThresholdChange) {
            onThresholdChange(event.target.value);
        }
    };

    const saveSettings = () => {
        if (onSaveSettings) {
            onSaveSettings();
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <i className="fas fa-chart-line" style={styles.cardIcon}></i>
                <h2 style={styles.cardTitle}>Hava Kalitesi Bilgileri</h2>
            </div>
            <div style={styles.aqiInfo}>
                <div style={styles.aqiValueContainer}>
                    <div className={`aqi-value ${riskClass}`} style={styles.aqiValue}>
                        {aqiLoading ? <i className="fas fa-circle-notch fa-spin"></i> : mainValue}
                    </div>
                    <p style={styles.aqiLabel}>{mainSubtitle}</p>

                    {(coordinateText || lastUpdatedText || aqiData?.source) && !aqiLoading && (
                        <div style={metaInfoStyle}>
                            {coordinateText && (
                                <span style={metaChipStyle}>
                                    <i className="fas fa-map-marker-alt"></i>
                                    {coordinateText}
                                </span>
                            )}
                            {lastUpdatedText && (
                                <span style={metaChipStyle}>
                                    <i className="fas fa-clock"></i>
                                    {lastUpdatedText}
                                </span>
                            )}
                            {aqiData?.source && (
                                <span style={metaChipStyle}>
                                    <i className="fas fa-database"></i>
                                    Kaynak: {aqiData.source}
                                </span>
                            )}
                        </div>
                    )}

                    {!aqiLoading && aqiError && (
                        <div role="alert" style={errorBannerStyle}>
                            <i className="fas fa-exclamation-triangle"></i>
                            {aqiError}
                        </div>
                    )}
                </div>

                <div style={styles.aqiDetails}>
                    {METRIC_CONFIG.map((config, index) => (
                        <div key={config.key} style={styles.detailItem}>
                            <div
                                style={{
                                    ...styles.detailIcon,
                                    animationDelay: `${index * 0.1}s`,
                                }}
                                className="icon-float"
                            >
                                <i className={config.icon}></i>
                            </div>
                            <div style={styles.detailContent}>
                                <span style={styles.detailLabel}>{config.label}</span>
                                <span style={styles.detailValue}>{formatMetricValue(config.key, metrics[config.key])}</span>
                                <span style={styles.detailDesc}>{config.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {isAuthenticated ? (
                    <div style={styles.notificationSettings}>
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
                                    <i className="fas fa-sliders-h" style={{ marginRight: '8px' }}></i>
                                    Bildirim Eşiği (AQI)
                                </label>
                                <select
                                    id="threshold"
                                    style={styles.formSelect}
                                    value={threshold}
                                    onChange={handleThresholdChangeInternal}
                                >
                                    <option value="50">50 - İyi</option>
                                    <option value="100">100 - Orta</option>
                                    <option value="150">150 - Hassas Gruplar İçin Sağlıksız</option>
                                    <option value="200">200 - Sağlıksız</option>
                                    <option value="300">300 - Çok Sağlıksız</option>
                                </select>
                            </div>
                            <button style={styles.btnPrimary} onClick={saveSettings}>
                                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                                Ayarları Kaydet
                            </button>
                        </div>
                        {notificationMessage && (
                            <div
                                style={{
                                    ...styles.notificationHelper,
                                    color:
                                        notificationState === 'error'
                                            ? '#e53e3e'
                                            : notificationState === 'info'
                                            ? '#2b6cb0'
                                            : '#2f855a',
                                }}
                            >
                                <i className={helperIconClass} style={{ marginRight: '8px' }}></i>
                                {notificationMessage}
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={styles.notificationLocked}>
                        <i className="fas fa-lock" style={{ marginRight: '10px' }}></i>
                        Bildirim ayarlarını yönetmek için lütfen giriş yapın.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AQIInfo;
