import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
    AuthenticationService,
    AlertService,
    PeopleService,
    Person,
    PersonResponse,
    PeopleResponse,
} from '@freescan/skeleton';


@Component({
    selector:      'pstudio-person',
    templateUrl:   './person.component.html',
    styleUrls:     ['./person.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PersonComponent implements OnInit {
    public person: Person   = new Person();
    public loading: boolean = true;
    public saving: boolean  = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authentication: AuthenticationService,
                private alerts: AlertService,
                private peopleService: PeopleService) {
    }

    public ngOnInit(): void {
        this.loadPerson();
    }

    /**
     * Request the person if one was requested, otherwise this is a new person.
     */
    public loadPerson(): void {
        this.route.params
            .switchMap((params: Params) => {
                this.loading = !!params.id;
                return params.id ? this.peopleService.one(params.id) : Observable.empty();
            })
            .subscribe((response: PersonResponse) => {
                this.loading = false;
                this.person  = response.data;
            });
    }

    /**
     * Cancel the edit and navigate back.
     */
    public cancel(): void {
        this.router.navigate(['authors']);
    }

    /**
     * Either POST a new person or PUT the new contents.
     */
    public store(form: NgForm): void {
        this.saving = true;
        this.setEnabled(form);

        if (!this.person.id) {
            this.setUserId();
            this.post();

            return;
        }

        this.put();
    }

    /**
     * Sets the User ID of the new Person to the currently logged in user.
     */
    private setUserId(): void {
        this.person.user_id = this.authentication.userId();
    }

    /**
     * Convert strings true/false to their boolean counterpart.
     */
    private setEnabled(form: NgForm): void {
        this.person.enabled = form.value.enabled === 'true';
    }

    /**
     * POST the person.
     */
    private post(): void {
        this.peopleService
            .post(this.person)
            .finally(() => this.saving = false)
            .subscribe(
                (response: PersonResponse) => {
                    this.person = response.data;
                    this.alerts.success(null, 'Person has been saved.');
                    this.router.navigate([`../edit/${this.person.id}`], { relativeTo: this.route });
                },
                (error: any) => this.alerts.errorMessage(error),
            );
    }

    /**
     * PUT the person.
     */
    private put(): void {
        this.peopleService
            .put(this.person)
            .finally(() => this.saving = false)
            .subscribe(
                (response: PeopleResponse) => {
                    this.alerts.success(null, 'Person has been saved.');
                },
                (error: any) => this.alerts.errorMessage(error),
            );
    }
}
