import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Umbrella, 
  Minus, 
  Plus 
} from 'lucide-react'
import type { WeatherCardData } from '@/shared/types/weather'
import type { WeatherCardType } from '@/shared/constants/weather'
import { 
  calculateTempRange, 
  convertWindSpeed, 
  getMaxRainProbability 
} from './weatherCalculations'

export const getWeatherCardData = (): WeatherCardData[] => [
  {
    type: 'feels_like' as WeatherCardType,
    icon: Thermometer,
    title: "Sezilayotgan harorat",
    getValue: (weatherData) => weatherData ? `${Math.round(weatherData.main.feels_like)}°` : "0°"
  },
  {
    type: 'wind_speed' as WeatherCardType,
    icon: Wind,
    title: "Shamol tezligi",
    getValue: (weatherData) => weatherData ? `${convertWindSpeed(weatherData.wind.speed)} km/h` : "0 km/h"
  },
  {
    type: 'humidity' as WeatherCardType,
    icon: Droplets,
    title: "Namlik",
    getValue: (weatherData) => weatherData ? `${weatherData.main.humidity}%` : "0%"
  },
  {
    type: 'rain_probability' as WeatherCardType,
    icon: Umbrella,
    title: "Yomg'ir ehtimoli",
    getValue: (_, forecastData) => forecastData ? `${getMaxRainProbability(forecastData.list)}%` : "0%"
  },
  {
    type: 'min_temp' as WeatherCardType,
    icon: Minus,
    title: "Min harorat",
    getValue: (weatherData) => weatherData ? `${calculateTempRange(weatherData.main.temp).min}°` : "0°"
  },
  {
    type: 'max_temp' as WeatherCardType,
    icon: Plus,
    title: "Max harorat",
    getValue: (weatherData) => weatherData ? `${calculateTempRange(weatherData.main.temp).max}°` : "0°"
  }
]
