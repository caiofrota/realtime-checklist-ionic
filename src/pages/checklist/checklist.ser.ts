import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { IChecklist, IChecklistItem } from './'

/**
 * Checklist Service.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
@Injectable()
export class ChecklistService {
    /**
     * Constructor.
     * 
     * @param AngularFireDatabase _firebase Firebase database.
     */
    constructor(private _firebase: AngularFireDatabase) {
        // Do nothing.
    }
    
    /**
     * Get checklist.
     * 
     * @param string key Checklist key.
     * @return FirebaseObjectObservable<any> Checklist observable.
     */
    public getChecklist(key: string): FirebaseObjectObservable<IChecklist> {
        return this._firebase.object('/checklists/' + key);
    }

    /**
     * Create a checklist.
     * 
     * Return FirebaseObjectObservable<IChecklist> when success.
     * Return any when error.
     * 
     * @param checklistName Checklist name.
     * @param permanent If true, this list won't be removed.
     * @return any Observable.
     */
    public createChecklist(checklistName: string, permanent?: boolean): any {
        this.clearOldestChecklists();
        let listData: IChecklist = {
            name: checklistName,
            permanent: ((permanent) ? true : false),
            items: [],
            created_on: new Date().getTime(),
            updated_on: new Date().getTime(),
            last_access_on: new Date().getTime()
        }
        return Observable.create((observer: any) => {
            this._firebase.list('/checklists').push(listData).then(
                (item: any) => {
                    observer.next(this._firebase.object('/checklists/' + item.key));
                    observer.complete();
                },
                (error: any) => {
                    observer.error(error);
                }
            );
        }); 
    }

    /**
     * Remove non-permanent oldest lists.
     * 
     * Greater than 7 days.
     */
    public clearOldestChecklists(): void {
        // Find lists greated than 7 days.
        this._firebase.list('/checklists', {
            query: {
                endAt: (new Date().getTime() - (7*24*60*60*1000)), // 7 days.
                orderByChild: 'last_access_on'
            }
        }).subscribe((items: Array<IChecklist>) => {
            // Make sure the lists are non-permanents and remove them.
            for(let i in items) {
                if (!items[i].permanent) {
                    this._firebase.list('/checklists/' + items[i]['$key']).remove();
                }
            };
        });
    }

    /**
     * Get checklist items.
     * 
     * @param string key Checklist key.
     * @return FirebaseListObservable<IChecklistItem> Checklist observable.
     */
    public getChecklistItems(key: string): FirebaseListObservable<any> {
        return this._firebase.list('/checklists/' + key + '/items');
    }

    /**
     * Add a item into list.
     * 
     * Return IChecklistItem when success.
     * Return any when error.
     * 
     * @param key List key.
     * @param item Item to be added.
     * @return any Observable.
     */
    public addChecklistItem(key: string, item: string): any {
        let listItemData: IChecklistItem = {
            name: item,
            checked: false
        }
        return Observable.create((observer: any) => {
            this._firebase.list('/checklists/' + key + '/items').push(listItemData).then(
                (item: any) => {
                    console.log(item);
                    observer.next(listItemData);
                    observer.complete();
                },
                (error: any) => {
                    console.log(error);
                    observer.error(error);
                }
            );
        }); 
    }

    /**
     * Update checklist item.
     * 
     * @param string checklistKey Checklist key.
     * @param IChecklistItem checklistItem Item to be updated.
     */
    public updateChecklistItem(checklistKey: string, checklistItem: IChecklistItem): void {
        console.log(checklistItem['$key']);
        this._firebase.object('/checklists/' + checklistKey + '/items/' + checklistItem['$key']).set(checklistItem);
    }

    /**
     * Get checklist items.
     * 
     * @param string checklistKey Checklist key.
     * @param string itemKey Item key.
     */
    public removeChecklistItem(checklistKey: string, itemKey: string): void {
        this._firebase.list('/checklists/' + checklistKey + '/items/' + itemKey).remove();
    }
}
