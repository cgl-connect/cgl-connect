'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Bell,
  Settings,
  Users,
  Library,
  Tablet,
  MapPin,
  LogOut,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface Route {
  name: string
  path: string
  icon: React.ReactNode
  disabled?: boolean
  section?: string
}

export default function Sidebar() {
  const pathname = usePathname()

  const routes: Route[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      section: 'main'
    },
    {
      name: 'Dispositivos',
      path: '/dashboard/devices',
      icon: <Tablet className="mr-2 h-5 w-5" />,
      section: 'main'
    },
    {
      name: 'Tipo de Dispositivos',
      path: '/dashboard/device-types',
      icon: <Library className="mr-2 h-5 w-5" />,
      section: 'main'
    },
    {
      name: 'Localizações',
      path: '/dashboard/locations',
      icon: <MapPin className="mr-2 h-5 w-5" />,
      section: 'main'
    },
    {
      name: 'Usuários',
      path: '/dashboard/users',
      icon: <Users className="mr-2 h-5 w-5" />,
      section: 'admin'
    },
    {
      name: 'Configurações',
      path: '/dashboard/settings',
      icon: <Settings className="mr-2 h-5 w-5" />,
      section: 'admin',
      disabled: true,
    },
  ] as const

  const mainRoutes = routes.filter(route => route.section === 'main')
  const adminRoutes = routes.filter(route => route.section === 'admin')

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="py-6 px-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">CGL</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Connect
          </h1>
        </div>
      </div>
      <div className="py-4 flex flex-col flex-1 overflow-y-auto">
        <nav className="px-3 space-y-1">
          <div className="mb-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-2 uppercase tracking-wider">
              Principal
            </p>
            {mainRoutes.map(route => (
              <Link href={route.disabled ? '#' : route.path} key={route.path}>
                <Button
                  disabled={route?.disabled}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start cursor-pointer my-1 group transition-all duration-200',
                    pathname === route.path
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50',
                  )}
                >
                  <span className={cn(
                    "transition-colors", 
                    pathname === route.path ? "text-blue-600 dark:text-blue-400" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  )}>
                    {route.icon}
                  </span>
                  {route.name}
                </Button>
              </Link>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-2 uppercase tracking-wider">
              Administração
            </p>
            {adminRoutes.map(route => (
              <Link href={route.disabled ? '#' : route.path} key={route.path}>
                <Button
                  disabled={route?.disabled}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start cursor-pointer my-1 group transition-all duration-200',
                    pathname === route.path
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50',
                  )}
                >
                  <span className={cn(
                    "transition-colors", 
                    pathname === route.path ? "text-blue-600 dark:text-blue-400" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  )}>
                    {route.icon}
                  </span>
                  {route.name}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="mt-auto px-3 mb-6">
          <Separator className="my-4" />
          <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400">
            <LogOut className="mr-2 h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
