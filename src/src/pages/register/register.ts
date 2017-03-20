// Angular references
import { Component, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Ionic references
import { Slides } from 'ionic-angular';

// Models and services
import { RegisterModel } from '../../providers/account-service';
import { ValidationHelper } from '../../utils/validation/validation.helper';

// Pages
import { BasePage } from '../../core/pages/base';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage extends BasePage {
    @ViewChild(Slides) slides: Slides;

    public registerForm: FormGroup;
    public submitAttempt: boolean;
    public model: RegisterModel;

    private checkingUserName: boolean;

    constructor(public injector: Injector,
                public formBuilder: FormBuilder) {
        super(injector);
        this.initializeForm();
    }

    // Method that initializes the form
    private initializeForm(): void {
        this.model = new RegisterModel();
        this.submitAttempt = false;

        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(30)]],
            lastName: ['', [Validators.required, Validators.maxLength(30)]],
            userName: ['', [Validators.required, Validators.maxLength(30)]],
            email: ['', [Validators.required, ValidationHelper.emailValidator]],
            password: ['', [Validators.required, ValidationHelper.passwordValidator]]
        });

        // Add an async validation for the username
        this.registerForm.get('userName')
            .valueChanges
            .map((value: string) => {
                this.checkingUserName = true;
                return value;
            })
            .debounceTime(1000)
            .subscribe((value: string) => {
                if (value) {
                    this.domain.accountService.checkUserName(value).subscribe(
                        available => {
                            let error = available ? null : { 'usernameTaken': true };
                            this.registerForm.get('userName').setErrors(error);
                            this.registerForm.get('userName').markAsTouched();
                        },
                        err => {
                            this.registerForm.get('userName').setErrors({ 'usernameTaken': true });
                            this.registerForm.get('userName').markAsTouched();
                        }, () => {
                            this.checkingUserName = false;
                        });
                } else {
                    this.checkingUserName = false;
                }
            });
    }

    // Method that redirects the user to the previous page
    public goBack(): void {
        this.ionic.viewCtrl.dismiss(false);
    }

    // Method that sends the user information to the server
    public register(): void {
        this.submitAttempt = true;

        if (this.registerForm.valid) {
            this.helpers.showLoadingMessage().then(() => {
                // Create the model with the proper information
                this.model = this.getModelFromForm();

                this.domain.accountService.register(this.model).subscribe(() => {
                    this.helpers.hideLoadingMessage().then(() => {
                        this.showSuccessMessage(this.domain.translateService.instant('REGISTER_PAGE.SUCCESS_MESSAGE'));
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
    private showSuccessMessage(result: string): void {
        let callback = () => {
            this.helpers.hideAlertMessage().then(() => {
                this.ionic.viewCtrl.dismiss(true);
            });
        },
            buttonText = this.domain.translateService.instant('OK');
        this.helpers.showAlertMessageWithCallbacks('SUCCESS', result, [{ buttonText: buttonText, callback: callback }]);
    }

    // Method that creates the model with the information of the form
    private getModelFromForm(): RegisterModel {
        let model = new RegisterModel();

        model.firstName = this.registerForm.get('firstName').value;
        model.lastName = this.registerForm.get('lastName').value;
        model.email = this.registerForm.get('email').value;
        model.username = this.registerForm.get('userName').value;
        model.password = this.registerForm.get('password').value;

        return model;
    }
}