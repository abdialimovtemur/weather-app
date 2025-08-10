import { useWeatherQuery } from '@/features/searchCity/model/useWeatherQuery'
import { useForecast3hQuery } from '@/features/searchCity/model/useForecast3hQuery'
import { useCityCoordinates } from '@/features/searchCity/model/useCityCoordinates'
import { useGeolocation } from '@/shared/hooks/useGeolocation'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { getCityByCoords } from '@/entities/weather/api/getWeather'
import { motion } from 'framer-motion'
import { WeatherSearch } from '@/shared/ui/components/WeatherSearch'
import { WeatherForecast } from '@/shared/ui/components/WeatherForecast'
import { WeatherAnimation } from '@/shared/ui/widgets/WeatherAnimation'
import { WEATHER_CONSTANTS } from '@/shared/constants/weather'
import { Calendar, TrendingUp, CloudRain, Wind } from 'lucide-react'

export function ForecastPage() {
  const [city, setCity] = useLocalStorage('selectedCity', 'Tashkent')
  const [isAutoLocation, setIsAutoLocation] = useLocalStorage('isAutoLocation', true)
  
  const { latitude, longitude, error: locationError, isLoading: locationLoading, requestLocation } = useGeolocation()
  
  const { data: coordinates, isLoading: coordsLoading } = useCityCoordinates(city)
  
  const { isLoading: weatherLoading, isError: weatherError } = useWeatherQuery(city)
  const { data: forecastData, isLoading: forecastLoading } = useForecast3hQuery(
    city, 
    coordinates?.lat, 
    coordinates?.lon
  )

  const handleCitySelect = (cityName: string) => {
    setCity(cityName)
    setIsAutoLocation(false)
  }

  const handleAutoLocation = async () => {
    setIsAutoLocation(true)
    if (latitude && longitude) {
      const cityName = await getCityByCoords(latitude, longitude)
      if (cityName) {
        setCity(cityName)
      }
    } else {
      requestLocation()
    }
  }

  const isLoading = coordsLoading || weatherLoading || forecastLoading || (isAutoLocation && locationLoading)
  const isError = weatherError

  // Prepare 5-day forecast data
  const dailyForecast = forecastData?.list?.reduce((acc, item) => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toLocaleDateString('uz-UZ', { weekday: 'long' })
    
    if (!acc[dayKey]) {
      acc[dayKey] = {
        date: date,
        temp: item.main.temp,
        feels_like: item.main.temp,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        pressure: 'N/A',
        visibility: 'N/A'
      }
    }
    return acc
  }, {} as Record<string, any>)

  const pageVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: WEATHER_CONSTANTS.ANIMATION_DURATION } },
  }

  return (
    <motion.main 
      className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" 
      role="main" 
      aria-label="Ob-havo prognozi"
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

      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-[#0EA5E9]/10 rounded-2xl">
            <Calendar className="w-8 h-8 text-[#0EA5E9]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {city} prognozi
          </h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          5 kunlik batafsil ob-havo prognozi
        </p>
      </motion.header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Daily Forecast Cards */}
        <div className="flex-1 lg:max-w-2xl xl:max-w-3xl">
          {isLoading ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  <span className="text-lg">Prognoz ma'lumotlari yuklanmoqda...</span>
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl animate-pulse">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <div className="text-red-600 dark:text-red-400 text-lg">
                Ma'lumotlarni yuklashda xatolik yuz berdi
              </div>
            </div>
          ) : dailyForecast ? (
            <div className="space-y-6">
              {Object.entries(dailyForecast).map(([day, data], index) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white capitalize">
                      {day}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12">
                        <WeatherAnimation 
                          iconCode={data.icon} 
                          description={data.description} 
                          isDaily={true}
                          loop={true}
                          autoplay={true}
                        />
                      </div>
                      <span className="text-2xl font-bold text-[#0EA5E9]">
                        {Math.round(data.temp)}°
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <TrendingUp className="w-4 h-4 text-[#0EA5E9]" />
                      <span className="text-sm">His qilish: {Math.round(data.feels_like)}°</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CloudRain className="w-4 h-4 text-[#0EA5E9]" />
                      <span className="text-sm">Namlik: {data.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Wind className="w-4 h-4 text-[#0EA5E9]" />
                      <span className="text-sm">Shamol: {data.wind_speed} m/s</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-sm">Bosim: {data.pressure} hPa</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-slate-300 capitalize">
                      {data.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-slate-600 dark:text-slate-400 text-lg">
                Prognoz ma'lumotlari mavjud emas
              </div>
            </div>
          )}
        </div>

        {/* Current Weather Summary */}
        <div className="w-full lg:w-80 xl:w-96">
          <WeatherForecast 
            forecastData={forecastData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.main>
  )
}


