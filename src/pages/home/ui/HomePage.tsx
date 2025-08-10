import { useWeatherQuery } from '@/features/searchCity/model/useWeatherQuery'
import { useForecast3hQuery } from '@/features/searchCity/model/useForecast3hQuery'
import { useCityCoordinates } from '@/features/searchCity/model/useCityCoordinates'
import { useGeolocation } from '@/shared/hooks/useGeolocation'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { getCityByCoords } from '@/entities/weather/api/getWeather'
import { motion } from 'framer-motion'
import { WeatherSearch } from '@/shared/ui/components/WeatherSearch'
import { WeatherDisplay } from '@/shared/ui/components/WeatherDisplay'
import { WeatherForecast } from '@/shared/ui/components/WeatherForecast'
import { WEATHER_CONSTANTS } from '@/shared/constants/weather'
import { useEffect } from 'react'

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: WEATHER_CONSTANTS.ANIMATION_DURATION } },
}

export function HomePage() {
  const [city, setCity] = useLocalStorage('selectedCity', 'Tashkent')
  const [isAutoLocation, setIsAutoLocation] = useLocalStorage('isAutoLocation', true)
  
  const { latitude, longitude, error: locationError, isLoading: locationLoading, requestLocation } = useGeolocation()
  
  const { data: coordinates, isLoading: coordsLoading } = useCityCoordinates(city)
  
  const { data: weatherData, isLoading: weatherLoading, isError: weatherError } = useWeatherQuery(city)
  const { data: forecastData, isLoading: forecastLoading } = useForecast3hQuery(
    city, 
    coordinates?.lat, 
    coordinates?.lon
  )

  useEffect(() => {
    console.log('useEffect triggered:', { isAutoLocation, latitude, longitude })
    if (isAutoLocation && latitude && longitude) {
      console.log('Avtomatik manzil olish uchun koordinatalar mavjud')
      handleAutoLocationFromCoords(latitude, longitude)
    }
  }, [isAutoLocation, latitude, longitude])

  useEffect(() => {
    console.log('Koordinatalar o\'zgardi:', { latitude, longitude, isAutoLocation })
  }, [latitude, longitude, isAutoLocation])

  const handleCitySelect = (cityName: string) => {
    console.log('Shahar tanlandi:', cityName)
    setCity(cityName)
    setIsAutoLocation(false)
  }

  const handleAutoLocationFromCoords = async (lat: number, lon: number) => {
    try {
      const cityName = await getCityByCoords(lat, lon)
      if (cityName) {
        setCity(cityName)
        console.log('Avtomatik manzil olingan:', cityName)
      }
    } catch (error) {
      console.error('Avtomatik manzil olishda xatolik:', error)
    }
  }

  const handleAutoLocation = async () => {
    setIsAutoLocation(true)
    
    if (latitude && longitude) {
      await handleAutoLocationFromCoords(latitude, longitude)
    } else {
      console.log('Yangi manzil so\'ralmoqda...')
      requestLocation()
    }
  }

  const isLoading = coordsLoading || weatherLoading || forecastLoading || (isAutoLocation && locationLoading)
  const isError = weatherError

  return (
    <motion.main 
      className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" 
      role="main" 
      aria-label="Ob-havo ma'lumotlari"
      initial="hidden" 
      animate="visible" 
      variants={pageVariants}
    >
      <WeatherSearch 
        onCitySelect={handleCitySelect} 
        onAutoLocation={handleAutoLocation}
        isAutoLocation={isAutoLocation}
        locationError={locationError}
        locationLoading={locationLoading}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Current weather and cards */}
        <div className="flex-1 lg:max-w-2xl xl:max-w-3xl">
          <WeatherDisplay 
            weatherData={weatherData || null}
            forecastData={forecastData || null}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {/* Forecast */}
        <WeatherForecast 
          forecastData={forecastData}
          isLoading={isLoading}
        />
      </div>
    </motion.main>
  )
}


