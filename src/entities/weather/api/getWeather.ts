import { api } from '@/shared/api/api';
import axios from 'axios';
import type { WeatherData, GeoResult, OneCallResponse, Forecast3HResponse } from '../model/types';

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const { data } = await api.get(`/weather?q=${city}`);
  return data;
};

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

if (!apiKey) {
  console.error('VITE_OPENWEATHER_API_KEY environment variable topilmadi!')
}

export const geocodeCity = async (city: string): Promise<GeoResult | null> => {
  if (!apiKey) {
    console.error('API kalit yo\'q, geocoding amalga oshirilmaydi')
    return null
  }

  try {
    const { data } = await axios.get<GeoResult[]>(
      'https://api.openweathermap.org/geo/1.0/direct',
      {
        params: {
          q: city,
          limit: 1,
          appid: apiKey,
        },
        timeout: 8000,
      }
    );
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Geocoding xatoligi:', error);
    return null;
  }
};

export const getCityByCoords = async (lat: number, lon: number): Promise<string | null> => {
  if (!apiKey) {
    console.error('API kalit yo\'q, reverse geocoding amalga oshirilmaydi')
    return null
  }

  try {
    console.log('Reverse geocoding so\'ralmoqda:', { lat, lon })
    
    const { data } = await axios.get<GeoResult[]>(
      'https://api.openweathermap.org/geo/1.0/reverse',
      {
        params: {
          lat,
          lon,
          limit: 1,
          appid: apiKey,
        },
        timeout: 10000,
      }
    );
    
    console.log('Reverse geocoding natijasi:', data)
    
    if (Array.isArray(data) && data.length > 0) {
      const cityName = data[0].name
      console.log('Shahar nomi topildi:', cityName)
      return cityName
    } else {
      console.log('Shahar nomi topilmadi')
      return null
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Reverse geocoding API xatoligi:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
      
      if (error.response?.status === 401) {
        console.error('API kalit noto\'g\'ri yoki muddati tugagan')
      } else if (error.response?.status === 429) {
        console.error('API so\'rovlar chegarasi yetib bormoqda')
      }
    } else {
      console.error('Reverse geocoding xatoligi:', error)
    }
    return null
  }
};

export const getDailyForecastByCoords = async (
  lat: number,
  lon: number
): Promise<OneCallResponse> => {
  const { data } = await axios.get<OneCallResponse>(
    'https://api.openweathermap.org/data/3.0/onecall',
    {
      params: {
        lat,
        lon,
        exclude: 'current,minutely,hourly,alerts',
        units: 'metric',
        appid: apiKey,
      },
      timeout: 8000,
    }
  );
  return data;
};

export const getForecast3hByCoords = async (lat: number, lon: number) => {
  const { data } = await api.get<Forecast3HResponse>(`/forecast`, {
    params: { lat, lon },
  });
  return data;
};
