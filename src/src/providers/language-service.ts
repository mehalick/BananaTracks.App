// Angular references
import { Injectable, Inject } from '@angular/core';

// Ng2 Translate references
import { TranslateService } from 'ng2-translate';

// Ionic references
import { Storage } from '@ionic/storage';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';

@Injectable()
export class LanguageService {

    private defaultLanguage: string;
    private selectedLanguage: string;
    private availableLanguages: Array<string>;

    private storageDbName: string;

    constructor(@Inject(TOKEN_CONFIG) config: AppConfig,
                private storage: Storage,
                private translateService: TranslateService) {

        // Get the default and available languages from the config file
        this.defaultLanguage = config.defaultLanguage;
        this.availableLanguages = config.availableLanguages;

        // Set the name of the storage using the app name
        this.storageDbName = `${config.appName}:language`;
    }

    // Method that gets the information from the storage and initializes an object
    // in memory to avoid dealing with promises everywhere in the code
    public initializeLanguage(): Promise<string> {
        console.log('Getting language from storage...');
        return this.storage.get(this.storageDbName).then(data => {

            this.selectedLanguage = data ? data : this.defaultLanguage;

            // Configure ng2 translate to use the selected / default language
            this.translateService.setDefaultLang(this.selectedLanguage);
            this.translateService.use(this.selectedLanguage);

            console.log(`Setting ${this.selectedLanguage} language...`);

            return this.selectedLanguage;
        });
    }

    // Method that returns the selected language
    public getLanguage(): string {
        return this.selectedLanguage || this.defaultLanguage;
    }

    // Method that changes the selected language
    public changeLanguage(language: string): Promise<string> {
        if (!this.isValidLanguage(language)) {
            return Promise.reject('Invalid language');
        } else if (language === this.selectedLanguage) {
            return Promise.resolve(this.selectedLanguage);
        } else {
            return this.storage.set(this.storageDbName, language).then(() => {
                this.selectedLanguage = language;

                // Configure ng2 translate to use the selected / default language
                this.translateService.use(this.selectedLanguage);

                console.log(`Setting ${this.selectedLanguage} language...`);

                return this.selectedLanguage;
            });
        }
    }

    // Method that checks if the language is included in the available languages
    // array from the configuration file
    private isValidLanguage(language: string): boolean {
        return this.availableLanguages.indexOf(language) > -1;
    }
}