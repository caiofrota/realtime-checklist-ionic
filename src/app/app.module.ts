import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppConfigProvider, AppFirebaseConfig } from '../providers/app-config/app-config';
import { HomeController, HomeService } from '../pages/home';

@NgModule({
    declarations: [
        MyApp,
        HomeController,
        TabsPage
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
        TabsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AppConfigProvider,
        HomeService
    ]
})
export class AppModule {}
