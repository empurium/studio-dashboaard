import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AlertService, ArticleService, Article, ArticlesResponse } from '@freescan/skeleton';


@Component({
    selector:    'pstudio-articles',
    templateUrl: './articles.component.html',
    styleUrls:   ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
    public articles: Article[];
    public page: number  = 1;
    public limit: number = 20;

    constructor(private alerts: AlertService,
                private articlesService: ArticleService) {
    }

    public ngOnInit(): void {
        this.articlesService
            .all(this.page, this.limit)
            .subscribe(
                (response: ArticlesResponse) => this.articles = response.data,
                (error: any) => this.alerts.errorMessage(error),
            );
    }

    /**
     * Relative time since the article was posted.
     */
    public published(article: Article): string {
        return moment(article.published_at).fromNow();
    }
}
