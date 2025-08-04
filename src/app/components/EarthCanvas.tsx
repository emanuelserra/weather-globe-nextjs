"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EarthModel } from "./EarthModel";
import { WeatherPoints } from "./wheater/weatherPoints";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import {
  fetchAllWeatherData,
  type WeatherData,
} from "./wheater/weatherService";

function RotatingEarth({ weatherData }: { weatherData: WeatherData[] }) {
  const earthRef = useRef<THREE.Group>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }

    if (directionalLightRef.current) {
      const date = new Date();
      const hours = date.getUTCHours() + date.getUTCMinutes() / 60;
      const angle = (hours / 24) * 2 * Math.PI;

      const radius = 10;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      directionalLightRef.current.position.set(x, 2, z);
    }
  });

  return (
    <group ref={earthRef}>
      <EarthModel />
      {weatherData.length > 0 && <WeatherPoints weatherData={weatherData} />}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 2, 5]}
        intensity={2.5}
        castShadow
        color={"#FFDDB0"}
      />
    </group>
  );
}

const LEGEND_DATA = [
  { color: "#00BFFF", label: "< 0°C" },
  { color: "#4169E1", label: "0-10°C" },
  { color: "#32CD32", label: "10-20°C" },
  { color: "#FFD700", label: "20-30°C" },
  { color: "#FF4500", label: "> 30°C" },
];

function WeatherLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs z-10">
      <h4 className="font-bold mb-2">Temperatura</h4>
      <div className="space-y-1">
        {LEGEND_DATA.map(({ color, label }) => (
          <div className="flex items-center gap-2" key={label}>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EarthCanvas() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiUsable, setIsApiUsable] = useState(true);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllWeatherData();
      if (data.length === 0) {
        setError(
          "Nessun dato meteo disponibile. La chiave API potrebbe non essere configurata."
        );
        setIsApiUsable(false);
      } else {
        setWeatherData(data);
        setIsApiUsable(true);
      }
    } catch (e) {
      setError("Errore nel caricamento dei dati meteo");
      setIsApiUsable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
    const interval = setInterval(loadWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 1000 }}>
        <hemisphereLight
          groundColor={"#444444"}
          intensity={0.6}
          position={[0, 50, 0]}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <OrbitControls
          enableZoom
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
      </div>

      {weatherData.length > 0 && <WeatherLegend />}

      {isApiUsable && (
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
