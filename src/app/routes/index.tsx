import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/RootLayout'
import { HomePage } from '@/pages/home'
import { ForecastPage } from '@/pages/forecast'
import { SettingsPage } from '@/pages/settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'forecast', element: <ForecastPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])


