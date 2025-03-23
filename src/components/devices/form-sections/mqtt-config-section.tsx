import { useFormContext } from 'react-hook-form'
import { TopicSuffix } from '@prisma/client'
import { FormLabel, FormDescription } from '@/components/ui/form'
import { topicSuffixToPath } from '@/lib/mqtt/topicMapping'
import { Badge } from '@/components/ui/badge'
import { FormText } from '@/components/ui/form-fields/form-text'

interface MqttConfigSectionProps {
  deviceTypeId: string
  selectedTopicSuffixes: TopicSuffix[]
}

export function MqttConfigSection({ 
  deviceTypeId,
  selectedTopicSuffixes 
}: MqttConfigSectionProps) {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <h3 className="text-lg font-medium">MQTT Configuration</h3>

      <FormText
        name="baseTopic"
        label="Base Topic"
        placeholder="e.g., home/livingroom/device1"
        description="Base topic for this device (e.g., home/livingroom/device1)"
      />

      {deviceTypeId && (
        <div>
          <FormLabel className="block mb-2">Available Topics</FormLabel>
          <div className="bg-gray-50 p-3 rounded-md">
            {selectedTopicSuffixes.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {selectedTopicSuffixes.map((suffix) => (
                  <Badge key={suffix} className="flex items-center">
                    <div className="text-sm">{topicSuffixToPath[suffix]}</div>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No topics available for this device type
              </div>
            )}
          </div>
          <FormDescription className="mt-2">
            These topics are determined by the device type and will be automatically configured.
          </FormDescription>
        </div>
      )}
    </div>
  )
}
