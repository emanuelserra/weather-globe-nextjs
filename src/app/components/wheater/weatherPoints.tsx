"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Definiamo i tipi direttamente qui per evitare errori di import
interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  lat: number;
  lon: number;
}

// Funzione per convertire coordinate geografiche in 3D
function latLonTo3D(
  lat: number,
  lon: number,
  radius: number = 1.5
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

interface WeatherPointProps {
  weather: WeatherData;
  onClick: () => void;
}

interface WeatherTooltipProps {
  weather: WeatherData;
  position: [number, number, number];
  onClose: () => void;
}

function getTemperatureColor(temp: number): string {
  if (temp < 0) return "#00BFFF"; // Blu ghiaccio
  if (temp < 10) return "#4169E1"; // Blu
  if (temp < 20) return "#32CD32"; // Verde
  if (temp < 30) return "#FFD700"; // Giallo
  return "#FF4500"; // Arancione/Rosso
}

function WeatherPoint({ weather, onClick }: WeatherPointProps) {
  const [hovered, setHovered] = useState(false);
  const position = latLonTo3D(weather.lat, weather.lon);
  const color = getTemperatureColor(weather.temperature);

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 1 : 0.8}
        />
      </mesh>

      {hovered && (
        <mesh>
          <ringGeometry args={[0.06, 0.08, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function WeatherTooltip({ weather, position, onClose }: WeatherTooltipProps) {
  return (
    <Html position={position} distanceFactor={8}>
      <div className="bg-black/90 text-white p-4 rounded-lg border border-white/30 min-w-[250px] shadow-lg">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">
            {weather.city}, {weather.country}
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Temperatura:</span>
            <span className="font-semibold text-lg">
              {weather.temperature}°C
            </span>
          </div>

          <div className="flex justify-between">
            <span>Condizioni:</span>
            <span className="capitalize">{weather.description}</span>
          </div>

          <div className="flex justify-between">
            <span>Umidità:</span>
            <span>{weather.humidity}%</span>
          </div>

          <div className="flex justify-between">
            <span>Vento:</span>
            <span>{weather.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </Html>
  );
}

interface WeatherPointsProps {
  weatherData: WeatherData[];
}

export function WeatherPoints({ weatherData }: WeatherPointsProps) {
  const [selectedWeather, setSelectedWeather] = useState<WeatherData | null>(
    null
  );

  return (
    <>
      {weatherData.map((weather, index) => (
        <WeatherPoint
          key={`${weather.city}-${index}`}
          weather={weather}
          onClick={() => setSelectedWeather(weather)}
        />
      ))}

      {selectedWeather && (
        <WeatherTooltip
          weather={selectedWeather}
          position={latLonTo3D(selectedWeather.lat, selectedWeather.lon)}
          onClose={() => setSelectedWeather(null)}
        />
      )}
    </>
  );
}
