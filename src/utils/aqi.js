export const updateAQI = () => {
    // DOM elementlerinin yüklenip yüklenmediğini kontrol et
    const aqiElement = document.getElementById("aqi-value");
    if (!aqiElement) {
        console.warn("AQI element not found, skipping update");
        return;
    }

    const aqi = Math.floor(Math.random() * 300) + 1;
    const pm25 = Math.floor(Math.random() * 100) + 1;
    const pm10 = Math.floor(Math.random() * 150) + 1;
    const no2 = Math.floor(Math.random() * 100) + 1;
    const so2 = Math.floor(Math.random() * 80) + 1;
    const co = (Math.random() * 5).toFixed(1);
    const temperature = Math.floor(Math.random() * 30) + 5;
    const humidity = Math.floor(Math.random() * 60) + 30;
    const density = Math.floor(Math.random() * 10000) + 1000;
    const population = Math.floor(Math.random() * 500000) + 50000;
    const proximity = Math.floor(Math.random() * 20) + 1;

    let aqiClass = "aqi-good";
    if (aqi > 50) aqiClass = "aqi-moderate";
    if (aqi > 100) aqiClass = "aqi-unhealthy-sensitive";
    if (aqi > 150) aqiClass = "aqi-unhealthy";
    if (aqi > 200) aqiClass = "aqi-very-unhealthy";
    if (aqi > 300) aqiClass = "aqi-hazardous";

    // Güvenli DOM güncellemeleri
    try {
        aqiElement.textContent = aqi;
        aqiElement.className = `aqi-value ${aqiClass}`;

        const elements = {
            "pm25-value": `${pm25} µg/m³`,
            "pm10-value": `${pm10} µg/m³`,
            "no2-value": `${no2} µg/m³`,
            "so2-value": `${so2} µg/m³`,
            "co-value": `${co} mg/m³`,
            "temperature-value": `${temperature}°C`,
            "humidity-value": `${humidity}%`,
            "density-value": `${density.toLocaleString()} /km²`,
            "population-value": population.toLocaleString(),
            "proximity-value": `${proximity} km`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    } catch (error) {
        console.error("Error updating AQI values:", error);
    }
};
