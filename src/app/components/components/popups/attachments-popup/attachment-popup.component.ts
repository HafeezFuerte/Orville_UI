import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { PortfolioTypes } from '../../../../shared/services/portfolio.service';

@Component({
  selector: 'app-attachment-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadComponent
  ],
  templateUrl: './attachment-popup.component.html',
  styleUrls: ['./attachment-popup.component.scss']
})
export class AttachmentPopupComponent {

  @Input({ required: true })
  form!: FormGroup;
  @Output() fileSelected = new EventEmitter<File[]>();
  attachmentStatuses : any =[];
  documentTypes: any = [];

attachmentFiles: File[] = [];
constructor(private portfolioTypes: PortfolioTypes){}
ngOnInit(){
  this.loadMasterDataByType(9,0, 'documentTypes', '','');
  this.loadMasterDataByType(10, 0,'attachmentStatuses','','');
}
onFilesSelected(files: File[]) {

  if (files.length > 0) {

    this.form.patchValue({
      propertyAttachment: files[0]
    });

  } else {

    this.form.patchValue({
      propertyAttachment: null
    });

  }

}

private loadMasterDataByType(
   typeId: number,
  filterId: number,
  target: 'documentTypes' | 'attachmentStatuses',
  filtertext: '',
  filterText1:'', 
) {
  this.portfolioTypes.getMasterByType({
    typeId: typeId,
    filterId,
     filterText: filtertext,
    filterText1: filterText1 
  }).subscribe({
    next: res => {
      if(res['statusCode'] == 200)
        this[target] = res.objResult.table;
     
    },
    error: console.error
  });
}
}
