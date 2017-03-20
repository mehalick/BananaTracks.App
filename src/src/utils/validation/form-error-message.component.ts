// Angular references
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// Models and services
import { ValidationHelper } from './validation.helper';

@Component({
  selector: 'form-error-message',
  template: `<div class="error-message" *ngIf="showError">{{ errorMessage | translate }}</div>`
})
export class FormErrorMessage {
    @Input() submitted: boolean;
    @Input() form: FormGroup;
    @Input() name: string;
    @Input() control: FormControl;

    constructor() { }

    // Method that returns if the error should be shown or not
    get showError(): boolean {
        // We show the error related to the form only if the control does not have an error
        return !this.control.errors && this.form.errors && (this.control.touched || this.submitted);
    }

    // Method that returns the error message
    get errorMessage() {
        for (let errorName in this.form.errors) { 
            return ValidationHelper.getErrorTypeName(errorName);
        }
        return null;
    }
}