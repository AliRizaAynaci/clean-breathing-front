import { useCallback, useMemo, useState } from 'react';

export const useMap = (mapCenter, options = {}) => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const { onLocationChange } = options;

    const notifyLocationChange = useMemo(() => {
        if (typeof onLocationChange !== 'function') {
            return () => {};
        }

        return ({ lat, lng }) => {
            try {
                if (typeof lat === 'number' && typeof lng === 'number') {
                    onLocationChange({ lat, lng });
                }
            } catch (err) {
                console.warn('Konum bilgisi bildirilirken hata oluştu:', err);
            }
        };
    }, [onLocationChange]);

    const initMap = useCallback(() => {
        try {
            const mapElement = document.getElementById('map');
            if (!mapElement || !window.L) {
                console.warn('Harita başlatma atlandı - element veya Leaflet bulunamadı');
                return;
            }

            const newMap = window.L.map('map').setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(newMap);

            const customIcon = window.L.divIcon({
                html: '<i class="fas fa-map-marker-alt" style="font-size: 32px; color: #e74c3c;"></i>',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                className: 'custom-marker',
            });

            const newMarker = window.L.marker([mapCenter.lat, mapCenter.lng], {
                icon: customIcon,
                draggable: true,
            }).addTo(newMap);

            newMap.on('click', (e) => {
                try {
                    newMarker.setLatLng(e.latlng);
                    notifyLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
                } catch (err) {
                    console.warn('Harita tıklama olayında hata:', err);
                }
            });

            newMarker.on('dragend', () => {
                try {
                    const position = newMarker.getLatLng();
                    notifyLocationChange({ lat: position.lat, lng: position.lng });
                } catch (err) {
                    console.warn('Marker sürükleme olayında hata:', err);
                }
            });

            setMap(newMap);
            setMarker(newMarker);
            notifyLocationChange({ lat: mapCenter.lat, lng: mapCenter.lng });

            return () => {
                try {
                    newMap.remove();
                } catch (err) {
                    console.warn('Harita kaldırılırken hata:', err);
                }
            };
        } catch (err) {
            console.error('Harita başlatılırken hata oluştu:', err);
        }
    }, [mapCenter, notifyLocationChange]);

    return { map, marker, initMap };
};
