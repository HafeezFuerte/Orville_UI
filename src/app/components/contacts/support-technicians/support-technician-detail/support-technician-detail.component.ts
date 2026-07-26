import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
      clientId: localStorage.getItem('clientId') || "74BB6922",
      companyId: Number(localStorage.getItem('companyId')) || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          if (res.objResult.technician_dtls && res.objResult.technician_dtls.length > 0) {
            this.technicianData = res.objResult.technician_dtls[0];
          } else if (res.objResult.technicians && res.objResult.technicians.length > 0) {
            this.technicianData = res.objResult.technicians[0];
          } else if (Array.isArray(res.objResult) && res.objResult.length > 0) {
            this.technicianData = res.objResult[0];
          }
          if (res.objResult.work_orders) this.workOrderData = res.objResult.work_orders;
          
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

  // Dropdown options
  actionOptions = [
    { label: 'Edit Technician', icon: 'ri-edit-line' },
    { label: 'Block Technician', icon: 'ri-prohibit-line' }
  ];

  // Technician details mock
  technician = {
    id: 31658,
    name: 'suhel barwani Muhammed',
    email: 'suhelbarwani@gmail.com',
    phone: '+971 0528 6135 68',
    username: 'suhel10',
    status: 'Active',
    assignedJob: 'shamedvendor@gmail.com',
    responsibleForWorkOrders: false,
    system: {
      createdAt: '09-10-2025 03:22 PM',
      lastLoginAt: '09-10-2026 09:21 PM'
    }
  };

  // Work orders table columns
  workOrderColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'title', label: 'web.contacts.lblSubject', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'closingStatus', label: 'web.contacts.lblStatus', visible: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'priority', label: 'web.contacts.lblPriority', visible: true, useTemplate: true },
    { key: 'property', label: 'web.contacts.lblProperty', visible: true }
  ];

  workOrderData: any[] = [];

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
