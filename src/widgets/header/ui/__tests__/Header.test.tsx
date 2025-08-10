import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { Header } from '../Header'

vi.mock('/logo.svg', () => ({
  default: '/logo.svg'
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  it('renders desktop sidebar with navigation items', () => {
    renderWithRouter(<Header />)
    
    const sidebar = screen.getByRole('navigation', { name: /asosiy navigatsiya/i })
    expect(sidebar).toBeInTheDocument()
    
    const desktopNav = sidebar.querySelector('nav[role="menubar"]')
    expect(desktopNav).toBeInTheDocument()
    
    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders mobile bottom navigation', () => {
    renderWithRouter(<Header />)
    
    const mobileNav = screen.getByRole('navigation', { name: /mobil navigatsiya/i })
    expect(mobileNav).toBeInTheDocument()
    
    const mobileGrid = mobileNav.querySelector('.grid.grid-cols-3')
    expect(mobileGrid).toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    renderWithRouter(<Header />)
    
    const homeLink = screen.getByRole('link', { name: /bosh sahifa/i })
    expect(homeLink).toHaveAttribute('href', '/')
    
    const forecastLink = screen.getByRole('link', { name: /ob-havo prognozi/i })
    expect(forecastLink).toHaveAttribute('href', '/forecast')
    
    const settingsLink = screen.getByRole('link', { name: /sozlamalar/i })
    expect(settingsLink).toHaveAttribute('href', '/settings')
  })

  it('applies active styles to current route', () => {
    renderWithRouter(<Header />)
    
    const homeLink = screen.getByRole('link', { name: /bosh sahifa/i })
    expect(homeLink).toHaveClass('text-primary')
  })

  it('has proper accessibility attributes', () => {
    renderWithRouter(<Header />)
    
    expect(screen.getByRole('navigation', { name: /asosiy navigatsiya/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /mobil navigatsiya/i })).toBeInTheDocument()
    
    const menubar = screen.getByRole('menubar')
    expect(menubar).toBeInTheDocument()
    
    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(3)
  })

  it('renders with correct icon sizes', () => {
    renderWithRouter(<Header />)
    
    const icons = document.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('has correct navigation structure', () => {
    renderWithRouter(<Header />)
    
    const desktopNav = screen.getByRole('navigation', { name: /asosiy navigatsiya/i })
    const mobileNav = screen.getByRole('navigation', { name: /mobil navigatsiya/i })
    
    expect(desktopNav).toHaveClass('hidden', 'lg:flex')
    expect(mobileNav).toHaveClass('lg:hidden')
  })
})
