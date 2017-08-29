import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export const AppFirebaseConfig = {
    apiKey: 'AIzaSyCiBCRgjPa46jz87CIzkygUpnKrkXGM_gg',
    authDomain: 'fortdev-checklist.firebaseapp.com',
    databaseURL: 'https://fortdev-checklist.firebaseio.com',
    storageBucket: 'fortdev-checklist',
    messagingSenderId: '739075733966'
};

/**
 * Application Configuration Provider.
 */
@Injectable()
export class AppConfigProvider {
    constructor(public http: Http) {
        console.log('Hello AppConfigProvider Provider');
    }
}
