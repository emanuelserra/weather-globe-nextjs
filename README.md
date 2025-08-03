# Earth Weather Visualization

A real-time 3D Earth visualization built with Next.js and React Three Fiber.  
It shows weather data from multiple cities around the globe, fetched via the OpenWeatherMap API and displayed as interactive points on a rotating Earth model.

## Features

- Interactive 3D Earth with rotation and zoom
- Weather points showing temperature, humidity, wind speed, and conditions
- Tooltip with detailed weather info on click
- Real-time data fetching via a Next.js API route
- Dynamic starry background and atmospheric glow effects
- Responsive and customizable UI

## Setup

1. **Clone the repo** by running `git clone https://github.com/emanuelserra/weather-globe-nextjs.git` and then navigate into the folder with `cd weather-globe-nextjs`.
2. **Install dependencies** using `npm install` or `yarn install`.
3. **Set your OpenWeatherMap API key** by creating a `.env.local` file in the root directory and adding the line `NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here`.
4. **Run the development server** using `npm run dev` or `yarn dev` and open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy on Vercel by connecting your GitHub repo and setting the environment variable `NEXT_PUBLIC_WEATHER_API_KEY` in the Vercel dashboard.
