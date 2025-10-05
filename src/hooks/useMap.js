import { useCallback, useState } from 'react';
import { updateAQI } from '../utils/aqi';

export const useMap = (mapCenter) => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    const initMap = useCallback(() => {
        try {
            const mapElement = document.getElementById("map");
            if (!mapElement || !window.L) {
                console.warn('Map initialization skipped - element or Leaflet not available');
                return;
            }

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
                try {
                    newMarker.setLatLng(e.latlng);
                    setTimeout(() => {
                        try {
                            updateAQI();
                        } catch (err) {
                            console.warn('Error updating AQI:', err);
                        }
                    }, 100);
                } catch (err) {
                    console.warn('Error handling map click:', err);
                }
            });

            newMarker.on('dragend', () => {
                try {
                    setTimeout(() => {
                        try {
                            updateAQI();
                        } catch (err) {
                            console.warn('Error updating AQI:', err);
                        }
                    }, 100);
                } catch (err) {
                    console.warn('Error handling marker drag:', err);
                }
            });

            setMap(newMap);
            setMarker(newMarker);

            return () => {
                try {
                    newMap.remove();
                } catch (err) {
                    console.warn('Error removing map:', err);
                }
            };
        } catch (err) {
            console.error('Error initializing map:', err);
        }
    }, [mapCenter]);

    return { map, marker, initMap };
};
