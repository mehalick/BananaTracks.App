// Angular references
import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';

// Ionic references
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Ng2 Translate references
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';

// App
import { MyApp } from './app.component';

// Core dependencies
import { BasePage } from '../core/pages/base';
import { UserBasePage } from '../core/pages/user-base';

// Pages
import { HomePage } from '../pages/home/home';
import { MyAccountPage } from '../pages/my-account/my-account';
import { LogInPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { PasswordResetPage } from '../pages/password-reset/password-reset';
import { AddWorkoutPage } from '../pages/add-workout/add-workout';

// Services
import { HttpClientService } from '../providers/http-client-service';
import { AccountService } from '../providers/account-service';
import { EventService } from '../providers/event-service';
import { LanguageService } from '../providers/language-service';
import { SideMenuService } from '../providers/side-menu-service';
import { NetworkService } from '../providers/network-service';
import { ActivityService } from '../providers/activity-service';
import { WorkoutService } from '../providers/workout-service';

// Utils
import { MultiLevelSideMenuComponent } from '../utils/multi-level-side-menu/multi-level-side-menu';

// Config object
import { TOKEN_CONFIG, APP_CONFIG } from '../app/app.config';

// Custom modules
import { ValidationModule } from '../utils/validation/validation.module';

// Ng2 Translate Loader
export function createTranslateLoader(http: Http) {
	return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
	declarations: [
		MyApp,
		BasePage,
		UserBasePage,
		HomePage,
		MyAccountPage,
		LogInPage,
		RegisterPage,
		PasswordResetPage,
        AddWorkoutPage,

		// Utils
		MultiLevelSideMenuComponent
	],
	imports: [
		TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
		ValidationModule,
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,

		// Pages
		BasePage,
		UserBasePage,
		HomePage,
		MyAccountPage,
		LogInPage,
		RegisterPage,
		PasswordResetPage,
        AddWorkoutPage
	],
	providers: [
		Storage,
		LanguageService,
		HttpClientService,
		AccountService,
		EventService,
		SideMenuService,
		NetworkService,
        ActivityService,
        WorkoutService,
		{ provide: TOKEN_CONFIG, useValue: APP_CONFIG },
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
