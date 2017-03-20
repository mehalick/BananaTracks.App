// Angular references
import { Component, ViewChild, Inject } from '@angular/core';

// Ionic references
import { Nav, Platform, MenuController, ModalController, Events, ToastController } from 'ionic-angular';

// Ionic Native references
import { StatusBar, Splashscreen } from 'ionic-native';

// Ng2 Translate references
import { TranslateService } from 'ng2-translate';

// Models and services
import { EventService } from '../providers/event-service';
import { SideMenuService, SideMenuOptionModel } from '../providers/side-menu-service';
import { LanguageService } from '../providers/language-service';
import { AccountService, UserAccountModel } from '../providers/account-service';
import { NetworkService } from '../providers/network-service';

// Pages
import { HomePage } from '../pages/home/home';
import { LogInPage } from '../pages/login/login';

// Utils
import { MultiLevelSideMenuComponent } from '../utils/multi-level-side-menu/multi-level-side-menu';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) navCtrl: Nav;

	// Get the instance to call the public methods
	@ViewChild(MultiLevelSideMenuComponent) sideMenuContent: MultiLevelSideMenuComponent;

	// Side menu options
	public availableOptions: Array<SideMenuOptionModel>;

	// Property used to show only one toast message at a time
	private toastInstance: any;

	public rootPage;

	// Language properties
	public selectedLanguage: string;
	public changeLanguageText: string;
	public availableLanguages: Array<string>;

	// Account details
	public userDetails: UserAccountModel;

	constructor(public platform: Platform,
				private menuCtrl: MenuController,
				private modalCtrl: ModalController,
				private eventCtrl: Events,
				private toastCtrl: ToastController,
				private accountService: AccountService,
				private networkService: NetworkService,
				private eventService: EventService,
				private sideMenuService: SideMenuService,
				private languageService: LanguageService,
				private translateService: TranslateService,
				@Inject(TOKEN_CONFIG) config: AppConfig) {
		this.availableLanguages = config.availableLanguages;
		this.initializeApp();
	}

	// Method that initializes the language and account details, and subscribes
	// to the account and navigation related events
	private initializeApp(): void {
		this.platform.ready().then(() => {
			StatusBar.styleDefault();
			Splashscreen.hide();

			// Initialize the language
			this.initializeDefaultLanguage().then(() => {

				// Put in memory data that we keep in storage
				this.accountService.initializeAccountStatus().then((loggedIn) => {
					this.userDetails = this.accountService.getCurrentUserDetails();
					this.rootPage = HomePage;
					this.initializeSideMenu(loggedIn);
				});
			});
			this.initializeEvents();
		});
	}

	// Method that initializes the default language
	private initializeDefaultLanguage(): Promise<any> {
		return this.languageService.initializeLanguage().then(language => {
			this.selectedLanguage = language;
			this.changeLanguageText = this.availableLanguages.filter((language) => language != this.selectedLanguage)[0];
			this.setProperAligment();
		});
	}

	// Method that subscribes to all the events in the app
	private initializeEvents(): void {

		// Initialize network events
		this.networkService.initializeNetworkEvents();

		// Handles what to do when the user logs in or logs out
		this.eventCtrl.subscribe(this.eventService.UserLoginStatusChanged, (isLoggedIn) => {
			// Update the side menu according to the account status
			this.initializeSideMenu(isLoggedIn);

			// Get the user details or set it to null
			this.userDetails = this.accountService.getCurrentUserDetails();

			// Redirect to home when logging out to prevent the user to stay in
			// a page that requires to be logged in
			if (!isLoggedIn) {
				this.menuCtrl.close().then(() => {
					this.navCtrl.setRoot(HomePage);
				});
			}
		});

		// Handle what to do when the user needs to be redirected to any page of the app
		this.eventCtrl.subscribe(this.eventService.NavigationRedirectTo, (redirectionModel) => {
			this.handlePageRedirect(redirectionModel.page, redirectionModel.openAsRoot, redirectionModel.params);
		});

		// Offline event
		this.eventCtrl.subscribe(this.eventService.NetworkIsOffline, () => {
			this.showToastMessage(this.translateService.instant('OFFLINE'), 'offline');
		});

		// Online event
		this.eventCtrl.subscribe(this.eventService.NetworkIsOnline, () => {
			this.showToastMessage(this.translateService.instant('ONLINE'), 'online', true);
		});
	}

	// Method that gets available options for logged in / logged out users
	private initializeSideMenu(loggedIn: boolean): void {
		this.availableOptions = this.sideMenuService.getAvailableOptions(loggedIn);
	}

	// Method that handles what to do when the user wants to open a page
	private handlePageRedirect(targetPage: any, openAsRoot?: boolean, params?: any): Promise<any> {
		if (openAsRoot) {
			// Try to set the page as the root page
			return this.navCtrl.setRoot(targetPage, params).catch(() => {
				this.showLoginPageAndRedirect(targetPage, openAsRoot, params);
			});
		} else {
			// Try to add the page to the current navigation stack
			return this.navCtrl.push(targetPage, params).catch(() => {
				this.showLoginPageAndRedirect(targetPage, openAsRoot, params);
			});
		}
	}

	// Method that shows the sign in page and then redirect the user to the target page
	private showLoginPageAndRedirect(targetPage?: any, openAsRoot?: boolean, params?: any): void {
		// The user is not logged in, so we need to show the SignInPage
		let signInModal = this.modalCtrl.create(LogInPage, { 'openAsModal': true });
		signInModal.onWillDismiss(result => {
			if (result && targetPage) {
				// If the user is now logged in, we redirect him/her to the targetPage
				openAsRoot
					? this.navCtrl.setRoot(targetPage, params || null)
					: this.navCtrl.push(targetPage, params || null);
			}
		});
		signInModal.present();
	}

	// Method that gets executed when the user select an option from side menu
	public selectOption(option: SideMenuOptionModel): void {
		if (option.toggleLanguage) {
			this.toggleLanguage();
		} else if(option.isLogin) {
			this.menuCtrl.close().then(() => {
				this.showLoginPageAndRedirect();
			});
		} else if(option.isLogout) {
			this.menuCtrl.close().then(() => {
				this.accountService.logOut();
			});
		} else if(option.component) {
			this.menuCtrl.close().then(() => {
				this.handlePageRedirect(option.component, option.isRoot);
			});
		}
	}

	// Method that changes the language
	public toggleLanguage(): void {
		let targetLanguage = this.availableLanguages.find(lang => lang !== this.selectedLanguage);
		this.menuCtrl.close().then(() => {
			this.handlePageRedirect(HomePage, true).then(() => {
				this.languageService.changeLanguage(targetLanguage).then(newLanguage => {
					this.selectedLanguage = newLanguage;
					this.deleteCachedData();
					this.setProperAligment();
				});
			});
		});
	}

	// Method that aligns the text to the left or right according the selected language
	private setProperAligment(): void {

		// Change the side menu position if language is Arabic
		if (this.selectedLanguage.toLowerCase() === 'ar') {
			this.menuCtrl.enable(true, 'right-menu');
			this.menuCtrl.enable(false, 'left-menu');
		} else {
			this.menuCtrl.enable(false, 'right-menu');
			this.menuCtrl.enable(true, 'left-menu');
		}

		// Add a class with the language to the ion-app element to apply custom styles
		let appElement = document.getElementsByTagName('ion-app');
		if (appElement) {

			// Remove the previous language if any
			var regx = new RegExp('\\blang*[-]\\w*\\b', 'g');
			appElement[0].className = appElement[0].className.replace(regx, '');

			// Add the new language
			appElement[0].className += appElement[0].className ? ` lang-${this.selectedLanguage}` : `lang-${this.selectedLanguage}`;
		}
	}

	// Method that deletes the cached data when changing the language
	private deleteCachedData(): void {
		// TODO: add calls to the services that needs to be reset for instance, products or 
		// brands details that will change when changing the language
	}

	// Method that shows a toast alert with a given message
	private showToastMessage(message: string, cssClass?: string, autoDismiss?: boolean): void {
		if (this.toastInstance) {
			this.toastInstance.dismiss();
		}

		let options: any = {
			position: 'bottom',
			message: message,
			showCloseButton: true,
			closeButtonText: this.translateService.instant('OK')
		};

		if(autoDismiss) {
			options.duration = 3000;
			options.dismissOnPageChange = true;
		} else {
			options.dismissOnPageChange = false;
		}

		if(cssClass) {
			options.cssClass = cssClass;
		}

		this.toastInstance = this.toastCtrl.create(options);

		this.toastInstance.present();
	}
}
