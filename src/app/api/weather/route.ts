import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.WEATHER_API_KEY;
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
      { error: "API key not configured on the server" },
      { status: 500 }
    );
  }

  try {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric&lang=it`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "NextJS-Weather-App/1.0",
      },
    });

    if (!response.ok) {
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

    if (
      !data.name ||
      !data.main ||
      !data.weather ||
      !data.coord ||
      !data.dt ||
      data.timezone === undefined
    ) {
      return NextResponse.json(
        { error: "Incomplete weather data received" },
        { status: 502 }
      );
    }

    const weatherData = {
      city: data.name,
      country: data.sys?.country || "N/A",
      temperature: Math.round(data.main.temp),
      description: data.weather[0]?.description || "N/D",
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed,
      lat: data.coord.lat,
      lon: data.coord.lon,
      timestamp: data.dt,
      timezone: data.timezone,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
