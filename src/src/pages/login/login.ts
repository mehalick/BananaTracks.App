// Angular references
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

// Pages
import { BasePage } from '../../core/pages/base';
import { RegisterPage } from '../register/register';
import { PasswordResetPage } from '../password-reset/password-reset';

// Models and services
import { LogInModel } from '../../providers/account-service';
import { ValidationHelper } from '../../utils/validation/validation.helper';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LogInPage extends BasePage {

    public signInForm: FormGroup;
    public submitAttempt: boolean;
    public model: LogInModel;

    constructor(public injector: Injector,
        public formBuilder: FormBuilder) {
        super(injector);
        this.initializeForm();
    }

    // Method that initializes the form
    private initializeForm(): void {
        this.model = new LogInModel();
        this.submitAttempt = false;

        this.signInForm = this.formBuilder.group({
            email: ['', [ValidationHelper.emailValidator]],
            password: ['', [ValidationHelper.passwordValidator]]
        });
    }

    // Method that redirects the user to the previous page
    public goBack(): void {
        this.ionic.viewCtrl.dismiss(false);
    }

    // Method that sends the user information to the server
    public signIn(): void {

        this.submitAttempt = true;
        if (this.signInForm.valid) {

            this.helpers.showLoadingMessage().then(() => {
                // Initialize the model
                this.model.email = this.signInForm.get('email').value;
                this.model.password = this.signInForm.get('password').value;

                this.domain.accountService.logIn(this.model).subscribe((result) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        this.ionic.viewCtrl.dismiss(true);
                    });
                }, (error) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let errorMessage = this.helpers.getErrorMessage(error);
                        this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                    });
                });
            })
        }
    }

    // Method that redirects the user to the RegisterPage
    public register(): void {
        let registerModal = this.ionic.modalCtrl.create(RegisterPage);
        registerModal.onDidDismiss(result => {
            if (result) {
                this.ionic.viewCtrl.dismiss(result);
            }
        });
        registerModal.present();
    }

    // Method that redirects the user to the NeedPasswordPage
    public resetPassword(): void {
        let needPasswordModal = this.ionic.modalCtrl.create(PasswordResetPage);
        needPasswordModal.present();
    }
}