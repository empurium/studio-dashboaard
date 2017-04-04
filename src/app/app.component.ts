import { Component } from '@angular/core';
import { FullLayoutComponent, Navigation } from '@freescan/skeleton';


@Component({
    selector: 'pstudio-root',
    template: `<freescan-dashboard [navigation]="nav"></freescan-dashboard>`,
})
export class AppComponent extends FullLayoutComponent {
    public nav: Navigation[] = [
        {
            routerLink: '/',
            label:      'Home',
            icon:       'icon-home',
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
    ];
}
