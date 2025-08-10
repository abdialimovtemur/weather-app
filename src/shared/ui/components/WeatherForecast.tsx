import { motion, type Variants } from 'framer-motion'
import { WeatherAnimation } from '@/shared/ui/widgets'
import { WEATHER_CONSTANTS, ANIMATION_CONSTANTS } from '@/shared/constants/weather'
import { formatTime } from '@/shared/utils/weatherCalculations'
import type { ForecastData } from '@/shared/types/weather'
import { ForecastSkeleton } from '@/components/ui/skeleton'

interface WeatherForecastProps {
  forecastData?: ForecastData | null
  isLoading: boolean
}

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

export function WeatherForecast({ forecastData, isLoading }: WeatherForecastProps) {
  if (isLoading) {
    return (
      <aside className="space-y-3 lg:sticky lg:top-6 w-full lg:w-80 xl:w-96" aria-label="Ob-havo prognozi">
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            <span className="text-sm">Prognoz yuklanmoqda...</span>
          </div>
        </div>
        <ForecastSkeleton />
      </aside>
    )
  }

  if (!forecastData) {
    return null
  }

  return (
    <aside className="space-y-3 lg:sticky lg:top-6 w-full lg:w-80 xl:w-96" aria-label="Ob-havo prognozi">
      <motion.section
        variants={itemRise}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-[#0EA5E9]/20 p-6 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-[#0EA5E9]/10 transition-all duration-300"
      >
        <header className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-[#0EA5E9] rounded-full" aria-hidden="true"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Bugungi prognoz</h2>
        </header>
        
        <div className="space-y-3" role="list" aria-label="Soatlik prognoz">
          {forecastData.list.slice(0, WEATHER_CONSTANTS.FORECAST_ITEMS).map((item: any) => {
            const when = new Date(item.dt * 1000)
            const hour = formatTime(item.dt)
            return (
              <article key={item.dt} className="rounded-xl border border-slate-200/50 dark:border-slate-600/50 p-4 flex items-center gap-4 bg-slate-50/60 dark:bg-slate-700/30 hover:bg-slate-100/80 dark:hover:bg-slate-600/40 transition-all duration-200 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40" role="listitem">
                <time className="text-sm text-slate-600 dark:text-slate-400 font-medium w-16" dateTime={when.toISOString()}>{hour}</time>
                <div className="h-12 w-12">
                  <WeatherAnimation iconCode={item.weather[0]?.icon} description={item.weather[0]?.description} />
                </div>
                <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{Math.round(item.main.temp)}°</div>
              </article>
            )
          })}
        </div>
      </motion.section>
    </aside>
  )
}


