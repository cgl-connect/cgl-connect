'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Thermometer } from 'lucide-react'
import { useToast } from '@/lib/hooks/toast'
import { Button } from '@/components/ui/button'

interface TemperatureCommandWidgetProps {
  deviceId: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
}

export default function TemperatureCommandWidget({ deviceId, size }: TemperatureCommandWidgetProps) {
  const toast = useToast()
  const [temperature, setTemperature] = useState(22)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTemperatureChange = async (value: number[]) => {
    const newTemperature = value[0]
    if (newTemperature === temperature) return
    
    setTemperature(newTemperature)
  }

  const sendTemperatureCommand = async () => {
    setIsSubmitting(true)
    try {
      // Mock sending command to device
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast.success(`Command sent: Set temperature to ${temperature}°C`)
      
      // Ideally, here we would publish to MQTT topic:
      // mqttClient.publish(`${deviceBaseTopic}/command/temperature`, { temperature })
    } catch (error) {
      console.error('Error sending temperature command', error)
      toast.error('Failed to send temperature command to device')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (size === 'SMALL') {
    return (
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <Thermometer className="h-5 w-5 text-blue-500 mb-1" />
          <div className="text-2xl font-bold">{temperature}°C</div>
          <p className="text-xs text-muted-foreground">Target</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Thermometer className="h-4 w-4 text-blue-500 mr-2" />
          Temperature Control
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold">{temperature}°C</span>
            <span className="ml-2 text-xs text-muted-foreground">
              Set target temperature
            </span>
          </div>
          
          <div className="mb-6">
            <Slider
              defaultValue={[temperature]}
              min={16}
              max={30}
              step={0.5}
              onValueChange={(value) => setTemperature(value[0])}
              disabled={isSubmitting}
            />
          </div>
          
          <Button 
            onClick={sendTemperatureCommand}
            disabled={isSubmitting}
            className="mt-2"
          >
            Send Command
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
