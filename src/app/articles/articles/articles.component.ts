import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AlertService, ArticleService, Article, ArticlesResponse } from '@freescan/skeleton';


@Component({
    selector:        'pstudio-articles',
    templateUrl:     './articles.component.html',
    styleUrls:       ['./articles.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent implements OnInit {
    public articles: Observable<Article[]>;
    public page: number     = 1;
    public limit: number    = 15;
    public total: number    = 0;
    public loading: boolean = true;

    constructor(private alerts: AlertService,
                private articlesService: ArticleService) {
    }

    public ngOnInit(): void {
        this.load();
    }

    /**
     * Get the articles for the given page.
     */
    public load(page: number = this.page): void {
        this.page    = page;
        this.loading = true;

        this.articles = this.articlesService
            .all(page, this.limit)
            .do(
                (response: ArticlesResponse) => {
                    this.loading = false;
                    this.total   = +_.get(response, 'meta.pagination.total');
                },
                (error: any) => this.alerts.errorMessage(error),
            )
            .map((response: ArticlesResponse) => response.data);
    }

    /**
     * Relative time since the article was posted.
     */
    public published(article: Article): string {
        return moment(article.published_at).fromNow();
    }
}
