import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { FacilityService } from '../../facility.service';
import { QUOTATION_FORM_OPTIONS } from '../quotations.data';

@Component({
  selector: 'app-request-quotation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    TranslateModule,
    FlowbiteDatepickerDirective
  ],
  templateUrl: './request-quotation.component.html',
  styleUrl: './request-quotation.component.scss'
})
export class RequestQuotationComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facilityService = inject(FacilityService);
  private commontabservice = inject(Common_TabsService);
  private commonservice = inject(CommonService);
  private toastr = inject(ToastrService);

  currentUser = this.commonservice.getCurrentUser();

  options: {
    workOrders: any[];
    vendors: any[];
    categories: any[];
    taxProfiles: any[];
  } = {
    workOrders: [],
    vendors: [],
    categories: [],
    taxProfiles: []
  };

  title = '';
  reference = '';
  quotationno = '';
  selectedWorkOrder: string | null = null;
  estimatedDate = '';
  selectedCategory: string | null = null;
  selectedVendors: string[] = [];
  description = '';
  editId: string | null = '';
  isSaving = false;

  ngOnInit(): void {
    this.editId = '';
    this.route.paramMap.subscribe((params) => {
      this.editId = params.get('code');
      if (this.editId) {
        this.getQuotationDetails(78, 41, 'statusTabs', this.editId);
      }
    });
    this.loadLookup(79, 0, 'categories', '');
  }

  getQuotationDetails(Typeid: number, filterId: number, targetProperty: string, filterText: string): void {
    this.commontabservice.getMasterByType({
      typeId: 78,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table1) {
          const temp = res.objResult.table1[0] || {};
          if (temp) {
            this.title = temp.title || '';
            this.quotationno = temp.quotation_no || '';
            this.description = temp.description || '';
            this.reference = temp.reference_no || '';
            this.estimatedDate = this.commonservice.formatDateForInput(temp.estimation_date) || '';
            this.selectedWorkOrder = temp.workorder_id || null;
            this.selectedCategory = temp.quotation_category || null;
            if (temp.selected_vendors) {
              setTimeout(() => {
                this.selectedVendors = typeof temp.selected_vendors === 'string'
                  ? temp.selected_vendors.split(',').map((x: string) => x.trim())
                  : temp.selected_vendors;
              }, 500);
            }
          }
        } else {
          this.toastr.error('No record[s] found');
        }
      },
      error: (err) => {
        console.error(`Error fetching quotation details ${filterText}:`, err);
      }
    });
  }

  loadLookup(Typeid: number, filterId: number, targetProperty: string, filterText: string): void {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult) {
          if (!this.editId) {
            this.quotationno = (res.objResult.invoice_no && res.objResult.invoice_no[0]?.inv_no) || '';
          }
          this.options.workOrders = res.objResult.workorders || [];
          this.options.vendors = res.objResult.vendors || [];
          this.options.categories = res.objResult.categories || [];
          this.options.taxProfiles = res.objResult.taxprofiles || [];
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/facility/quotations']);
  }

  submit(): void {
    if (!this.title || !this.title.trim()) {
      this.toastr.error('Invalid title');
      return;
    }
    if (!this.selectedWorkOrder) {
      this.toastr.error('Invalid work order');
      return;
    }
    if (!this.selectedVendors || (Array.isArray(this.selectedVendors) && this.selectedVendors.length === 0)) {
      this.toastr.error('Invalid vendors');
      return;
    }

    this.isSaving = true;
    const vendorCode = Array.isArray(this.selectedVendors) ? this.selectedVendors.join(',') : (this.selectedVendors || '');

    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      title: this.title || '',
      quotation_no: this.quotationno || '',
      vendor_code: vendorCode,
      code: this.editId || '',
      workorder_code: this.selectedWorkOrder,
      description: this.description || '',
      category: this.selectedCategory || '',
      est_completion_date: this.commonservice.parseInputDate(this.estimatedDate),
      reference_no: this.reference || '',
      lineItems: []
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(payload));

    this.facilityService.save_update_quotation(formData).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && (res.statusCode == 200 || res.statusCode == '200' || res.isSuccess)) {
          this.toastr.success('Successfully saved');
          this.router.navigate(['/facility/quotations']);
        } else {
          this.toastr.error(res?.message || 'Failed to save quotation');
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error('Error saving request quotation:', err);
        this.toastr.error('An error occurred while saving the quotation : ' + (err?.message || err));
      }
    });
  }
}
