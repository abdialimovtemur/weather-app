interface City {
  id: number
  name: string
  country: string
  state?: string
  lat?: number
  lon?: number
}

export const getCities = async (searchTerm: string): Promise<City[]> => {
  if (!searchTerm.trim()) {
    return []
  }

  try {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_api_key_here'
    
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchTerm)}&limit=10&appid=${API_KEY}`
    )

    if (!response.ok) {
      throw new Error('API response error')
    }

    const data = await response.json()
    
    return data.map((city: any) => ({
      id: city.id || Math.random(),
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon
    }))
  } catch (error) {
    console.error('Error fetching cities:', error)
    
    const fallbackCities: City[] = [
      { id: 1, name: 'Tashkent', country: 'UZ' },
      { id: 2, name: 'Samarkand', country: 'UZ' },
      { id: 3, name: 'Bukhara', country: 'UZ' },
      { id: 4, name: 'Andijan', country: 'UZ' },
      { id: 5, name: 'Namangan', country: 'UZ' }
    ]
    
    return fallbackCities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
}
