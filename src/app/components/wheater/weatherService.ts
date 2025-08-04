export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  lat: number;
  lon: number;
  timestamp: number;
  timezone: number;
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

export async function fetchAllWeatherData(): Promise<WeatherData[]> {
  const promises = CITIES.map(
    (city, index) =>
      new Promise<WeatherData | null>((resolve) => {
        setTimeout(async () => {
          try {
            const response = await fetch(
              `/api/weather?city=${encodeURIComponent(city)}`
            );
            if (!response.ok) {
              resolve(null);
            } else {
              const data = await response.json();
              resolve(data);
            }
          } catch (error) {
            console.error(`Failed to fetch weather for ${city}`, error);
            resolve(null);
          }
        }, index * 100);
      })
  );

  const results = await Promise.all(promises);
  const validData = results.filter(
    (data): data is WeatherData => data !== null
  );
  return validData;
}
