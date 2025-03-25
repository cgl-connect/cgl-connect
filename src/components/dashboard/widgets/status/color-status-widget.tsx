'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaletteIcon } from 'lucide-react'
import { dayJs } from '@/utils/dayjs'

interface ColorStatusWidgetProps {
  data: Array<{
    id: string
    receivedAt: Date
    data: any
  }>
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
}

export default function ColorStatusWidget({ data, size }: ColorStatusWidgetProps) {
  const latestColor = useMemo(() => {
    if (!data || data.length === 0) return '#cccccc'
    const latest = data[0]
    return latest.data.color || latest.data.value || '#cccccc'
  }, [data])

  if (size === 'SMALL') {
    return (
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <div 
            className="h-10 w-10 rounded-full mb-1 border border-slate-200" 
            style={{ backgroundColor: latestColor }}
          />
          <p className="text-xs text-muted-foreground">Color</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <PaletteIcon className="h-4 w-4 mr-2" />
          Color
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <div 
              className="h-8 w-8 rounded-full mr-2 border border-slate-200" 
              style={{ backgroundColor: latestColor }}
            />
            <div>
              <div className="font-mono text-sm">{latestColor}</div>
              <span className="text-xs text-muted-foreground">
                {data.length > 0 && dayJs(data[0].receivedAt).fromNow()}
              </span>
            </div>
          </div>
          
          {size === 'LARGE' && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Colors</h4>
              <div className="flex flex-wrap gap-2">
                {data.slice(0, 10).map((item) => (
                  <div 
                    key={item.id}
                    className="h-6 w-6 rounded-full border border-slate-200"
                    style={{ backgroundColor: item.data.color || item.data.value }}
                    title={dayJs(item.receivedAt).format('MMM D, HH:mm')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
