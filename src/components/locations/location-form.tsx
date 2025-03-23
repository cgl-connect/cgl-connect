'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormText } from '@/components/ui/form-fields/form-text'
import LoadingSpinner from '@/components/loading-spinner'
import {
  useCreateLocation,
  useFindUniqueLocation,
  useUpdateLocation,
} from '@/lib/zenstack-hooks'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  address: z.string().optional(),
})

type LocationFormValues = z.infer<typeof formSchema>

interface LocationFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  locationId?: string
}

export default function LocationForm({
  isOpen,
  onClose,
  onSuccess,
  locationId,
}: LocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!locationId

  const { data: locationData, isLoading: isLoadingLocation } =
    useFindUniqueLocation(
      { where: { id: locationId } },
      { enabled: !!locationId },
    )

  const { mutate: createLocation } = useCreateLocation()
  const { mutate: updateLocation } = useUpdateLocation()

  const methods = useForm<LocationFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: locationData?.name || '',
      address: locationData?.address || '',
    },
  })

  const onSubmit = (values: LocationFormValues) => {
    setIsSubmitting(true)

    if (isEditMode && locationData) {
      updateLocation(
        {
          where: { id: locationData.id },
          data: values,
        },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            onSuccess()
          },
          onError: error => {
            console.error('Error updating location:', error)
            setIsSubmitting(false)
          },
        },
      )
    } else {
      createLocation(
        {
          data: values,
        },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            onSuccess()
          },
          onError: error => {
            console.error('Error creating location:', error)
            setIsSubmitting(false)
          },
        },
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the location information in the form below.'
              : 'Enter the details for the new location.'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingLocation ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormText
                name="name"
                label="Name"
                placeholder="Enter location name"
                required
              />

              <FormText
                name="address"
                label="Address"
                placeholder="Enter address (optional)"
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
                    <>
                      {isEditMode ? 'Update Location' : 'Create Location'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  )
}
