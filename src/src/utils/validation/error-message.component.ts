// Angular references
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

// Models and services
import { ValidationHelper } from './validation.helper';

@Component({
  selector: 'error-message',
  template: `<div class="error-message" *ngIf="showError">{{ errorMessage | translate:errorParameter }}</div>`
})
export class ErrorlMessage {
    @Input() submitted: boolean;
    @Input() name: string;
    @Input() control: FormControl;

    constructor() { }

    // Method that returns if the error should be shown or not
    get showError(): boolean {
        return this.control.errors && (this.control.touched || this.submitted);
    }

    // Method that returns the error message
    get errorMessage(): string {
        return ValidationHelper.getErrorMessageFromFormControl(this.control);
    }

    // Method that returns the parameters (if any) to be included in the error message
    get errorParameter(): any {
        return ValidationHelper.getErrorParameterFromFormControl(this.control, this.name);
    }
}