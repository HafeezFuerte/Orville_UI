import { Component, EventEmitter,  Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule,formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-hearings-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    SharedTableComponent, 
    TranslateModule,
    FileUploadComponent,
    ReusableModalComponent
  ],
  templateUrl: './hearings-table.component.html',
  styleUrls: []
})
export class HearingsTableComponent implements OnInit {
  @Input() selectedTab: any = [];
  private commonservice= inject(CommonService);
  private toast=inject(ToastrService);
  isColumnDropdownOpen = false;
  code:string='';
  showModal = false;
  currentUser : any;
  selectedHearing: any = null;
  attachedFile:any=[];
  private fb = inject(FormBuilder);
  hearingForm!: FormGroup;

  ngOnInit() {
    this.currentUser=this.commonservice.getCurrentUser();
    this.hearingForm = this.fb.group({
      date: [''],
      description: [''],
      attachment: ['']
    });
  }

  get columns() {
    return this.selectedTab?.columns || [];
  }

  get visibleColumns() {
    return this.columns.filter((c: any) => c.visible !== false);
  }
  onFilesSelected(files: File[]) {
    if (files.length > 0) {
      this.attachedFile=files[0];
    } else {
      this.attachedFile=null;
    }
  }
  toggleColumnDropdown() {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }
  linkClick(lnk:any) {
    window.open(lnk, "_blank");
  }
  toggleColumn(col: any) {
    col.visible = !(col.visible !== false);
  }

  toggleAllColumns(event: any) {
    const isChecked = event.target.checked;
    this.columns.forEach((c: any) => c.visible = isChecked);
  }

  get allColumnsVisible() {
    if (!this.columns.length) return false;
    return this.columns.every((c: any) => c.visible !== false);
  }

  openAddModal() {
    this.selectedHearing = null;
    this.hearingForm.reset({
      date: '',
      description: '',
      attachment: ''
    });
    this.showModal = true;
  }

  openHearingDetails(row: any) {
    this.selectedHearing = row;
    this.hearingForm.patchValue({
      date: formatDate( row.date, 'yyyy-MM-dd', 'en-US'),
      description: row.description,
      attachment: row.attachment
    });
    this.showModal = true;
  }

  saveHearing() {
    if (this.hearingForm.invalid) {
      return;
    }
    const values = this.hearingForm.value;
    const request = {
      userid: this.currentUser?.userId,
      code: this.selectedHearing?.code || '',
      source: 'web',
      company_id: this.currentUser?.companyId, 
      clientId: this.currentUser?.clientId, 
      legal_code: this.selectedTab?.entity_id,
      date: formatDate(values.date, 'yyyy-MM-dd', 'en-US'),
      description: values.description,  
    }; 

    const formData = new FormData(); 
  // JSON goes as ONE field
  formData.append('reqObject', JSON.stringify(request));
  if(this.attachedFile!='')
    formData.append("attachment", this.attachedFile); 
 
   this.commonservice.saveLegalHearing(formData).subscribe({
      next: (res:any) => { 
        if (res["statusCode"] == "200") {
          this.toast.success('Successfully saved');
          setTimeout(() => {
            window.location.reload()
          }, 3000);
        }
        else{
          this.toast.error(res['message']);
          return;
        }
      },
      error: (err:any) => {
     
      },
    });
     
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.selectedHearing = null;
  }
}
