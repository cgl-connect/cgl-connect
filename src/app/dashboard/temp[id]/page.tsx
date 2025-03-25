'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteDashboard, useFindUniqueDashboard } from '@/lib/zenstack-hooks'
import { Edit, Share2, Trash2, MoreHorizontal, ArrowLeft } from 'lucide-react'
import LoadingSpinner from '@/components/loading-spinner'
import DashboardForm from '@/components/dashboard/dashboard-form'
import DashboardSharingModal from '@/components/dashboard/dashboard-sharing-modal'
import DashboardWidgetsContainer from '@/components/dashboard/dashboard-widgets-container'
import { useToast } from '@/lib/hooks/toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function SingleDashboardPage({ params }: { params: { id: string } }) {
  const dashboardId = params.id
  const router = useRouter()
  const toast = useToast()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSharingOpen, setIsSharingOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: dashboard, isLoading, refetch } = useFindUniqueDashboard(
    {
      where: { id: dashboardId },
      include: {
        owner: true,
        _count: {
          select: {
            devices: true,
          },
        },
      },
    }
  )

  const { mutate: deleteDashboard, isPending: isDeleting } = useDeleteDashboard()

  const handleDelete = () => {
    deleteDashboard(
      { where: { id: dashboardId } },
      {
        onSuccess: () => {
          toast.success('Dashboard deleted successfully')
          router.push('/dashboard')
        },
        onError: (error) => {
          console.error('Error deleting dashboard:', error)
          toast.exception(error)
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Dashboard Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The dashboard you're looking for doesn't exist or you don't have permission to view it
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboards
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{dashboard.name}</h1>
          {dashboard.isPublic && (
            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
              Public
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSharingOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsFormOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {dashboard.description && (
        <p className="text-muted-foreground mb-6">{dashboard.description}</p>
      )}

      <DashboardWidgetsContainer dashboardId={dashboardId} />

      <DashboardForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false)
          refetch()
        }}
        dashboardId={dashboardId}
      />

      <DashboardSharingModal
        isOpen={isSharingOpen}
        onClose={() => setIsSharingOpen(false)}
        dashboardId={dashboardId}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dashboard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this dashboard? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
