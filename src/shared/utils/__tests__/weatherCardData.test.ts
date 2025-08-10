import { describe, it, expect } from 'vitest'
import { getWeatherCardData } from '../weatherCardData'

describe('weatherCardData', () => {
  describe('getWeatherCardData', () => {
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

    it('getValue function handles null weather data', () => {
      const result = getWeatherCardData()
      
      result.forEach(card => {
        const value = card.getValue(null, null)
        expect(value).toBeDefined()
        expect(typeof value).toBe('string')
      })
    })

    it('getValue function handles null forecast data', () => {
      const result = getWeatherCardData()
      const mockWeatherData = { main: { temp: 25, feels_like: 27, humidity: 60 }, wind: { speed: 10 } }
      
      result.forEach(card => {
        const value = card.getValue(mockWeatherData, null)
        expect(value).toBeDefined()
        expect(typeof value).toBe('string')
      })
    })

    it('getValue function returns correct format for temperature cards', () => {
      const result = getWeatherCardData()
      const mockWeatherData = { main: { temp: 25, feels_like: 27, humidity: 60 }, wind: { speed: 10 } }
      
      const feelsLikeCard = result.find(card => card.type === 'feels_like')
      const minTempCard = result.find(card => card.type === 'min_temp')
      const maxTempCard = result.find(card => card.type === 'max_temp')
      
      if (feelsLikeCard) {
        const value = feelsLikeCard.getValue(mockWeatherData, null)
        expect(value).toMatch(/^\d+°$/)
      }
      
      if (minTempCard) {
        const value = minTempCard.getValue(mockWeatherData, null)
        expect(value).toMatch(/^\d+°$/)
      }
      
      if (maxTempCard) {
        const value = maxTempCard.getValue(mockWeatherData, null)
        expect(value).toMatch(/^\d+°$/)
      }
    })

    it('getValue function returns correct format for wind speed', () => {
      const result = getWeatherCardData()
      const mockWeatherData = { main: { temp: 25, feels_like: 27, humidity: 60 }, wind: { speed: 10 } }
      
      const windCard = result.find(card => card.type === 'wind_speed')
      
      if (windCard) {
        const value = windCard.getValue(mockWeatherData, null)
        // Wind speed can have decimal places, so adjust regex
        expect(value).toMatch(/^\d+(\.\d+)? km\/h$/)
      }
    })

    it('getValue function returns correct format for humidity', () => {
      const result = getWeatherCardData()
      const mockWeatherData = { main: { temp: 25, feels_like: 27, humidity: 60 }, wind: { speed: 10 } }
      
      const humidityCard = result.find(card => card.type === 'humidity')
      
      if (humidityCard) {
        const value = humidityCard.getValue(mockWeatherData, null)
        expect(value).toMatch(/^\d+%$/)
      }
    })

    it('getValue function returns correct format for rain probability', () => {
      const result = getWeatherCardData()
      const mockWeatherData = { main: { temp: 25, feels_like: 27, humidity: 60 }, wind: { speed: 10 } }
      const mockForecastData = { list: [{ pop: 0.8 }, { pop: 0.6 }] }
      
      const rainCard = result.find(card => card.type === 'rain_probability')
      
      if (rainCard) {
        const value = rainCard.getValue(mockWeatherData, mockForecastData)
        expect(value).toMatch(/^\d+%$/)
      }
    })
  })
})
