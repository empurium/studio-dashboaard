import { NgModule } from '@angular/core';
import { FreeScanModule } from '@freescan/skeleton';

// Core
import { environment } from '@env/environment';
import { AppRoutingModule } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';


@NgModule({
    imports: [
        AppRoutingModule,
        FreeScanModule.forRoot(environment),
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
