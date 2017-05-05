import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { MomentModule } from 'angular2-moment';
import { NgUploaderModule } from 'ngx-uploader';
import { StudioModule } from '@freescan/skeleton';

// Core
import { ArticlesRoutingModule } from './articles.routing';

// Components
import { ArticlesComponent } from './articles/articles.component';
import { ArticleComponent } from './article/article.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        MomentModule,
        NgUploaderModule,

        StudioModule,
        ArticlesRoutingModule,
    ],

    declarations: [
        ArticlesComponent,
        ArticleComponent,
    ],
})
export class ArticlesModule {
}
