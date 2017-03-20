// Angular references
import { FormControl } from '@angular/forms';

export class ValidationHelper {

    // Method that returns the name of the error type, to be used with ng2 translate
    static getErrorTypeName(errorType: string): string {
        switch (errorType) {
            case 'required':
                return 'VALIDATIONS.REQUIRED';
            case 'invalidEmailAddress':
                return 'VALIDATIONS.INVALID_EMAIL_ADDRESS';
            case 'invalidPassword':
                return 'VALIDATIONS.INVALID_PASSWORD';
            case 'passwordsDoNotMatch':
                return 'VALIDATIONS.PASSWORDS_DO_NOT_MATCH';
            case 'minlength':
                return 'VALIDATIONS.MIN_LENGTH';
            case 'maxlength':
                return 'VALIDATIONS.MAX_LENGTH';
            case 'usernameTaken':
                return 'VALIDATIONS.USERNAME_TAKEN';
            case 'invalidUserName':
                return 'VALIDATIONS.INVALID_USERNAME';
            default:
                return 'VALIDATIONS.INVALID_FIELD';
        }
    }

    // Method that returns the error type name (if any) from the control sent as parameter
    static getErrorMessageFromFormControl(control: FormControl): string {
        let errorCode: string;
        for (let errorName in control.errors) {
            errorCode = this.getErrorTypeName(errorName);
        }
        return errorCode;
    }

    // Method that returns a parameter (if any) that should be added in the error from the control sent as parameter
    static getErrorParameterFromFormControl(control: FormControl, fieldName: string): any {
        let errorCode: string, param: any = { value: '' };
        for (let errorName in control.errors) {
            errorCode = this.getErrorTypeName(errorName);

            if (errorCode === this.getErrorTypeName('required')) {
                // If the error is because a required field, we add the name of the field as parameter 
                // to show it in the error message
                param.value = fieldName;
            } else if (errorCode === this.getErrorTypeName('minlength') || errorCode === this.getErrorTypeName('maxlength')) {
                    param.value = control.errors[errorName].requiredLength;
            } else if (control.errors[errorName]) {
                // If the control has information about the error (like the min or max length of the field)
                // we add that information to the error message
                param.value = control.errors[errorName];
            }
        }
        return param;
    }

    // Validation for email fields
    static emailValidator(control): any {
        // RFC 2822 compliant regex
        if(control.value === '') {
            return { 'required': true };
        } else if (control.value === '' || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    // Validation for password fields
    static passwordValidator(control): any {
        // {6,100}: Assert password is between 6 and 100 characters
        if(control.value === '') {
            return { 'required': true };
        } else if (control.value.match(/^[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    // Validation for matching passwords
    // NOTE: As of now, this validation requires both controls to be named 'password' and 'confirmPassword'
    static matchingPasswordsValidator(controlGroup) {
        let passwordControl = controlGroup.get('password');
        let confirmPasswordControl = controlGroup.get('confirmPassword');

        // If the password field is not valid, we don't show this error message
        if (passwordControl.valid && passwordControl.value !== confirmPasswordControl.value) {
            return { 'passwordsDoNotMatch': true };
        } else {
            return null;
        }
    }

    // Validation for user name fields
    static userNameValidator(control): any {
        if(control.value === '') {
            return { 'required': true };
        } else if ( control.value.match(/^[a-zA-Z0-9-\._]+$/)) {
            return null;
        } else {
            return { 'invalidUserName': true };
        }
    }
}