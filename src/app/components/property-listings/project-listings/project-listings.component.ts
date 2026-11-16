import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { CommonService } from '../../../services/common.service';
import { ProjectListingRow } from '../property-listings.data';

@Component({
  selector: 'app-project-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, SharedTableComponent],
  templateUrl: './project-listings.component.html'
})
export class ProjectListingsComponent implements OnInit {
  private translate = inject(TranslateService);
  private propertiesService = inject(PropertiesService);
  private commonService = inject(CommonService);

  searchQuery = '';
  pageIndex = 0;
  pageSize = 10;
  totalRecordsCount = 0;
  allRows: ProjectListingRow[] = [];
  isLoading = false;

  tableColumns = [
    { key: 'id', label: 'ID', labelKey: 'web.propertyListings.projectListings.colId', visible: true },
    { key: 'name', label: 'Project', labelKey: 'web.propertyListings.projectListings.colProject', visible: true, useTemplate: true },
    { key: 'developer', label: 'Developer', labelKey: 'web.propertyListings.projectListings.colDeveloper', visible: true },
    { key: 'location', label: 'Location', labelKey: 'web.propertyListings.projectListings.colLocation', visible: true },
    { key: 'units', label: 'Units', labelKey: 'web.propertyListings.projectListings.colUnits', visible: true },
    { key: 'available', label: 'Available', labelKey: 'web.propertyListings.projectListings.colAvailable', visible: true },
    { key: 'status', label: 'Status', labelKey: 'web.propertyListings.projectListings.colStatus', visible: true, useTemplate: true }
  ];

  ngOnInit(): void {
    this.updateColumnLabels();
    this.translate.onLangChange.subscribe(() => {
      this.updateColumnLabels();
    });
    this.loadProjectListings();
  }

  loadProjectListings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '',
      source: 'web',
      languageid: 1,
      page_no: this.pageIndex,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: 50,
      filter_by: 'is_published',
      filter_list: JSON.stringify([{ key: 'is_published', value: '1' }]),
      featureid: 'Property'
    };

    this.propertiesService.getProperties(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.statusCode === '200' && Array.isArray(res?.objResult?.property)) {
          const rawProperties = res.objResult.property;
          const hasExplicitFlag = rawProperties.some((p: any) =>
            p.is_published !== undefined || p.isPublished !== undefined || p.is_publish !== undefined || p.publish_status !== undefined
          );
          let displayProperties = rawProperties;
          if (hasExplicitFlag) {
            const onlyPublished = rawProperties.filter((p: any) =>
              p.is_published == 1 || p.is_published === '1' || p.is_published === true ||
              p.isPublished == 1 || p.isPublished === '1' || p.isPublished === true ||
              p.is_publish == 1 || p.is_publish === '1' || p.is_publish === true ||
              String(p.publish_status || '').toLowerCase() === 'published'
            );
            displayProperties = onlyPublished.length > 0 ? onlyPublished : rawProperties;
          }
          this.allRows = displayProperties.map((p: any) => ({
            id: String(p.code || p.id || ''),
            name: p.name || 'Project',
            developer: p.landlord_name || p.developer || 'Orville Real Estate',
            location: p.address_1 || p.city || 'Dubai',
            units: Number(p.total_units) || 0,
            available: Math.max(0, (Number(p.total_units) || 0) - (Number(p.occupied_units) || 0)),
            status: 'Active' as const
          }));
          this.totalRecordsCount = this.allRows.length;
        } else {
          this.allRows = [];
          this.totalRecordsCount = 0;
        }
      },
      error: () => {
        this.isLoading = false;
        this.allRows = [];
        this.totalRecordsCount = 0;
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

  get filteredRows(): ProjectListingRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.allRows;
    }
    return this.allRows.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.developer.toLowerCase().includes(q) ||
        row.location.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
    );
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get paginatedRows(): ProjectListingRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadProjectListings();
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  statusClass(status: ProjectListingRow['status']): string {
    switch (status) {
      case 'Active':
        return 'ov-status ov-status--success';
      case 'Coming Soon':
        return 'ov-status ov-status--info';
      default:
        return 'ov-status ov-status--muted';
    }
  }
}
