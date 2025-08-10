import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'

export function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-16 lg:pb-6 mt-12">
        <Outlet />
      </main>
    </div>
  )
}


