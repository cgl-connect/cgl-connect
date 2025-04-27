'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, RefreshCw, Search } from 'lucide-react'
import { useFindManyDashboard } from '@/lib/zenstack-hooks'
import LoadingSpinner from '@/components/loading-spinner'
import DashboardForm from '@/components/dashboard/dashboard-form'
import DashboardSharingModal from '@/components/dashboard/dashboard-sharing-modal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DashboardCard from '@/components/dashboard/dashboard-card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dashboard } from '@prisma/client'
import { useSession } from 'next-auth/react'

export default function DashboardsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDashboardId, setEditingDashboardId] = useState<
    string | undefined
  >()
  const [sharingDashboardId, setSharingDashboardId] = useState<
    string | undefined
  >()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()

  const {
    data: dashboards,
    isLoading,
    refetch,
  } = useFindManyDashboard({
    include: {
      owner: true,
      _count: {
        select: {
          devices: true,
        },
      },
    },
  })

  const filteredDashboards = dashboards?.filter(dashboard =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const myDashboards = filteredDashboards?.filter(
    dashboard => dashboard.ownerId === session?.user?.id,
  )
  const sharedDashboards = filteredDashboards?.filter(
    dashboard => dashboard.ownerId !== session?.user?.id,
  )

  const handleAddNew = () => {
    setEditingDashboardId(undefined)
    setIsFormOpen(true)
  }

  const handleEditClick = (id: string) => {
    setEditingDashboardId(id)
    setIsFormOpen(true)
  }

  const handleShareClick = (id: string) => {
    setSharingDashboardId(id)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    refetch()
  }

  const renderDashboardGrid = (items: typeof myDashboards) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )
    }

    if (!items?.length) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
            <PlusCircle className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
            Nenhum dashboard encontrado
          </p>
          <p className="text-slate-500 dark:text-slate-500 mb-6 max-w-sm">
            {searchQuery
              ? 'Tente outro termo de busca ou'
              : 'Você ainda não tem dashboards. Que tal'}{' '}
            criar seu primeiro dashboard?
          </p>
          <Button onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Dashboard
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(dashboard => (
          <DashboardCard
            key={dashboard.id}
            dashboard={dashboard}
            onEdit={() => handleEditClick(dashboard.id)}
            onShare={() => handleShareClick(dashboard.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboards
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gerencie e visualize seus dashboards personalizados
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar dashboard..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button onClick={handleAddNew} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Criar Dashboard</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            Todos
            {filteredDashboards && (
              <Badge variant="secondary" className="ml-2">
                {filteredDashboards.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="mine">
            Meus Dashboards
            {myDashboards && (
              <Badge variant="secondary" className="ml-2">
                {myDashboards.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shared">
            Compartilhados
            {sharedDashboards && (
              <Badge variant="secondary" className="ml-2">
                {sharedDashboards.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="shadow-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle>Todos os Dashboards</CardTitle>
              <CardDescription>
                Visualize todos os seus dashboards personalizados.
              </CardDescription>
            </CardHeader>

            <CardContent>{renderDashboardGrid(filteredDashboards)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mine">
          <Card className="shadow-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle>Meus Dashboards</CardTitle>
              <CardDescription>Dashboards que você criou.</CardDescription>
            </CardHeader>

            <CardContent>{renderDashboardGrid(myDashboards)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared">
          <Card className="shadow-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle>Dashboards Compartilhados</CardTitle>
              <CardDescription>
                Dashboards compartilhados com você por outros usuários.
              </CardDescription>
            </CardHeader>

            <CardContent>{renderDashboardGrid(sharedDashboards)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DashboardForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        dashboardId={editingDashboardId}
      />

      {sharingDashboardId && (
        <DashboardSharingModal
          dashboardId={sharingDashboardId}
          isOpen={!!sharingDashboardId}
          onClose={() => setSharingDashboardId(undefined)}
        />
      )}
    </div>
  )
}
