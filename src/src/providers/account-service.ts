// Angular references
import { Injectable, Inject } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/Rx';

// Ionic references
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Models and services
import { EventService } from '../providers/event-service';
import { HttpClientService } from '../providers/http-client-service';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';

export class UserAccountModel {
    public userId: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public token: string;
}

export class LogInModel {
    public email: string;
    public password: string;
}

export class RegisterModel extends UserAccountModel {
    public username: string;
    public password: string;
}

export class PasswordResetModel {
    public email: string;
}

@Injectable()
export class AccountService {

    private userDetails: UserAccountModel;
    private storageDbName: string;

    private testMode: boolean;

    constructor( @Inject(TOKEN_CONFIG) config: AppConfig,
        private http: HttpClientService,
        private eventService: EventService,
        private storage: Storage,
        private eventCtrl: Events) {
        this.storageDbName = `${config.appName}:account`;
        this.testMode = config.testMode;
    }

    // Method that gets the information from the storage and initializes an object
    // in memory to avoid dealing with promises everywhere in the code
    public initializeAccountStatus(): Promise<boolean> {

        // TEST mode
        // -----------------------
        if (this.testMode) {
            console.log('[TEST]: Getting account status from storage...');
            return this.storage.get(`${this.storageDbName}-test`).then(data => {
                this.userDetails = data ? JSON.parse(data) : null;
                return this.userDetails !== null;
            });
        }

        // REAL implementation
        // -----------------------
        console.log('Getting account status from storage...');
        return this.storage.get(this.storageDbName).then(data => {
            this.userDetails = data ? JSON.parse(data) : null;
            return this.userDetails !== null;
        });
    }

    // Method that returns true if the user is logged in
    public isLoggedIn(): boolean {
        return this.userDetails !== null;
    }

    // Method that handles user login
    public logIn(model: LogInModel): Observable<UserAccountModel> {

        // TEST mode
        // -----------------------
        if (this.testMode) {
            if (model.email === 'admin@mail.com' && model.password === 'admin1234') {
                this.userDetails = this.getUserAccountMock();
                this.storage.set(`${this.storageDbName}-test`, JSON.stringify(this.userDetails));
                this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, true);
                return Observable.create(observable => {
                    observable.next(this.userDetails);
                    observable.complete();
                });
            } else {
                return Observable.create(observable => {
                    observable.error(new Error('The email or password you entered is incorrect. Please try again'));
                    observable.complete();
                });
            }
        }

        // REAL implementation
        // -----------------------
        let data = `grant_type=password&username=${model.email}&password=${model.password}`;
        let contentType = 'application/x-www-form-urlencoded';

        // First get the token details
        return this.http.post('token', data, '', contentType, true).map(res => res.json())
            .flatMap((tokenDetails: any) => {

                // Now we can get the details of the user
                return this.http.get(`users/action?username=${model.email}`).map(res => res.json())
                    .map((userDetails: UserAccountModel) => {

                        // Update the token
                        userDetails.token = tokenDetails;

                        // Save the data in the storage
                        this.saveUserInformationInStorage(userDetails);

                        // Publish an event to update side menu and any other required component
                        this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, true);

                        return userDetails;
                    });
            });
    }

    // Method that handles user logout
    public logOut(): void {

        // TEST mode
        // -----------------------
        if (this.testMode) {
            this.userDetails = null;
            this.storage.set(`${this.storageDbName}-test`, null);
            this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, false);
            return;
        }

        // REAL implementation
        // -----------------------
        this.storage.set(this.storageDbName, null).then(() => {
            // Update the status in memory
            this.userDetails = null;

            // Publish an event to update side menu and any other required component
            this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, false);
        });
    }

    // Method that handles user registration and then obtains a valid token for the new user
    public register(model: RegisterModel): Observable<UserAccountModel> {

        // TEST mode
        // -----------------------
        if (this.testMode) {
            this.userDetails = this.getUserAccountMock();
            this.storage.set(`${this.storageDbName}-test`, JSON.stringify(this.userDetails));
            this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, true);
            return Observable.create(observable => {
                observable.next(this.userDetails);
                observable.complete();
            });
        }

        // REAL implementation
        // -----------------------
        return this.http.post('users', model).map(res => res.json())
            .flatMap((userDetails: UserAccountModel) => {

                // Get the token for the new user
                let data = `grant_type=password&username=${model.email}&password=${model.password}`;
                let contentType = 'application/x-www-form-urlencoded';

                return this.http.post('token', data, '', contentType, true).map(res => res.json())
                    .map((token: any) => {

                        userDetails.token = token;

                        // Save the data in the storage
                        this.saveUserInformationInStorage(userDetails);

                        // Publish an event to update side menu and any other required component
                        this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, true);

                        return userDetails;
                    });
            });
    }

    // Method that requests a new password for the user
    public needPassword(model: PasswordResetModel): Observable<string> {

        // TEST mode
        // -----------------------
        if (this.testMode) {
            return Observable.create(observable => {
                observable.next();
                observable.complete();
            });
        }

        // REAL implementation
        // -----------------------
        return this.http.post('users/action/password-reset', model)
            .map(res => res.json());
    }

    // Method that saves the user information in the local storage
    private saveUserInformationInStorage(userDetails: UserAccountModel) {
        // Update the status in memory
        this.userDetails = userDetails

        // Save the data in the storage
        return this.storage.set(this.storageDbName, JSON.stringify(userDetails));
    }

    // Method that returns the user information
    public getCurrentUserDetails(): UserAccountModel {
        return this.userDetails;
    }

    // Method that returns a list of free avatars
    public checkUserName(userName: string): Observable<boolean> {

        // TEST mode
        // -----------------------
        if (this.testMode) {
            let result = userName !== 'admin';
            return Observable.create(observable => {
                observable.next(result);
                observable.complete();
            });
        }

        // REAL implementation
        // -----------------------
        return this.http.get(`users/action/username-validate?username=${userName}`)
            .map(res => res.json())
            .map((result) => {
                return result && result.isValid;
            });
    }

    // Method that returns a demo UserAccount object
    private getUserAccountMock(): UserAccountModel {
        let user: UserAccountModel = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@mail.com',
            userId: '0',
            token: 'h34kjhad/&(%dsfasdfa6'
        }
        return user;
    }

}