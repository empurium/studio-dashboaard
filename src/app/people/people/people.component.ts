import { Component, OnInit } from '@angular/core';
import { AlertService, Person, PeopleService, PeopleResponse } from '@freescan/skeleton';


@Component({
    selector:    'pstudio-people',
    templateUrl: './people.component.html',
    styleUrls:   ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
    public people: Person[];

    constructor(private alerts: AlertService,
                private peopleService: PeopleService) {
    }

    public ngOnInit(): void {
        this.peopleService.all().subscribe(
            (response: PeopleResponse) => this.people = response.data,
            (error: any) => this.alerts.errorMessage(error),
        );
    }
}
