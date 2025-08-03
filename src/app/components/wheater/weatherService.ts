// /src/app/components/wheater/weatherService.ts

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  lat: number;
  lon: number;
}

export const CITIES: string[] = [
  "Rome,IT",
  "New York,US",
  "London,GB",
  "Tokyo,JP",
  "Sydney,AU",
  "Cairo,EG",
  "Moscow,RU",
  "Rio de Janeiro,BR",
  "Beijing,CN",
  "New Delhi,IN",
];

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export function isApiKeyConfigured(): boolean {
  return !!API_KEY && API_KEY.length > 0;
}

/**
 * Fetch weather data using Next.js API route (server-side)
 * This avoids CORS issues and user-agent blocking
 */
export async function fetchWeatherData(
  city: string
): Promise<WeatherData | null> {
  if (!isApiKeyConfigured()) {
    console.error("❌ API Key non configurata");
    return null;
  }

  try {
    console.log(`🌍 Fetching weather for: ${city} (via Next.js API)`);

    // Usa la tua API route invece di chiamare direttamente OpenWeatherMap
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(city)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      `📡 API route response for ${city}:`,
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error(`❌ API route error for ${city}:`, errorData);
      return null;
    }

    const weatherData: WeatherData = await response.json();
    console.log(
      `✅ Weather data received for ${weatherData.city}: ${weatherData.temperature}°C`
    );

    return weatherData;
  } catch (error) {
    console.error(`❌ Network error fetching weather for ${city}:`, error);
    return null;
  }
}

/**
 * Fetch weather data for all cities
 */
export async function fetchAllWeatherData(): Promise<WeatherData[]> {
  if (!isApiKeyConfigured()) {
    console.warn("⚠️ API Key non configurata");
    return [];
  }

  console.log(`🌍 Fetching weather data for ${CITIES.length} cities...`);

  // Fetch in parallelo ma con un piccolo delay per evitare rate limiting
  const promises = CITIES.map(
    (city, index) =>
      new Promise<WeatherData | null>((resolve) => {
        setTimeout(() => {
          fetchWeatherData(city).then(resolve);
        }, index * 100); // 100ms delay tra le richieste
      })
  );

  const results = await Promise.all(promises);
  const validData = results.filter(
    (data): data is WeatherData => data !== null
  );

  console.log(
    `✅ Successfully loaded ${validData.length}/${CITIES.length} weather stations`
  );

  return validData;
}

/**
 * Dati meteo di esempio per testing
 */
export const MOCK_WEATHER_DATA: WeatherData[] = [
  {
    city: "Rome",
    country: "IT",
    temperature: 24,
    description: "Soleggiato",
    humidity: 45,
    windSpeed: 3.2,
    lat: 41.9028,
    lon: 12.4964,
  },
  {
    city: "New York",
    country: "US",
    temperature: 18,
    description: "Nuvoloso",
    humidity: 60,
    windSpeed: 4.1,
    lat: 40.7128,
    lon: -74.006,
  },
  {
    city: "London",
    country: "GB",
    temperature: 12,
    description: "Pioggia leggera",
    humidity: 85,
    windSpeed: 2.8,
    lat: 51.5074,
    lon: -0.1278,
  },
  {
    city: "Tokyo",
    country: "JP",
    temperature: 28,
    description: "Sereno",
    humidity: 55,
    windSpeed: 1.5,
    lat: 35.6762,
    lon: 139.6503,
  },
  {
    city: "Sydney",
    country: "AU",
    temperature: 16,
    description: "Parzialmente nuvoloso",
    humidity: 65,
    windSpeed: 3.7,
    lat: -33.8688,
    lon: 151.2093,
  },
  {
    city: "Cairo",
    country: "EG",
    temperature: 32,
    description: "Molto soleggiato",
    humidity: 25,
    windSpeed: 2.1,
    lat: 30.0444,
    lon: 31.2357,
  },
  {
    city: "Moscow",
    country: "RU",
    temperature: 8,
    description: "Neve leggera",
    humidity: 75,
    windSpeed: 4.5,
    lat: 55.7558,
    lon: 37.6176,
  },
  {
    city: "Rio de Janeiro",
    country: "BR",
    temperature: 26,
    description: "Tropicale",
    humidity: 70,
    windSpeed: 2.3,
    lat: -22.9068,
    lon: -43.1729,
  },
  {
    city: "Beijing",
    country: "CN",
    temperature: 22,
    description: "Foschia",
    humidity: 50,
    windSpeed: 1.8,
    lat: 39.9042,
    lon: 116.4074,
  },
  {
    city: "New Delhi",
    country: "IN",
    temperature: 35,
    description: "Molto caldo",
    humidity: 40,
    windSpeed: 2.7,
    lat: 28.6139,
    lon: 77.209,
  },
];
