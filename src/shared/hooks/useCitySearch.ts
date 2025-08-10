import { useState, useEffect, useRef } from 'react'
import { getCities } from '@/entities/weather/api/getCities'
import type { City } from '@/shared/types/weather'
import { WEATHER_CONSTANTS } from '@/shared/constants/weather'

export const useCitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // OpenWeatherMap API dan shaharlarni qidirish
  useEffect(() => {
    const searchCities = async () => {
      if (searchTerm.trim() === '') {
        setFilteredCities([])
        setShowSuggestions(false)
        setError(null)
        return
      }

      setIsLoadingCities(true)
      setError(null)
      
      try {
        const cities = await getCities(searchTerm)
        setFilteredCities(cities)
        setShowSuggestions(cities.length > 0)
      } catch (error) {
        console.error('Error fetching cities:', error)
        setError('Shaharlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')
        setFilteredCities([])
        setShowSuggestions(false)
      } finally {
        setIsLoadingCities(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchCities, WEATHER_CONSTANTS.DEBOUNCE_DELAY)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCitySelect = (selectedCity: City) => {
    setSearchTerm(selectedCity.name)
    setShowSuggestions(false)
    setError(null)
    return selectedCity.name
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setShowSuggestions(false)
      setError(null)
      return searchTerm.trim()
    }
    return null
  }

  const clearError = () => {
    setError(null)
  }

  return {
    searchTerm,
    setSearchTerm,
    showSuggestions,
    setShowSuggestions,
    filteredCities,
    isLoadingCities,
    error,
    clearError,
    searchRef,
    handleCitySelect,
    handleSearchSubmit
  }
}
