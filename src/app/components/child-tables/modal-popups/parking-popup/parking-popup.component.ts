import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule,FormBuilder,FormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';  
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
@Component({
  selector: 'app-parking-popup',
  standalone: true,
  imports: [
    CommonModule,FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FileUploadComponent,
    TranslateModule
  ],
  templateUrl: './parking-popup.component.html',
  styleUrls: ['./parking-popup.component.scss']
})
export class ParkingPopupComponent {

  @Input({ required: true })
  form!: FormGroup; 
  @Input() entity_id: string = '';
  unit_code:string='';
  recurringCycle: any = [];
  propertyList: any = [];
  unitsList: any = []; 
  roomsList: any = [];
  parkingTypeList: any = [];
  communicationChannels: any = [];
  editor!: Editor;
  @Output() fileSelected = new EventEmitter<File[]>();
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['ordered_list', 'bullet_list'],
    ['link']
  ];
  constructor(private portfolioService: PortfolioService,    private fb: FormBuilder,){}
  ngOnInit(){
     this.editor = new Editor(); 
     this.form.patchValue({
      property_code: this.entity_id,
    }); 
    const control = this.form.get('property_code');
    if (this.entity_id) {
      control?.disable();
      this.getUnits(); 
    } 
    //  this.form = this.fb.group({
    //   property_code: ['', Validators.required],
    //   unit_code: ['', Validators.required],
    //   room_code: ['', Validators.required],
    //   parking_no: ['', Validators.required],
    //   parking_type: ['', Validators.required],
    //   recurring_cycle: ['', Validators.required],
    //   remarks: [''], 
    // });
    this.loadMasterDataByType(2,13,'recurringCycle','','')
    this.loadMasterDataByType(2,12,'parkingTypeList','','')
    this.loadMasterDataByType(11,0,'propertyList','','')
  }
  onChange(){
    console.log("test");
  }
  getUnits(){
    this.unitsList=[];
    this.loadMasterDataByType(3,0,'unitsList',this.entity_id,'')
  }
  getRooms(){
    this.roomsList=[];
    this.loadMasterDataByType(38,0,'roomsList',this.entity_id,this.form.value?.unit_code)
  }
  private loadMasterDataByType(
  typeId: number,
  filterId: number,
  target: 'recurringCycle' | 'parkingTypeList' | 'propertyList' | 'unitsList' | 'roomsList',
  filtertext:string,
  filterText1:string, 
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
