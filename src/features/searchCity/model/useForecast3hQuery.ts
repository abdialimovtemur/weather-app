import { useQuery } from '@tanstack/react-query'
import { getForecast3hByCoords } from '@/entities/weather/api/getWeather'
import type { Forecast3HResponse } from '@/entities/weather/model/types'

export function useForecast3hQuery(city: string, lat?: number, lon?: number) {
  return useQuery<Forecast3HResponse | null>({
    queryKey: ['forecast-3h', city, lat, lon],
    enabled: !!city && !!lat && !!lon,
    staleTime: 10 * 60 * 1000, // 10 daqiqa
    gcTime: 15 * 60 * 1000, // 15 daqiqa cache
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    queryFn: async () => {
      try {
        if (!lat || !lon) return null
        const data = await getForecast3hByCoords(lat, lon)
        return data
      } catch (error) {
        console.error('Forecast query error:', error)
        throw error
      }
    },
  })
}


