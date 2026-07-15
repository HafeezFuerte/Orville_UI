import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { GetAllTypes } from '../../../../shared/services/get-all-types.service';

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
constructor(private getAllTypes: GetAllTypes){}
ngOnInit(){
  this.loadStatuses();
  this.loadDocumentTypes();
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


loadStatuses() {
  const payload = {
      typeId:2,
      filterId: 10,
      filterText: "",
      filterText1: "",
      userId: 0,
      clientId: "74BB6922",
      companyId: 1
  };

  this.getAllTypes.getAttachmentsSttaus(payload).subscribe({
    next: (response) => {
      this.attachmentStatuses = response.objResult.table;
    },
    error: (err) => {
      console.error(err);
    }
  });
}
loadDocumentTypes() {
  const payload = {
      typeId:2,
      filterId: 9,
      filterText: "",
      filterText1: "",
      userId: 0,
      clientId: "74BB6922",
      companyId: 1
  };

  this.getAllTypes.getDocumentType(payload).subscribe({
    next: (response) => {
      this.documentTypes= response.objResult.table;
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}
