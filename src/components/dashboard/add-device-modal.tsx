'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useFindManyDevice, useCreateDashboardDevice } from '@/lib/zenstack-hooks'
import { DeviceStatus, WidgetSize } from '@prisma/client'
import LoadingSpinner from '@/components/loading-spinner'
import { Search, Wifi, WifiOff, HelpCircle } from 'lucide-react'
import { useToast } from '@/lib/hooks/toast'

interface AddDeviceModalProps {
  dashboardId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddDeviceToDashboardModal({
  dashboardId,
  isOpen,
  onClose,
  onSuccess,
}: AddDeviceModalProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [widgetSize, setWidgetSize] = useState<WidgetSize>('MEDIUM')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const { data: devices, isLoading } = useFindManyDevice(
    {
      include: {
        deviceType: true,
        location: true,
      },
    },
    {
      enabled: isOpen,
    }
  )

  const { mutate: createDashboardDevice } = useCreateDashboardDevice()

  const filteredDevices = devices?.filter(
    device =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.location?.name &&
        device.location.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      device.deviceType.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddDevice = () => {
    if (!selectedDevice) return

    setIsSubmitting(true)
    createDashboardDevice(
      {
        data: {
          dashboard: { connect: { id: dashboardId } },
          device: { connect: { id: selectedDevice } },
          layout: {
            width: widgetSize,
            height: widgetSize,
            order: 0, // Will be adjusted by the backend
          },
        },
      },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          setSelectedDevice(null)
          setWidgetSize('MEDIUM')
          setSearchQuery('')
          toast.success('Device added to dashboard')
          onSuccess()
        },
        onError: error => {
          console.error('Error adding device to dashboard:', error)
          setIsSubmitting(false)
          toast.exception(error)
        },
      }
    )
  }

  const getStatusIcon = (status: DeviceStatus) => {
    if (status === 'ONLINE') return <Wifi className="h-4 w-4 text-green-500" />
    if (status === 'OFFLINE') return <WifiOff className="h-4 w-4 text-red-500" />
    return <HelpCircle className="h-4 w-4 text-amber-500" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Device to Dashboard</DialogTitle>
          <DialogDescription>
            Select a device to add to your dashboard
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredDevices?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No devices found matching your search
                  </div>
                )}

                {filteredDevices?.map(device => (
                  <Card
                    key={device.id}
                    className={`cursor-pointer transition-colors ${
                      selectedDevice === device.id
                        ? 'border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDevice(device.id)}
                  >
                    <CardHeader className="p-3 flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{device.name}</CardTitle>
                        <CardDescription className="text-xs">
                          Type: {device.deviceType.name}
                          {device.location && ` • Location: ${device.location.name}`}
                        </CardDescription>
                      </div>
                      {getStatusIcon(device.status)}
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {selectedDevice && (
                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor="widgetSize">Widget Size</Label>
                  <Select
                    //id="widgetSize"
                    value={widgetSize}
                    onValueChange={value => setWidgetSize(value as WidgetSize)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LARGE">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAddDevice}
                disabled={!selectedDevice || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Adding...
                  </>
                ) : (
                  'Add to Dashboard'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
