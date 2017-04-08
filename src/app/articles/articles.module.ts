import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';

// Core
import { ArticlesRoutingModule } from './articles.routing';

// Components
import { ArticlesComponent } from './articles.component';
import { ArticleComponent } from './article/article.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        ArticlesRoutingModule,
    ],

    declarations: [
        ArticlesComponent,
        ArticleComponent,
    ],
})
export class ArticlesModule {
}
