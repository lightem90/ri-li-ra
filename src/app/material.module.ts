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
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';




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
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatCardModule,
        MatDividerModule,
        MatSelectModule
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
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatCardModule,
        MatDividerModule,
        MatSelectModule
    ]
})
export class MaterialModule { }