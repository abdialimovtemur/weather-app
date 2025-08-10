import { useQuery } from '@tanstack/react-query';
import { getWeatherByCity } from '@/entities/weather/api/getWeather';

export function useWeatherQuery(city: string) {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => getWeatherByCity(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa cache
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
