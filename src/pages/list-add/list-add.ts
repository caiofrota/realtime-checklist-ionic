import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'list-add',
    templateUrl: 'list-add.html'
})
export class ContactPage {

    private user: string;
    listName: string;

    constructor(private _navCtrl: NavController,
                private _firebase: AngularFireDatabase,
                private _navParams: NavParams) {
                    console.log(this._navParams.get('user'));
        this.user = this._navParams.get('user');
    }

    addList(): void {
        this._firebase.list('/checklists/' + this.user).push(this.listName);
        this._navCtrl.pop();
    }

}
