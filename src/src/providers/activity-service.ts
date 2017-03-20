import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { HttpClientService } from '../providers/http-client-service';

export class Activity {
    public id: string;
    public name: string;
}

@Injectable()
export class ActivityService {

    constructor(private http: HttpClientService) {

    }

    public getAll(): Observable<Array<Activity>> {
        return this.http.get('activities').map(res => res.json());
    }

}
