// EarthCanvas.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EarthModel } from "./EarthModel";
import { WeatherPoints } from "./wheater/weatherPoints";
import { useRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  fetchWeatherData,
  CITIES,
  type WeatherData,
} from "./wheater/weatherService";
import { Stars } from "@react-three/drei";

function RotatingEarth({ weatherData }: { weatherData: WeatherData[] }) {
  const earthRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={earthRef}>
      <EarthModel />
      {weatherData.length > 0 && <WeatherPoints weatherData={weatherData} />}
    </group>
  );
}

function WeatherLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs z-10">
      <h4 className="font-bold mb-2">Temperature</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#00BFFF" }}
          ></div>
          <span>&lt; 0°C</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#4169E1" }}
          ></div>
          <span>0-10°C</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#32CD32" }}
          ></div>
          <span>10-20°C</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#FFD700" }}
          ></div>
          <span>20-30°C</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#FF4500" }}
          ></div>
          <span>&gt; 30°C</span>
        </div>
      </div>
    </div>
  );
}

export function EarthCanvas() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const promises = CITIES.map((city) => fetchWeatherData(city));
      const results = await Promise.all(promises);
      const validData = results.filter(
        (data): data is WeatherData => data !== null
      );

      setWeatherData(validData);

      if (validData.length === 0 && process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
        setError("Nessun dato meteo disponibile");
      }
    } catch (err) {
      setError("Errore nel caricamento dei dati meteo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
      loadWeatherData();
      const interval = setInterval(loadWeatherData, 10 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <OrbitControls
          enableZoom={true}
          target={[0, 0, 0]}
          minDistance={3}
          maxDistance={15}
          enablePan={false}
        />

        <Suspense fallback={null}>
          <RotatingEarth weatherData={weatherData} />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 right-4 text-white text-sm z-10">
        {loading && (
          <div className="bg-blue-500/80 px-3 py-2 rounded">
            Caricamento meteo...
          </div>
        )}
        {error && (
          <div className="bg-red-500/80 px-3 py-2 rounded">{error}</div>
        )}
        {!loading && !error && weatherData.length > 0 && (
          <div className="bg-green-500/80 px-3 py-2 rounded">
            {weatherData.length} stazioni meteo caricate
          </div>
        )}
        {!process.env.NEXT_PUBLIC_WEATHER_API_KEY && (
          <div className="bg-yellow-600/90 text-black font-semibold px-3 py-2 rounded">
            API Key per il meteo mancante!
          </div>
        )}
      </div>

      {weatherData.length > 0 && <WeatherLegend />}

      {process.env.NEXT_PUBLIC_WEATHER_API_KEY && (
        <button
          onClick={loadWeatherData}
          disabled={loading}
          className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed z-10"
        >
          {loading ? "Caricando..." : "Aggiorna Meteo"}
        </button>
      )}
    </div>
  );
}

export default EarthCanvas;
