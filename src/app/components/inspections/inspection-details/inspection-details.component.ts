import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,ActivatedRoute,Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
@Component({
  selector: 'app-inspection-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, SharedTableComponent, ReusableModalComponent],
  templateUrl: './inspection-details.component.html',
  styleUrl: './inspection-details.component.scss'
})
export class InspectionDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  private translate = inject(TranslateService);
  private commonservice = inject(CommonService);
  private commontab_service=inject(Common_TabsService)
  currentUser = this.commonservice.getCurrentUser();
  isLoading = false;
  showModal = false;
  imageIndex = 0;
  workOrderId:string='';
  inpectionDetails:any={};

  imagesList = [
    'assets/images/common/img-placeholder.png',
    'assets/images/common/img-placeholder.png',
    'assets/images/common/img-placeholder.png'
  ];

  isColumnDropdownOpen = false;
  showActionMenu = false;

  inspectionItemsColumns = [
    { key: 'item', label: 'Item', labelKey: 'web.inspections.details.colItem', visible: true, useTemplate: true },
    { key: 'cleanliness', label: 'Cleanliness', labelKey: 'web.inspections.details.colCleanliness', visible: true, useTemplate: true },
    { key: 'condition', label: 'Condition', labelKey: 'web.inspections.details.colCondition', visible: true, useTemplate: true },
    { key: 'notes', label: 'Notes', labelKey: 'web.inspections.details.colNotes', visible: true, useTemplate: true },
    { key: 'images', label: 'Images', labelKey: 'web.inspections.details.colImages', visible: true, useTemplate: true },
    { key: 'qty', label: 'Qty', labelKey: 'web.inspections.details.colQty', visible: true, useTemplate: true },
    { key: 'cost', label: 'Cost', labelKey: 'web.inspections.details.colCost', visible: true, useTemplate: true }
  ];

  inspectionItemsData :any[]=[];

  ngOnInit() {
    this.updateColumnLabels();
    this.translate.onLangChange.subscribe(() => {
      this.updateColumnLabels();
    });
    this.route.params.subscribe(params => {
      this.workOrderId = params['code'];
      if (this.workOrderId) {
        this.getWorkOrderDetails();
      }
    });
  }
  getWorkOrderDetails() {
    const currentUser = this.commonservice.getCurrentUser();
    const payload = {
      typeId: 100, 
      filterId: 0,
      filterText: this.workOrderId,
      filterText1: "",
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    };

    this.commontab_service.getMasterByType(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const details = res.objResult.inspection_dtls || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.inpectionDetails = {
              id:  data.code,
              type: data.inspection_type_text || '-',
              inspection_scope: data.inspection_scope || '-', 
              status: data.status || '-',
              inspection_date_time:this.commonservice.formatDateForInput(data.inspection_date_time),
              details: data.details || '-', 
              property: data.property || '-',
              unit: data.unit || '-',
              createdDate: this.commonservice.formatDateForInput(data.created_date)|| '-',
              lastUpdated: this.commonservice.formatDateForInput(data.modified_date)|| '-',
              lease: data.lease || '-',
              inspector:data.inspector,
              phone: data.phone || '-', 
            };
            
            } 
 
           
          } 
      },
      error: (err) => {
        console.error("Error loading work order details:", err);
      }
    });
  }
  private updateColumnLabels() {
    this.inspectionItemsColumns.forEach(col => {
      if (col.labelKey) {
        col.label = this.translate.instant(col.labelKey);
      }
    });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
    this.isColumnDropdownOpen = false;
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.isColumnDropdownOpen = false;
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(_action: string): void {
    this.router.navigate(['/inspections/edit-inspection', this.workOrderId]);
  }

  get visibleColumns() {
    return this.inspectionItemsColumns.filter(c => c.visible !== false);
  }

  get allColumnsVisible() {
    return this.inspectionItemsColumns.every(c => c.visible !== false);
  }

  toggleAllColumns(checked: boolean) {
    this.inspectionItemsColumns.forEach(c => c.visible = checked);
  }

  clearAllColumns() {
    this.inspectionItemsColumns.forEach(c => c.visible = false);
  }

  openImageModal(idx: number) {
    this.imageIndex = idx;
    this.showModal = true;
  }

  nextImage() {
    this.imageIndex = (this.imageIndex + 1) % this.imagesList.length;
  }

  prevImage() {
    this.imageIndex = (this.imageIndex - 1 + this.imagesList.length) % this.imagesList.length;
  }

  closeModal() {
    this.showModal = false;
  }
}
