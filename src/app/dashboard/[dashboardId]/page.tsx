"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Share2, 
  Trash,
  LayoutGrid
} from "lucide-react";
import { 
  useFindUniqueDashboard, 
  useFindManyDashboardDevice,
  useDeleteDashboard
} from "@/lib/zenstack-hooks";
import LoadingSpinner from "@/components/loading-spinner";
import DashboardSharingModal from "@/components/dashboard/dashboard-sharing-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import DeviceWidget from "@/components/dashboard/device-widget";
import AddDeviceToDashboardModal from "@/components/dashboard/add-device-modal";

export default function DashboardDetailPage({ params }: { params: { dashboardId: string } }) {
  const router = useRouter();
  const dashboardId = params.dashboardId;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: dashboard, isLoading: isDashboardLoading } = useFindUniqueDashboard({
    where: { id: dashboardId },
    include: { owner: true }
  });
  
  const { data: dashboardDevices, isLoading: isDevicesLoading, refetch } = useFindManyDashboardDevice({
    where: { dashboardId },
    include: { device: { include: { deviceType: true } } },
    orderBy: { layout: 'asc' }
  });
  
  const { mutate: deleteDashboard } = useDeleteDashboard();
  
  const handleDeleteDashboard = () => {
    deleteDashboard(
      { where: { id: dashboardId } },
      {
        onSuccess: () => {
          router.push('/dashboard');
        }
      }
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      {(isDashboardLoading || isDevicesLoading) ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : dashboard ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold">{dashboard.name}</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isEditMode ? "default" : "outline"} 
                size="sm" 
                onClick={() => setIsEditMode(!isEditMode)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditMode ? "Save Layout" : "Edit Layout"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddDeviceModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSharingModalOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          
          {dashboard.description && (
            <p className="text-muted-foreground mb-6">{dashboard.description}</p>
          )}
          
          {dashboardDevices?.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-12 mt-8">
              <LayoutGrid className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">This dashboard is empty</h3>
              <p className="text-muted-foreground mb-6">Add devices to create your custom dashboard</p>
              <Button onClick={() => setIsAddDeviceModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Device
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {dashboardDevices?.map(dashboardDevice => (
                <DeviceWidget
                  key={dashboardDevice.id}
                  dashboardDevice={dashboardDevice}
                  isEditMode={isEditMode}
                  onRemove={() => {/* Handle remove */}}
                  onRefresh={refetch}
                />
              ))}
            </div>
          )}
          
          <DashboardSharingModal
            dashboardId={dashboardId}
            isOpen={isSharingModalOpen}
            onClose={() => setIsSharingModalOpen(false)}
          />
          
          <AddDeviceToDashboardModal
            dashboardId={dashboardId}
            isOpen={isAddDeviceModalOpen}
            onClose={() => setIsAddDeviceModalOpen(false)}
            onSuccess={() => {
              setIsAddDeviceModalOpen(false);
              refetch();
            }}
          />
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the dashboard and remove all device associations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteDashboard}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div className="text-center py-8">
          <p>Dashboard not found or you don't have access to it.</p>
          <Button 
            variant="link" 
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboards
          </Button>
        </div>
      )}
    </div>
  );
}
