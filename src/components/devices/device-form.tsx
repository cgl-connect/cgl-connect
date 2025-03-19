'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form' // Add useFieldArray
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DeviceStatus } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateDevice,
  useFindManyDevice,
  useUpdateDevice
} from '@/lib/hooks/device'
import LoadingSpinner from '@/components/loading-spinner'
import {
  useFindManyDeviceType,
  useFindManyLocation,
  useFindManyUser
} from '@/lib/hooks'
import { Plus, Trash2 } from 'lucide-react' // Import icons
import { FormMultipleTags } from '../common/form-multiple-tags'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  status: z.enum(['ONLINE', 'OFFLINE', 'UNKNOWN']),
  deviceTypeId: z.string({ required_error: 'Device type is required' }),
  locationId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  // Add MQTT configuration
  mqtt: z.object({
    topicPrefix: z.string().min(1, { message: 'Topic prefix is required' }),
    listenTopics: z
      .array(z.string().min(1, { message: 'Topic cannot be empty' }))
      .min(1, { message: 'At least one topic is required' })
  })
})

type FormValues = z.infer<typeof formSchema>

interface DeviceFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  deviceData?: any // Using any for simplicity, but in a real app would be more specific
}

export default function DeviceForm({
  isOpen,
  onClose,
  onSuccess,
  deviceData
}: DeviceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!deviceData

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
      mqtt: {
        topicPrefix: '',
        listenTopics: []
      }
    }
  })

  useEffect(() => {
    if (!isOpen) return

    if (deviceData) {
      // Get MQTT configuration from the deviceData
      const mqttConfig = deviceData.mqttConfig?.[0] || {
        topicPrefix: '',
        listenTopics: []
      }

      form.reset({
        name: deviceData.name,
        description: deviceData.description || '',
        status: deviceData.status,
        deviceTypeId: deviceData.deviceType.id,
        locationId: deviceData.location?.id || null,
        userId: deviceData.user?.id || null,
        mqtt: {
          topicPrefix: mqttConfig.topicPrefix || '',
          listenTopics: mqttConfig.listenTopics?.length
            ? mqttConfig.listenTopics
            : []
        }
      })
    } else {
      form.reset({
        name: '',
        description: '',
        status: 'UNKNOWN',
        deviceTypeId: '',
        locationId: null,
        userId: null,
        mqtt: {
          topicPrefix: '',
          listenTopics: []
        }
      })
    }
  }, [deviceData, form, isOpen])

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true)

    const deviceFormattedData = {
      name: values.name,
      description: values.description,
      status: values.status,
      deviceTypeId: values.deviceTypeId,
      locationId: values.locationId || null,
      userId: values.userId || null
    }

    if (isEditMode) {
      updateDevice(
        {
          where: { id: deviceData.id },
          data: {
            ...deviceFormattedData,
            mqttConfig: {
              upsert: {
                where: {
                  id: deviceData.mqttConfig?.[0]?.id || 'create-new'
                },
                create: {
                  topicPrefix: values.mqtt.topicPrefix,
                  listenTopics: values.mqtt.listenTopics
                },
                update: {
                  topicPrefix: values.mqtt.topicPrefix,
                  listenTopics: values.mqtt.listenTopics
                }
              }
            }
          }
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
          data: {
            ...deviceFormattedData,
            mqttConfig: {
              create: {
                topicPrefix: values.mqtt.topicPrefix,
                listenTopics: values.mqtt.listenTopics
              }
            }
          }
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
      <DialogContent className="sm:max-w-[600px]">
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter device name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter device description (optional)"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ONLINE">Online</SelectItem>
                          <SelectItem value="OFFLINE">Offline</SelectItem>
                          <SelectItem value="UNKNOWN">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deviceTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deviceTypes?.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ''}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'none'}>None</SelectItem>
                          {locations?.map(location => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned User (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ''}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'none'}>None</SelectItem>
                          {users?.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name || user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* MQTT Configuration Section */}
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">MQTT Configuration</h3>

                <FormField
                  control={form.control}
                  name="mqtt.topicPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic Prefix</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., devices/temperature"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Base topic for this device (e.g., devices/room1/temp)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormMultipleTags
                  name="mqtt.listenTopics"
                  placeholder="e.g., data, alerts"
                />
              </div>

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
