import { useQuery } from '@tanstack/react-query'
import { geocodeCity } from '@/entities/weather/api/getWeather'
import type { GeoResult } from '@/entities/weather/model/types'

export function useCityCoordinates(city: string) {
  return useQuery<GeoResult | null>({
    queryKey: ['city-coordinates', city],
    queryFn: async () => {
      try {
        const geo = await geocodeCity(city)
        return geo
      } catch (error) {
        console.error('City coordinates error:', error)
        throw error
      }
    },
    enabled: !!city,
    staleTime: 30 * 60 * 1000, // 30 daqiqa (shahar koordinatalari kam o'zgarmaydi)
    gcTime: 60 * 60 * 1000, // 1 soat cache
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}
