import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { ChecklistService, ChecklistController, IChecklist } from '../checklist';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomeController implements OnInit {
    // Constants.
    private LOCAL_STORAGE_LISTKEYS = 'fd.checklists';

    // Page attributes.
    listName: string;
    checklists: Array<FirebaseObjectObservable<IChecklist>>;

    /**
     * Constructor.
     * 
     * @param NavController _navCtrl Navigation Controller.
     * @param ChecklistService _checklistService Checlist Service.
     */
    constructor(private _navCtrl: NavController,
                private _checklistService: ChecklistService) {
        
    }

    /**
     * Add checklist.
     */
    public addList(): void {
        this._checklistService.createChecklist(this.listName).subscribe(
            (checklist: FirebaseObjectObservable<IChecklist>) => {
                this.checklists.push(checklist);
                this._navCtrl.push(ChecklistController, { checklist });
                this.refreshLocalStorage();
                this.refreshLists();
            }
        );
    }

    /**
     * Edit checklist.
     * 
     * @param FirebaseObjectObservable<IChecklist> checklist Checklist
     */
    public editList(checklist: FirebaseObjectObservable<IChecklist>): void {
        this._navCtrl.push(ChecklistController, { checklist: checklist });
    }

    /**
     * Remove checklist.
     * 
     * @param string list List to be removed.
     */
    public removeList(checklist: FirebaseObjectObservable<IChecklist>): void {
        let index: number = this.checklists.indexOf(checklist);
        if (index !== -1) {
            this.checklists.splice(index, 1);
        } 
        this.refreshLocalStorage();
    }

    /**
     * Refresh checklists from localStorage.
     */
    private refreshLists(): void {
        this.checklists = [];
        let keys: Array<string> = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_LISTKEYS));
        keys.forEach((key) => {
            let item: FirebaseObjectObservable<IChecklist> = this._checklistService.getChecklist(key);
            this.checklists.push(item);
            item.subscribe(
                (data: IChecklist) => {
                    if (!data['$exists']()) {
                        console.log('Removed');
                        this.removeList(item);
                    }
                }
            );
        });
    }

    /**
     * Refresh localStorage from checklists.
     */
    private refreshLocalStorage(): void {
        let localStorageJSON = [];
        this.checklists.forEach((data: FirebaseObjectObservable<IChecklist>) => {
            let key = data.$ref.key; 
            if (data.$ref.key.indexOf('checklists') >= 0) {
                key = key.substring(key.indexOf('checklists') + 10);
            }
            localStorageJSON.push(key);
        });
        localStorage.setItem(this.LOCAL_STORAGE_LISTKEYS, JSON.stringify(localStorageJSON));
    }

    /**
     * Post-constructor.
     * 
     * Refresh checklists.
     */
    ngOnInit(): void {
        if (!localStorage.getItem(this.LOCAL_STORAGE_LISTKEYS)) {
            localStorage.setItem(this.LOCAL_STORAGE_LISTKEYS, '[]');
        }
        this.refreshLists();
    }

}
