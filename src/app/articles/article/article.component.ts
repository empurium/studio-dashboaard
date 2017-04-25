import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import {
    AuthenticationService,
    AlertService,
    PeopleService,
    Person,
    PeopleResponse,
    ArticleService,
    Article,
    ArticleResponse,
    TierService,
    Tier,
    TierResourceService,
    TierResource,
} from '@freescan/skeleton';


@Component({
    selector:      'pstudio-article',
    templateUrl:   './article.component.html',
    styleUrls:     ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
    public article: Article     = new Article();
    public tiers: Tier[];
    public tier: Tier;
    public people: Person[];
    public loading: boolean     = true;
    public saving: boolean      = false;
    public momentPublished: any = moment();
    public froala: any          = {
        toolbarStickyOffset: 60,
    };

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authentication: AuthenticationService,
                private alerts: AlertService,
                private peopleService: PeopleService,
                private tierService: TierService,
                private tierResourceService: TierResourceService,
                private articleService: ArticleService) {
    }

    public ngOnInit(): void {
        this.loadArticle();
        this.loadTiers();
        this.loadPeople();
    }

    /**
     * Request the tiers for this white label so they can assign articles to them.
     */
    public loadTiers(): void {
        this.tierService.all().subscribe(
            (tiers: Tier[]) => this.tiers = tiers,
            (error: string) => this.alerts.warning(
                null, 'There are no payment tiers available to assign to.',
            ),
        );
    }

    /**
     * Request the tiers for this white label so they can assign articles to them.
     */
    public loadTierResources(): void {
        this.tierResourceService.for(this.article.id).subscribe(
            (tiers: TierResource[]) => {
                // nothing yet
            },
            (error: string) => this.alerts.warning(
                null, 'There are no payment tiers available to assign to.',
            ),
        );
    }

    /**
     * Request the people for this white label so they can assign articles to them.
     */
    public loadPeople(): void {
        this.peopleService.all().subscribe(
            (people: PeopleResponse) => this.people = people.data,
            (error: string) => this.alerts.warning(
                null, 'There are People available to assign to.',
            ),
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
                this.loadTierResources();
            });
    }

    /**
     * Either POST a new article or PUT the new contents.
     */
    public store(form: NgForm): void {
        this.saving = true;
        this.overwrite(form.form.value);
        this.setPublishedAt(this.article.published_at);

        if (!this.article.id) {
            this.setPersonId();
            this.post();

            return;
        }

        this.put();
    }

    /**
     * Store the Tier Resource if it was specified.
     */
    public storeTierResource(): void {
        this.tierResourceService
            .post(this.tier, this.article.id)
            .finally(() => this.saving = false)
            .subscribe(
                (response: TierResource) => {
                    // this.tier = response;
                    this.alerts.success(null, 'Article has been saved.');
                    this.router.navigate([`../edit/${this.article.id}`], { relativeTo: this.route });
                },
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
     * Convert the published_at date the user entered to UTC for the API.
     * Template uses this.
     */
    public setPublishedAt(datetime: string): void {
        this.article.published_at = moment(datetime).utc().format('YYYY-MM-DD\THH:mm:ssZZ');
    }

    /**
     * Return the User ID of the currently logged in user.
     */
    private setPersonId(): void {
        this.article.person_id = this.authentication.userId();
    }

    /**
     * POST the article.
     */
    private post(): void {
        this.articleService
            .post(this.article)
            .finally(() => this.saving = false)
            .subscribe(
                (response: ArticleResponse) => {
                    this.article = response.data;
                    this.alerts.success(null, 'Article has been saved.');
                    this.router.navigate([`../edit/${this.article.id}`], { relativeTo: this.route });
                },
                (error: any) => this.alerts.errorMessage(error),
            );
    }

    /**
     * PUT the article.
     */
    private put(): void {
        this.articleService
            .put(this.article)
            .finally(() => this.saving = false)
            .subscribe(
                (response: ArticleResponse) => {
                    this.alerts.success(null, 'Article has been saved.');
                },
                (error: any) => this.alerts.errorMessage(error),
            );
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
