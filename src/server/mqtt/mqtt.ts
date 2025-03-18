import mqtt, { IClientOptions, IClientPublishOptions, IClientSubscribeOptions, MqttClient as MQTTClient } from 'mqtt';
import { EventEmitter } from 'events';

export interface MqttMessage {
  topic: string;
  payload: string;
  packet: mqtt.IPublishPacket;
}

export interface MqttConnectionOptions extends IClientOptions {
  reconnectPeriod?: number;
  connectTimeout?: number;
}

export class MqttClient extends EventEmitter {
  private client: MQTTClient;
  private isConnected: boolean = false;
  private subscriptions: Map<string, mqtt.ISubscriptionGrant[]> = new Map();

  /**
   * Creates a new MQTT client
   * @param brokerUrl - The MQTT broker URL
   * @param options - Optional client connection options
   */
  constructor(brokerUrl: string, options: MqttConnectionOptions = {}) {
    super();
    
    // Set default options if not provided
    const defaultOptions: MqttConnectionOptions = {
      reconnectPeriod: 5000,
      connectTimeout: 10000,
      ...options,
    };

    this.client = mqtt.connect(brokerUrl, defaultOptions);

    this.client.on('connect', () => {
      this.isConnected = true;
      this.emit('connect');
    });

    this.client.on('reconnect', () => {
      this.emit('reconnect');
    });

    this.client.on('error', (error) => {
      this.emit('error', error);
    });

    this.client.on('offline', () => {
      this.isConnected = false;
      this.emit('offline');
    });

    this.client.on('close', () => {
      this.isConnected = false;
      this.emit('close');
    });

    this.client.on('message', (topic, messageBuffer, packet) => {
      const message: MqttMessage = {
        topic,
        payload: messageBuffer.toString(),
        packet,
      };
      
      this.emit('message', message);
    });
  }

  /**
   * Subscribe to a topic or array of topics
   * @param topic - Single topic or array of topics
   * @param options - Optional subscription options
   * @returns Promise that resolves with subscription grants
   */
  public subscribe(
    topic: string | string[], 
    options: Partial<IClientSubscribeOptions> = { qos: 0 }
  ): Promise<mqtt.ISubscriptionGrant[]> {
    const subscribeOptions: IClientSubscribeOptions = {
      qos: 0,
      ...options
    };

    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, subscribeOptions, (error, grants) => {
        if (error) {
          this.emit('error', error);
          return reject(error);
        }

        if (grants) {
          const topicStr = Array.isArray(topic) ? topic.join(',') : topic;
          this.subscriptions.set(topicStr, grants);
          
          this.emit('subscribe', { topic, grants });
          resolve(grants);
        } else {
          resolve([]);
        }
      });
    });
  }

  /**
   * Publish a message to a topic
   * @param topic - The topic to publish to
   * @param message - The message to publish (string or Buffer)
   * @param options - Optional publish options
   * @returns Promise that resolves when message is published
   */
  public publish(
    topic: string, 
    message: string | Buffer, 
    options: IClientPublishOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(topic, message, options, (error) => {
        if (error) {
          this.emit('error', error);
          return reject(error);
        }
        
        this.emit('publish', { topic, message });
        resolve();
      });
    });
  }

  /**
   * Unsubscribe from a topic or array of topics
   * @param topic - Topic(s) to unsubscribe from
   * @returns Promise that resolves when unsubscribed
   */
  public unsubscribe(topic: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          this.emit('error', error);
          return reject(error);
        }
        
        // Clean up subscriptions map
        const topicStr = Array.isArray(topic) ? topic.join(',') : topic;
        this.subscriptions.delete(topicStr);
        
        this.emit('unsubscribe', { topic });
        resolve();
      });
    });
  }

  /**
   * Add a message listener
   * @param callback - Function to call when a message is received
   * @returns this instance for chaining
   */
  public onMessage(callback: (message: MqttMessage) => void): this {
    this.on('message', callback);
    return this;
  }

  /**
   * Check if the client is connected
   * @returns boolean indicating if connected
   */
  public isClientConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect the client
   * @returns Promise that resolves when disconnected
   */
  public disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isConnected) {
        return resolve();
      }
      
      this.client.end(false, () => {
        this.isConnected = false;
        this.emit('disconnect');
        resolve();
      });
    });
  }

  /**
   * Reconnect the client if disconnected
   * @returns void
   */
  public reconnect(): void {
    if (!this.isConnected) {
      this.client.reconnect();
    }
  }

  /**
   * Get all active subscriptions
   * @returns Map of topic strings to subscription grants
   */
  public getSubscriptions(): Map<string, mqtt.ISubscriptionGrant[]> {
    return new Map(this.subscriptions);
  }
}
