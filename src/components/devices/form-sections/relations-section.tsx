import { Control, useFormContext } from 'react-hook-form'
import {
  FormControl,
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
import { DeviceType, Location, User } from '@prisma/client'

interface DeviceRelationsSectionProps {
  deviceTypes: DeviceType[]
  locations: Location[]
  users: User[]
  onDeviceTypeChange: (deviceTypeId: string) => void
}

export function DeviceRelationsSection({
  deviceTypes,
  locations,
  users,
  onDeviceTypeChange
}: DeviceRelationsSectionProps) {
  const { control } = useFormContext()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="deviceTypeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Device Type</FormLabel>
            <Select
              onValueChange={value => {
                field.onChange(value)
                onDeviceTypeChange(value)
              }}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {deviceTypes.map(type => (
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

      <FormField
        control={control}
        name="locationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
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
                {locations.map(location => (
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
        control={control}
        name="userId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned User</FormLabel>
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
                {users.map(user => (
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
  )
}
