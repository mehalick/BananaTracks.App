// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { UserBasePage } from '../../core/pages/user-base';

@Component({
	selector: 'page-my-account',
	templateUrl: 'my-account.html'
})
export class MyAccountPage extends UserBasePage {
	constructor(public injector: Injector) {
		super(injector);
	}
}
