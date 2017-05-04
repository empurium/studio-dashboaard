import { Component, OnInit } from '@angular/core';
import { DashboardComponent, Navigation } from '@freescan/skeleton';


@Component({
    selector: 'pstudio-root',
    template: `<studio-dashboard [navigation]="nav" layout="fluid"></studio-dashboard>`,
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
            routerLink: '/publications',
            label:      'Publications',
            icon:       'icon-notebook',
            show:       (): boolean => {
                return this.roles.has('dashboard');
            },
        },
        {
            routerLink: '/authors',
            label:      'Authors',
            icon:       'icon-people',
            show:       (): boolean => {
                return this.roles.has('dashboard');
            },
        },
        // {
        //     routerLink: '/files',
        //     label:      'File Manager',
        //     icon:       'icon-docs',
        // },
        // {
        //     routerLink: '/tiers',
        //     label:      'Payment Tiers',
        //     icon:       'icon-key',
        // },
        // {
        //     routerLink: '/analytics',
        //     label:      'Analytics',
        //     icon:       'icon-graph',
        // },
        // {
        //     routerLink: '/embeds',
        //     label:      'Embed Scripts',
        //     icon:       'icon-energy',
        // },
        // {
        //     routerLink: '/settings',
        //     label:      'Settings',
        //     icon:       'icon-settings',
        // },
        // {
        //     routerLink: '/contact',
        //     label:      'Contact Us',
        //     icon:       'icon-speech',
        // },
    ];

    public ngOnInit(): void {
        this.attemptLogin();

        this.roles.all().subscribe(
            (roles: string[]) => {
                // Fetch roles for navigation
            },
            (error: string) => console.error(error),
        );
    }
}
