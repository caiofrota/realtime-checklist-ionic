import { Component, OnInit, Pipe, PipeTransform, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { IChecklist, IChecklistItem, ChecklistService } from './'

/**
 * Checklist Controller.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
@Component({
    selector: 'checklist',
    templateUrl: 'checklist.html'
})
export class ChecklistController implements OnInit {
    // Page attributes.
    itemValue: string;
    checklist: FirebaseObjectObservable<IChecklist>;
    checklistItems: FirebaseListObservable<IChecklistItem>;

    /**
     * Constructor.
     * 
     * @param NavController _navCtrl Navigation Controller.
     * @param NavParams _navParams Navigation Parameters.
     * @param ChecklistService _checklistService Checklist Service.
     */
    constructor(private _navCtrl: NavController,
                private _navParams: NavParams,
                private _checklistService: ChecklistService,
                private _alertController: AlertController) {
        // Do nothing.
    }

    /**
     * Add checklist item.
     * 
     * @param string itemValue Item to be added.
     */
    public createChecklistItem(itemValue: string): void {
        if (itemValue != null) {
            this._checklistService.addChecklistItem(this.checklist.$ref.key, itemValue).subscribe(
                (data) => {
                    console.log(data);
                }
            );
        }
    }

    /**
     * Remove checklist item.
     * 
     * @param any list Item to be removed.
     */
    public removeChecklistItem(item: IChecklistItem): void {
        this._checklistService.removeChecklistItem(this.checklist.$ref.key, item['$key']);
    }
    
    /**
     * Toggle checked item.
     * 
     * @param any list Item to be removed.
     */
    public toggleChecklistItemChecked(item: IChecklistItem): void {
        item.checked = !item.checked;
        this._checklistService.updateChecklistItem(this.checklist.$ref.key, item);
    }

    public shareChecklist(): void {
        let prompt = this._alertController.create({
            title: 'Compartilhar Lista',
            message: 'Copie o código da lista e compartilhe com quem você quiser!',
            inputs: [{
                name: 'checklistKey',
                placeholder: 'Chave da lista.',
                value: this.checklist.$ref.key
            }],
            buttons: [
                {
                    text: 'Pronto!',
                    handler: (data: any) => { }
                }
            ]
        });
        prompt.present();
    }

    /**
     * Post-constructor.
     * 
     * Update checklist and checklistItems.
     */
    ngOnInit(): void {
        this.checklist = this._navParams.get('checklist');
        this.checklistItems = this._checklistService.getChecklistItems(this.checklist.$ref.key);
    }
}
