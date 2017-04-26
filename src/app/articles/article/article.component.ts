import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import {
    AuthenticationService,
    AlertService,
    Person,
    PeopleService,
    PeopleResponse,
    Article,
    ArticleService,
    ArticleResponse,
    Tier,
    TierService,
    TierResource,
    TierResourceService,
    TierResourceResponse,
} from '@freescan/skeleton';


@Component({
    selector:      'pstudio-article',
    templateUrl:   './article.component.html',
    styleUrls:     ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
    public people: Person[];
    public tiers: Tier[];
    public tierId: string;
    public tierResources: TierResource[];
    public article: Article     = new Article();
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
     * Request the article if one was requested, otherwise this is a new article.
     */
    public loadArticle(): void {
        this.route.params
            .switchMap((params: Params) => {
                this.loading = !!params.id;
                if (params.id) {
                    this.loadTierResources(params.id);
                }

                return params.id ? this.articleService.one(params.id) : Observable.empty();
            })
            .subscribe(
                (response: ArticleResponse) => {
                    this.loading = false;
                    this.article = response.data;
                    this.setMomentPublished();
                },
                (error: string) => this.alerts.error(null, 'Could not locate this article.'),
            );
    }

    /**
     * Request the tiers for this white label so they can assign articles to them.
     */
    public loadTiers(): void {
        this.tierService
            .all()
            .subscribe(
                (tiers: Tier[]) => {
                    this.tiers = tiers;
                    this.setTierId();
                },
                (error: string) => this.alerts.warning(
                    null, 'There are no payment tiers available to assign to.',
                ),
            );
    }

    /**
     * Request the Tier Resource for a given article.
     */
    public loadTierResources(articleId: string): void {
        this.tierResourceService
            .for(articleId)
            .subscribe(
                (tierResources: TierResource[]) => {
                    this.tierResources = tierResources;
                    this.setTierId();
                },
                (error: string) => this.alerts.warning(
                    null, 'Error loading Payment Tier Resources for this publication.',
                ),
            );
    }

    /**
     * Request the people for this white label so they can assign articles to them.
     */
    public loadPeople(): void {
        this.peopleService.all().subscribe(
            (people: PeopleResponse) => {
                this.people = people.data;
                this.setPersonId();
            },
            (error: string) => this.alerts.warning(
                null, 'There are People available to assign to.',
            ),
        );
    }

    /**
     * Either POST a new article or PUT the new contents.
     */
    public store(form: NgForm): void {
        this.saving = true;
        this.overwrite(form.form.value);
        this.setPublishedAt(this.article.published_at);

        this.storeTierResource();

        if (!this.article.id) {
            this.setPersonId();
            this.post();
            return;
        }

        this.put();
    }

    /**
     * Store the selected Tier Resource.
     * TODO - support more than one Tier Resource at a time.
     */
    public storeTierResource(): void {
        this.deleteTierResources();

        let tier: Tier|false = this.getTier();
        if (!tier) {
            return;
        }

        if (!this.tierResources || !this.tierResources.length) {
            this.postTierResources(tier);
            return;
        }

        this.putTierResources(tier);
    }

    /**
     * Cancel the edit and navigate back.
     */
    public cancel(): void {
        this.router.navigate(['publications']);
    }

    /**
     * Get the Tier by Tier ID.
     */
    public getTier(): Tier|false {
        let tier: Tier = _.find(this.tiers, { id: this.tierId });
        return tier ? tier : false;
    }

    /**
     * Get the Tier name by Tier ID for the template.
     */
    public getTierName(): string {
        let tier: Tier = _.find(this.tiers, { id: this.tierId });
        return tier ? tier.name : 'all';
    }

    /**
     * Get the Tier Resource by Tier ID.
     */
    public getTierResource(): TierResource {
        // We map() out the tier data so we can find() it by tierId
        let tierResource: any = _.find(
            _.map(this.tierResources, (t: TierResource) => t.tier ? t.tier.data : {}),
            { id: this.tierId },
        );

        return tierResource;
    }

    /**
     * Convert the published_at date the user entered to UTC for the API.
     * Template uses this.
     */
    public setPublishedAt(datetime: string): void {
        this.article.published_at = moment(datetime).format('YYYY-MM-DD\THH:mm:ssZZ');
    }

    /**
     * Create a moment object based on the published_at date.
     */
    private setMomentPublished(): void {
        this.momentPublished = moment(this.article.published_at);
    }

    /**
     * Automatically select the first author associated with this account
     * if there isn't already one set on the article.
     */
    private setPersonId(): void {
        let person: Person = _.find(this.people, { user_id: this.authentication.userId() });

        if (!person) {
            this.alerts.error(null, 'Please create an Author for your account before publishing.');
            return;
        }

        if (this.article.person_id) {
            return;
        }

        this.article.person_id = person.id;
    }

    /**
     * Set the Tier based on the Tier Resources this article is assigned to.
     */
    private setTierId(): void {
        let tierId: any = _.get(_.first(this.tierResources), 'tier.data.id');
        let tier: Tier  = _.find(this.tiers, { id: tierId });

        this.tierId = tier ? tier.id : '';
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
     * POST the Tier Resources for this article.
     */
    private postTierResources(tier: Tier): void {
        this.tierResourceService
            .post(tier, this.article.id)
            .subscribe(
                (response: TierResource): void => {
                    this.alerts.success(null, `Saved to ${tier.name} payment tier.`);
                },
                (error: any): void => {
                    this.alerts.error(null, `Could not save to ${tier.name} payment tier!`);
                },
            );
    }

    /**
     * PUT the Tier Resource to update the tier_id accordingly.
     */
    private putTierResources(tier: Tier): void {
        let tierResource: any = this.getTierResource();
        if (!tierResource) {
            return;
        }

        tierResource.tier_id = this.tierId;

        this.tierResourceService
            .put(tierResource)
            .subscribe(
                (response: TierResourceResponse): void => {
                    this.alerts.success(null, `Saved to ${tier.name} payment tier.`);
                },
                (error: any): void => {
                    this.alerts.error(null, `Could not save to ${tier.name} payment tier!`);
                },
            );
    }

    /**
     * DELETE all existing Tier Resources if the article was marked as Free.
     * Does not delete if there was no change.
     */
    private deleteTierResources(): void {
        if (this.tierId === _.get(this.tierResources, 'tier.data.id')) {
            return;
        }

        _.each(this.tierResources, (tierResource: TierResource) => {
            this.tierResourceService
                .delete(tierResource)
                .subscribe(
                    () => {
                        this.tierResources = [];
                        this.alerts.warning(null, 'Removed from payment tier.');
                    },
                );
        });
    }

    /**
     * Overwrites the values from the form to the Article model for submission.
     */
    private overwrite(values: Article): void {
        _.each(values, (value: any, key: string) => {
            this.article[key] = value;
        });
    }
}
