import { useQuery } from '@tanstack/react-query'
import { geocodeCity, getForecast3hByCoords } from '@/entities/weather/api/getWeather'
import type { OneCallResponse } from '@/entities/weather/model/types'
import { aggregateDailyFrom3h } from '@/entities/weather/lib/aggregateDailyFrom3h'

export function useForecastQuery(city: string) {
  return useQuery<OneCallResponse | null>({
    queryKey: ['forecast', city],
    enabled: !!city,
    queryFn: async () => {
      const geo = await geocodeCity(city)
      if (!geo) return null
      const resp = await getForecast3hByCoords(geo.lat, geo.lon)
      const daily = aggregateDailyFrom3h(resp)
      return { timezone: String(resp.city.timezone), daily }
    },
  })
}


