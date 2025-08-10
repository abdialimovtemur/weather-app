import { Search, MapPin, Navigation } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import type { City } from '@/shared/types/weather'
import { useCitySearch } from '@/shared/hooks/useCitySearch'
import { ANIMATION_CONSTANTS } from '@/shared/constants/weather'

interface WeatherSearchProps {
  onCitySelect: (cityName: string) => void
  onAutoLocation: () => void
  isAutoLocation: boolean
  locationError: string | null
  locationLoading: boolean
}

export function WeatherSearch({ 
  onCitySelect, 
  onAutoLocation, 
  isAutoLocation, 
  locationError, 
  locationLoading 
}: WeatherSearchProps) {
  const {
    searchTerm,
    setSearchTerm,
    showSuggestions,
    setShowSuggestions,
    filteredCities,
    isLoadingCities,
    error: searchError,
    clearError,
    searchRef,
    handleCitySelect,
    handleSearchSubmit
  } = useCitySearch()

  const handleSubmit = (e: React.FormEvent) => {
    const cityName = handleSearchSubmit(e)
    if (cityName) {
      onCitySelect(cityName)
    }
  }

  const handleCityClick = (city: City) => {
    const cityName = handleCitySelect(city)
    onCitySelect(cityName)
  }

  return (
    <section className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full" aria-label="Shahar qidirish">
      <motion.button
        onClick={onAutoLocation}
        disabled={locationLoading}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          isAutoLocation 
            ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white shadow-lg' 
            : 'border-slate-300 dark:border-slate-600 hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/10'
        } ${locationLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        whileHover={!locationLoading ? { scale: ANIMATION_CONSTANTS.HOVER.SCALE } : {}}
        whileTap={!locationLoading ? { scale: ANIMATION_CONSTANTS.TAP.SCALE } : {}}
        aria-label="Avtomatik manzil olish"
        title={isAutoLocation ? 'Avtomatik manzil faol' : 'Avtomatik manzilni yoqish'}
      >
        <Navigation className={`w-5 h-5 ${locationLoading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline text-sm font-medium">
          {locationLoading 
            ? 'Manzil olinmoqda...' 
            : isAutoLocation 
              ? 'Avtomatik faol' 
              : 'Avtomatik manzil'
          }
        </span>
      </motion.button>

      {locationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800"
        >
          {locationError}
        </motion.div>
      )}

      {searchError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-between"
        >
          <span>{searchError}</span>
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
            aria-label="Xatolik xabarini yashirish"
          >
            ✕
          </button>
        </motion.div>
      )}

      <div className="relative w-full max-w-4xl" ref={searchRef}>
        <form onSubmit={handleSubmit} className="relative" role="search" aria-label="Shahar qidirish formasi">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 sm:w-6 sm:h-6 z-10" aria-hidden="true" />
            <Input
              className="w-full pl-12 pr-6 py-6 sm:py-8 text-lg sm:text-xl border-2 focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#0EA5E9]/20"
              placeholder="Shahar nomini kiriting..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() !== '' && setShowSuggestions(true)}
              aria-label="Shahar nomi"
              aria-describedby="search-description"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
              role="combobox"
              aria-autocomplete="list"
            />
            <div id="search-description" className="sr-only">
              Shahar nomini kiriting va ro'yxatdan tanlang
            </div>
          </div>
        </form>
        
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-600 shadow-2xl z-50 max-h-80 overflow-y-auto"
              role="listbox"
              aria-label="Shahar ro'yxati"
            >
              {isLoadingCities ? (
                <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
                  <div className="w-8 h-8 border-3 border-[#0EA5E9]/20 border-t-[#0EA5E9] rounded-full animate-spin mx-auto mb-3" aria-hidden="true"></div>
                  <p className="text-base sm:text-lg">Shaharlar qidirilmoqda...</p>
                </div>
              ) : filteredCities.length > 0 ? (
                filteredCities.map((cityItem, index) => (
                  <motion.button
                    key={cityItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCityClick(cityItem)}
                    className="w-full px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 flex items-center gap-4 first:rounded-t-2xl last:rounded-b-2xl border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                    role="option"
                    aria-selected={false}
                    aria-label={`${cityItem.name}, ${cityItem.country}${cityItem.state ? `, ${cityItem.state}` : ''}`}
                  >
                    <MapPin className="w-5 h-5 text-[#0EA5E9]" aria-hidden="true" />
                    <div className="flex flex-col flex-1">
                      <span className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300">{cityItem.name}</span>
                      {cityItem.state && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">{cityItem.state}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{cityItem.country}</span>
                  </motion.button>
                ))
              ) : searchTerm.trim() !== '' ? (
                <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400" role="status">
                  <p className="text-base sm:text-lg">Shahar topilmadi</p>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
