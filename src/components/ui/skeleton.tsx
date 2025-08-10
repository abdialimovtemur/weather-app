import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function WeatherCardSkeleton() {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50/60 dark:bg-slate-700/30 border border-slate-200/50 dark:border-slate-600/50">
      <Skeleton className="w-8 h-8 rounded-full mb-2" />
      <Skeleton className="w-16 h-3 mb-1" />
      <Skeleton className="w-12 h-6" />
    </div>
  )
}

function WeatherDisplaySkeleton() {
  return (
    <div className="space-y-6 flex-1 min-w-0">
      <div className="rounded-2xl border border-slate-200/50 dark:border-slate-600/50 p-6 bg-white/80 dark:bg-slate-800/60 shadow-lg w-full">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-24 h-5" />
            <div className="space-y-3">
              <Skeleton className="w-24 h-16" />
              <Skeleton className="w-28 h-5" />
            </div>
          </div>
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/50 dark:border-slate-600/50 p-6 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md shadow-lg w-full">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-2 h-8 rounded-full" />
            <Skeleton className="w-32 h-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <WeatherCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ForecastSkeleton() {
  return (
    <aside className="space-y-3 lg:sticky lg:top-6 w-full lg:w-80 xl:w-96">
      <div className="rounded-2xl border border-slate-200/50 dark:border-slate-600/50 p-6 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-2 h-6 rounded-full" />
          <Skeleton className="w-32 h-6" />
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200/50 dark:border-slate-600/50 p-4 flex items-center gap-4 bg-slate-50/60 dark:bg-slate-700/30">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-12 h-6" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export { Skeleton, WeatherCardSkeleton, WeatherDisplaySkeleton, ForecastSkeleton }
