import { NgModule } from '@angular/core';

import { MatToolbarModule} from '@angular/material/toolbar'
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
    imports: [
        MatSliderModule,
        MatToolbarModule,
    ],
    exports: [
        MatSliderModule,
        MatToolbarModule
    ]
})
export class MaterialModule { }