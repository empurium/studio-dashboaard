import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnavailableComponent } from '@freescan/skeleton';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path:      '',
        component: HomeComponent,
    },
    {
        path:      'publications',
        loadChildren: './articles/articles.module',
    },

    // 404
    {
        path:      '**',
        component: UnavailableComponent,
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
