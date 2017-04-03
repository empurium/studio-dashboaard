import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@freescan/skeleton';


@Component({
    selector: 'pstudio-root',
    template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
    constructor(private authentication: AuthenticationService) {
    }

    /**
     * Attempt to login the user. Essentially checks the URL for an access_token,
     * saves to local storage, and then removes it from the URL.
     * Performed in AppComponent to remove from the URL as early as possible.
     */
    public ngOnInit(): void {
        this.authentication.attemptLogin();
    }
}
