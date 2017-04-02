import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullLayoutComponent, UnavailableComponent } from '@freescan/skeleton';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    // All routes that appear within the FullLayout
    {
        path:      '',
        component: FullLayoutComponent,
        data:      {
            title: 'Home',
        },
        children:  [
            {
                path:      '',
                component: HomeComponent,
            },

            // 404
            {
                path:      '**',
                component: UnavailableComponent,
            },
        ],
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
