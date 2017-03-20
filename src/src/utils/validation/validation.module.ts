// Angular references
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { CommonModule } from '@angular/common';

// Custom components
import { ErrorlMessage } from './error-message.component';
import { FormErrorMessage } from './form-error-message.component';

// Ng2 Translate references
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';

// Ng2 Translate Loader
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    declarations: [
        ErrorlMessage,
        FormErrorMessage
    ],
    exports: [
        ErrorlMessage,
        FormErrorMessage
    ]
})
export class ValidationModule { }