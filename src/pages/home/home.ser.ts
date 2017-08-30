import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

/**
 * Home service.
 */
@Injectable()
export class HomeService {

    constructor(private _firebase: AngularFireDatabase) {
        
    }

    public addList(listName: string): any {
        let listData = {
            name: listName,
            creation: new Date().getTime()
        }
        return Observable.create((observer: any) => {
            this._firebase.list('/checklists').push(listData).then(
                (item: any) => {
                    observer.next(item);
                    observer.complete();
                },
                (error: any) => {
                    observer.error(error);
                }
            );
        }); 
    }
}
