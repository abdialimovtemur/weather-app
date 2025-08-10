import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/app/providers/AppProviders'
import { THEME_CONSTANTS } from '@/shared/constants/weather'

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme()

  const toggleTheme = () => {
    if (theme === THEME_CONSTANTS.AUTO) {
      setTheme(isDark ? THEME_CONSTANTS.LIGHT : THEME_CONSTANTS.DARK)
    } else {
      setTheme(isDark ? THEME_CONSTANTS.LIGHT : THEME_CONSTANTS.DARK)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label={`${isDark ? 'Yorug' : 'Qorong\'i'} rejimga o\'tish`}
      title={`${isDark ? 'Yorug' : 'Qorong\'i'} rejimga o\'tish`}
    >
      {isDark ? (
        <Sun data-testid="sun-icon" size={20} className="text-slate-700 dark:text-slate-300" aria-hidden="true" />
      ) : (
        <Moon data-testid="moon-icon" size={20} className="text-slate-700 dark:text-slate-300" aria-hidden="true" />
      )}
    </button>
  )
}


