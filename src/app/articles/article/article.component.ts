import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ArticleService, Article, ArticleResponse, TierService, Tier } from '@freescan/skeleton';


@Component({
    selector:    'pstudio-article',
    templateUrl: './article.component.html',
    styleUrls:   ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
    public _article: Article = new Article();
    public _tiers: Tier[];
    public _tier: Tier;
    public loading: boolean = true;

    constructor(private route: ActivatedRoute,
                private tiers: TierService,
                private articles: ArticleService) {
    }

    public ngOnInit(): void {
        this.loadArticle();
        this.loadTiers();
    }

    /**
     * Request the tiers for this white label so they can assign articles to them.
     */
    public loadTiers(): void {
        this.tiers.all().subscribe(
            (tiers: Tier[]) => this._tiers = tiers,
            (error: string) => console.error(error),
        );
    }

    /**
     * Request the article if one was requested, otherwise this is a new article.
     */
    public loadArticle(): void {
        this.route.params
            .switchMap((params: Params) => {
                this.loading = !!params.id;
                return params.id ? this.articles.one(params.id) : Observable.empty();
            })
            .subscribe((response: ArticleResponse) => {
                this.loading = false;
                this._article = response.data;
            });
    }

    /**
     * Either POST a new article or PUT the new contents.
     */
    public save(form: NgForm): void {
        this.overwrite(form.form.value);

        if (!this._article.id) {
            this.articles
                .post(this._article)
                .subscribe(
                    (response: ArticleResponse) => this._article = response.data,
                    (error: string) => console.error(error),
                );
            return;
        }

        this.articles
            .put(this._article)
            .subscribe(
                () => {},
                (error: string) => console.error(error),
            );
    }

    /**
     * Overwrites the values from the form to the Article model before submission.
     */
    public overwrite(values: Article): void {
        _.each(values, (value: any, key: string) => {
            this._article[key] = value;
        });
    }
}
