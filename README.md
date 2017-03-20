# Ionic App Template

```
Ionic Framework Version: 2.0.0
Ionic CLI Version: 2.1.18
Ionic App Lib Version: 2.1.9
Ionic App Scripts Version: 1.0.0
```

The configuration file can be found in `src/app/app.config.ts`:

```
// Application Config object
export const APP_CONFIG: AppConfig = {

    // Application name
    appName: 'TEMPLATE',

    // Application mode
    testMode: true,

    // Localization
    defaultLanguage:    'en',
    availableLanguages: ['en', 'ar'],

    // HTTP Client
    timeout:    50000,
    apiKey:     'j43242g42j4hg2jh1j%$333r',

    apiUrlLocal:        'https://localhost:port/api',
    apiUrlStaging:      'https://app-staging.azurewebsites.net/api',
    apiUrlProduction:   'https://app.azurewebsites.net/api'
};
```

It's important to set the api urls and the `apiKey` in this configuration file. 

The `appName` will be used to set the name in the storages, so the account information will be stored in `${config.appName}:account`, the default language in `${config.appName}:language` and so on.

The `testMode` allows the account related methods to return fake data so the app can be tested without using a working API.

## Adding new services

When a new service is added to the app, it needs to be added not only to the `app.module.ts` file, but also to the `BasePage`.

```
// Private properties to hold instances and avoid using the injector when possible
// -------------------------------------------------------------------------
// ...
private _newService: NewService;
// ...

// Service instances
// -------------------------------------------------------------------------
// ...
public get newService(): NewService {
    if (!this._newService) {
        this.printInjectorLog('[BasePage]: Obtaining NewService from injector...');
        this._newService = this.injector.get(NewService);
    }
    return this._newService;
}
// ...
```

By doing that, the instance of the new service will be available in any page that extends the `BasePage` or `UserBasePage`.