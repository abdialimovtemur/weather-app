// Map OpenWeather icon/code/description to local image paths under public/weather-icons

export function getLocalIconPath(iconCode?: string, description?: string) {
  // Priority: direct icon code mapping
  const code = iconCode ?? ''
  if (/^01[d|n]$/.test(code)) return '/weather-icons/sunny.png'
  if (/^02[d|n]$/.test(code)) return '/weather-icons/partly-cloudy.png'
  if (/^(03|04)[d|n]$/.test(code)) return '/weather-icons/cloudy.png'
  if (/^09[d|n]$/.test(code)) return '/weather-icons/shower-rain.png'
  if (/^10[d|n]$/.test(code)) return '/weather-icons/rain.png'
  if (/^11[d|n]$/.test(code)) return '/weather-icons/thunderstorm.png'
  if (/^13[d|n]$/.test(code)) return '/weather-icons/snow.png'
  if (/^50[d|n]$/.test(code)) return '/weather-icons/mist.png'

  // Fallback by description keywords
  const d = (description ?? '').toLowerCase()
  if (d.includes('snow')) return '/weather-icons/snow.png'
  if (d.includes('thunder')) return '/weather-icons/thunderstorm.png'
  if (d.includes('rain')) return '/weather-icons/rain.png'
  if (d.includes('cloud')) return '/weather-icons/cloudy.png'
  if (d.includes('mist') || d.includes('fog')) return '/weather-icons/mist.png'
  if (d.includes('clear')) return '/weather-icons/sunny.png'

  return '/weather-icons/partly-cloudy.png'
}

// Animation mapping (Lottie) based on icon codes and description
// Files are located under src/assets/animations
export function getAnimationKey(iconCode?: string, description?: string):
  | 'Weather-sunny'
  | 'Weather-partly-cloudy'
  | 'Weather-cloudy(night)'
  | 'Weather-partly-shower'
  | 'Weather-rainy(night)'
  | 'Weather-snow'
  | 'Weather-storm'
  | 'Weather-windy'
  | 'Weather-night'
  | 'fallback' {
  const code = iconCode ?? ''
  const d = (description ?? '').toLowerCase()

  if (/^01d$/.test(code) || d.includes('clear')) return 'Weather-sunny'
  if (/^01n$/.test(code)) return 'Weather-night'
  if (/^02[d|n]$/.test(code)) return 'Weather-partly-cloudy'
  if (/^(03|04)d$/.test(code)) return 'Weather-windy'
  if (/^(03|04)n$/.test(code)) return 'Weather-cloudy(night)'
  if (/^09[d|n]$/.test(code)) return 'Weather-partly-shower'
  if (/^10d$/.test(code)) return 'Weather-partly-shower'
  if (/^10n$/.test(code)) return 'Weather-rainy(night)'
  if (/^11[d|n]$/.test(code)) return 'Weather-storm'
  if (/^13[d|n]$/.test(code) || d.includes('snow')) return 'Weather-snow'

  return 'fallback'
}

// For daily forecasts, always use day icons (ignore night codes)
export function getDailyAnimationKey(iconCode?: string, description?: string):
  | 'Weather-sunny'
  | 'Weather-partly-cloudy'
  | 'Weather-cloudy(night)'
  | 'Weather-partly-shower'
  | 'Weather-rainy(night)'
  | 'Weather-snow'
  | 'Weather-storm'
  | 'Weather-windy'
  | 'Weather-night'
  | 'fallback' {
  const code = iconCode ?? ''
  const d = (description ?? '').toLowerCase()

  // Force day icons for daily forecasts
  const dayCode = code.replace('n', 'd')

  if (/^01d$/.test(dayCode) || d.includes('clear')) return 'Weather-sunny'
  if (/^02d$/.test(dayCode)) return 'Weather-partly-cloudy'
  if (/^(03|04)d$/.test(dayCode)) return 'Weather-windy'
  if (/^09d$/.test(dayCode)) return 'Weather-partly-shower'
  if (/^10d$/.test(dayCode)) return 'Weather-partly-shower'
  if (/^11d$/.test(dayCode)) return 'Weather-storm'
  if (/^13d$/.test(dayCode) || d.includes('snow')) return 'Weather-snow'

  return 'Weather-partly-cloudy'
}



