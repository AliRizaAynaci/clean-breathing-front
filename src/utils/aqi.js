import { getApiBaseUrl } from './config';

const RISK_LEVEL_CLASS_MAP = {
	good: 'aqi-good',
	low: 'aqi-good',
	excellent: 'aqi-good',
	moderate: 'aqi-moderate',
	medium: 'aqi-moderate',
	fair: 'aqi-moderate',
	elevated: 'aqi-unhealthy-sensitive',
	'unhealthy-sensitive': 'aqi-unhealthy-sensitive',
	'unhealthy-for-sensitive-groups': 'aqi-unhealthy-sensitive',
	high: 'aqi-unhealthy',
	poor: 'aqi-unhealthy',
	unhealthy: 'aqi-unhealthy',
	'very-high': 'aqi-very-unhealthy',
	'very_unhealthy': 'aqi-very-unhealthy',
	'very-unhealthy': 'aqi-very-unhealthy',
	hazardous: 'aqi-hazardous',
	extreme: 'aqi-hazardous',
	unknown: 'aqi-moderate',
};

const RISK_LEVEL_LABEL_MAP = {
	good: 'İyi',
	low: 'Düşük',
	excellent: 'Mükemmel',
	moderate: 'Orta',
	medium: 'Orta',
	fair: 'İdare Eder',
	elevated: 'Yükselmiş',
	high: 'Yüksek',
	poor: 'Kötü',
	unhealthy: 'Sağlıksız',
	'unhealthy-sensitive': 'Hassas Gruplar İçin Sağlıksız',
	'unhealthy-for-sensitive-groups': 'Hassas Gruplar İçin Sağlıksız',
	'very-high': 'Çok Yüksek',
	'very_unhealthy': 'Çok Sağlıksız',
	'very-unhealthy': 'Çok Sağlıksız',
	hazardous: 'Tehlikeli',
	extreme: 'Aşırı Tehlikeli',
};

const METRIC_UNITS = {
	aqi: '',
	temperature: '°C',
	humidity: '%',
	pm25: 'µg/m³',
	pm10: 'µg/m³',
	no2: 'µg/m³',
	so2: 'µg/m³',
	co: 'mg/m³',
	populationDensity: '/km²',
};

const OPEN_METEO_AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const RISK_SEVERITY_ORDER = [
	'good',
	'moderate',
	'unhealthy-sensitive',
	'unhealthy',
	'very-unhealthy',
	'hazardous',
];

