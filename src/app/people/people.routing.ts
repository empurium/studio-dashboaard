import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonComponent } from './person/person.component';
import { PeopleComponent } from './people/people.component';

export const routes: Routes = [
    {
        path:      '',
        component: PeopleComponent,
    },
    {
        path:      'new',
        component: PersonComponent,
    },
    {
        path:      'edit/:id',
        component: PersonComponent,
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PeopleRoutingModule {
}
