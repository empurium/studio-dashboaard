import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnavailableComponent, ArticlesComponent, ArticleComponent } from '@freescan/skeleton';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path:         'publications',
        loadChildren: './articles/articles.module#ArticlesModule',
    },
    {
        path:         'authors',
        loadChildren: './people/people.module#PeopleModule',
    },

    // Home matches empty :slug param, so load last
    {
        path:      '',
        component: HomeComponent,
        children:  [
            {
                path:      '',
                component: ArticlesComponent,
            },
            {
                path:      ':slug',
                component: ArticleComponent,
            },
        ],
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
