import { NavLink } from 'react-router-dom'
import { Home as HomeIcon, CloudSun, Settings as SettingsIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ANIMATION_CONSTANTS } from '@/shared/constants/weather'

const sidebarVariants = {
  hidden: { x: -24, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { 
      type: 'spring' as const, 
      stiffness: ANIMATION_CONSTANTS.SPRING.STIFFNESS, 
      damping: ANIMATION_CONSTANTS.SPRING.DAMPING, 
      staggerChildren: 0.08 
    },
  },
} satisfies Variants

const itemVariants = {
  hidden: { y: 8, opacity: 0 },
  visible: { y: 0, opacity: 1 },
} satisfies Variants

const navigationItems = [
  {
    to: '/',
    icon: HomeIcon,
    label: 'Bosh',
    ariaLabel: 'Bosh sahifa',
    end: true,
    desktopIconSize: 36,
    mobileIconSize: 20
  },
  {
    to: '/forecast',
    icon: CloudSun,
    label: 'Prognoz',
    ariaLabel: 'Ob-havo prognozi',
    end: false,
    desktopIconSize: 32,
    mobileIconSize: 20
  },
  {
    to: '/settings',
    icon: SettingsIcon,
    label: 'Sozlamalar',
    ariaLabel: 'Sozlamalar',
    end: false,
    desktopIconSize: 32,
    mobileIconSize: 20
  }
] as const

interface NavigationItemProps {
  item: typeof navigationItems[number]
  isMobile: boolean
}

const NavigationItem = ({ item, isMobile }: NavigationItemProps) => {
  const Icon = item.icon
  const iconSize = isMobile ? item.mobileIconSize : item.desktopIconSize
  
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        isMobile 
          ? `flex flex-col items-center justify-center text-xs gap-1 ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`
          : `flex flex-col items-center gap-1 rounded-md px-3 py-2 transition-colors w-20 h-20 justify-center ${
              isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-primary'
            }`
      }
      aria-label={item.ariaLabel}
      role={isMobile ? undefined : "menuitem"}
    >
      <motion.div 
        variants={isMobile ? undefined : itemVariants} 
        whileHover={{ scale: isMobile ? 1.12 : 1.08, y: isMobile ? -1 : -2 }} 
        whileTap={{ scale: 0.95 }}
      >
        <Icon size={iconSize} aria-hidden="true" />
      </motion.div>
      <span className="text-xs font-medium">{item.label}</span>
    </NavLink>
  )
}

export function Header() {

  return (
    <>
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className="hidden lg:flex lg:fixed lg:inset-y-10 lg:inset-x-5 lg:w-24 lg:flex-col border border-primary/20 rounded-lg z-40 backdrop-blur supports-[backdrop-filter]:bg-secondary/60 bg-secondary/80"
        role="navigation"
        aria-label="Asosiy navigatsiya"
      >
        <header className="h-24 flex items-center px-4 border-b">
          <img src="/logo.svg" alt="Logo" />
        </header>
        <motion.nav variants={sidebarVariants} className="flex flex-col items-center justify-center gap-4 mt-12" role="menubar">
          {navigationItems.map((item) => (
            <NavigationItem key={item.to} item={item} isMobile={false} />
          ))}
        </motion.nav>
      </motion.aside>

      <motion.nav
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: ANIMATION_CONSTANTS.SPRING.STIFFNESS, 
          damping: ANIMATION_CONSTANTS.SPRING.DAMPING 
        }}
        className="lg:hidden fixed bottom-0 inset-x-0 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-40"
        role="navigation"
        aria-label="Mobil navigatsiya"
      >
        <div className="h-full grid grid-cols-3">
          {navigationItems.map((item) => (
            <NavigationItem key={item.to} item={item} isMobile={true} />
          ))}
        </div>
      </motion.nav>
    </>
  )
}


