import { useState } from 'react';
import { useWeatherQuery } from '../model/useWeatherQuery';
import { Search } from 'lucide-react';

export function SearchCity() {
  const [city, setCity] = useState('');
  const { data, isLoading, isError } = useWeatherQuery(city);

  return (
    <section className="space-y-4" aria-label="Shahar qidirish">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        <input
          type="text"
          placeholder="Shahar kiriting"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
          aria-label="Shahar nomi"
        />
      </div>
      
      {isLoading && (
        <div role="status" aria-live="polite" className="text-center py-4">
          <div className="w-6 h-6 border-2 border-[#0EA5E9]/20 border-t-[#0EA5E9] rounded-full animate-spin mx-auto mb-2" aria-hidden="true"></div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Yuklanmoqda...</p>
        </div>
      )}
      
      {isError && (
        <div role="alert" aria-live="assertive" className="text-center py-6 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-sm mx-auto">
          <div className="w-12 h-12 mx-auto mb-3 text-red-500" aria-hidden="true">⚠️</div>
          <h3 className="text-base font-semibold text-red-800 dark:text-red-200 mb-2">Xatolik yuz berdi</h3>
          <p className="text-sm text-red-600 dark:text-red-400">Ob-havo ma'lumotlarini yuklashda muammo yuz berdi</p>
        </div>
      )}
      
      {data && (
        <article className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
          <header className="mb-3">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">{data.name}</h2>
          </header>
          <div className="space-y-2">
            <p className="text-2xl sm:text-3xl font-bold text-[#0EA5E9]">{Math.round(data.main.temp)}°C</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 capitalize">{data.weather[0].description}</p>
          </div>
        </article>
      )}
    </section>
  );
}
