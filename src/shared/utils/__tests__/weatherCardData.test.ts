import { describe, it, expect } from 'vitest'
import { getWeatherCardData } from '../weatherCardData'
import type { WeatherData, ForecastData } from '@/shared/types/weather'

describe('weatherCardData', () => {
  describe('getWeatherCardData', () => {
    // Create a proper mock WeatherData object that matches the interface
    const createMockWeatherData = (): WeatherData => ({
      name: 'Test City',
      main: {
        temp: 25,
        feels_like: 27,
        humidity: 60,
        pressure: 1013
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }
      ],
      wind: {
        speed: 10,
        deg: 180
      },
      clouds: {
        all: 20
      },
      sys: {
        country: 'UZ',
        sunrise: 1640995200,
        sunset: 1641038400
      },
      dt: 1640995200,
      timezone: 18000
    })

    // Create a proper mock ForecastData object
    const createMockForecastData = (): ForecastData => ({
      list: [
        {
          dt: 1640995200,
          main: {
            temp: 25,
            feels_like: 27,
            humidity: 60,
            pressure: 1013,
            pop: 0.8
          },
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01d'
            }
          ],
          wind: {
            speed: 10,
            deg: 180
          },
          clouds: {
            all: 20
          },
          dt_txt: '2022-01-01 12:00:00'
        },
        {
          dt: 1641006000,
          main: {
            temp: 26,
            feels_like: 28,
            humidity: 65,
            pressure: 1012,
            pop: 0.6
          },
          weather: [
            {
              id: 801,
              main: 'Clouds',
              description: 'few clouds',
              icon: '02d'
            }
          ],
          wind: {
            speed: 12,
            deg: 190
          },
          clouds: {
            all: 30
          },
          dt_txt: '2022-01-01 15:00:00'
        }
      ],
      city: {
        id: 123456,
        name: 'Test City',
        coord: {
          lat: 41.3111,
          lon: 69.2797
        },
        country: 'UZ',
        timezone: 18000,
        sunrise: 1640995200,
        sunset: 1641038400
      }
    })

    it('returns array of weather card data', () => {
      const result = getWeatherCardData()
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(6)
    })

    it('has correct card types', () => {
      const result = getWeatherCardData()
      const expectedTypes = [
        'feels_like',
        'wind_speed', 
        'humidity',
        'rain_probability',
        'min_temp',
        'max_temp'
      ]
      
      result.forEach((card, index) => {
        expect(card.type).toBe(expectedTypes[index])
      })
    })

    it('has required properties for each card', () => {
      const result = getWeatherCardData()
      
      result.forEach(card => {
        expect(card).toHaveProperty('type')
        expect(card).toHaveProperty('icon')
        expect(card).toHaveProperty('title')
        expect(card).toHaveProperty('getValue')
        expect(typeof card.getValue).toBe('function')
      })
    })

    it('has correct titles in Uzbek', () => {
      const result = getWeatherCardData()
      const expectedTitles = [
        'Sezilayotgan harorat',
        'Shamol tezligi',
        'Namlik',
        'Yomg\'ir ehtimoli',
        'Min harorat',
        'Max harorat'
      ]
      
      result.forEach((card, index) => {
        expect(card.title).toBe(expectedTitles[index])
      })
    })

    it('getValue function handles undefined weather data', () => {
      const result = getWeatherCardData()
      
      result.forEach(card => {
        const value = card.getValue(undefined, undefined)
        expect(value).toBeDefined()
        expect(typeof value).toBe('string')
      })
    })

    it('getValue function handles undefined forecast data', () => {
      const result = getWeatherCardData()
      const mockWeatherData = createMockWeatherData()
      
      result.forEach(card => {
        const value = card.getValue(mockWeatherData, undefined)
        expect(value).toBeDefined()
        expect(typeof value).toBe('string')
      })
    })

    it('getValue function returns correct format for temperature cards', () => {
      const result = getWeatherCardData()
      const mockWeatherData = createMockWeatherData()
      
      const feelsLikeCard = result.find(card => card.type === 'feels_like')
      const minTempCard = result.find(card => card.type === 'min_temp')
      const maxTempCard = result.find(card => card.type === 'max_temp')
      
      if (feelsLikeCard) {
        const value = feelsLikeCard.getValue(mockWeatherData, undefined)
        expect(value).toMatch(/^\d+°$/)
      }
      
      if (minTempCard) {
        const value = minTempCard.getValue(mockWeatherData, undefined)
        expect(value).toMatch(/^\d+°$/)
      }
      
      if (maxTempCard) {
        const value = maxTempCard.getValue(mockWeatherData, undefined)
        expect(value).toMatch(/^\d+°$/)
      }
    })

    it('getValue function returns correct format for wind speed', () => {
      const result = getWeatherCardData()
      const mockWeatherData = createMockWeatherData()
      
      const windCard = result.find(card => card.type === 'wind_speed')
      
      if (windCard) {
        const value = windCard.getValue(mockWeatherData, undefined)
        // Wind speed can have decimal places, so adjust regex
        expect(value).toMatch(/^\d+(\.\d+)? km\/h$/)
      }
    })

    it('getValue function returns correct format for humidity', () => {
      const result = getWeatherCardData()
      const mockWeatherData = createMockWeatherData()
      
      const humidityCard = result.find(card => card.type === 'humidity')
      
      if (humidityCard) {
        const value = humidityCard.getValue(mockWeatherData, undefined)
        expect(value).toMatch(/^\d+%$/)
      }
    })

    it('getValue function returns correct format for rain probability', () => {
      const result = getWeatherCardData()
      const mockWeatherData = createMockWeatherData()
      const mockForecastData = createMockForecastData()
      
      const rainCard = result.find(card => card.type === 'rain_probability')
      
      if (rainCard) {
        const value = rainCard.getValue(mockWeatherData, mockForecastData)
        expect(value).toMatch(/^\d+%$/)
      }
    })
  })
})
