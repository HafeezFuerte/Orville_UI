import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
@Component({
  selector: 'app-notes-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FileUploadComponent,
    TranslateModule
  ],
  templateUrl: './notes-popup.component.html',
  styleUrls: ['./notes-popup.component.scss']
})
export class NotesPopupComponent {

  @Input({ required: true })
  form!: FormGroup;
  communicationChannels: any = [];
  editor!: Editor;
  @Output() fileSelected = new EventEmitter<File[]>();
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['ordered_list', 'bullet_list'],
    ['link']
  ];
  constructor(private portfolioService: PortfolioService){}
  ngOnInit(){
     this.editor = new Editor();
    this.loadMasterDataByType(2,11,'communicationChannels','','')
  }
  
  onFilesSelected(files: File[]) {
    if (files.length > 0) {
      this.form.patchValue({
        propertyNotesFile: files[0]
      });
    } else {
      this.form.patchValue({
        propertyNotesFile: null
      });
    }
  }
  private loadMasterDataByType(
  typeId: number,
  filterId: number,
  target: 'communicationChannels',
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
