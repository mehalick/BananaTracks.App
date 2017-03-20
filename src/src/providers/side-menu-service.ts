// Angular references
import { Injectable } from '@angular/core';

// Pages
import { HomePage } from '../pages/home/home';
import { MyAccountPage } from '../pages/my-account/my-account';

// Models
import { MenuOptionModel } from '../utils/multi-level-side-menu/multi-level-side-menu';

export class SideMenuOptionModel implements MenuOptionModel {
	constructor(
		// How should the option be displayed
		public displayName: string,
		public iconName: string,

		// Which component and how should be opened
		public component: any,
		public isRoot: boolean,

		// Special options like login, logut, language toggle...
		public isLogin: boolean = false,
		public isLogout: boolean = false,
		public toggleLanguage: boolean = false,

		// When should be shown
		public showWhenLoggedIn: boolean = true,
		public showWhenLoggedOut: boolean = true,

		// Nested items
		public subItems: Array<MenuOptionModel> = null) { }
}

@Injectable()
export class SideMenuService {

	public options: Array<SideMenuOptionModel>;

	constructor() {
		this.options = new Array<SideMenuOptionModel>();

		// Loads all the options
		this.options.push(new SideMenuOptionModel('PAGES.HOME', null, HomePage, true));
		this.options.push(new SideMenuOptionModel('PAGES.MY_ACCOUNT', null, MyAccountPage, true, false, false, false, true, false));
		this.options.push(new SideMenuOptionModel('LOG_IN', null, null, null, true, false, false, false, true));
		this.options.push(new SideMenuOptionModel('LOG_OUT', null, null, null, false, true, false, true, false));
		this.options.push(new SideMenuOptionModel('LANGUAGE', null, null, null, false, false, true));

		// Nested options with icons
		this.options.push(new SideMenuOptionModel('TESTING.MENU_WITH_ICONS', null, null, null, false, false, false, true, true,
			[
				new SideMenuOptionModel('PAGES.HOME', 'ios-contact', HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', 'ios-trophy', HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', 'ios-checkbox', HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', 'ios-list', HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', 'ios-star', HomePage, true),

			]));

		// Nested options without icons
		this.options.push(new SideMenuOptionModel('TESTING.MENU_WITHOUT_ICONS', null, null, null, false, false, false, true, true,
			[
				new SideMenuOptionModel('PAGES.HOME', null, HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', null, HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', null, HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', null, HomePage, true),
				new SideMenuOptionModel('PAGES.HOME', null, HomePage, true),

			]));
	}

	// Method that returns only available options
	public getAvailableOptions(isLoggedIn: boolean) {
		return this.options.filter(option => (isLoggedIn && option.showWhenLoggedIn) || (!isLoggedIn && option.showWhenLoggedOut));
	}

}