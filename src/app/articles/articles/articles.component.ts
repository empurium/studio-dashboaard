import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AlertService, ArticleService, Article, ArticlesResponse } from '@freescan/skeleton';


@Component({
    selector:    'pstudio-articles',
    templateUrl: './articles.component.html',
    styleUrls:   ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
    public _articles: Article[];

    constructor(private alerts: AlertService,
                private articles: ArticleService) {
    }

    public ngOnInit(): void {
        this.articles.all().subscribe(
            (response: ArticlesResponse) => this._articles = response.data,
            (error: any) => this.alerts.errorMessage(error),
        );
    }

    /**
     * Relative time since the article was posted.
     */
    public published(article: Article): string {
        return moment.utc(article.published_at).fromNow();
    }
}
