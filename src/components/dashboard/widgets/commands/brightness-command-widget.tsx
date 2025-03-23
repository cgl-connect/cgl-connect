'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { SunIcon } from 'lucide-react'
import { useToast } from '@/lib/hooks/toast'

interface BrightnessCommandWidgetProps {
  deviceId: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
}

export default function BrightnessCommandWidget({ deviceId, size }: BrightnessCommandWidgetProps) {
  const toast = useToast()
  const [brightness, setBrightness] = useState(50)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBrightnessChange = async (value: number[]) => {
    const newBrightness = value[0]
    if (newBrightness === brightness) return
    
    setIsSubmitting(true)
    try {
      // Mock sending command to device
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setBrightness(newBrightness)
      toast.success(`Command sent: Set brightness to ${newBrightness}%`)
      
      // Ideally, here we would publish to MQTT topic:
      // mqttClient.publish(`${deviceBaseTopic}/command/brightness`, { brightness: newBrightness })
    } catch (error) {
      console.error('Error sending brightness command', error)
      toast.error('Failed to send brightness command to device')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (size === 'SMALL') {
    return (
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <SunIcon className="h-5 w-5 text-amber-500 mb-1" />
          <div className="text-sm font-bold mb-1">{brightness}%</div>
          <Slider
            className="w-16"
            defaultValue={[brightness]}
            max={100}
            step={1}
            onValueCommit={handleBrightnessChange}
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
          <SunIcon className="h-4 w-4 text-amber-500 mr-2" />
          Brightness Control
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold">{brightness}%</span>
            <span className="ml-2 text-xs text-muted-foreground">
              Set device brightness
            </span>
          </div>
          
          <div className="mb-6">
            <Slider
              defaultValue={[brightness]}
              max={100}
              step={1}
              onValueCommit={handleBrightnessChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
