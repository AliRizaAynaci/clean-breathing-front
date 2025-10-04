import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';

// Components
import Header from './components/Header';
import MapCard from './components/MapCard';
import AQIInfo from './components/AQIInfo';
import AQILevels from './components/AQILevels';
import Footer from './components/Footer';

// Hooks
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { useMap } from './hooks/useMap';

// Utils
import { updateAQI } from './utils/aqi';

// Constants
import { cities } from './constants/cities';

// Styles
import { styles } from './styles/components';

function App() {
    const [selectedCity, setSelectedCity] = useState("");
    const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597, zoom: 6 });
    
    const { handleGoogleLogin, handleLogout } = useGoogleAuth();
    const { map, marker, initMap } = useMap(mapCenter);

    useEffect(() => {
        // Leaflet CSS ve JS'ini yükle
        const leafletCSS = document.createElement("link");
        leafletCSS.rel = "stylesheet";
        leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(leafletCSS);

        const leafletScript = document.createElement("script");
        leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        leafletScript.async = true;
        leafletScript.onload = initMap;
        document.body.appendChild(leafletScript);

        return () => {
            document.body.removeChild(leafletScript);
            document.head.removeChild(leafletCSS);
        };
    }, [initMap]);

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
                onGoogleLogin={handleGoogleLogin}
                onLogout={handleLogout}
            />

            <main style={styles.main}>
                <div style={styles.container}>
                    <section style={styles.dashboard}>
                        <MapCard 
                            selectedCity={selectedCity} 
                            handleCityChange={handleCityChange} 
                        />
                        <AQIInfo />
                    </section>
                    <AQILevels />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default App;