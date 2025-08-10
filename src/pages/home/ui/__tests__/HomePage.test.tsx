import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HomePage } from '../HomePage'

// Mock hooks using vi.hoisted
const mockUseLocalStorage = vi.hoisted(() => vi.fn())
const mockUseGeolocation = vi.hoisted(() => vi.fn())
const mockUseWeatherQuery = vi.hoisted(() => vi.fn())
const mockUseForecast3hQuery = vi.hoisted(() => vi.fn())
const mockUseCityCoordinates = vi.hoisted(() => vi.fn())
const mockGetCityByCoords = vi.hoisted(() => vi.fn())

vi.mock('@/features/searchCity/model/useWeatherQuery', () => ({
  useWeatherQuery: mockUseWeatherQuery
}))

vi.mock('@/features/searchCity/model/useForecast3hQuery', () => ({
  useForecast3hQuery: mockUseForecast3hQuery
}))

vi.mock('@/features/searchCity/model/useCityCoordinates', () => ({
  useCityCoordinates: mockUseCityCoordinates
}))

vi.mock('@/shared/hooks/useGeolocation', () => ({
  useGeolocation: mockUseGeolocation
}))

vi.mock('@/shared/hooks/useLocalStorage', () => ({
  useLocalStorage: mockUseLocalStorage
}))

vi.mock('@/entities/weather/api/getWeather', () => ({
  getCityByCoords: mockGetCityByCoords
}))

// Mock components
vi.mock('@/shared/ui/components/WeatherSearch', () => ({
  WeatherSearch: ({ onCitySelect, onAutoLocation, isAutoLocation, locationError, locationLoading }: any) => (
    <div data-testid="weather-search">
      <button onClick={() => onCitySelect('Tashkent')} data-testid="city-select-btn">
        Select Tashkent
      </button>
      <button onClick={onAutoLocation} data-testid="auto-location-btn">
        Auto Location
      </button>
      <span data-testid="auto-location-status">
        {isAutoLocation ? 'Enabled' : 'Disabled'}
      </span>
      {locationError && <span data-testid="location-error">{locationError}</span>}
      {locationLoading && <span data-testid="location-loading">Loading...</span>}
    </div>
  )
}))

vi.mock('@/shared/ui/components/WeatherDisplay', () => ({
  WeatherDisplay: ({ weatherData, forecastData, isLoading, isError }: any) => (
    <div data-testid="weather-display">
      {isLoading && <span data-testid="weather-loading">Loading weather...</span>}
      {isError && <span data-testid="weather-error">Weather error</span>}
      {weatherData && <span data-testid="weather-data">Weather data loaded</span>}
      {forecastData && <span data-testid="forecast-data">Forecast data loaded</span>}
    </div>
  )
}))

vi.mock('@/shared/ui/components/WeatherForecast', () => ({
  WeatherForecast: ({ forecastData, isLoading }: any) => (
    <div data-testid="weather-forecast">
      {isLoading && <span data-testid="forecast-loading">Loading forecast...</span>}
      {forecastData && <span data-testid="forecast-data">Forecast loaded</span>}
    </div>
  )
}))

// Test wrapper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock implementations
    mockUseLocalStorage.mockReturnValue(['Tashkent', vi.fn()])
    mockUseGeolocation.mockReturnValue({
      latitude: null,
      longitude: null,
      error: null,
      isLoading: false,
      requestLocation: vi.fn()
    })
    mockUseWeatherQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false
    })
    mockUseForecast3hQuery.mockReturnValue({
      data: null,
      isLoading: false
    })
    mockUseCityCoordinates.mockReturnValue({
      data: null,
      isLoading: false
    })
    mockGetCityByCoords.mockResolvedValue('Tashkent')
  })

  it('renders without crashing', () => {
    render(<HomePage />, { wrapper: createTestWrapper() })
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('weather-search')).toBeInTheDocument()
    expect(screen.getByTestId('weather-display')).toBeInTheDocument()
    expect(screen.getByTestId('weather-forecast')).toBeInTheDocument()
  })

  it('displays loading state when data is loading', () => {
    mockUseWeatherQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    })

    render(<HomePage />, { wrapper: createTestWrapper() })
    
    expect(screen.getByTestId('weather-loading')).toBeInTheDocument()
  })

  it('displays error state when weather query fails', () => {
    mockUseWeatherQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    })

    render(<HomePage />, { wrapper: createTestWrapper() })
    
    expect(screen.getByTestId('weather-error')).toBeInTheDocument()
  })

  it('handles city selection', async () => {
    const setCityMock = vi.fn()
    const setIsAutoLocationMock = vi.fn()
    
    mockUseLocalStorage
      .mockReturnValueOnce(['Tashkent', setCityMock]) // city
      .mockReturnValueOnce([true, setIsAutoLocationMock]) // isAutoLocation

    render(<HomePage />, { wrapper: createTestWrapper() })
    
    const citySelectBtn = screen.getByTestId('city-select-btn')
    citySelectBtn.click()
    
    await waitFor(() => {
      expect(setCityMock).toHaveBeenCalledWith('Tashkent')
      expect(setIsAutoLocationMock).toHaveBeenCalledWith(false)
    })
  })

  it('handles auto location request', async () => {
    const requestLocationMock = vi.fn()
    mockUseGeolocation.mockReturnValue({
      latitude: null,
      longitude: null,
      error: null,
      isLoading: false,
      requestLocation: requestLocationMock
    })

    render(<HomePage />, { wrapper: createTestWrapper() })
    
    const autoLocationBtn = screen.getByTestId('auto-location-btn')
    autoLocationBtn.click()
    
    await waitFor(() => {
      expect(requestLocationMock).toHaveBeenCalled()
    })
  })

  it('shows auto location status', () => {
    mockUseLocalStorage
      .mockReturnValueOnce(['Tashkent', vi.fn()]) // city
      .mockReturnValueOnce([true, vi.fn()]) // isAutoLocation

    render(<HomePage />, { wrapper: createTestWrapper() })
    
    expect(screen.getByTestId('auto-location-status')).toHaveTextContent('Enabled')
  })

  it('displays weather data when available', () => {
    const mockWeatherData = { main: { temp: 25 } }
    mockUseWeatherQuery.mockReturnValue({
      data: mockWeatherData,
      isLoading: false,
      isError: false
    })

    render(<HomePage />, { wrapper: createTestWrapper() })
    
    expect(screen.getByTestId('weather-data')).toBeInTheDocument()
  })

  it('displays forecast data when available', () => {
    const mockForecastData = { list: [] }
    mockUseForecast3hQuery.mockReturnValue({
      data: mockForecastData,
      isLoading: false
    })

    render(<HomePage />, { wrapper: createTestWrapper() })
    
    // Use getAllByTestId to get all forecast data elements and check if any exist
    const forecastDataElements = screen.getAllByTestId('forecast-data')
    expect(forecastDataElements.length).toBeGreaterThan(0)
    
    // Check that at least one shows "Forecast loaded" (from WeatherForecast component)
    const forecastLoadedElement = screen.getByText('Forecast loaded')
    expect(forecastLoadedElement).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<HomePage />, { wrapper: createTestWrapper() })
    
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('aria-label', 'Ob-havo ma\'lumotlari')
  })
})
