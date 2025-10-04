import React from 'react';
import { cities } from '../constants/cities';
import { styles } from '../styles/components';

const MapCard = ({ selectedCity, handleCityChange }) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <i className="fas fa-map-marked-alt" style={styles.cardIcon}></i>
                <h2 style={styles.cardTitle}>İnteraktif Harita</h2>
            </div>
            
            <div style={styles.citySelector}>
                <label htmlFor="city-select" style={styles.cityLabel}>
                    <i className="fas fa-city" style={{marginRight: '8px'}}></i>
                    Şehir Seçin
                </label>
                <select 
                    id="city-select" 
                    style={styles.citySelect}
                    value={selectedCity}
                    onChange={handleCityChange}
                >
                    <option value="">Şehir seçiniz...</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city.name}>{city.name}</option>
                    ))}
                </select>
            </div>

            <div style={styles.mapContainer}>
                <div id="map" style={styles.map}></div>
            </div>
            <p style={styles.mapHint}>
                <i className="fas fa-hand-pointer" style={{marginRight: '8px'}}></i>
                Haritada istediğiniz konuma tıklayın veya pini sürükleyin
            </p>
        </div>
    );
};

export default MapCard;
