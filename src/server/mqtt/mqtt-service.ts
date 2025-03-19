import { db } from "../db";
import { MqttClient, MqttMessage } from "./mqtt";
import { Device, DeviceStatus, Prisma } from "@prisma/client";
import { EventEmitter } from "events";

export interface MqttServiceOptions {
  brokerUrl: string;
  clientId?: string;
  username?: string;
  password?: string;
}

export class MqttService extends EventEmitter {
  private client: MqttClient;
  private _isRunning = false;
  private topicToDeviceMap: Map<string, string> = new Map(); 
  public get isRunning(): boolean {
    return this._isRunning;
  }
  public isClientConnected(): boolean {
    return this.client.isClientConnected()
  }

  constructor(options: MqttServiceOptions) {
    super();
    
    this.client = new MqttClient(options.brokerUrl, {
      clientId: options.clientId || `cgl-connect-${Math.random().toString(16).substring(2, 10)}`,
      username: options.username,
      password: options.password,
      reconnectPeriod: 5000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.emit('connect');
      
      
      if (this._isRunning) {
        this.resubscribeToAllTopics();
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error);
      this.emit('error', error);
    });

    this.client.on('offline', () => {
      console.log('MQTT client is offline');
      this.emit('offline');
    });

    this.client.on('message', this.handleMessage.bind(this));
  }

  /**
   * Handles an incoming MQTT message
   */
  private async handleMessage(message: MqttMessage) {
    try {
      
      const deviceId = this.topicToDeviceMap.get(message.topic);
      if (!deviceId) {
        console.warn(`Received message for unknown topic: ${message.topic}`);
        return;
      }

      
      let data: any;
      try {
        data = JSON.parse(message.payload);
      } catch (e) {
        
        data = { raw: message.payload };
      }

      
      await db.telemetry.create({
        data: {
          deviceId,
          data: data as Prisma.InputJsonValue,
          receivedAt: new Date(),
        },
      });

      
      await db.device.update({
        where: { id: deviceId },
        data: { status: 'ONLINE' },
      });

      
      this.emit('telemetry', {
        deviceId,
        topic: message.topic,
        data,
      });
    } catch (error) {
      console.error('Error handling MQTT message:', error);
      this.emit('error', error);
    }
  }

  /**
   * Start the MQTT service
   */
  public async start(): Promise<void> {
    if (this._isRunning) {
      return;
    }

    this._isRunning = true;
    
    
    await this.loadAndSubscribe();
    
    
    setInterval(async () => {
      await this.loadAndSubscribe();
    }, 5 * 60 * 1000); 
    
    
    setInterval(async () => {
      await this.checkDeviceStatuses();
    }, 60 * 1000); 
    
    console.log('MQTT service started');
  }

  /**
   * Load MQTT configurations and subscribe to topics
   */
  private async loadAndSubscribe(): Promise<void> {
    try {
      
      this.topicToDeviceMap.clear();

      
      const mqttConfigs = await db.mQTTConfig.findMany({
        include: {
          device: true,
        },
      });

      console.log(`Found ${mqttConfigs.length} MQTT configurations`);

      
      for (const config of mqttConfigs) {
        if (config.listenTopics && config.listenTopics.length > 0) {
          for (const topic of config.listenTopics) {
            
            const topicString = `${config.topicPrefix}/${topic}`;
            this.topicToDeviceMap.set(topicString, config.deviceId);
            
            
            await this.client.subscribe(topicString);
            console.log(`Subscribed to topic: ${topicString} for device: ${config.device.name}.`);
          }
        }
      }
    } catch (error) {
      console.error('Error loading MQTT configurations:', error);
      this.emit('error', error);
    }
  }

  /**
   * Resubscribe to all topics (used after reconnection)
   */
  private async resubscribeToAllTopics(): Promise<void> {
    const topics = Array.from(this.topicToDeviceMap.keys());
    if (topics.length > 0) {
      await this.client.subscribe(topics);
      console.log(`Resubscribed to ${topics.length} topics`);
    }
  }

  /**
   * Periodically check device statuses based on recent telemetry
   */
  private async checkDeviceStatuses(): Promise<void> {
    const timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - 5); 

    try {
      
      const devices = await db.device.findMany({
        select: {
          id: true,
          status: true,
          telemetry: {
            orderBy: {
              receivedAt: 'desc',
            },
            take: 1,
          }
        }
      });

      
      for (const device of devices) {
        let newStatus: DeviceStatus = 'UNKNOWN';
        
        if (device.telemetry && device.telemetry.length > 0) {
          const latestTelemetry = device.telemetry[0];
          
          if (latestTelemetry.receivedAt >= timeThreshold) {
            newStatus = 'ONLINE';
          } else {
            newStatus = 'OFFLINE';
          }
        }

        
        if (device.status !== newStatus) {
          await db.device.update({
            where: { id: device.id },
            data: { status: newStatus },
          });
          console.log(`Updated device ${device.id} status to ${newStatus}`);
        }
      }
    } catch (error) {
      console.error('Error checking device statuses:', error);
      this.emit('error', error);
    }
  }

  /**
   * Stop the MQTT service
   */
  public async stop(): Promise<void> {
    if (!this._isRunning) {
      return;
    }

    this._isRunning = false;
    await this.client.disconnect();
    console.log('MQTT service stopped');
  }
}
