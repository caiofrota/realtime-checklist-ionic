import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { ChecklistService, ChecklistController, IChecklist } from '../checklist';

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})
export class HomeController implements OnInit {
    // Constants.
    private LOCAL_STORAGE_LISTKEYS = 'fd.checklists';

    // Page attributes.
    listName: string;
    //checklists: Array<FirebaseObjectObservable<IChecklist>>;
    checklists: Array<any>;
    filteredList: Array<any>;

    /**
     * Constructor.
     * 
     * @param NavController _navCtrl Navigation Controller.
     * @param ChecklistService _checklistService Checlist Service.
     * @param AlertController _alertController Alert controller.
     */
    constructor(private _navCtrl: NavController,
                private _checklistService: ChecklistService,
                private _alertController: AlertController,
                private _toastCtrl: ToastController) {
        //_checklistService.teste();
    }

    teste() {
        console.log(this.listName);
        this.filteredList = this.checklists.filter((checklist) => checklist.name.indexOf(this.listName) !== -1);
    }

    /**
     * Exibe um popup para criar uma lista.
     */
    public createChecklist(): void {
        let prompt = this._alertController.create({
            title: 'Criar Lista',
            message: 'Insira o título da lista a ser criada.<br/>Ex: Lista de Compras',
            inputs: [{
                name: 'checklistTitle',
                placeholder: 'Título da lista.'
            }],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data: any) => { }
                },
                {
                    text: 'Criar',
                    handler: (data: any) => {
                        this._checklistService.createChecklist(data.checklistTitle).subscribe(
                            (checklist: FirebaseObjectObservable<IChecklist>) => {
                                this.checklists.push(checklist);
                                this._navCtrl.push(ChecklistController, { checklist });
                                this.refreshLocalStorage();
                                this.refreshLists();
                                let toast: any = this._toastCtrl.create({
                                    message: 'Lista criada com sucesso.',
                                    duration: 3000
                                });
                                toast.present();
                            },
                            (error) => {
                                let toast: any = this._toastCtrl.create({
                                    message: 'Ocorreu um erro na criação da lista.',
                                    duration: 3000
                                });
                                toast.present();
                            }
                        );
                    }
                }
            ]
        });
        prompt.present();
    }

    /**
     * Exibe um popup para importar uma lista passando o código.
     */
    public importChecklist(): void {
        let prompt = this._alertController.create({
            title: 'Importar Lista',
            message: 'Cole o código da lista que deseja importar.<br/>Ex: -KsnibokCYzTcCG4tp8p',
            inputs: [{
                name: 'checklistKey',
                placeholder: 'Chave da lista.'
            }],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data: any) => { }
                },
                {
                    text: 'Importar',
                    handler: (data: any) => {
                        let checklist: FirebaseObjectObservable<IChecklist> = this._checklistService.getChecklist(data.checklistKey)
                        console.log(checklist);
                        checklist.subscribe(
                            (data: IChecklist) => {
                                if (!data['$exists']()) {
                                    let toast: any = this._toastCtrl.create({
                                        message: 'Não foi possível encontrar a lista informada.',
                                        duration: 3000
                                    });
                                    toast.present();
                                } else {
                                    this.checklists.push({name: data.name, value: checklist});
                                    this.refreshLocalStorage();
                                    this.refreshLists();
                                    let toast: any = this._toastCtrl.create({
                                        message: 'Lista importada com sucesso.',
                                        duration: 3000
                                    });
                                    toast.present();
                                }
                            },
                            (error) => {
                                let toast: any = this._toastCtrl.create({
                                    message: 'Ocorreu um erro na importação da lista.',
                                    duration: 3000
                                });
                                toast.present();
                            }
                        );
                    }
                }
            ]
        });
        prompt.present();
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
            let i: number = this.checklists.push({name: item.$ref.key, value: item});
            console.log(i);
            item.subscribe(
                (data: IChecklist) => {
                    if (!data['$exists']()) {
                        this.removeList(item);
                    } else {
                        this.checklists[i-1]['name'] = data.name;
                    }
                }
            );
        });
        this.checklists.sort((a, b) => {
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });
        this.filteredList = this.checklists;
    }

    /**
     * Refresh localStorage from checklists.
     */
    private refreshLocalStorage(): void {
        let localStorageJSON = [];
        this.checklists.forEach((data: any) => {
            console.log(data);
            let key = data.value.$ref.key; 
            if (data.value.$ref.key.indexOf('checklists') >= 0) {
                key = key.substring(key.indexOf('checklists') + 10);
            }
            localStorageJSON.push(key);
        });
        localStorage.setItem(this.LOCAL_STORAGE_LISTKEYS, JSON.stringify(localStorageJSON));
    }

    public filter() {
        //console.log(this.checklists[0]['take'](1));
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
