"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, RefreshCw } from "lucide-react";
import { DeviceStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeviceTable from "@/components/devices/device-table";
import DeviceForm from "@/components/devices/device-form";
import LoadingSpinner from "@/components/loading-spinner";
import { useFindManyDevice } from "@/lib/hooks";

export default function DevicesPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTabValue, setSelectedTabValue] = useState("all");
  
  const { data: devices, isLoading, refetch } = useFindManyDevice({
    include: {
      deviceType: true,
      location: true,
      user: true,
    },
  });

  const filteredDevices = devices?.filter(device => {
    if (selectedTabValue === "all") return true;
    if (selectedTabValue === "online") return device.status === DeviceStatus.ONLINE;
    if (selectedTabValue === "offline") return device.status === DeviceStatus.OFFLINE;
    if (selectedTabValue === "unknown") return device.status === DeviceStatus.UNKNOWN;
    return true;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Device Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
          <CardDescription>
            Manage all your IoT devices from this dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={selectedTabValue} 
            onValueChange={setSelectedTabValue}
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="all">All Devices</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="unknown">Unknown</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <DeviceTable 
              devices={filteredDevices || []}
              onRefresh={() => refetch()}
            />
          )}
        </CardContent>
      </Card>

      <DeviceForm 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
