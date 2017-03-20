// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from './base';

@Component({ selector: '', template: '' })
export class UserBasePage extends BasePage {

    constructor(public injector: Injector) {
        super(injector);
    }

    ionViewCanEnter() {
        // Check if the user is allowed to enter to the page
        return this.domain.accountService.isLoggedIn();
    }
}