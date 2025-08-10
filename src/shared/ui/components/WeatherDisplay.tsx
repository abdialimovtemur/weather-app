import { motion, type Variants } from 'framer-motion'
import { WeatherAnimation } from '@/shared/ui/widgets'
import { getWeatherCardData } from '@/shared/utils/weatherCardData'
import { WeatherInfoCard } from '@/shared/ui/widgets'
import { WEATHER_CONSTANTS, ANIMATION_CONSTANTS } from '@/shared/constants/weather'
import type { WeatherData, ForecastData } from '@/shared/types/weather'
import { WeatherDisplaySkeleton } from '@/components/ui/skeleton'

interface WeatherDisplayProps {
  weatherData: WeatherData | null
  forecastData?: ForecastData | null
  isLoading: boolean
  isError: boolean
}



const gridStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: WEATHER_CONSTANTS.STAGGER_DELAY, delayChildren: WEATHER_CONSTANTS.CHILDREN_DELAY } },
} satisfies Variants

const itemRise = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: ANIMATION_CONSTANTS.SPRING.STIFFNESS, 
      damping: ANIMATION_CONSTANTS.SPRING.DAMPING 
    } 
  },
} satisfies Variants

export function WeatherDisplay({ weatherData, forecastData, isLoading, isError }: WeatherDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 flex-1 min-w-0">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            <span className="text-lg">Ob-havo ma'lumotlari yuklanmoqda...</span>
          </div>
        </div>
        <WeatherDisplaySkeleton />
      </div>
    )
  }

  if (isError || !weatherData) {
    return <WeatherErrorDisplay />
  }

  const weatherCardData = getWeatherCardData()

  return (
    <div className="space-y-6 flex-1 min-w-0">
      <motion.section
        className="flex w-full"
        variants={gridStagger}
        initial="hidden"
        animate="visible"
        aria-label="Hozirgi ob-havo"
      >
        <motion.article
          variants={itemRise}
          className="rounded-2xl border border-[#0EA5E9]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 bg-white/80 dark:bg-slate-800/60 shadow-lg hover:shadow-xl hover:shadow-[#0EA5E9]/10 transition-all duration-300 w-full"
          whileHover={{ y: ANIMATION_CONSTANTS.HOVER.Y_OFFSET, scale: 1.02 }}
        >
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <header className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">{weatherData.name}</h1>
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 capitalize">{weatherData.weather[0]?.description}</p>
            </header>

            <div className="space-y-3 sm:space-y-4">
              <div className="text-5xl sm:text-7xl font-bold text-[#0EA5E9] dark:text-[#0EA5E9]">
                {Math.round(weatherData.main.temp)}°
              </div>
              <div className="text-base sm:text-xl text-slate-600 dark:text-slate-300">
              Sezilayotgan harorat: {Math.round(weatherData.main.feels_like)}°
              </div>
            </div>

            {forecastData && (
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-full bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20 border border-[#0EA5E9]/20 dark:border-[#0EA5E9]/30">
                <span className="text-[#0EA5E9] dark:text-[#0EA5E9] text-sm sm:text-base font-medium">
                  Yomg'ir ehtimoli: {Math.round(Math.max(...forecastData.list.slice(0, WEATHER_CONSTANTS.FORECAST_ITEMS).map((i: any) => (i.pop ?? 0) * 100)))}%
                </span>
              </div>
            )}
          </div>

          <div className="w-48 h-48 sm:w-64 sm:h-64">
            <WeatherAnimation
              iconCode={weatherData.weather[0]?.icon}
              description={weatherData.weather[0]?.description}
            />
          </div>
        </motion.article>
      </motion.section>

      <motion.section 
        variants={itemRise} 
        initial="hidden" 
        animate="visible" 
        className="rounded-2xl border border-[#0EA5E9]/20 p-6 sm:p-8 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-[#0EA5E9]/10 transition-all duration-300 w-full"
        aria-label="Havo holati ma'lumotlari"
      >
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#0EA5E9] rounded-full" aria-hidden="true"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Havo holati</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {weatherCardData.map((cardData, index) => (
              <WeatherInfoCard
                key={index}
                icon={cardData.icon}
                title={cardData.title}
                value={cardData.getValue(weatherData || undefined, forecastData || undefined)}
              />
            ))}
          </div>
        </header>
      </motion.section>
    </div>
  )
}



function WeatherErrorDisplay() {
  return (
    <section className="flex items-center justify-center min-h-[50vh] lg:min-h-[60vh]" role="alert" aria-live="assertive">
      <motion.div 
        className="text-center space-y-6 p-8 lg:p-12 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 max-w-md lg:max-w-lg mx-auto"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-semibold text-red-800 dark:text-red-200">Xatolik yuz berdi</h2>
          <p className="text-base lg:text-lg text-red-600 dark:text-slate-300 max-w-sm lg:max-w-md leading-relaxed">
            Ob-havo ma'lumotlarini yuklashda muammo yuz berdi. Iltimos, qaytadan urinib ko'ring.
          </p>
        </div>
        <motion.button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-900"
                  whileHover={{ scale: ANIMATION_CONSTANTS.HOVER.SCALE }}
        whileTap={{ scale: ANIMATION_CONSTANTS.TAP.SCALE }}
          aria-label="Sahifani yangilash"
        >
          Qaytadan urinish
        </motion.button>
      </motion.div>
    </section>
  )
}
