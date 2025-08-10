import type { LucideIcon } from 'lucide-react'

export interface City {
  id: number
  name: string
  country: string
  state?: string
  lat?: number
  lon?: number
}

export interface WeatherCard {
  icon: LucideIcon
  title: string
  value: string
  unit?: string
}

export interface WeatherCardData {
  type: string
  icon: LucideIcon
  title: string
  getValue: (weatherData: WeatherData | undefined, forecastData?: ForecastData | undefined) => string
}

// Weather data interfaces
export interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  dt: number
  timezone: number
}

export interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      humidity: number
      pressure: number
      pop: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    wind: {
      speed: number
      deg: number
    }
    clouds: {
      all: number
    }
    dt_txt: string
  }>
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    timezone: number
    sunrise: number
    sunset: number
  }
}

// API response types
export interface GeoResult {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export interface OneCallResponse {
  daily: Array<{
    dt: number
    temp: {
      day: number
      min: number
      max: number
    }
    humidity: number
    wind_speed: number
    weather: Array<{
      description: string
      icon: string
    }>
    pop: number
  }>
}

