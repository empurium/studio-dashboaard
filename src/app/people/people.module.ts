import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudioModule } from '@freescan/skeleton';

// Core
import { PeopleRoutingModule } from './people.routing';

// Components
import { PersonComponent } from './person/person.component';
import { PeopleComponent } from './people/people.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        StudioModule,
        PeopleRoutingModule,
    ],

    declarations: [
        PersonComponent,
        PeopleComponent,
    ],
})
export class PeopleModule {
}
