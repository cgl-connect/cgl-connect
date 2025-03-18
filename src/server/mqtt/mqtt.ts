import mqtt from 'mqtt';

export class MqttClient {
  private client: mqtt.MqttClient;

  constructor(brokerUrl: string) {
    this.client = mqtt.connect(brokerUrl);
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      console.error('Connection error:', err);
    });

    this.client.on('close', () => {
      console.log('Connection closed');
    });
  }

  subscribe(topic: string) {
    this.client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message, (err) => {
      if (!err) {
        console.log(`Message published to ${topic}`);
      }
    });
  }

  onMessage(callback: (topic: string, message: string) => void) {
    this.client.on('message', (topic, message) => {
      callback(topic, message.toString());
    });
  }
}
