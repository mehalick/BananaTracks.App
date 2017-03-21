// Angular references
import { Component, Injector } from '@angular/core';
import {Observable} from 'rxjs/Observable';

// Pages
import { BasePage } from '../../core/pages/base';
import { MyAccountPage } from '../my-account/my-account';
import { AddWorkoutPage } from '../add-workout/add-workout';

// Services
import { Activity } from '../../providers/activity-service';
import { Workout } from '../../providers/workout-service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage extends BasePage {
	
    public isLoaded = false;
    public activities: Array<Activity>;
    public workouts: Array<Workout>;
    
    constructor(public injector: Injector) {
		super(injector);
	}

    public ionViewDidEnter(): void {

        this.helpers.showLoadingMessage().then(() => {

            console.log('Loading activities and workouts...');
            let t0 = performance.now();

            Observable.forkJoin(
                this.domain.activityService.getAll(),
                this.domain.workoutService.getRecent()
            ).subscribe(data => {
                
                this.activities = data[0];
                this.workouts = data[1].reverse();

                let t1 = performance.now();                 
                console.log(`Loading complete in ${t1 - t0}ms.`);

                this.isLoaded = true;

                this.helpers.hideLoadingMessage();
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
