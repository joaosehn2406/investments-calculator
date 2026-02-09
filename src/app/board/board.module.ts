import {NgModule} from '@angular/core';
import {BoardComponent} from './board.component';
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [BoardComponent],
    imports: [
        FormsModule
    ],
    exports: [BoardComponent]
})
export class BoardModule{}
