import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../../portfolio/services/properties.service';

@Component({
  selector: 'app-support-technician-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule],
  templateUrl: './support-technician-detail.component.html',
  styleUrl: './support-technician-detail.component.scss'
})
export class SupportTechnicianDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesService);
  private router = inject(Router);
  
  technicianId: any = null;
  technicianData: any = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.technicianId = params['id'];
      if (this.technicianId) {
        this.getTechnicianDetails();
      }
    });
  }

  getTechnicianDetails() {
    const payload = {
      typeId: 33,
      filterId: 0,
      filterText: this.technicianId,
      filterText1: "",
      userId: Number(localStorage.getItem('userId')) || 1,
      clientId: "74BB6922",
      companyId: Number(localStorage.getItem('companyId')) || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const result = res.objResult;
          let tech: any = null;
          if (result.table && result.table[0]) {
            tech = result.table[0];
          } else if (result.technicians_dtls && result.technicians_dtls[0]) {
            tech = result.technicians_dtls[0];
          } else if (result.technician_dtls && result.technician_dtls[0]) {
            tech = result.technician_dtls[0];
          } else if (result.technicians && result.technicians[0]) {
            tech = result.technicians[0];
          } else if (result.technician && result.technician[0]) {
            tech = result.technician[0];
          } else {
            const arrayKey = Object.keys(result).find(key => Array.isArray(result[key]) && result[key].length > 0 && key !== 'workorders' && key !== 'work_orders');
            if (arrayKey) {
              tech = result[arrayKey][0];
            }
          }
          this.technicianData = tech;
          
          if (result.workorders) this.workOrderData = result.workorders;
          else if (result.work_orders) this.workOrderData = result.work_orders;

          if (this.technicianData) {
            const data = this.technicianData;
            this.technician.id = data.id || data.code || this.technician.id;
            this.technician.name = data.technician_name || (data.first_name ? (data.first_name + ' ' + (data.last_name || '')) : '') || this.technician.name;
            this.technician.email = data.email || data.email_address || this.technician.email;
            this.technician.phone = data.phone || data.mobile_no || this.technician.phone;
            this.technician.username = data.username || this.technician.username;
            this.technician.status = data.status || 'Active';
          }
          
          console.log('Technician Details Loaded:', this.technicianData);
        }
      },
      error: (err) => {
        console.error('Error fetching technician details:', err);
      }
    });
  }
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];

  activeTab = 'Work Orders';
  tabs = ['Work Orders'];

  showActionDropdown = false;

  // Dropdown options (Figma support-technician-detail Action menu)
  actionOptions: {
    label: string;
    icon: string;
    asset?: string;
    danger?: boolean;
    dangerIcon?: boolean;
  }[] = [
    { label: 'Edit Technician', icon: 'ri-pencil-line', asset: 'assets/images/action-menu/pencil.svg' },
    { label: 'Block Technician', icon: 'ri-forbid-line', dangerIcon: true }
  ];

  get hasDangerAction(): boolean {
    return this.actionOptions.some((o: any) => o.danger);
  }

  onTechnicianAction(label: string): void {
    this.showActionDropdown = false;
    if (label === 'Edit Technician') {
      this.router.navigate(['/contacts/support-technicians/edit-support-technician', this.technicianId]);
      return;
    }
  }

  // Technician details mock
  technician = {
    id: 0,
    name: 'Loading...',
    email: '',
    phone: '',
    username: '',
    status: 'Active',
    assignedJob: '',
    responsibleForWorkOrders: false,
    system: {
      createdAt: '',
      lastLoginAt: ''
    }
  };

  // Work orders table columns
  workOrderColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'title', label: 'web.contacts.lblSubject', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'closingStatus', label: 'web.contacts.lblclosingStatus', visible: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'priority', label: 'web.contacts.lblPriority', visible: true, useTemplate: true },
    { key: 'property', label: 'web.contacts.lblProperty', visible: true }
  ];

  workOrderData: any[] = [];
  searchQuery = '';
  showColumnDropdown = false;

  get visibleColumns() {
    return this.workOrderColumns.filter(col => col.visible !== false);
  }

  toggleColumn(colKey: string) {
    const col = this.workOrderColumns.find(c => c.key === colKey);
    if (col) col.visible = !col.visible;
  }

  toggleAllColumns(event: any) {
    const checked = event.target.checked;
    this.workOrderColumns.forEach(c => c.visible = checked);
  }

  get allColumnsSelected(): boolean {
    return this.workOrderColumns.every(c => c.visible !== false);
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
