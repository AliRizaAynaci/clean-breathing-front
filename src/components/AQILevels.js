import React from 'react';
import { aqiLevels } from '../constants/aqiLevels';
import { styles } from '../styles/components';

const AQILevels = () => {
    return (
        <section style={styles.aqiLevelsSection}>
            <div style={styles.sectionHeader}>
                <i className="fas fa-info-circle" style={styles.sectionIcon}></i>
                <h2 style={styles.sectionTitle}>AQI Seviyeleri Nedir?</h2>
            </div>
            <p style={styles.sectionDesc}>
                Hava Kalitesi İndeksi (AQI), havanın ne kadar temiz veya kirli olduğunu ve bunun sağlığınızı nasıl etkileyebileceğini anlamanıza yardımcı olur.
            </p>
            <div style={styles.aqiLevelsGrid}>
                {aqiLevels.map((level, index) => (
                    <div key={index} style={{...styles.aqiLevelCard, animationDelay: `${index * 0.1}s`}} className="fade-in-up">
                        <div style={{...styles.aqiLevelIcon, background: level.color}}>
                            <i className={`fas ${level.icon}`}></i>
                        </div>
                        <div style={styles.aqiLevelContent}>
                            <h3 style={styles.aqiLevelTitle}>{level.level}</h3>
                            <div style={{...styles.aqiLevelRange, background: level.color}}>{level.range}</div>
                            <p style={styles.aqiLevelDesc}>{level.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AQILevels;
