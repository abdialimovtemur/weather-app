import Lottie from 'lottie-react'
import { getAnimationKey, getDailyAnimationKey } from '@/entities/weather/lib/iconMap'

// Import Lottie JSONs
import WeatherSunny from '@/assets/animations/Weather-sunny.json'
import WeatherPartlyCloudy from '@/assets/animations/Weather-partly-cloudy.json'
import WeatherCloudyNight from '@/assets/animations/Weather-cloudy(night).json'
import WeatherPartlyShower from '@/assets/animations/Weather-partly-shower.json'
import WeatherRainyNight from '@/assets/animations/Weather-rainy(night).json'
import WeatherSnow from '@/assets/animations/Weather-snow.json'
import WeatherStorm from '@/assets/animations/Weather-storm.json'
import WeatherWindy from '@/assets/animations/Weather-windy.json'
import WeatherNight from '@/assets/animations/Weather-night.json'

type Props = {
  iconCode?: string
  description?: string
  isDaily?: boolean
  loop?: boolean
  autoplay?: boolean
  className?: string
}

const animationMap: Record<string, object> = {
  'Weather-sunny': WeatherSunny,
  'Weather-partly-cloudy': WeatherPartlyCloudy,
  'Weather-cloudy(night)': WeatherCloudyNight,
  'Weather-partly-shower': WeatherPartlyShower,
  'Weather-rainy(night)': WeatherRainyNight,
  'Weather-snow': WeatherSnow,
  'Weather-storm': WeatherStorm,
  'Weather-windy': WeatherWindy,
  'Weather-night': WeatherNight,
}

export function WeatherAnimation({ iconCode, description, isDaily = false, loop = true, autoplay = true, className }: Props) {
  const key = isDaily 
    ? getDailyAnimationKey(iconCode, description)
    : getAnimationKey(iconCode, description)
  const animationData = animationMap[key] ?? WeatherPartlyCloudy
  return (
    <Lottie animationData={animationData as unknown as Record<string, unknown>} loop={loop} autoplay={autoplay} className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}


