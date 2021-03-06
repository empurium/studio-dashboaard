import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { MomentModule } from 'angular2-moment';
import { NgUploaderModule } from 'ngx-uploader';
import { NgxPaginationModule } from 'ngx-pagination';
import { StudioModule } from '@rndstudio/skeleton';

// Core
import { ArticlesRoutingModule } from './articles.routing';

// Components
import { ArticlesComponent } from './articles/articles.component';
import { ArticleComponent } from './article/article.component';
import { TierResourceComponent } from './tier-resource/tier-resource.component';
import { FilesComponent } from './files/files.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CKEditorModule,
        MomentModule,
        NgUploaderModule,
        NgxPaginationModule,

        StudioModule,
        ArticlesRoutingModule,
    ],

    declarations: [
        ArticlesComponent,
        ArticleComponent,
        TierResourceComponent,
        FilesComponent,
    ],
})
export class ArticlesModule {
}
