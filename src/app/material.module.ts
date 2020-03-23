import { NgModule } from '@angular/core';

import { MatToolbarModule} from '@angular/material/toolbar'
import { MatIconModule} from '@angular/material/icon'
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';

@NgModule({
    imports: [
        MatSliderModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [
        MatSliderModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class MaterialModule { }