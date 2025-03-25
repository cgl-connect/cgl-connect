'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCreateDashboard } from '@/lib/zenstack-hooks'
import LoadingSpinner from '@/components/loading-spinner'
import { useSession } from 'next-auth/react'
import { useToast } from '@/lib/hooks/toast'
import DashboardFormFields, { DashboardFormValues } from '@/components/dashboard/dashboard-form-fields'

export default function NewDashboardPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const toast = useToast()

  const { mutate: createDashboard } = useCreateDashboard()

  const handleSubmit = (data: DashboardFormValues) => {
    setIsSubmitting(true)

    createDashboard(
      {
        data: {
          name: data.name,
          description: data.description || undefined,
          isPublic: data.isPublic,
          ownerId: session!.user!.id,
        },
      },
      {
        onSuccess: newDashboard => {
          if (!newDashboard) return router.push('/dashboard')
          router.push(`/dashboard/${newDashboard.id}`)
        },
        onError: error => {
          console.error('Error creating dashboard:', error)
          setIsSubmitting(false)
          toast.exception(error)
        },
      },
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Dashboard</CardTitle>
          <CardDescription>
            Create a new dashboard to organize and monitor your devices
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <DashboardFormFields
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          >
            <CardFooter className="flex justify-between px-0 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  'Create Dashboard'
                )}
              </Button>
            </CardFooter>
          </DashboardFormFields>
        </CardContent>
      </Card>
    </div>
  )
}
