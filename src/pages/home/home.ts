import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ContactPage } from '../list-add/list-add';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    user: string;
    items: FirebaseListObservable<any[]>;

    constructor(private _navCtrl: NavController,
                private _firebase: AngularFireDatabase) {
        
    }

    public searchList(): void {
        if (this.user != null) {
            localStorage.setItem('user', this.user);
            this.items = this._firebase.list('/checklists/' + this.user);
        }
    }

    addList(): void {
        this._navCtrl.push(ContactPage, { user: this.user });
    }

    removeList(list: string): void {
        this._firebase.list('/checklists/' + this.user).remove(list);
    }

    ngOnInit(): void {
        if (localStorage.getItem('user') != null) {
            this.user = localStorage.getItem('user');
        }
    }

}
