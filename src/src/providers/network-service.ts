// Angular references
import { Injectable } from '@angular/core';

// Ionic native references
// http://ionicframework.com/docs/v2/native/network/
import { Network } from 'ionic-native';

// Ionic references
import { Events } from 'ionic-angular';

// Models and services
import { EventService } from '../providers/event-service';

export enum ConnectionStatusEnum {
    Online,
    Offline
}

@Injectable()
export class NetworkService {

    // Property used to avoid showing repeated online/offline messages
    private previousStatus;

    constructor(private eventService: EventService,
                private eventCtrl: Events) {
        this.previousStatus = ConnectionStatusEnum.Online;
    }

    // Method that handles the events related to connecting and disconnecting to internet
    public initializeNetworkEvents(): void {
        Network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
                this.eventCtrl.publish(this.eventService.NetworkIsOffline);
            }
            this.previousStatus = ConnectionStatusEnum.Offline;
        });
        Network.onConnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Offline) {
                this.eventCtrl.publish(this.eventService.NetworkIsOnline);
            }
            this.previousStatus = ConnectionStatusEnum.Online;
        });
    }

    // Method that returns true if the user is connected to internet
    public isOnline(): boolean {
        return Network.type.toLowerCase() !== 'none';
    }

    // Method that returns true if the user is not connected to internet
    public isOffline(): boolean {
        return Network.type.toLowerCase() === 'none';
    }
}