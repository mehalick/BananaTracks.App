// Core services
import { DomainServices } from '../providers/domain.services';
import { IonicServices } from '../providers/ionic.services';

// Model used to send information related to the page where
// the user should be redirected to.
export class RedirectionModel {
    public page: any;
    public openAsRoot: boolean;
    public params: any;
}

export class HelperServices {

    private _currentLoadingInstance: any;
    private _currentAlertInstance: any;

    constructor(private _ionic: IonicServices,
                private _domain: DomainServices) { }

    // Method that tries to obtain the error message from an error result object
    public getErrorMessage(result: any): string {
        let errorMessage, defaultErrorMessage = 'An error has occurred. Please try again later.';
        try {
            errorMessage = result && typeof result.json === 'function' && result.json()
                ? result && typeof result.json === 'function' && result.json() && result.json().error_description
                : result && result.message;
            errorMessage = errorMessage || result.statusText;
        } catch (e) {
            errorMessage = defaultErrorMessage;
        }
        return errorMessage || defaultErrorMessage;
    }

    // Method that redirects the user to a target page
    public redirectTo(targetPage: any, openAsRoot?: boolean, params?: any): void {

        let redirectionModel = new RedirectionModel();
        redirectionModel.page = targetPage;
        redirectionModel.openAsRoot = openAsRoot || false;
        redirectionModel.params = params || null;

        this._ionic.eventsCtrl.publish(this._domain.eventService.NavigationRedirectTo, redirectionModel);
    }

    // Method that shows a loading popup
    public showLoadingMessage(message?: string): Promise<any> {

        // If there's already a loading popup, hide it first
        if (this._currentLoadingInstance) {
            this.hideLoadingMessage();
        }

        let loadingText = message ? this._domain.translateService.instant(message) : this._domain.translateService.instant("LOADING");

        this._currentLoadingInstance = this._ionic.loadingCtrl.create({
            content: loadingText
        });
        return this._currentLoadingInstance.present();
    }

    // Method that hides the current loading popup
    public hideLoadingMessage(): Promise<any> {
        return this._currentLoadingInstance.dismiss();
    }

    // Method that shows an alert popup
    public showBasicAlertMessage(title: string, message: string, buttonText?: string): void {

        // If there's already an active alert, hide it first
        if (this._currentAlertInstance) {
            this.hideAlertMessage();
        }

        let buttonTextLang = buttonText ? this._domain.translateService.instant(buttonText.toUpperCase()) : this._domain.translateService.instant('OK');

        this._currentAlertInstance = this._ionic.alertCtrl.create({
            title: this._domain.translateService.instant(title.toUpperCase()),
            message: message,
            enableBackdropDismiss: false,
            buttons: [{
                text: buttonTextLang
            }]
        });
        this._currentAlertInstance.present();
    }

    // Method that shows an alert popup with custom buttons and callbacks
    public showAlertMessageWithCallbacks(title: string, message: string, buttons: Array<{ buttonText: string, callback: () => void }>) {

        // If there's already an active alert, hide it first
        if (this._currentAlertInstance) {
            this.hideAlertMessage();
        }

        this._currentAlertInstance = this._ionic.alertCtrl.create({
            title: this._domain.translateService.instant(title.toUpperCase()),
            message: message,
            enableBackdropDismiss: false
        });

        buttons.forEach(button => {
            let buttonTextLang = this._domain.translateService.instant(button.buttonText.toUpperCase());
            this._currentAlertInstance.addButton({
                text: buttonTextLang,
                handler: button.callback
            });
        });

        this._currentAlertInstance.present();
    }

    // Method that hides the current alert message
    public hideAlertMessage(): Promise<any> {
        return this._currentAlertInstance.dismiss();
    }
}