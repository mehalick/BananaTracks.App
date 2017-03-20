// Angular references
import { Component, Injector } from '@angular/core';

// Core services
import { DomainServices } from '../providers/domain.services';
import { IonicServices } from '../providers/ionic.services';
import { HelperServices } from '../providers/helper.services';

@Component({ selector: '', template: '' })
export class BasePage {

    private _domain: DomainServices;
    private _ionic: IonicServices;
    private _helpers: HelperServices;

    constructor(public injector: Injector) {
        this._domain = new DomainServices(injector);
        this._ionic = new IonicServices(injector);
        this._helpers = new HelperServices(this._ionic, this._domain);
    }

    // Allows the page to get access to all the domain services
    public get domain(): DomainServices {
        return this._domain;
    }

    // Allows the page to get access to all the ionic controllers
    public get ionic(): IonicServices {
        return this._ionic;
    }

    // Allows the page to get access to all the custom helpers
    public get helpers(): HelperServices {
        return this._helpers;
    }
}