const PM25_AQI_BREAKPOINTS = [
	{ concLow: 0, concHigh: 12, aqiLow: 0, aqiHigh: 50 },
	{ concLow: 12.1, concHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
	{ concLow: 35.5, concHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
	{ concLow: 55.5, concHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
	{ concLow: 150.5, concHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
	{ concLow: 250.5, concHigh: 350.4, aqiLow: 301, aqiHigh: 400 },
	{ concLow: 350.5, concHigh: 500.4, aqiLow: 401, aqiHigh: 500 },
];

const PM10_AQI_BREAKPOINTS = [
	{ concLow: 0, concHigh: 54, aqiLow: 0, aqiHigh: 50 },
	{ concLow: 55, concHigh: 154, aqiLow: 51, aqiHigh: 100 },
	{ concLow: 155, concHigh: 254, aqiLow: 101, aqiHigh: 150 },
	{ concLow: 255, concHigh: 354, aqiLow: 151, aqiHigh: 200 },
	{ concLow: 355, concHigh: 424, aqiLow: 201, aqiHigh: 300 },
	{ concLow: 425, concHigh: 504, aqiLow: 301, aqiHigh: 400 },
	{ concLow: 505, concHigh: 604, aqiLow: 401, aqiHigh: 500 },
];

const toNumber = (value) => {
	if (typeof value === 'number' && !Number.isNaN(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? null : parsed;
	}
	return null;
};

const sanitizeKey = (value) => {
	if (typeof value !== 'string') {
		return null;
	}
	return value.trim().toLowerCase().replace(/\s+/g, '-');
};

const normalizeRiskLevel = (value) => sanitizeKey(value);

const pickNumeric = (...candidates) => {
	for (const candidate of candidates) {
		const parsed = toNumber(candidate);
		if (parsed !== null) {
			return parsed;
		}
	}
	return null;
};

const normalizeMetrics = (metrics = {}) => {
	const source = metrics || {};

	return {
		aqi: pickNumeric(source.AQI, source.aqi, source.index, source.AirQualityIndex),
		temperature: pickNumeric(source.Temperature, source.temperature),
		humidity: pickNumeric(source.Humidity, source.humidity),
		pm25: pickNumeric(source.PM25, source.pm25),
		pm10: pickNumeric(source.PM10, source.pm10),
		no2: pickNumeric(source.NO2, source.no2),
		so2: pickNumeric(source.SO2, source.so2),
		co: pickNumeric(source.CO, source.co),
		populationDensity: pickNumeric(
			source.PopulationDensity,
			source.populationDensity,
			source.Density,
			source.density
		),
	};
};

export const getRiskLevelClassName = (riskLevel) => {
	const normalized = normalizeRiskLevel(riskLevel);
	return normalized ? RISK_LEVEL_CLASS_MAP[normalized] || 'aqi-moderate' : 'aqi-moderate';
};

export const getRiskLevelLabel = (riskLevel) => {
	const normalized = normalizeRiskLevel(riskLevel);
	if (!normalized) {
		return 'Bilinmiyor';
	}
	return RISK_LEVEL_LABEL_MAP[normalized] || riskLevel;
};

export const formatMetricValue = (key, value) => {
	if (value === null || typeof value === 'undefined') {
		return 'Veri yok';
	}

	const unit = METRIC_UNITS[key] || '';

	if (typeof value === 'number') {
		const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
		return unit ? `${formatted} ${unit}`.trim() : formatted;
	}

	return `${value} ${unit}`.trim();
};

const normalizeAirQualityResponse = (payload = {}) => {
	const latitude = pickNumeric(payload.latitude, payload.lat, payload.Latitude);
	const longitude = pickNumeric(payload.longitude, payload.lng, payload.long, payload.Longitude);
	let riskLevel = payload.risk_level ?? payload.riskLevel ?? null;
	
	// Normalize metrics first
	const metrics = normalizeMetrics(payload.metrics);

	// If backend returns 'unknown', calculate fallback risk level from PM2.5/PM10
	if (riskLevel === 'unknown' || !riskLevel) {
		const pm25 = metrics.pm25;
		const pm10 = metrics.pm10;
		
		// Try to calculate AQI from PM2.5 first (more accurate), fallback to PM10
		let calculatedAQI = null;
		if (pm25 !== null && pm25 !== undefined) {
			calculatedAQI = calculateAQI(pm25, PM25_AQI_BREAKPOINTS);
		} else if (pm10 !== null && pm10 !== undefined) {
			calculatedAQI = calculateAQI(pm10, PM10_AQI_BREAKPOINTS);
		}
		
		if (calculatedAQI !== null) {
			riskLevel = getRiskLevelFromAQI(calculatedAQI);
			console.log(`Backend returned 'unknown', calculated fallback risk level: ${riskLevel} (AQI: ${calculatedAQI})`);
		}
	}

	return {
		latitude,
		longitude,
		metrics,
		riskLevel,
		riskLevelLabel: getRiskLevelLabel(riskLevel),
		riskLevelClassName: getRiskLevelClassName(riskLevel),
		timestamp: payload.timestamp ?? payload.updated_at ?? payload.updatedAt ?? null,
		source: payload.source ?? payload.provider ?? null,
	};
};

export const fetchAirQualityData = async ({ latitude, longitude, signal, baseUrl } = {}) => {
	const latNumber = toNumber(latitude);
	const longNumber = toNumber(longitude);

	if (latNumber === null || longNumber === null) {
		throw new Error('Geçerli bir enlem ve boylam gerekli.');
	}

	const apiBaseUrl = (baseUrl || getApiBaseUrl()).replace(/\/$/, '');
	const url = new URL(`${apiBaseUrl}/air-quality`);
	url.searchParams.set('latitude', latNumber.toString());
	url.searchParams.set('longitude', longNumber.toString());

	try {
		console.log(`Fetching from backend: ${url.toString()}`);
		
		const response = await fetch(url.toString(), {
			method: 'GET',
			credentials: 'include',
			signal,
			headers: {
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			console.warn(`Backend responded with status ${response.status}`);
			
			if (response.status === 401 || response.status === 403) {
				console.warn('Unauthorized, falling back to Open-Meteo');
				const fallbackPayload = await fetchAirQualityDataFromOpenMeteo({
					latitude: latNumber,
					longitude: longNumber,
					signal,
				});
				return normalizeAirQualityResponse(fallbackPayload);
			}

			let message = '';
			try {
				message = await response.text();
			} catch (error) {
				console.warn('Could not read error response:', error);
			}
			
			// For other HTTP errors, also try fallback
			console.warn(`Backend error (${response.status}), trying Open-Meteo fallback`);
			const fallbackPayload = await fetchAirQualityDataFromOpenMeteo({
				latitude: latNumber,
				longitude: longNumber,
				signal,
			});
			return normalizeAirQualityResponse(fallbackPayload);
		}

		const data = await response.json();
		console.log('Backend data received:', { riskLevel: data.risk_level, hasMetrics: !!data.metrics });
		return normalizeAirQualityResponse(data);
		
	} catch (error) {
		// Network error, CORS, timeout, etc.
		console.warn('Backend fetch failed:', error.message);
		console.log('Falling back to Open-Meteo API');
		
		const fallbackPayload = await fetchAirQualityDataFromOpenMeteo({
			latitude: latNumber,
			longitude: longNumber,
			signal,
		});
		return normalizeAirQualityResponse(fallbackPayload);
	}
};

const fetchAirQualityDataFromOpenMeteo = async ({ latitude, longitude, signal }) => {
	const [airQualityPayload, weatherPayload] = await Promise.all([
		fetchOpenMeteoJson(
			buildOpenMeteoUrl(OPEN_METEO_AIR_QUALITY_URL, latitude, longitude, [
				'carbon_monoxide',
				'sulphur_dioxide',
				'nitrogen_dioxide',
				'pm10',
				'pm2_5',
			]),
			signal
		),
		fetchOpenMeteoJson(
			buildOpenMeteoUrl(OPEN_METEO_WEATHER_URL, latitude, longitude, [
				'temperature_2m',
				'relative_humidity_2m',
			]),
			signal
		),
	]);

	const metrics = extractMetricsFromOpenMeteo(airQualityPayload, weatherPayload);
	const aqiCandidates = [metrics.AQIFromPM25, metrics.AQIFromPM10].filter(
		(value) => typeof value === 'number' && !Number.isNaN(value)
	);
	const calculatedAqi = aqiCandidates.length > 0 ? Math.max(...aqiCandidates) : null;
	const riskCandidates = [metrics.RiskFromPM25, metrics.RiskFromPM10];
	const riskLevel =
		selectHighestRiskLevel(riskCandidates) ||
		(calculatedAqi !== null ? classifyRiskFromAqi(calculatedAqi) : null);

	return {
		latitude,
		longitude,
		metrics: {
			AQI: calculatedAqi,
			Temperature: metrics.Temperature,
			Humidity: metrics.Humidity,
			PM25: metrics.PM25,
			PM10: metrics.PM10,
			NO2: metrics.NO2,
			SO2: metrics.SO2,
			CO: metrics.CO,
			PopulationDensity: 497,
		},
		risk_level: riskLevel,
		timestamp: new Date().toISOString(),
		source: 'open-meteo-direct',
	};
};

const buildOpenMeteoUrl = (baseUrl, latitude, longitude, hourlyParameters) => {
	const url = new URL(baseUrl);
	url.searchParams.set('latitude', latitude.toString());
	url.searchParams.set('longitude', longitude.toString());
	url.searchParams.set('timezone', 'UTC');
	if (Array.isArray(hourlyParameters) && hourlyParameters.length > 0) {
		url.searchParams.set('hourly', hourlyParameters.join(','));
	}
	return url.toString();
};

const fetchOpenMeteoJson = async (url, signal) => {
	const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
	if (!response.ok) {
		const message = await response.text();
		throw new Error(
			message || `Open-Meteo isteği başarısız oldu (${response.status})`
		);
	}
	return response.json();
};

const extractMetricsFromOpenMeteo = (airQualityPayload = {}, weatherPayload = {}) => {
	const hourlyAir = airQualityPayload?.hourly || {};
	const hourlyWeather = weatherPayload?.hourly || {};

	const pm25 = getLatestNumericValue(hourlyAir.pm2_5);
	const pm10 = getLatestNumericValue(hourlyAir.pm10);
	const pm25Aqi = computeAqiFromPm25(pm25);
	const pm10Aqi = computeAqiFromPm10(pm10);

	return {
		PM25: pm25,
		PM10: pm10,
		NO2: getLatestNumericValue(hourlyAir.nitrogen_dioxide),
		SO2: getLatestNumericValue(hourlyAir.sulphur_dioxide),
		CO: getLatestNumericValue(hourlyAir.carbon_monoxide),
		Temperature: getLatestNumericValue(hourlyWeather.temperature_2m),
		Humidity: getLatestNumericValue(hourlyWeather.relative_humidity_2m),
		AQIFromPM25: pm25Aqi,
		AQIFromPM10: pm10Aqi,
		RiskFromPM25: classifyRiskFromAqi(pm25Aqi),
		RiskFromPM10: classifyRiskFromAqi(pm10Aqi),
	};
};

const getLatestNumericValue = (values) => {
	if (!Array.isArray(values) || values.length === 0) {
		return null;
	}
	const latest = toNumber(values[values.length - 1]);
	return typeof latest === 'number' && !Number.isNaN(latest) ? latest : null;
};

const computeAqiFromPm25 = (value) => {
	return computeAqiFromBreakpoints(value, PM25_AQI_BREAKPOINTS);
};

const computeAqiFromPm10 = (value) => {
	return computeAqiFromBreakpoints(value, PM10_AQI_BREAKPOINTS);
};

const computeAqiFromBreakpoints = (value, breakpoints) => {
	if (typeof value !== 'number' || Number.isNaN(value)) {
		return null;
	}

	const range = breakpoints.find(
		({ concLow, concHigh }) => value >= concLow && value <= concHigh
	);

	const targetRange = range || breakpoints[breakpoints.length - 1];
	if (!targetRange) {
		return null;
	}

	const { concLow, concHigh, aqiLow, aqiHigh } = targetRange;
	const clampedValue = Math.min(Math.max(value, concLow), concHigh);
	const aqi = ((aqiHigh - aqiLow) / (concHigh - concLow)) * (clampedValue - concLow) + aqiLow;
	return Math.max(0, Math.min(500, Math.round(aqi)));
};

const classifyRiskFromAqi = (aqi) => {
	if (typeof aqi !== 'number' || Number.isNaN(aqi)) {
		return null;
	}
	if (aqi <= 50) {
		return 'good';
	}
	if (aqi <= 100) {
		return 'moderate';
	}
	if (aqi <= 150) {
		return 'unhealthy-sensitive';
	}
	if (aqi <= 200) {
		return 'unhealthy';
	}
	if (aqi <= 300) {
		return 'very-unhealthy';
	}
	return 'hazardous';
};

const selectHighestRiskLevel = (candidates = []) => {
	let selected = null;
	let highestIndex = -1;

	for (const candidate of candidates) {
		const normalized = normalizeRiskLevel(candidate);
		if (!normalized) {
			continue;
		}
		const index = RISK_SEVERITY_ORDER.indexOf(normalized);
		if (index > highestIndex) {
			highestIndex = index;
			selected = normalized;
		}
	}

	return selected;
};
