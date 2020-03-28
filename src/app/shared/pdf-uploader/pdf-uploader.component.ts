import { Component, OnInit } from '@angular/core';

import { FileValidator } from 'ngx-material-file-input';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-pdf-uploader',
  templateUrl: './pdf-uploader.component.html',
  styleUrls: ['./pdf-uploader.component.css']
})
export class PdfUploaderComponent implements OnInit {

  //25 mb farlo diventare un @Input() se serve
  maxSize : number = 26214400;
  pdfSrc : string
  pdfManager : FormGroup
  showPdf : boolean
  page : number = 1
  zoom : number = 1
  rotation : number = 0

  constructor(private _fb: FormBuilder) {
    this.pdfManager = this._fb.group({
        drawPdfFile: [
          undefined,
          [FileValidator.maxContentSize(this.maxSize)]
        ],
        showPdfForm : []
      });
    }

  ngOnInit() {
  }
  

  togglePdfViewer(e) {
    this.showPdf = e.checked;
  }

  uploadFile(event) {

    let fileList: FileList = event.target.files;
    //abilitato il caricamento di un unico .pdf
    if (fileList.length == 1 ) {

      const file = event.dataTransfer 
        ? event.dataTransfer.files[0] 
        : event.target.files[0];

      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.showPdf = true
    }
    //NO! this.pdfSrc = this.pieceSelector.controls["drawPdfFile"].value
  }

  _handleReaderLoaded(e) {
    var reader = e.target;
    this.pdfSrc = reader.result;
  }

}