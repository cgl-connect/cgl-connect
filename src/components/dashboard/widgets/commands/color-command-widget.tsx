'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaletteIcon } from 'lucide-react'
import { useToast } from '@/lib/hooks/toast'
import { HexColorPicker } from 'react-colorful'

interface ColorCommandWidgetProps {
  deviceId: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
}

export default function ColorCommandWidget({ deviceId, size }: ColorCommandWidgetProps) {
  const toast = useToast()
  const [color, setColor] = useState('#ff0000')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleColorChange = async (newColor: string) => {
    if (newColor === color) return
    
    setIsSubmitting(true)
    try {
      // Mock sending command to device
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setColor(newColor)
      toast.success('Command sent: Color updated')
      
      // Ideally, here we would publish to MQTT topic:
      // mqttClient.publish(`${deviceBaseTopic}/command/color`, { color: newColor })
    } catch (error) {
      console.error('Error sending color command', error)
      toast.error('Failed to send color command to device')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (size === 'SMALL') {
    return (
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <div 
            className="h-10 w-10 rounded-full mb-1 border border-slate-200" 
            style={{ backgroundColor: color }}
          />
          <p className="text-xs text-muted-foreground">Set Color</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <PaletteIcon className="h-4 w-4 mr-2" />
          Color Control
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <div 
              className="h-8 w-8 rounded-full mr-2 border border-slate-200" 
              style={{ backgroundColor: color }}
            />
            <div>
              <div className="font-mono text-sm">{color}</div>
              <span className="text-xs text-muted-foreground">
                Set device color
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <HexColorPicker 
              color={color} 
              onChange={setColor} 
              onMouseUp={() => handleColorChange(color)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
