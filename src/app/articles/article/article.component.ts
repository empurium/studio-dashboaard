import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ErrorMessage } from '@freescan/http';
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
} from '@freescan/skeleton';

import { TierResourceComponent } from '../tier-resource/tier-resource.component';


@Component({
    selector:      'pstudio-article',
    templateUrl:   './article.component.html',
    styleUrls:     ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
    @ViewChild('form') public form: NgForm;
    @ViewChild('articleTier') public articleTier: TierResourceComponent;

    public tier: Tier|null;
    public people: Person[];
    public article: Article        = new Article();
    public loading: boolean        = true;
    public saving: boolean         = false;
    public momentPublished: any    = moment();
    public ckeditorContent: string = '';
    public ckeditorConfig: any     = {
        height: '450px',
    };

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authentication: AuthenticationService,
                private alerts: AlertService,
                private peopleService: PeopleService,
                private articleService: ArticleService) {
    }

    public ngOnInit(): void {
        this.loadArticle();
        this.loadPeople();
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
            .subscribe(
                (response: ArticleResponse) => {
                    this.loading         = false;
                    this.article         = response.data;
                    this.ckeditorContent = this.article.content;
                    this.setMomentPublished();
                },
                (error: string) => this.alerts.error(null, 'Could not locate this article.'),
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
    public store(): void {
        this.saving = true;
        this.overwrite(this.form.form.value);
        this.setPublishedAt(this.article.published_at);

        if (!this.article.id) {
            this.setPersonId();
            this.post();
            return;
        }

        this.put();
    }

    /**
     * Delete an article.
     */
    public delete(article: Article): void {
        if (confirm(`Are you sure you want to DELETE this article?\n\n${article.title}`)) {
            this.articleService
                .delete(article)
                .subscribe(
                    () => {
                        this.alerts.success('Deleted', article.title);
                        this.router.navigate(['../']);
                    },
                    (error: ErrorMessage) => this.alerts.errorMessage(error),
                );
        }
    }

    /**
     * Cancel the edit and navigate back.
     */
    public cancel(): void {
        this.router.navigate(['publications']);
    }

    /**
     * Change the Tier when the TierResourceComponent emits the event.
     */
    public handleTierChange(tier: Tier|null): void {
        this.tier = tier;
        this.article.tier_ids = tier && tier.id ? [tier.id] : null;
    }

    /**
     * Retrieve an appropriate label for the current Tier this article is saved to.
     */
    public tierLabel(): string {
        return this.tier ? this.tier.name : 'all';
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
                    this.articleTier.storeEvent.emit(this.tier);
                },
                (error: any) => this.alerts.errorMessage(error),
            );
    }

    /**
     * Overwrites the values from the form to the Article model for submission.
     */
    private overwrite(values: Article): void {
        this.article.content = this.contentReplace(this.ckeditorContent);

        _.each(values, (value: any, key: string) => {
            this.article[key] = value;
        });
    }

    /**
     * Replace some bad content from the CKEditor.
     * It loves to use nbsp and force extremely long lines of text thereby breaking styles.
     */
    private contentReplace(content: string): string {
        return content
            .replace(/&nbsp;/g, ' ')
            .replace(/<div> <\/div>/g, `<div>&nbsp;</div>`);
    }
}
