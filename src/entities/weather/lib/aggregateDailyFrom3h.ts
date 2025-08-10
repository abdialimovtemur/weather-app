import type { DailyForecast, Forecast3HResponse } from '@/entities/weather/model/types'

function getDateKey(tsSeconds: number, tzOffsetSeconds: number) {
  const shiftedMs = (tsSeconds + tzOffsetSeconds) * 1000
  const d = new Date(shiftedMs)
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

export function aggregateDailyFrom3h(resp: Forecast3HResponse): DailyForecast[] {
  const tz = resp.city.timezone ?? 0
  const byDay: Record<string, {
    dt: number
    min: number
    max: number
    humidities: number[]
    windSpeeds: number[]
    icons: string[]
    descriptions: string[]
  }> = {}

  for (const item of resp.list) {
    const key = getDateKey(item.dt, tz)
    if (!byDay[key]) {
      byDay[key] = {
        dt: item.dt,
        min: item.main.temp_min,
        max: item.main.temp_max,
        humidities: [],
        windSpeeds: [],
        icons: [],
        descriptions: [],
      }
    } else {
      byDay[key].dt = Math.min(byDay[key].dt, item.dt)
      byDay[key].min = Math.min(byDay[key].min, item.main.temp_min)
      byDay[key].max = Math.max(byDay[key].max, item.main.temp_max)
    }
    byDay[key].humidities.push(item.main.humidity)
    byDay[key].windSpeeds.push(item.wind.speed)
    if (item.weather?.[0]) {
      byDay[key].icons.push(item.weather[0].icon)
      byDay[key].descriptions.push(item.weather[0].description)
    }
  }

  const mode = (arr: string[]) => {
    const m = new Map<string, number>()
    for (const s of arr) m.set(s, (m.get(s) ?? 0) + 1)
    let best = arr[0]
    let cnt = -1
    for (const [k, v] of m) {
      if (v > cnt) { best = k; cnt = v }
    }
    return best
  }

  return Object.keys(byDay)
    .sort((a, b) => byDay[a].dt - byDay[b].dt)
    .slice(0, 5) // free endpoint covers ~5 days
    .map((k) => {
      const b = byDay[k]
      const humidityAvg = Math.round(b.humidities.reduce((s, v) => s + v, 0) / Math.max(1, b.humidities.length))
      const windAvg = b.windSpeeds.reduce((s, v) => s + v, 0) / Math.max(1, b.windSpeeds.length)
      const icon = b.icons.length ? mode(b.icons) : '01d'
      const description = b.descriptions.length ? mode(b.descriptions) : ''
      return {
        dt: b.dt,
        temp: { min: b.min, max: b.max },
        weather: [{ description, icon }],
        humidity: humidityAvg,
        wind_speed: windAvg,
      } as DailyForecast
    })
}


