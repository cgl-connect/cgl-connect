// TODO: verificar se esta usando
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTabContent } from "./tabs/overview-tab";
import { DevicesTabContent } from "./tabs/devices-tab";
import { AlertsTabContent } from "./tabs/alerts-tab";
import { AnalyticsTabContent } from "./tabs/analytics-tab";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="devices">Dispositivos</TabsTrigger>
        <TabsTrigger value="alerts">Alertas</TabsTrigger>
        <TabsTrigger value="analytics">Análises</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <OverviewTabContent />
      </TabsContent>

      <TabsContent value="devices" className="space-y-4">
        <DevicesTabContent />
      </TabsContent>

      <TabsContent value="alerts">
        <AlertsTabContent />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTabContent />
      </TabsContent>
    </Tabs>
  );
}
