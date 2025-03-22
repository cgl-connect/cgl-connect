'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DeviceStatus, TopicSuffix } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  useCreateDevice,
  useFindUniqueDevice,
  useUpdateDevice
} from '@/lib/hooks/device'
import LoadingSpinner from '@/components/loading-spinner'
import {
  useFindManyDeviceType,
  useFindManyLocation,
  useFindManyUser,
  useFindUniqueDeviceType
} from '@/lib/hooks'
import { DeviceBasicInfoSection } from './form-sections/basic-info-section'
import { DeviceRelationsSection } from './form-sections/relations-section'
import { MqttConfigSection } from './form-sections/mqtt-config-section'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  status: z.enum(['ONLINE', 'OFFLINE', 'UNKNOWN']),
  deviceTypeId: z.string({ required_error: 'Device type is required' }),
  locationId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  baseTopic: z.string().min(1, { message: 'Base topic is required' })
})

type FormValues = z.infer<typeof formSchema>

interface DeviceFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  deviceId?: string
}

export default function DeviceForm({
  isOpen,
  onClose,
  onSuccess,
  deviceId
}: DeviceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTopicSuffixes, setSelectedTopicSuffixes] = useState<
    TopicSuffix[]
  >([])

  const isEditMode = !!deviceId
  const { data: editingDeviceData } = useFindUniqueDevice({
    where: { id: deviceId },
    include: {
      deviceType: true,
      location: true,
      user: true
    }
  })

  const { data: deviceTypes, isLoading: loadingDeviceTypes } =
    useFindManyDeviceType()
  const { data: locations, isLoading: loadingLocations } = useFindManyLocation()
  const { data: users, isLoading: loadingUsers } = useFindManyUser()

  const { mutate: createDevice } = useCreateDevice()
  const { mutate: updateDevice } = useUpdateDevice()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'UNKNOWN' as DeviceStatus,
      deviceTypeId: '',
      locationId: null,
      userId: null,
      baseTopic: ''
    }
  })

  const deviceTypeSelected = form.watch('deviceTypeId')

  useEffect(() => {
    console.log('Device type selected:', deviceTypeSelected)
    if (!deviceTypeSelected) return

    console.table(deviceTypes)

    const deviceType = deviceTypes?.find(dt => dt.id === deviceTypeSelected)
    setSelectedTopicSuffixes(deviceType?.topicSuffixes || [])
  }, [deviceTypeSelected, deviceTypes, setSelectedTopicSuffixes])

  useEffect(() => {
    if (!isOpen) return

    if (editingDeviceData) {
      form.reset({
        name: editingDeviceData.name,
        description: editingDeviceData.description || '',
        status: editingDeviceData.status,
        deviceTypeId: editingDeviceData.deviceType.id,
        locationId: editingDeviceData.location?.id || null,
        userId: editingDeviceData.user?.id || null,
        baseTopic: editingDeviceData.baseTopic || ''
      })

      if (editingDeviceData.deviceType?.topicSuffixes) {
        setSelectedTopicSuffixes(editingDeviceData.deviceType.topicSuffixes)
      }
    } else {
      form.reset({
        name: '',
        description: '',
        status: 'UNKNOWN',
        deviceTypeId: '',
        locationId: null,
        userId: null,
        baseTopic: ''
      })
      setSelectedTopicSuffixes([])
    }
  }, [editingDeviceData, form, isOpen])

  const handleDeviceTypeChange = (deviceTypeId: string) => {
    const deviceType = deviceTypes?.find(dt => dt.id === deviceTypeId)
    if (deviceType?.topicSuffixes) {
      setSelectedTopicSuffixes(deviceType.topicSuffixes)
    } else {
      setSelectedTopicSuffixes([])
    }
  }

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true)

    const deviceFormattedData = {
      name: values.name,
      description: values.description,
      status: values.status,
      deviceTypeId: values.deviceTypeId,
      locationId: values.locationId || null,
      userId: values.userId || null,
      baseTopic: values.baseTopic
    }

    if (isEditMode) {
      updateDevice(
        {
          where: { id: editingDeviceData!.id },
          data: deviceFormattedData
        },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            onSuccess()
          },
          onError: error => {
            console.error('Error updating device:', error)
            setIsSubmitting(false)
          }
        }
      )
    } else {
      createDevice(
        {
          data: deviceFormattedData
        },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            onSuccess()
          },
          onError: error => {
            console.error('Error creating device:', error)
            setIsSubmitting(false)
          }
        }
      )
    }
  }

  const isLoading = loadingDeviceTypes || loadingLocations || loadingUsers

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Device' : 'Add New Device'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the device information in the form below.'
              : 'Enter the details for the new device.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <DeviceBasicInfoSection control={form.control} />

              <DeviceRelationsSection
                deviceTypes={deviceTypes || []}
                locations={locations || []}
                users={users || []}
                onDeviceTypeChange={handleDeviceTypeChange}
              />

              <MqttConfigSection
                deviceTypeId={form.watch('deviceTypeId')}
                selectedTopicSuffixes={selectedTopicSuffixes}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{isEditMode ? 'Update Device' : 'Create Device'}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
