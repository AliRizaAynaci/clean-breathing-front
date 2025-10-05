import React, { useEffect, useState } from 'react';
import { styles } from '../styles/components';

const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
};

const NotificationModal = ({
    isOpen,
    onClose,
    onSubscribe,
    isSubmitting,
    status,
    threshold = '100',
    onThresholdChange,
    userEmail,
    selectedLocation,
}) => {
    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('idle');
    const [locationMessage, setLocationMessage] = useState('');

    const normalizeLocation = (loc) => {
        if (!loc || typeof loc !== 'object') {
            return null;
        }

        const parseCoordinate = (value) => {
            if (typeof value === 'number' && !Number.isNaN(value)) {
                return value;
            }
            if (typeof value === 'string') {
                const parsed = Number(value);
                if (!Number.isNaN(parsed)) {
                    return parsed;
                }
            }
            return null;
        };

        const latitude = parseCoordinate(loc.latitude ?? loc.lat);
        const longitude = parseCoordinate(loc.longitude ?? loc.lng ?? loc.long);

        if (latitude === null || longitude === null) {
            return null;
        }

        return {
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6)),
        };
    };

    const normalizedLocation = normalizeLocation(location);
    const normalizedSelectedLocation = normalizeLocation(selectedLocation);
    const effectiveLocation = normalizedLocation || normalizedSelectedLocation;
    const usingFallbackLocation = !normalizedLocation && !!normalizedSelectedLocation;

    useEffect(() => {
        if (!isOpen) {
            setLocation(null);
            setLocationStatus('idle');
            setLocationMessage('');
        }
    }, [isOpen]);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationMessage('Tarayıcınız konum paylaşımını desteklemiyor.');
            return;
        }

        setLocationStatus('loading');
        setLocationMessage('Konumunuz alınıyor...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: parseFloat(position.coords.latitude.toFixed(6)),
                    longitude: parseFloat(position.coords.longitude.toFixed(6)),
                };
                setLocation(coords);
                setLocationStatus('success');
                setLocationMessage(`Konum alındı: ${coords.latitude}, ${coords.longitude}`);
            },
            (error) => {
                console.warn('Geolocation error:', error);
                let message = 'Konum bilgisi alınamadı.';
                if (error.code === error.PERMISSION_DENIED) {
                    message = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    message = 'Konum bilgisine şu anda ulaşılamıyor.';
                } else if (error.code === error.TIMEOUT) {
                    message = 'Konum isteği zaman aşımına uğradı. Tekrar deneyin.';
                }
                setLocationStatus('error');
                setLocationMessage(message);
            },
            geolocationOptions
        );
    };

    const handleSubscribeClick = () => {
        if (!effectiveLocation) {
            setLocationStatus('error');
            setLocationMessage('Konum almadan devam edemezsiniz. Lütfen haritadan seçim yapın veya konum paylaşın.');
            return;
        }

        if (onSubscribe) {
            if (usingFallbackLocation) {
                setLocationStatus('success');
                setLocationMessage(
                    `Haritada seçtiğiniz konum kullanılacak: ${effectiveLocation.latitude}, ${effectiveLocation.longitude}`
                );
            }

            onSubscribe({
                latitude: effectiveLocation.latitude,
                longitude: effectiveLocation.longitude,
                lat: effectiveLocation.latitude,
                long: effectiveLocation.longitude,
                threshold,
            });
        }
    };

    const handleThresholdChange = (event) => {
        if (onThresholdChange) {
            onThresholdChange(event.target.value);
        }
    };

    if (!isOpen) {
        return null;
    }

    const statusState = status?.state;
    const statusMessage = status?.message;

    return (
        <div style={styles.modalOverlay} role="dialog" aria-modal="true">
            <div style={styles.modalContent}>
                <header style={styles.modalHeader}>
                    <div>
                        <h2 style={styles.modalTitle}>Bildirim Tercihleri</h2>
                        <p style={styles.modalSubtitle}>
                            Riskli hava kalitesi durumlarında e-posta alabilmek için konumunuzu paylaşın.
                        </p>
                    </div>
                    <button type="button" style={styles.modalCloseButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </header>

                <div style={styles.modalBody}>
                    <section>
                        <h3 style={styles.modalSectionTitle}>1. Konum İzni</h3>
                        <p style={styles.modalSectionText}>
                            Bildirimleri kişiselleştirmek için bulunduğunuz bölgenin koordinatlarına ihtiyacımız var.
                            Konum paylaşımına izin verdiğinizde yalnızca koordinatlarınız kayıt altına alınır.
                        </p>
                        <div style={styles.modalActionsRow}>
                            <button
                                type="button"
                                style={styles.modalPrimaryButton}
                                onClick={requestLocation}
                                disabled={locationStatus === 'loading'}
                            >
                                <i className="fas fa-location-arrow" style={{ marginRight: '8px' }}></i>
                                Konumumu Paylaş
                            </button>
                            {normalizedLocation && (
                                <div style={styles.locationPreview}>
                                    <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                                    {normalizedLocation.latitude}, {normalizedLocation.longitude}
                                </div>
                            )}
                            {!normalizedLocation && normalizedSelectedLocation && (
                                <div style={styles.locationPreview}>
                                    <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                                    Harita: {normalizedSelectedLocation.latitude}, {normalizedSelectedLocation.longitude}
                                </div>
                            )}
                        </div>
                        {(locationMessage || usingFallbackLocation) && (
                            <p
                                style={{
                                    ...styles.statusMessage,
                                    color:
                                        locationStatus === 'error'
                                            ? '#e53e3e'
                                            : locationStatus === 'success'
                                            ? '#2f855a'
                                            : '#2d3748',
                                }}
                            >
                                {locationMessage || 'Haritada seçtiğiniz konum kullanılacaktır.'}
                            </p>
                        )}
                    </section>

                    <section>
                        <h3 style={styles.modalSectionTitle}>2. Bildirim Eşiği</h3>
                        <p style={styles.modalSectionText}>
                            Hava kalitesi bu seviyeyi aştığında bildirim alırsınız.
                        </p>
                        <select
                            value={threshold}
                            onChange={handleThresholdChange}
                            style={styles.modalSelect}
                        >
                            <option value="50">50 - İyi</option>
                            <option value="100">100 - Orta</option>
                            <option value="150">150 - Hassas Gruplar İçin Sağlıksız</option>
                            <option value="200">200 - Sağlıksız</option>
                            <option value="300">300 - Çok Sağlıksız</option>
                        </select>
                    </section>

                    {userEmail && (
                        <section style={styles.modalInfoBox}>
                            <i className="fas fa-envelope" style={{ marginRight: '10px' }}></i>
                            Bildirimler <strong>{userEmail}</strong> adresine gönderilecektir.
                        </section>
                    )}

                    {statusMessage && (
                        <div
                            style={{
                                ...styles.statusMessage,
                                background:
                                    statusState === 'error'
                                        ? 'rgba(254, 215, 215, 0.8)'
                                        : statusState === 'success'
                                        ? 'rgba(198, 246, 213, 0.8)'
                                        : 'rgba(237, 242, 247, 0.8)',
                                borderColor:
                                    statusState === 'error'
                                        ? '#feb2b2'
                                        : statusState === 'success'
                                        ? '#9ae6b4'
                                        : '#cbd5f5',
                            }}
                        >
                            <i
                                className={
                                    statusState === 'error'
                                        ? 'fas fa-exclamation-circle'
                                        : statusState === 'success'
                                        ? 'fas fa-check-circle'
                                        : 'fas fa-info-circle'
                                }
                                style={{ marginRight: '8px' }}
                            ></i>
                            {statusMessage}
                        </div>
                    )}
                </div>

                <footer style={styles.modalFooter}>
                    <button
                        type="button"
                        style={styles.modalSecondaryButton}
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Vazgeç
                    </button>
                    <button
                        type="button"
                        style={{
                            ...styles.modalPrimaryButton,
                            opacity: !location || isSubmitting ? 0.7 : 1,
                            cursor: !location || isSubmitting ? 'not-allowed' : 'pointer',
                        }}
                        onClick={handleSubscribeClick}
                        disabled={!effectiveLocation || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i>
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-bell" style={{ marginRight: '8px' }}></i>
                                Bildirimleri Aç
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default NotificationModal;
