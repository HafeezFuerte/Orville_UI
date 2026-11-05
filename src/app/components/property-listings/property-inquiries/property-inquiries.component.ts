import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import {
  PROPERTY_INQUIRY_ROWS,
  PropertyInquiryRow,
  PropertyInquiryType
} from '../property-listings.data';

@Component({
  selector: 'app-property-inquiries',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './property-inquiries.component.html',
  styleUrl: './property-inquiries.component.scss'
})
export class PropertyInquiriesComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly commonservice=inject(CommonService);
  private readonly  commontabservice=inject(Common_TabsService);
  isDrawerOpen = false;
  showColumnDropdown = false;
  currentUser = this.commonservice.getCurrentUser();
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows: any[] = [];
  searchQuery:any='';
  filterInquiryType: '' | PropertyInquiryType = '';
  filterUnit = '';

  tableColumns = [
    { key: 'code', label: 'ID', labelKey: 'web.propertyListings.inquiries.colId', visible: true },
    { key: 'name', label: 'Name', labelKey: 'web.propertyListings.inquiries.colFullName', visible: true },
    { key: 'email', label: 'Email', labelKey: 'web.propertyListings.inquiries.colEmail', visible: true },
    { key: 'phone_no', label: 'Phone', labelKey: 'web.propertyListings.inquiries.colPhone', visible: true },
    { key: 'entity_type', label: 'Inquiry Type', labelKey: 'web.propertyListings.inquiries.colInquiryType', visible: true },
    { key: 'entity', label: 'entity', labelKey: 'web.propertyListings.inquiries.colUnit', visible: true },
    { key: 'additional_info', label: 'Message', labelKey: 'web.propertyListings.inquiries.colMessage', visible: true},
    { key: 'created_date', label: 'Submitted At', labelKey: 'web.propertyListings.inquiries.colSubmittedAt', visible: true }
  ];

  constructor(
    private readonly location: Location,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadEnquires();
    this.updateColumnLabels();
    this.translate.onLangChange.subscribe(() => {
      this.updateColumnLabels();
    });
  }
  loadEnquires(append = false): void {
    const filterList: any[] = [];
    
    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize, // Load all to handle advanced dashboard filters locally for interactive UX
      filter_by: '', 
      filter_list: JSON.stringify(filterList),
      featureid: 'ENQUIRES'
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => { 
        if (res && res.statusCode === "200") {
         
        if(res.objResult.rows_info)
        {
          this.totalRecords=res.objResult.rows_info[0].totalrecords;
          //this.pageNo=res.objResult.rows_info[0].currentpage; 
          this.totalPages=res.objResult.rows_info[0].noofpages;
        }
         
        this.allRows = res.objResult.enquires; 
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }
  private updateColumnLabels(): void {
    this.tableColumns.forEach(col => {
      if (col.labelKey) {
        col.label = this.translate.instant(col.labelKey);
      }
    });
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): PropertyInquiryRow[] {
    return this.allRows.filter((row) => {
      if (this.filterInquiryType && row.inquiryType !== this.filterInquiryType) {
        return false;
      }
      if (this.filterUnit && !row.unit.toLowerCase().includes(this.filterUnit.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }
 
  get paginatedRows(): PropertyInquiryRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    void this.router.navigate(['/property-listings']);
  }

  toggleColumnDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  @HostListener('document:click')
  closeColumnDropdown(): void {
    this.showColumnDropdown = false;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col) {
      col.visible = col.visible === false;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => {
      col.visible = checked;
    });
  }

  applyFilters(): void {
    this.pageNo = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.filterInquiryType = '';
    this.filterUnit = '';
    this.pageNo = 0;
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void { 
    if(event.pageIndex>this.pageNo){
      this.pageNo = this.pageNo + 1;
      }
      else{
        this.pageNo = this.pageNo - 1;
      }
      if(this.pageNo<0)
      this.pageNo=0;
      this.pageSize = event.pageSize; 
      this.loadEnquires();
  }

  inquiryTypeClass(type: PropertyInquiryType): string {
    switch (type) {
      case 'For Rent':
        return 'ov-status ov-status--soft';
      case 'For Sale':
        return 'ov-status ov-status--info';
      case 'Viewing':
        return 'ov-status ov-status--warning';
      default:
        return 'ov-status ov-status--muted';
    }
  }
}
