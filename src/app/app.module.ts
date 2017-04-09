import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule, FreeScanModule } from '@freescan/skeleton';

// Core
import { environment } from '@env/environment';
import { AppRoutingModule } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';


@NgModule({
    imports: [
        BrowserModule, // Do not use with Universal
        BrowserAnimationsModule,

        AppRoutingModule,
        FreeScanModule.forRoot(environment),
        DashboardModule,
    ],

    declarations: [
        AppComponent,
        HomeComponent,
    ],

    providers: [],

    bootstrap: [AppComponent],
})
export class AppModule {
}
