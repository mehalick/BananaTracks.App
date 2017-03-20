import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../providers/activity-service';

import { BasePage } from '../../core/pages/base';
import { HomePage } from '../../pages/home/home';

@Component({
    selector: 'page-add-workout',
    templateUrl: 'add-workout.html'
})
export class AddWorkoutPage extends BasePage {

    public formGroup: FormGroup;
    public activity: Activity;

    constructor(public injector: Injector, private formBuilder: FormBuilder) {
		super(injector);
        this.activity = this.ionic.paramCtrl.get('activity');
        this.initializeForm();
	}

    ionViewDidLoad() {

        
    }

    private initializeForm() {
        let activityId = this.activity.id;
        let startTime = new Date();

        this.formGroup = this.formBuilder.group({
            activityId: [activityId, [Validators.required]],
            startTime: [startTime, [Validators.required]]
        });

    }

    public logWorkout() {
        
        let activityId = this.formGroup.get('activityId').value;
        let startTime = new Date(this.formGroup.get('startTime').value)

        this.helpers.showLoadingMessage().then(() => {
            this.domain.workoutService.addWorkout(activityId, startTime).subscribe(result => {
                this.helpers.hideLoadingMessage().then(() => {
                    this.helpers.showAlertMessageWithCallbacks('Success!', 'Workout successfully logged.', [{ buttonText: 'OK', callback: () => {
                        this.helpers.hideAlertMessage().then(() => {
                            this.helpers.redirectTo(HomePage, true);
                        })
                    }}]);
                });
            });    
        });   
    }

}
