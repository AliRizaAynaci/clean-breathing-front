import { useCallback, useState } from 'react';
import { updateAQI } from '../utils/aqi';

export const useMap = (mapCenter) => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    const initMap = useCallback(() => {
        const mapElement = document.getElementById("map");
        if (!mapElement || !window.L) return;

        const newMap = window.L.map('map').setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(newMap);

        const customIcon = window.L.divIcon({
            html: '<i class="fas fa-map-marker-alt" style="font-size: 32px; color: #e74c3c;"></i>',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            className: 'custom-marker'
        });

        const newMarker = window.L.marker([mapCenter.lat, mapCenter.lng], {
            icon: customIcon,
            draggable: true
        }).addTo(newMap);

        newMap.on('click', (e) => {
            newMarker.setLatLng(e.latlng);
            // DOM yüklendikten sonra updateAQI'yi çağır
            setTimeout(() => updateAQI(), 100);
        });

        newMarker.on('dragend', () => {
            // DOM yüklendikten sonra updateAQI'yi çağır
            setTimeout(() => updateAQI(), 100);
        });

        setMap(newMap);
        setMarker(newMarker);

        return () => {
            newMap.remove();
        };
    }, [mapCenter]);

    return { map, marker, initMap };
};
