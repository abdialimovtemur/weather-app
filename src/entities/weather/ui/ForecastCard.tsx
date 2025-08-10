import { WeatherAnimation } from '@/shared/ui/widgets/WeatherAnimation'

type ForecastCardProps = {
  date: Date
  minTemp: number
  maxTemp: number
  description: string
  icon: string
  humidity?: number
  windSpeed?: number
}

export function ForecastCard({ date, minTemp, maxTemp, description, icon, humidity, windSpeed }: ForecastCardProps) {
  const day = date.toLocaleDateString(undefined, { weekday: 'short' })
  const dayNum = date.getDate()
  const month = date.toLocaleDateString(undefined, { month: 'short' })

  return (
    <article 
      className="rounded-lg border p-3 sm:p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
      role="region"
      aria-label={`${day}, ${dayNum} ${month} ob-havo prognozi`}
    >
      <header className="flex items-center justify-between">
        <time className="text-sm text-muted-foreground font-medium" dateTime={date.toISOString()}>{day}</time>
        <time className="text-xs text-muted-foreground" dateTime={date.toISOString()}>{dayNum} {month}</time>
      </header>
      
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12">
          <WeatherAnimation iconCode={icon} description={description} />
        </div>
        <div className="flex-1">
          <div className="text-sm capitalize text-muted-foreground">{description}</div>
          <div className="text-base sm:text-lg font-semibold">
            {Math.round(maxTemp)}° / {Math.round(minTemp)}°
          </div>
        </div>
      </div>
      
      {(humidity != null || windSpeed != null) && (
        <footer className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
          {humidity != null && (
            <div aria-label={`Namlik: ${Math.round(humidity)} foiz`}>
              Namlik: {Math.round(humidity)}%
            </div>
          )}
          {windSpeed != null && (
            <div aria-label={`Shamol tezligi: ${Math.round(windSpeed)} metr soniyada`}>
              Shamol: {Math.round(windSpeed)} m/s
            </div>
          )}
        </footer>
      )}
    </article>
  )
}


