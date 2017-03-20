import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { HttpClientService } from '../providers/http-client-service';

import { Activity } from '../providers/activity-service';

export class Workout {
    public id: string;
    public userId: string;
    public activity: Activity;
    public name: string;
    public startUtc: Date;
    public endUtc: Date;
}

@Injectable()
export class WorkoutService {

    constructor(private http: HttpClientService) {

    }

    public getAll(): Observable<Array<Workout>> {
        return this.http.get('workouts').map(res => res.json());
    }

    public addWorkout(activityId: string, startTime: Date): Observable<Workout> {

        let workout = new Workout();
        workout.userId = 'a09970b2-be2a-4614-a3c9-a153584629d0';
        workout.activity = new Activity();
        workout.activity.id = activityId;
        workout.startUtc = startTime;
        workout.endUtc = new Date();

        return this.http.post('workouts', workout).map(res => res.json());
    }
}