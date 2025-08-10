export const WEATHER_CONSTANTS = {
  DEBOUNCE_DELAY: 500,
  FORECAST_ITEMS: 6,
  TEMP_OFFSET: 5,
  ANIMATION_DURATION: 0.35,
  STAGGER_DELAY: 0.06,
  CHILDREN_DELAY: 0.05
} as const

export const WEATHER_CARD_TYPES = {
  FEELS_LIKE: 'feels_like',
  WIND_SPEED: 'wind_speed',
  HUMIDITY: 'humidity',
  RAIN_PROBABILITY: 'rain_probability',
  MIN_TEMP: 'min_temp',
  MAX_TEMP: 'max_temp'
} as const

// Union types for better type safety
export type WeatherCardType = typeof WEATHER_CARD_TYPES[keyof typeof WEATHER_CARD_TYPES]

// Theme constants
export const THEME_CONSTANTS = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const

export type ThemeType = typeof THEME_CONSTANTS[keyof typeof THEME_CONSTANTS]

// Animation constants
export const ANIMATION_CONSTANTS = {
  SPRING: {
    STIFFNESS: 140,
    DAMPING: 18
  },
  HOVER: {
    SCALE: 1.05,
    Y_OFFSET: -2
  },
  TAP: {
    SCALE: 0.95
  }
} as const

