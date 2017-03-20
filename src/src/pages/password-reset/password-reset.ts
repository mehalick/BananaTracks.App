// Angular references
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models and services
import { PasswordResetModel } from '../../providers/account-service';
import { ValidationHelper } from '../../utils/validation/validation.helper';

// Pages
import { BasePage } from '../../core/pages/base';

@Component({
    selector: 'page-password-reset',
    templateUrl: 'password-reset.html'
})
export class PasswordResetPage extends BasePage {

    public needPasswordForm: FormGroup;
    public submitAttempt: boolean;
    public model: PasswordResetModel;

    constructor(public injector: Injector,
                private formBuilder: FormBuilder) {
        super(injector);
        this.initializeForm();
    }

    // Method that initializes the form
    private initializeForm(): void {
        this.model = new PasswordResetModel();
        this.submitAttempt = false;

        this.needPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, ValidationHelper.emailValidator]]
        });
    }

    // Method that redirects the user to the previous page
    public goBack(): void {
        this.ionic.viewCtrl.dismiss();
    }
    
    // Method that sends the email to the server
    public sendInstructions(): void {
        this.submitAttempt = true;

        if (this.needPasswordForm.valid) {
            this.helpers.showLoadingMessage().then(() => {

                // Initialize the model with the information from the form
                this.model.email = this.needPasswordForm.get('email').value;

                this.domain.accountService.needPassword(this.model).subscribe((result) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        // Show a message to the user
                        let message = result || this.domain.translateService.instant('PASSWORD-RESET.RESULT');
                        this.showSuccessMessage(message);
                    });
                }, (error) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let errorMessage = this.helpers.getErrorMessage(error);
                        this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                    });
                });

            });

        }
    }

    // Method that shows the result to the user and then goes to the previous page
    private showSuccessMessage(result): void {
        let callback = () => {
            this.helpers.hideAlertMessage().then(() => {
                this.goBack();
            });
        },
        buttonText = this.domain.translateService.instant('OK');
        this.helpers.showAlertMessageWithCallbacks('SUCCESS', result, [{buttonText: buttonText, callback: callback}]);
    }
}
