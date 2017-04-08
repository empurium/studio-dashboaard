import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AlertService, ArticleService, Article, ArticleResponse, TierService, Tier } from '@freescan/skeleton';


@Component({
    selector:    'pstudio-article',
    templateUrl: './article.component.html',
    styleUrls:   ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
    public article: Article = new Article();
    public tiers: Tier[];
    public tier: Tier;
    public loading: boolean = true;
    public froala: any = {
        toolbarStickyOffset: 60,
    };

    constructor(private route: ActivatedRoute,
                private router: Router,
                private alerts: AlertService,
                private tierService: TierService,
                private articleService: ArticleService) {
    }

    public ngOnInit(): void {
        this.loadArticle();
        this.loadTiers();
    }

    /**
     * Request the tiers for this white label so they can assign articles to them.
     */
    public loadTiers(): void {
        this.tierService.all().subscribe(
            (tiers: Tier[]) => this.tiers = tiers,
            (error: string) => this.alerts.error('Error', error),
        );
    }

    /**
     * Request the article if one was requested, otherwise this is a new article.
     */
    public loadArticle(): void {
        this.route.params
            .switchMap((params: Params) => {
                this.loading = !!params.id;
                return params.id ? this.articleService.one(params.id) : Observable.empty();
            })
            .subscribe((response: ArticleResponse) => {
                this.loading = false;
                this.article = response.data;
            });
    }

    /**
     * Either POST a new article or PUT the new contents.
     */
    public save(form: NgForm): void {
        this.overwrite(form.form.value);

        if (!this.article.id) {
            this.articleService
                .post(this.article)
                .subscribe(
                    (response: ArticleResponse) => {
                        this.alerts.success(null, 'Article has been saved.');
                        this.article = response.data;
                    },
                    (error: any) => this.alerts.errorMessage(error),
                );
            return;
        }

        this.articleService
            .put(this.article)
            .subscribe(
                (response: ArticleResponse) => this.alerts.success(null, 'Article has been saved.'),
                (error: any) => this.alerts.errorMessage(error),
            );
    }

    /**
     * Cancel the edit and navigate back.
     */
    public cancel(): void {
        this.router.navigate(['publications']);
    }

    /**
     * Overwrites the values from the form to the Article model before submission.
     */
    private overwrite(values: Article): void {
        _.each(values, (value: any, key: string) => {
            this.article[key] = value;
        });
    }
}
