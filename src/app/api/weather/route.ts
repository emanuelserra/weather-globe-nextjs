// /src/app/api/weather/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    console.log(`🌍 Server-side request for: ${city}`);

    const url = `${API_BASE_URL}?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric&lang=it`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "NextJS-Weather-App/1.0",
      },
    });

    if (!response.ok) {
      console.error(
        `❌ OpenWeatherMap API error for ${city}:`,
        response.status,
        response.statusText
      );

      // Rilancia l'errore con dettagli
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Weather API error: ${response.statusText}`,
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Verifica che i dati siano completi
    if (!data.name || !data.main || !data.weather || !data.coord) {
      return NextResponse.json(
        { error: "Incomplete weather data received" },
        { status: 502 }
      );
    }

    // Restituisci i dati formattati
    const weatherData = {
      city: data.name,
      country: data.sys?.country || "Unknown",
      temperature: Math.round(data.main.temp),
      description: data.weather[0]?.description || "N/A",
      humidity: data.main.humidity || 0,
      windSpeed: data.wind?.speed || 0,
      lat: data.coord.lat,
      lon: data.coord.lon,
    };

    console.log(
      `✅ Weather data fetched for ${weatherData.city}: ${weatherData.temperature}°C`
    );

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error(`❌ Server error fetching weather for ${city}:`, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
