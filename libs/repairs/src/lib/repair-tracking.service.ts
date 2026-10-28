
import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { TokenStorageService } from '@doublestar/shared';

export interface RepairStatusUpdate {
  ticketId: number;
  fromStatus: string;
  toStatus: string;
  changedAtUtc: string;
}

@Injectable({ providedIn: 'root' })
export class RepairTrackingService {
  private connection: HubConnection | null = null;

  private readonly desiredTicketIds = new Set<number>();
  private readonly subscribedTicketIds = new Set<number>();

  private connectionPromise: Promise<void> | null = null;
  private syncPromise: Promise<void> = Promise.resolve();

  private readonly updatesSubject =
    new Subject<RepairStatusUpdate>();

  readonly updates$ = this.updatesSubject.asObservable();
  private readonly tokenStorage = inject(TokenStorageService);

  async setTickets(ticketIds: number[]): Promise<void> {
    this.desiredTicketIds.clear();

    for (const id of ticketIds) {
      this.desiredTicketIds.add(id);
    }

    if (this.desiredTicketIds.size === 0) {
      await this.disconnect();
      return;
    }

    await this.ensureConnected();
    await this.queueSubscriptionSync();
  }

  async disconnect(): Promise<void> {
    this.desiredTicketIds.clear();
    this.subscribedTicketIds.clear();

    const connection = this.connection;
    this.connection = null;

    if (
      connection &&
      connection.state !== HubConnectionState.Disconnected
    ) {
      await connection.stop();
    }
  }

  private async ensureConnected(): Promise<void> {
    if (
      this.connection?.state === HubConnectionState.Connected
    ) {
      return;
    }

    if (this.connectionPromise) {
      await this.connectionPromise;
      return;
    }

    const connection = new HubConnectionBuilder()
      // This relative URL requires the frontend proxy to forward
      // /hubs/repair-tracking to the backend API.
      .withUrl('/hubs/repair-tracking', {
        accessTokenFactory: () => {
          const token = this.tokenStorage.getAccessToken();

          if (!token) {
            throw new Error(
              'Sign in again to receive live repair updates.',
            );
          }

          return token;
        },
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection = connection;

    connection.on(
      'RepairStatusChanged',
      (update: RepairStatusUpdate) => {
        if (this.desiredTicketIds.has(update.ticketId)) {
          this.updatesSubject.next(update);
        }
      },
    );

    connection.onreconnecting(() => {
      this.subscribedTicketIds.clear();
    });

    connection.onreconnected(async () => {
      this.subscribedTicketIds.clear();
      await this.queueSubscriptionSync();
    });

    this.connectionPromise = connection.start();

    try {
      await this.connectionPromise;
    } catch (error) {
      if (this.connection === connection) {
        this.connection = null;
      }

      throw error;
    } finally {
      this.connectionPromise = null;
    }
  }

  private queueSubscriptionSync(): Promise<void> {
    this.syncPromise = this.syncPromise
      .catch(() => undefined)
      .then(() => this.syncSubscriptions());

    return this.syncPromise;
  }

  private async syncSubscriptions(): Promise<void> {
    const connection = this.connection;

    if (
      !connection ||
      connection.state !== HubConnectionState.Connected
    ) {
      return;
    }

    // Remove subscriptions for tickets no longer displayed.
    for (const id of [...this.subscribedTicketIds]) {
      if (!this.desiredTicketIds.has(id)) {
        await connection.invoke('UnsubscribeFromTicket', id);
        this.subscribedTicketIds.delete(id);
      }
    }

    // Subscribe to tickets currently displayed.
    for (const id of this.desiredTicketIds) {
      if (!this.subscribedTicketIds.has(id)) {
        await connection.invoke('SubscribeToTicket', id);
        this.subscribedTicketIds.add(id);
      }
    }
  }
}
