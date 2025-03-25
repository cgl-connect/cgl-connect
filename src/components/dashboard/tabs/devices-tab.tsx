import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeviceList from "@/components/dashboard/device-list";
import LoadingSpinner from "@/components/loading-spinner";

export function DevicesTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Dispositivos</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingSpinner />}>
          <DeviceList />
        </Suspense>
      </CardContent>
    </Card>
  );
}
