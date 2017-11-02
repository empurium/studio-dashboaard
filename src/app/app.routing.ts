import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnavailableComponent, ArticleComponent } from '@rndstudio/skeleton';

import { HomeComponent } from './home/home.component';
import { ArticleWrapperComponent } from './article-wrapper/article-wrapper.component';

export const routes: Routes = [
    // Articles on Home
    {
        path:      '',
        component: HomeComponent,
    },
    {
        path:     'article',
        component: ArticleWrapperComponent,
        children:  [
            {
                path:      ':slug',
                component: ArticleComponent,
            },
        ],
    },

    {
        path:         'publications',
        loadChildren: './articles/articles.module#ArticlesModule',
    },
    {
        path:         'authors',
        loadChildren: './people/people.module#PeopleModule',
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
