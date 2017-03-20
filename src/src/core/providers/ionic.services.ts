// Angular references
import { Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Ionic references
import {
    App,
    Platform,
    NavController,
    ViewController,
    LoadingController,
    ModalController,
    MenuController,
    Events,
    NavParams,
    AlertController
} from 'ionic-angular';

export class IonicServices {

    private _app: App;
    private _navCtrl: NavController;
    private _menuCtrl: MenuController;
    private _viewCtrl: ViewController;
    private _loadingCtrl: LoadingController;
    private _alertCtrl: AlertController;
    private _eventsCtrl: Events;
    private _paramCtrl: NavParams;
    private _modalCtrl: ModalController;
    private _platform: Platform;
    private _sanitizer: DomSanitizer;

    constructor(private _injector: Injector) { }

    // Platform
    // http://ionicframework.com/docs/v2/api/platform/Platform/
    public get platform(): Platform {
        if (!this._platform) {
            this._platform = this._injector.get(Platform);
        }
        return this._platform;
    }

    // App
    // http://ionicframework.com/docs/v2/api/components/app/App/
    public get app(): App {
        if (!this._app) {
            this._app = this._injector.get(App);
        }
        return this._app;
    }

    // NavController
    // http://ionicframework.com/docs/v2/api/navigation/NavController/
    public get navCtrl(): NavController {
        if (!this._navCtrl) {
            this._navCtrl = this._injector.get(NavController);
        }
        return this._navCtrl;
    }

    // MenuController
    // http://ionicframework.com/docs/v2/api/components/menu/MenuController/
    public get menuCtrl(): MenuController {
        if (!this._menuCtrl) {
            this._menuCtrl = this._injector.get(MenuController);
        }
        return this._menuCtrl;
    }

    // ViewController
    // http://ionicframework.com/docs/v2/api/navigation/ViewController/
    public get viewCtrl(): ViewController {
        if (!this._viewCtrl) {
            this._viewCtrl = this._injector.get(ViewController);
        }
        return this._viewCtrl;
    }

    // LoadingController
    // http://ionicframework.com/docs/v2/api/components/loading/LoadingController/
    public get loadingCtrl(): LoadingController {
        if (!this._loadingCtrl) {
            this._loadingCtrl = this._injector.get(LoadingController);
        }
        return this._loadingCtrl;
    }

    // AlertController
    // http://ionicframework.com/docs/v2/api/components/alert/AlertController/
    public get alertCtrl(): AlertController {
        if (!this._alertCtrl) {
            this._alertCtrl = this._injector.get(AlertController);
        }
        return this._alertCtrl;
    }

    // ModalController
    // http://ionicframework.com/docs/v2/api/components/modal/ModalController/
    public get modalCtrl(): ModalController {
        if (!this._modalCtrl) {
            this._modalCtrl = this._injector.get(ModalController);
        }
        return this._modalCtrl;
    }

    // Events
    // http://ionicframework.com/docs/v2/api/util/Events/
    public get eventsCtrl(): Events {
        if (!this._eventsCtrl) {
            this._eventsCtrl = this._injector.get(Events);
        }
        return this._eventsCtrl;
    }

    // NavParams
    // http://ionicframework.com/docs/v2/api/navigation/NavParams/
    public get paramCtrl(): NavParams {
        if (!this._paramCtrl) {
            this._paramCtrl = this._injector.get(NavParams);
        }
        return this._paramCtrl;
    }

    // DomSanitizer
    // https://angular.io/docs/ts/latest/api/platform-browser/index/DomSanitizer-class.html
    public get sanitizer(): DomSanitizer {
        if (!this._sanitizer) {
            this._sanitizer = this._injector.get(DomSanitizer);
        }
        return this._sanitizer;
    }
}