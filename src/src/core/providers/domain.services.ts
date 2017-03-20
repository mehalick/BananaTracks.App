// Angular references
import { Injector } from '@angular/core';

// Services
import { EventService } from "../../providers/event-service";
import { AccountService } from '../../providers/account-service';
import { NetworkService } from '../../providers/network-service';

// Ng2 Translate references
import { TranslateService } from 'ng2-translate';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../../app/app.config';

// Project services
import { ActivityService } from "../../providers/activity-service";
import { WorkoutService } from "../../providers/workout-service";

export class DomainServices {

    private _translateService: TranslateService;
    private _eventService: EventService;
    private _accountService: AccountService;
    private _networkService: NetworkService;
    private _config: AppConfig;

    private _activityService: ActivityService;
    private _workoutService: WorkoutService;

    constructor(private _injector: Injector) {}

    // Config object
    public get config(): AppConfig {
        if (!this._config) {
            this._config = this._injector.get(TOKEN_CONFIG);
        }
        return this._config;
    }

    // EventService
    public get eventService(): EventService {
        if (!this._eventService) {
            this._eventService = this._injector.get(EventService);
        }
        return this._eventService;
    }

    // TranslateService
    public get translateService(): TranslateService {
        if (!this._translateService) {
            this._translateService = this._injector.get(TranslateService);
        }
        return this._translateService;
    }

    // AccountService
    public get accountService(): AccountService {
        if (!this._accountService) {
            this._accountService = this._injector.get(AccountService);
        }
        return this._accountService;
    }

    // NetworkService
    public get networkService(): NetworkService {
        if (!this._networkService) {
            this._networkService = this._injector.get(NetworkService);
        }
        return this._networkService;
    }

    // ActivityService
    public get activityService(): ActivityService {
        if (!this._activityService) {
            this._activityService = this._injector.get(ActivityService);
        }
        return this._activityService;
    }

    // WorkoutService
    public get workoutService(): WorkoutService {
        if (!this._workoutService) {
            this._workoutService = this._injector.get(WorkoutService);
        }
        return this._workoutService;
    }
}