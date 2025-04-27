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
import { Badge } from '@/components/ui/badge'
import {
  useFindManyDevice,
  useCreateDashboardDevice,
} from '@/lib/zenstack-hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeviceStatus, WidgetSize } from '@prisma/client'
import { CheckCircle, WifiOff, AlertTriangle } from 'lucide-react'
import LoadingSpinner from '@/components/loading-spinner'
import { useToast } from '@/lib/hooks/toast'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AddDeviceToDashboardDialogProps {
  isOpen: boolean
  onClose: () => void
  dashboardId: string
  onDeviceAdded: () => void
}

export default function AddDeviceToDashboardDialog({
  isOpen,
  onClose,
  dashboardId,
  onDeviceAdded,
}: AddDeviceToDashboardDialogProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [widgetSize, setWidgetSize] = useState<WidgetSize>('MEDIUM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const { data: devices, isLoading } = useFindManyDevice({
    include: {
      deviceType: true,
      location: true,
    },
  })

  const { mutate: createDashboardDevice } = useCreateDashboardDevice()

  const handleAddDevice = () => {
    if (!selectedDeviceId) {
      toast.error('Please select a device to add')
      return
    }

    setIsSubmitting(true)
    createDashboardDevice(
      {
        data: {
          dashboardId,
          deviceId: selectedDeviceId,
          layout: {
            width: widgetSize,
            height: widgetSize,
            order: 0,
          },
        },
      },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          toast.success('Device added to dashboard')
          onDeviceAdded()
        },
        onError: error => {
          setIsSubmitting(false)
          console.error('Error adding device to dashboard:', error)
          toast.exception(error)
        },
      },
    )
  }

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'ONLINE':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Online
          </Badge>
        )
      case 'OFFLINE':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <WifiOff className="h-3 w-3" />
            Offline
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Unknown
          </Badge>
        )
    }
  }

  const reset = () => {
    setSelectedDeviceId(null)
    setWidgetSize('MEDIUM')
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          reset()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Dispositivo ao Dashboard</DialogTitle>
          <DialogDescription>
            Selecione um dispositivo e configure como ele será exibido no
            dashboard.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Dispositivo</Label>
                <Select onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices?.map(device => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                        <Badge variant="outline" className="ml-2">
                          {device.status === 'ONLINE' ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : device.status === 'OFFLINE' ? (
                            <WifiOff className="h-3 w-3 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tamanho do Widget</Label>
                <Select onValueChange={setWidgetSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMALL">Pequeno</SelectItem>
                    <SelectItem value="MEDIUM">Médio</SelectItem>
                    <SelectItem value="LARGE">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleAddDevice} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Adicionando...</span>
                  </>
                ) : (
                  'Adicionar'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
