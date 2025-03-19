import { initializeMqttService } from "@/server/actions/mqtt-actions";

export async function InitializeServices() {

    await initializeMqttService()

    return null
}