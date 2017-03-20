// Angular references
import { OpaqueToken } from '@angular/core';

// Token used to inject the configuration object
export let TOKEN_CONFIG = new OpaqueToken('app.config');

export interface AppConfig {

    // Application name
    appName: string;

    // Application mode
    // When testMode is set to true, the HttpClient won't be called, and mocks will
    // be returned instead. This mode can be used to develop/show the app when the 
    // required api endpoints are not yet ready
    testMode: boolean;

    // Localization
    defaultLanguage: string;
    availableLanguages: Array<string>;

    // HTTP Client
    timeout: number;
    apiKey: string;

    apiUrlLocal: string;
    apiUrlStaging: string;
    apiUrlProduction: string;
}

// Application Config object
export const APP_CONFIG: AppConfig = {

    // Application name
    appName: 'TEMPLATE',

    // Application mode
    testMode: false,

    // Localization
    defaultLanguage:    'en',
    availableLanguages: ['en'],

    // HTTP Client
    timeout:    50000,
    apiKey:     'j43242g42j4hg2jh1j%$333r',

    apiUrlLocal:        'https://localhost:50219/api',
    apiUrlStaging:      'https://bananatracks-staging.azurewebsites.net/api',
    apiUrlProduction:   'https://bananatracks.azurewebsites.net/api'
};