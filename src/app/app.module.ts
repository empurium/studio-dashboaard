import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FREESCAN_ENV, DashboardModule, StudioModule, ArticlesModule } from '@rndstudio/skeleton';

// Core
import { environment } from '@env/environment';
import { AppRoutingModule } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ArticleWrapperComponent } from './article-wrapper/article-wrapper.component';


@NgModule({
    imports: [
        BrowserModule, // Do not use with Universal
        BrowserAnimationsModule,

        AppRoutingModule,
        StudioModule.forRoot(),
        ArticlesModule.forRoot(),
        DashboardModule,
    ],

    declarations: [
        AppComponent,
        HomeComponent,
        ArticleWrapperComponent,
    ],

    providers: [
        { provide: FREESCAN_ENV, useValue: environment },
    ],

    bootstrap: [AppComponent],
})
export class AppModule {
}
