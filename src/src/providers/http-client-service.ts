// Angular references
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

// Services
import { LanguageService } from './language-service';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';

@Injectable()
export class HttpClientService {

    private timeout: number;
    private apiKey: string;
    private apiUrl: string;

    constructor(@Inject(TOKEN_CONFIG) config: AppConfig,
                private http: Http, 
                private languageService: LanguageService) {
        this.timeout = config.timeout;
        this.apiKey = config.apiKey

        // Change the next line of code to use the local/staging/production api url
        this.apiUrl = config.apiUrlProduction;
    }

    // Method that returns the current api url
    public getApiUrl(): string {
        return this.apiUrl;
    }

    // Method that returns the api key
    public getApiKey(): string {
        return this.apiKey;
    }

    // Method that creates the header options for get requests
    private createGetHeaderOptions(authorizationToken: string, excludeKey: boolean): RequestOptions {
        let headers = new Headers();

        headers.append('accept-language', this.languageService.getLanguage())

        if(!excludeKey) {
            headers.append('X-ApiKey', this.apiKey);
        }
        if (authorizationToken) {
            headers.append('Authorization', `Bearer ${authorizationToken}`);
        }
        return new RequestOptions({ headers: headers });
    }

    // Method that creates the header options for post requests
    private createPostAndPutHeaderOptions(authorizationToken: string, contentType: string, excludeKey: boolean): RequestOptions {
        let headers = new Headers();
        headers.append('Content-Type', contentType);
        if (authorizationToken) {
            headers.append('Authorization', `Bearer ${authorizationToken}`);
        }
        if(!excludeKey) {
            headers.append('X-ApiKey', this.apiKey);
        }
        return new RequestOptions({ headers: headers });
    }

    // Base get method
    public get(url: string, authorizationToken: string = '', excludeKey: boolean = false): Observable<any> {
        const requestUrl = `${this.apiUrl}/${url}`;
        let options = this.createGetHeaderOptions(authorizationToken, excludeKey);
        return this.http.get(requestUrl, options).timeout(this.timeout, new Error('Timeout exceeded'));
    }

    // Base post method
    public post(url: string, data: any, authorizationToken: string = '', contentType: string = 'application/json', excludeKey: boolean = false): Observable<any> {
        const requestUrl = `${this.apiUrl}/${url}`;
        let options = this.createPostAndPutHeaderOptions(authorizationToken, contentType, excludeKey);
        return this.http.post(requestUrl, data, options).timeout(this.timeout, new Error('Timeout exceeded'));
    }

    // Base put method
    public put(url: string, data: any, authorizationToken: string = '', contentType: string = 'application/json', excludeKey: boolean = false): Observable<any> {
        const requestUrl = `${this.apiUrl}/${url}`;
        let options = this.createPostAndPutHeaderOptions(authorizationToken, contentType, excludeKey);
        return this.http.put(requestUrl, data, options).timeout(this.timeout, new Error('Timeout exceeded'));
    }
}