import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticlesComponent } from './articles.component';
import { ArticleComponent } from './article/article.component';

export const routes: Routes = [
    {
        path:      '',
        component: ArticlesComponent,
    },
    {
        path:      'new',
        component: ArticleComponent,
    },
    {
        path:      'edit/:id',
        component: ArticleComponent,
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ArticlesRoutingModule {
}
