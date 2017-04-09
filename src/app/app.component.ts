import { Component, OnInit } from '@angular/core';
import { DashboardComponent, Navigation } from '@freescan/skeleton';


@Component({
    selector: 'pstudio-root',
    template: `<freescan-dashboard [navigation]="nav"></freescan-dashboard>`,
})
export class AppComponent extends DashboardComponent implements OnInit {
    public nav: Navigation[] = [
        {
            routerLink:  '/',
            label:       'Home',
            icon:        'icon-home',
            exactActive: true,
        },
        {
            label: 'Login',
            icon:  'icon-login',
            show:  (): boolean => {
                return !this.authenticated();
            },
            click: (): void => {
                this.login();
            },
        },
        {
            routerLink: '/publications',
            label:      'Publications',
            icon:       'icon-notebook',
            show:       (): boolean => {
                return this.roles.has('dashboard');
            },
        },
    ];

    public ngOnInit(): void {
        this.attemptLogin();

        this.roles.all().subscribe(
            (roles: string[]) => { },
            (error: string) => console.error(error),
        );
    }
}
