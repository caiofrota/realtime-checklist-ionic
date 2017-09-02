import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppConfigProvider, AppFirebaseConfig } from '../providers/app-config/app-config';

import { HomeController } from '../pages/home';
import { ChecklistService, ChecklistController } from '../pages/checklist';

@NgModule({
    declarations: [
        MyApp,
        HomeController,
        ChecklistController
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(AppFirebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule
    ],
    bootstrap: [IonicApp],
        entryComponents: [
        MyApp,
        HomeController,
        ChecklistController
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AppConfigProvider,
        ChecklistService
    ]
})
export class AppModule {}
