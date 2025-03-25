'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Edit, MoreVertical, Trash } from 'lucide-react'
import { useState } from 'react'
import { useDeleteLocation } from '@/lib/zenstack-hooks'
import { dayJs } from '@/utils/dayjs'

interface LocationWithRelations {
  id: string
  name: string
  address?: string | null
  createdAt: Date
  updatedAt: Date
  _count?: {
    devices: number
  }
}

interface LocationTableProps {
  locations: LocationWithRelations[]
  onRefresh: () => void
  onClickEdit: (id: string) => void
}

export default function LocationTable({
  locations,
  onRefresh,
  onClickEdit
}: LocationTableProps) {
  const [locationToDelete, setLocationToDelete] = useState<string | null>(
    null
  )

  const { mutate: deleteLocation } = useDeleteLocation()

  const handleDelete = () => {
    if (locationToDelete) {
      deleteLocation(
        {
          where: { id: locationToDelete }
        },
        {
          onSuccess: () => {
            setLocationToDelete(null)
            onRefresh()
          }
        }
      )
    }
  }

  if (locations.length === 0) {
    return <div className="text-center py-4">No locations found</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Devices</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map(location => (
            <TableRow key={location.id}>
              <TableCell className="font-medium">{location.name}</TableCell>
              <TableCell>
                {location.address || <span className="text-muted-foreground text-sm">Not specified</span>}
              </TableCell>
              <TableCell>{location._count?.devices || 0}</TableCell>
              <TableCell>{dayJs(location.updatedAt).fromNow()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onClickEdit(location.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setLocationToDelete(location.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!locationToDelete}
        onOpenChange={open => !open && setLocationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              location. Any devices associated with this location may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
