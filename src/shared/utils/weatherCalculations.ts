import { WEATHER_CONSTANTS } from '@/shared/constants/weather'

export const calculateTempRange = (temp: number, offset: number = WEATHER_CONSTANTS.TEMP_OFFSET) => ({
  min: Math.round(temp - offset),
  max: Math.round(temp + offset)
})

export const convertWindSpeed = (speed: number) => (speed * 3.6).toFixed(1)

export const getMaxRainProbability = (forecastList: any[]) => {
  if (!forecastList || forecastList.length === 0) return 0
  return Math.round(Math.max(...forecastList.slice(0, WEATHER_CONSTANTS.FORECAST_ITEMS).map((i) => (i.pop ?? 0) * 100)))
}

export const formatTime = (timestamp: number) => {
  const when = new Date(timestamp * 1000)
  return when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

