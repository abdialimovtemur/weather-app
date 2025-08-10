import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { useGeolocation } from '@/shared/hooks/useGeolocation'
import { getCityByCoords } from '@/entities/weather/api/getWeather'
import { Navigation, MapPin, Sun, Moon, Monitor, Globe, Settings as SettingsIcon, Search, X } from 'lucide-react'
import { useTheme } from '@/app/providers/AppProviders'
import { useState, useEffect, useRef } from 'react'
import { getCities } from '@/entities/weather/api/getCities'
import type { City } from '@/shared/types/weather'
import { WEATHER_CONSTANTS } from '@/shared/constants/weather'

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [selectedCity, setSelectedCity] = useLocalStorage('selectedCity', 'Tashkent')
  const [isAutoLocation, setIsAutoLocation] = useLocalStorage('isAutoLocation', true)
  
  const [showCitySearch, setShowCitySearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const citySearchRef = useRef<HTMLDivElement>(null)
  
  const { latitude, longitude, error: locationError, isLoading: locationLoading, requestLocation } = useGeolocation()

  useEffect(() => {
    const searchCities = async () => {
      if (searchTerm.trim() === '') {
        setFilteredCities([])
        return
      }

      setIsLoadingCities(true)
      try {
        const cities = await getCities(searchTerm)
        setFilteredCities(cities)
      } catch (error) {
        console.error('Error fetching cities:', error)
        setFilteredCities([])
      } finally {
        setIsLoadingCities(false)
      }
    }

    const timeoutId = setTimeout(searchCities, WEATHER_CONSTANTS.DEBOUNCE_DELAY)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (citySearchRef.current && !citySearchRef.current.contains(event.target as Node)) {
        setShowCitySearch(false)
        setSearchTerm('')
        setFilteredCities([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAutoLocation = async () => {
    setIsAutoLocation(true)
    if (latitude && longitude) {
      const cityName = await getCityByCoords(latitude, longitude)
      if (cityName) {
        setSelectedCity(cityName)
      }
    } else {
      requestLocation()
    }
  }

  const handleManualCity = () => {
    setIsAutoLocation(false)
    setShowCitySearch(true)
    setSearchTerm('')
    setFilteredCities([])
  }

  const handleCitySelect = (city: City) => {
    setSelectedCity(city.name)
    setShowCitySearch(false)
    setSearchTerm('')
    setFilteredCities([])
  }

  const closeCitySearch = () => {
    setShowCitySearch(false)
    setSearchTerm('')
    setFilteredCities([])
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.main 
      className="p-4 sm:p-6 max-w-4xl mx-auto" 
      role="main" 
      aria-label="Sozlamalar"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-8 h-8 text-[#0EA5E9]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Sozlamalar</h1>
        </div>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Ilovangiz sozlamalarini boshqaring va shaxsiylashtiring
        </p>
      </header>
      
      <section className="space-y-6" aria-label="Asosiy sozlamalar">
        {/* Dark Mode Settings */}
        <motion.div 
          className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg"
          whileHover={{ y: -2, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-[#0EA5E9]" />
              ) : theme === 'light' ? (
                <Sun className="w-6 h-6 text-[#0EA5E9]" />
              ) : (
                <Monitor className="w-6 h-6 text-[#0EA5E9]" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ko'rinish</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'light', icon: Sun, label: 'Yorug', desc: 'Yorug mavzu' },
              { value: 'dark', icon: Moon, label: 'Qorong\'i', desc: 'Qorong\'i mavzu' },
              { value: 'auto', icon: Monitor, label: 'Avtomatik', desc: 'Sistema sozlamasi' }
            ].map((option) => {
              const Icon = option.icon
              return (
                <motion.button
                  key={option.value}
                  onClick={() => setTheme(option.value as 'light' | 'dark' | 'auto')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    theme === option.value
                      ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 shadow-lg'
                      : 'border-slate-200 dark:border-slate-600 hover:border-[#0EA5E9]/50 hover:bg-[#0EA5E9]/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-6 h-6 mb-2 ${theme === option.value ? 'text-[#0EA5E9]' : 'text-slate-400'}`} />
                  <div className="font-medium text-slate-900 dark:text-white">{option.label}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Location Settings */}
        <motion.div 
          className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg"
          whileHover={{ y: -2, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
              <Globe className="w-6 h-6 text-[#0EA5E9]" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Manzil</h2>
          </div>
          
          <div className="space-y-4">
            {/* Current city display */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#0EA5E9]" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Joriy shahar</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{selectedCity}</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isAutoLocation 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {isAutoLocation ? 'Avtomatik' : 'Qo\'lda'}
              </div>
            </div>

            {/* Auto location button */}
            <motion.button
              onClick={handleAutoLocation}
              disabled={locationLoading}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                isAutoLocation
                  ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white shadow-lg'
                  : 'border-slate-300 dark:border-slate-600 hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/10'
              } ${locationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={!locationLoading ? { scale: 1.02 } : {}}
              whileTap={!locationLoading ? { scale: 0.98 } : {}}
            >
              <Navigation className={`w-5 h-5 ${locationLoading ? 'animate-spin' : ''}`} />
              <span className="font-medium">
                {locationLoading ? 'Manzil olinmoqda...' : 'Avtomatik manzil olish'}
              </span>
            </motion.button>

            {/* Manual city button */}
            <motion.button
              onClick={handleManualCity}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Qo'lda shahar tanlash</span>
            </motion.button>

            {/* Location error */}
            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
              >
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{locationError}</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* City Search Modal */}
      <AnimatePresence>
        {showCitySearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeCitySearch}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              ref={citySearchRef}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Shahar tanlash</h3>
                <button
                  onClick={closeCitySearch}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Yopish"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Search Input */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Shahar nomini kiriting..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* City Results */}
              <div className="max-h-96 overflow-y-auto">
                {isLoadingCities ? (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 border-3 border-[#0EA5E9]/20 border-t-[#0EA5E9] rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-600 dark:text-slate-400">Shaharlar qidirilmoqda...</p>
                  </div>
                ) : filteredCities.length > 0 ? (
                  filteredCities.map((city, index) => (
                    <motion.button
                      key={city.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCitySelect(city)}
                      className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#0EA5E9] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 dark:text-white truncate">{city.name}</div>
                          {city.state && (
                            <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{city.state}</div>
                          )}
                        </div>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full flex-shrink-0">
                          {city.country}
                        </span>
                      </div>
                    </motion.button>
                  ))
                ) : searchTerm.trim() !== '' ? (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                    <p>Shahar topilmadi</p>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                    <p>Shahar nomini kiriting</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}


