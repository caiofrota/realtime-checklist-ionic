import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { HomeService } from './home.ser';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomeController implements OnInit {
    // Constants.
    private LOCAL_STORAGE_LISTKEYS = 'fd.checklists';

    listName: string;
    lists: Array<string>;
    items: FirebaseListObservable<any[]>;
    teste: FirebaseObjectObservable<any>;
    name: string;

    constructor(private _navCtrl: NavController,
                private _firebase: AngularFireDatabase,
                private _homeService: HomeService) {
        
    }

    /**
     * Add list.
     */
    public addList(): void {
        this._homeService.addList(this.listName).subscribe(
            (data: any) => {
                let checklists: Array<string> = this.getListKeys();
                checklists.push(data.key);
                this.setListKeys(checklists);
                this.lists = this.getListKeys();
            }
        );
    }

    /**
     * Remove list.
     * 
     * @param string list List to be removed.
     */
    public removeList(list: string): void {
        let index: number = this.lists.indexOf(list);
        if (index !== -1) {
            this.lists.splice(index, 1);
        }
        this.setListKeys(this.lists);
    }

    /**
     * Get list keys.
     * 
     * @return Array<string> List keys.
     */
    private getListKeys(): Array<string> {
        return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_LISTKEYS));
    }

    /**
     * Define list keys.
     * 
     * @param Array<string> listKeys List keys.
     */
    private setListKeys(listKeys: Array<string>): void {
        localStorage.setItem(this.LOCAL_STORAGE_LISTKEYS, JSON.stringify(listKeys));
    }

    /**
     * Post-constructor.
     */
    ngOnInit(): void {
        if (!localStorage.getItem(this.LOCAL_STORAGE_LISTKEYS)) {
            localStorage.setItem(this.LOCAL_STORAGE_LISTKEYS, '[]');
        }
        this.lists = this.getListKeys();
    }

}
