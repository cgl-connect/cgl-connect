'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, PlusCircle, RefreshCw } from 'lucide-react'
import { useFindManyDeviceType } from '@/lib/zenstack-hooks'
import DeviceTypeTable from '@/components/device-types/device-type-table'
import DeviceTypeForm from '@/components/device-types/device-type-form'
import LoadingSpinner from '@/components/loading-spinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function DeviceTypesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDeviceTypeId, setEditingDeviceTypeId] = useState<
    string | undefined
  >()

  const {
    data: deviceTypes,
    isLoading,
    refetch
  } = useFindManyDeviceType({
    include: {
      _count: {
        select: {
          devices: true
        }
      }
    }
  })

  const handleAddNew = () => {
    setEditingDeviceTypeId(undefined)
    setIsFormOpen(true)
  }

  const handleEditClick = (id: string) => {
    setEditingDeviceTypeId(id)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    refetch()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Device Types Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddNew} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Types</CardTitle>
          <CardDescription>
            Manage all your device types from this dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <DeviceTypeTable
              deviceTypes={deviceTypes || []}
              onRefresh={refetch}
              onClickEdit={handleEditClick}
            />
          )}
        </CardContent>
      </Card>

      <DeviceTypeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        deviceTypeId={editingDeviceTypeId}
      />
    </div>
  )
}
