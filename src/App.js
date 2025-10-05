import React, { useEffect, useMemo, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';

// Components
import Header from './components/Header';
import MapCard from './components/MapCard';
import AQIInfo from './components/AQIInfo';
import AQILevels from './components/AQILevels';
import Footer from './components/Footer';
import NotificationModal from './components/NotificationModal';

// Hooks
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { useMap } from './hooks/useMap';

// Utils
import { updateAQI, getApiBaseUrl } from './utils';

// Constants
import { cities } from './constants/cities';

// Styles
import { styles } from './styles/components';

function App() {
    const [selectedCity, setSelectedCity] = useState("");
    const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597, zoom: 6 });
    const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
    const [notificationThreshold, setNotificationThreshold] = useState('100');
    const [notificationStatus, setNotificationStatus] = useState({ state: 'idle', message: '' });
    const [isSubmittingNotification, setIsSubmittingNotification] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const { user, loading, error, handleGoogleLogin, handleLogout } = useGoogleAuth();
    const { map, marker, initMap } = useMap(mapCenter);

    useEffect(() => {
        let leafletCSS = null;
        let leafletScript = null;

        try {
            // Leaflet CSS ve JS'ini yükle
            leafletCSS = document.createElement("link");
            leafletCSS.rel = "stylesheet";
            leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            leafletCSS.onerror = (err) => {
                console.warn('Failed to load Leaflet CSS:', err);
            };
            document.head.appendChild(leafletCSS);

            leafletScript = document.createElement("script");
            leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            leafletScript.async = true;
            leafletScript.onload = () => {
                try {
                    initMap();
                } catch (err) {
                    console.error('Error initializing map after Leaflet load:', err);
                }
            };
            leafletScript.onerror = (err) => {
                console.warn('Failed to load Leaflet JS:', err);
            };
            document.body.appendChild(leafletScript);
        } catch (err) {
            console.error('Error loading Leaflet resources:', err);
        }

        return () => {
            try {
                if (leafletScript && document.body.contains(leafletScript)) {
                    document.body.removeChild(leafletScript);
                }
                if (leafletCSS && document.head.contains(leafletCSS)) {
                    document.head.removeChild(leafletCSS);
                }
            } catch (err) {
                console.warn('Error cleaning up Leaflet resources:', err);
            }
        };
    }, [initMap]);

    const openNotificationModal = () => {
        setNotificationStatus({ state: 'idle', message: '' });
        setNotificationModalOpen(true);
    };

    const closeNotificationModal = () => {
        setNotificationModalOpen(false);
    };

    const handleThresholdChange = (value) => {
        setNotificationThreshold(value);
    };

    const handleNotificationSettingsSave = () => {
        setNotificationStatus({
            state: 'info',
            message: `Bildirim eşiğiniz ${notificationThreshold} AQI olarak güncellendi.`,
        });
    };

    const handleNotificationSubscribe = async ({ latitude, longitude, threshold }) => {
        if (!latitude || !longitude) {
            setNotificationStatus({ state: 'error', message: 'Konum bilgisi alınamadı. Lütfen tekrar deneyin.' });
            return;
        }

        const payloadThreshold = threshold || notificationThreshold;

        setIsSubmittingNotification(true);
        setNotificationStatus({ state: 'loading', message: 'Bildirim tercihiniz kaydediliyor...' });

        try {
            const response = await fetch(`${apiBaseUrl}/notifications/subscribe`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    threshold: parseInt(payloadThreshold, 10),
                    email: user?.email,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Sunucu hatası (${response.status})`);
            }

            setNotificationStatus({
                state: 'success',
                message: 'Konumunuz kaydedildi. Riskli durumlarda e-posta ile bilgilendirileceksiniz.',
            });
        } catch (err) {
            console.error('Notification subscription failed:', err);
            setNotificationStatus({
                state: 'error',
                message: err.message || 'Bildirim tercihi kaydedilirken bir hata oluştu.',
            });
        } finally {
            setIsSubmittingNotification(false);
        }
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setSelectedCity(cityName);
        
        const city = cities.find(c => c.name === cityName);
        if (city) {
            setMapCenter({ lat: city.lat, lng: city.lng, zoom: 12 });
            if (map && marker) {
                map.setView([city.lat, city.lng], 12);
                marker.setLatLng([city.lat, city.lng]);
                // DOM yüklendikten sonra updateAQI'yi çağır
                setTimeout(() => updateAQI(), 100);
            }
        }
    };

    return (
        <div style={styles.app}>
            <div style={styles.bgAnimation}></div>
            
            <Header 
                user={user}
                loading={loading}
                onGoogleLogin={handleGoogleLogin}
                onLogout={handleLogout}
                onNotificationsClick={openNotificationModal}
                notificationsStatus={notificationStatus}
            />

            <main style={styles.main}>
                <div style={styles.container}>
                    {error && (
                        <div style={styles.authError} role="alert">
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                            Oturum bilgisi alınamadı. Lütfen yeniden giriş yapmayı deneyin.
                        </div>
                    )}
                    <section style={styles.dashboard}>
                        <MapCard 
                            selectedCity={selectedCity} 
                            handleCityChange={handleCityChange} 
                        />
                        <AQIInfo 
                            user={user}
                            threshold={notificationThreshold}
                            onThresholdChange={handleThresholdChange}
                            onSaveSettings={handleNotificationSettingsSave}
                            status={notificationStatus}
                        />
                    </section>
                    <AQILevels />
                </div>
            </main>

            <Footer />

            <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={closeNotificationModal}
                onSubscribe={handleNotificationSubscribe}
                isSubmitting={isSubmittingNotification}
                status={notificationStatus}
                threshold={notificationThreshold}
                onThresholdChange={handleThresholdChange}
                userEmail={user?.email}
            />
        </div>
    );
}

export default App;