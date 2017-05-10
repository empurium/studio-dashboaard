import { Component } from '@angular/core';


@Component({
    selector: 'pstudio-home',
    template: `
<div class="container mt-2">
    <router-outlet></router-outlet>
</div>`,
})
export class HomeComponent {
}
