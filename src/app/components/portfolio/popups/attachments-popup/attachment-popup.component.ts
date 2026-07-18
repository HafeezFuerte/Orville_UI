import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { PortfolioService } from '../../services/portfolio.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-attachment-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadComponent,
    TranslateModule
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
  constructor(private portfolioService: PortfolioService){}
  ngOnInit(){
    this.loadMasterDataByType(2,9,'documentTypes', '','');
    this.loadMasterDataByType(2,10,'attachmentStatuses','','');
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
  this.portfolioService.getMasterByType({
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
