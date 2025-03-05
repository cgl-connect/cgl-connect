"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  WifiOff,
  AlertTriangle,
  Tablet
} from "lucide-react";

export default function DeviceStats() {
  const stats = [
    {
      title: "Total de Dispositivos",
      value: "145",
      icon: <Tablet className="h-6 w-6 text-muted-foreground" />,
      description: "Dispositivos registrados",
    },
    {
      title: "Online",
      value: "132",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      description: "Conectados e funcionando",
    },
    {
      title: "Alertas",
      value: "8",
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      description: "Precisam de atenção",
    },
    {
      title: "Offline",
      value: "5",
      icon: <WifiOff className="h-6 w-6 text-red-500" />,
      description: "Desconectados",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
