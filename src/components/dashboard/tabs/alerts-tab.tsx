import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AlertsTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Visualização detalhada de todos os alertas do sistema.</p>
      </CardContent>
    </Card>
  );
}
