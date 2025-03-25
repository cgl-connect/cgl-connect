import { FormText } from '@/components/ui/form-fields/form-text'
import { FormTextarea } from '@/components/ui/form-fields/form-textarea'

export function DeviceBasicInfoSection() {
  return (
    <>
      <FormText
        name="name"
        label="Name"
        placeholder="Enter device name"
        required
      />

      <FormTextarea
        name="description"
        label="Description"
        placeholder="Enter device description (optional)"
      />
    </>
  )
}
