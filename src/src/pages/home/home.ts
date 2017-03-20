// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';
import { MyAccountPage } from '../my-account/my-account';
import { AddWorkoutPage } from '../add-workout/add-workout';

import { Activity } from '../../providers/activity-service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage extends BasePage {
	
    public activities: Array<Activity>
    
    constructor(public injector: Injector) {
		super(injector);
	}

    public ionViewDidEnter(): void {

        if (this.activities && this.activities.length > 0) {
            return;
        }

        this.helpers.showLoadingMessage().then(() => {
            this.domain.activityService.getAll().subscribe(
                (results: any) => {
                    this.activities = results;
                    this.helpers.hideLoadingMessage();
                },
                (error) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let errorMessage = this.helpers.getErrorMessage(error);
                        this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                    });
                });
        });
    }

    public selectActivity(activity: Activity): void {
        this.helpers.redirectTo(AddWorkoutPage, false, { 'activity': activity });
    }

	public showLoading(): void {
		this.helpers.showLoadingMessage('TESTING.LOADING_TEXT').then(() => {
			setTimeout(() => {
				this.helpers.hideLoadingMessage();
			}, 1000);
		});
	}

	public showAlert(): void {
		this.helpers.showBasicAlertMessage('TESTING.ALERT_TITLE', 'This is a test message.', 'TESTING.ALERT_BUTTON');
	}

	public showAlertWithCallback(): void {
		let callback = () => {
			setTimeout(() => {
				this.helpers.showBasicAlertMessage('TESTING.ALERT_TITLE', 'This is the second alert.', 'TESTING.ALERT_BUTTON');
			}, 500);
		}
		this.helpers.showAlertMessageWithCallbacks('TESTING.ALERT_TITLE', 'This alert will open another alert.', [{ buttonText: 'TESTING.ALERT_BUTTON', callback: callback }]);
	}

	public redirectToUserBasePage(): void {
		this.helpers.redirectTo(MyAccountPage, true);
	}
}
