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
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PdfViewerModule } from 'ng2-pdf-viewer';



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
        MatSelectModule,
        MaterialFileInputModule,
        MatSlideToggleModule,
        PdfViewerModule
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
        MatSelectModule,
        MaterialFileInputModule,
        MatSlideToggleModule,
        PdfViewerModule
    ]
})
export class MaterialModule { }