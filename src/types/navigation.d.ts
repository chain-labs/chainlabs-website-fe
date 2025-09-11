export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType
  badge?: string | number
  children?: NavigationItem[]
}

export interface NavigationMenuProps {
  items: NavigationItem[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export interface FloatingNavbarProps {
  items: NavigationItem[]
  className?: string
}

export interface MobileMenuProps {
  items: NavigationItem[]
  isOpen: boolean
  onToggle: () => void
}