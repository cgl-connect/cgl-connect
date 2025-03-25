'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { PowerIcon } from 'lucide-react'
import { useToast } from '@/lib/hooks/toast'

interface OnOffCommandWidgetProps {
  deviceId: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
}

export default function OnOffCommandWidget({ deviceId, size }: OnOffCommandWidgetProps) {
  const toast = useToast()
  const [isOn, setIsOn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = async (newState: boolean) => {
    setIsSubmitting(true)
    try {
      // Mock sending command to device
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setIsOn(newState)
      toast.success(`Command sent: Turn ${newState ? 'ON' : 'OFF'}`)
      
      // Ideally, here we would publish to MQTT topic:
      // mqttClient.publish(`${deviceBaseTopic}/command/onoff`, { state: newState })
    } catch (error) {
      console.error('Error sending command', error)
      toast.error('Failed to send command to device')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (size === 'SMALL') {
    return (
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <PowerIcon className={`h-5 w-5 ${isOn ? 'text-green-500' : 'text-slate-400'} mb-1`} />
          <Switch 
            checked={isOn} 
            onCheckedChange={handleToggle}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <PowerIcon className={`h-4 w-4 ${isOn ? 'text-green-500' : 'text-slate-400'} mr-2`} />
          Power Control
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-medium">{isOn ? 'ON' : 'OFF'}</span>
              <p className="text-xs text-muted-foreground">
                Send command to turn device on or off
              </p>
            </div>
            <Switch 
              checked={isOn} 
              onCheckedChange={handleToggle}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
