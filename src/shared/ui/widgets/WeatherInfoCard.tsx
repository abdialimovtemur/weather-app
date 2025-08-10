import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface WeatherInfoCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  children?: ReactNode
}

export function WeatherInfoCard({ icon: Icon, title, value, children }: WeatherInfoCardProps) {
  return (
    <article 
      className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-slate-50/60 dark:bg-slate-700/30 hover:bg-slate-100/80 dark:hover:bg-slate-600/40 transition-all duration-200 border border-slate-200/50 dark:border-slate-600/50 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-lg hover:shadow-[#0EA5E9]/10"
      role="region"
      aria-label={`${title}: ${children || value}`}
    >
      <div className="text-lg sm:text-2xl mb-2 text-[#0EA5E9]" aria-hidden="true">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
      <h3 className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center mb-1 font-medium">{title}</h3>
      <div className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white">
        {children || value}
      </div>
    </article>
  )
}
