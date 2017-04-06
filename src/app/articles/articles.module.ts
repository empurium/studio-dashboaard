import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core
import { ArticlesRoutingModule } from './articles.routing';

// Components
import { ArticlesComponent } from './articles.component';
import { ArticleComponent } from './article/article.component';


@NgModule({
    imports: [
        CommonModule,
        ArticlesRoutingModule,
    ],

    declarations: [
        ArticlesComponent,
        ArticleComponent,
    ],
})
export default class ArticlesModule {
}
