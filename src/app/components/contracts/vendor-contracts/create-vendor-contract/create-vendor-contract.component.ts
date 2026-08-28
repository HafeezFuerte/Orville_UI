import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

interface ScheduleRow {
  account: string;
  amount: string;
  due: string;
  recurrence: string;
  paymentVia: string;
}

@Component({
  selector: 'app-create-vendor-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FileUploadComponent],
  templateUrl: './create-vendor-contract.component.html',
  styleUrl: './create-vendor-contract.component.scss'
})
export class CreateVendorContractComponent implements OnInit {
  vendors: any[] = [];
  properties: any[] = [];
  units: any[] = [];
  rooms: any[] = [];
  cycles = ['Monthly', 'Quarterly', 'Yearly', 'Auto Renewal'];
  feeTypes = ['Standard', 'Percentage', 'Per service charge'];
  pmaTypes = ['Standard', 'Full management', 'Let only'];
  taxProfiles = ['Standard rated', 'Zero rated', 'Exempt'];
  paymentViaOptions: any[] = [];
  
  pendingUnit: string | null = null;
  pendingRoom: string | null = null;
  unitMenuOpen = false;
  roomMenuOpen = false;

  selectedUnits: any[] = [];
  selectedRooms: any[] = [];
  schedules: ScheduleRow[] = [];
  contractImages: File[] = [];

  form = {
    vendor: null as string | null,
    property: null as string | null,
    name: '',
    cycle: null as string | null,
    startDate: '',
    endDate: '',
    feeType: null as string | null,
    feeValue: '0.00',
    paymentCount: '',
    pmaType: null as string | null,
    paymentVia: null as string | null,
    taxProfile: null as string | null,
    chargePayments: '',
    chargePercent: '0.00',
    chargeCommission: '0.00',
    chargeFixed: '0.00',
    chargeBalance: '0.00',
    notes: ''
  };

  isEdit = false;
  contractCode = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    this.loadVendors();
    this.loadRooms();
    this.loadPaymentMethods();

    const code = this.route.snapshot.queryParams['code'];
    if (code) {
      this.isEdit = true;
      this.contractCode = code;
      this.loadContractDetails();
    }
  }

  loadProperties(): void {
    this.portfolioService.getMasterByType({
      typeId: 11,
      filterId: 0,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.properties = res.objResult.table.map((p: any) => ({
            code: p.code || p.property_code || p.id,
            name: p.name || p.property || p.code
          }));
        }
      },
      error: (err) => console.error('Error loading properties:', err)
    });
  }

  loadVendors(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMastersByPaging({
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      filter_by: '',
      featureid: 'VENDORS'
    }).subscribe({
      next: (res: any) => {
        if (res && res.objResult && res.objResult.vendors) {
          this.vendors = res.objResult.vendors.map((v: any) => ({
            code: v.code || v.id,
            name: v.company_name || v.contact_name || v.name || v.code || '-'
          }));
        }
      },
      error: (err) => console.error('Error loading vendors:', err)
    });
  }

  loadRooms(): void {
    const propertyCode = this.form.property || '';
    const unitCode = this.pendingUnit || '';
    this.portfolioService.getMasterByType({
      typeId: 38,
      filterId: 0,
      filterText: propertyCode,
      filterText1: unitCode
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.rooms = res.objResult.table.map((r: any) => ({
            code: r.code || r.room_code || r.id,
            name: r.room_name || r.room_type || r.code
          }));
        }
      },
      error: (err) => console.error('Error loading rooms:', err)
    });
  }

  loadPaymentMethods(): void {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: 23,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.paymentViaOptions = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item.lookup_name || item.name || ''
          }));
        }
      },
      error: (err) => console.error('Error loading payment methods:', err)
    });
  }

  onPropertyChange(): void {
    this.pendingUnit = null;
    this.units = [];
    this.selectedUnits = [];
    this.pendingRoom = null;
    this.rooms = [];
    this.selectedRooms = [];
    if (this.form.property) {
      this.loadUnitsForProperty(this.form.property);
      this.loadRooms();
    }
  }

  loadUnitsForProperty(propertyCode: string, callback?: () => void): void {
    this.portfolioService.getMasterByType({
      typeId: 3,
      filterId: 0,
      filterText: propertyCode,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.units = res.objResult.table.map((u: any) => ({
            code: u.code || u.unit_code || u.id,
            name: `${u.unit_code || u.code} - ${u.unit_no || u.name}`
          }));
        }
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error loading units:', err);
        if (callback) callback();
      }
    });
  }

  loadContractDetails(): void {
    this.portfolioService.getMasterByType({
      typeId: 25,
      filterId: 0,
      filterText: this.contractCode,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res && res.statusCode === "200" && res.objResult) {
          const detail = res.objResult.contract_dtls?.[0] || res.objResult.contract?.[0] || res.objResult.table?.[0] || {};
          
          this.form = {
            vendor: detail.vendor_code || null,
            property: detail.property_codes || detail.property || null,
            name: detail.name || '',
            cycle: detail.contract_cycle || null,
            startDate: this.formatDateForInput(detail.start_date),
            endDate: this.formatDateForInput(detail.end_date),
            feeType: detail.is_per_service_charge ? 'Per service charge' : 'Standard',
            feeValue: String(detail.value || '0.00'),
            paymentCount: String(detail.no_of_payments || ''),
            pmaType: detail.pma_type_nm || null,
            paymentVia: detail.payment_type_nm || null,
            taxProfile: detail.tax_profile_id || null,
            chargePayments: '',
            chargePercent: '0.00',
            chargeCommission: '0.00',
            chargeFixed: '0.00',
            chargeBalance: '0.00',
            notes: detail.notes || ''
          };

          if (this.form.property) {
            this.loadUnitsForProperty(this.form.property);
          }

          if (res.objResult.units || res.objResult.table2) {
            const rawUnits = res.objResult.units || res.objResult.table2 || [];
            this.selectedUnits = rawUnits.map((u: any) => ({
              code: u.code || u.unit_code || u.id,
              name: u.unit_code || u.code
            }));
          }

          if (res.objResult.rooms || res.objResult.table3) {
            const rawRooms = res.objResult.rooms || res.objResult.table3 || [];
            this.selectedRooms = rawRooms.map((r: any) => ({
              code: r.code || r.room_code || r.id,
              name: r.room_name || r.code
            }));
          }

          if (res.objResult.payment_schedules || res.objResult.table5) {
            const schedules = res.objResult.payment_schedules || res.objResult.table5 || [];
            this.schedules = schedules.map((s: any) => ({
              account: s.account || s.account_name || 'Management Fee',
              amount: `AED ${(s.amount || 0).toFixed(2)}`,
              due: this.formatDateForInput(s.due_date || s.due),
              recurrence: s.recurrence || 'Once',
              paymentVia: s.payment_via || s.payment_type_nm || ''
            }));
          }
        }
      },
      error: (err) => console.error("Error loading vendor contract details:", err)
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
    }
  }

  parseInputDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const d = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const y = Number(parts[2]);
      return new Date(y, m, d).toISOString();
    }
    return new Date(dateStr).toISOString();
  }

  onFilesSelected(files: File[]): void {
    this.contractImages = files;
  }

  toggleUnitMenu(event: Event): void {
    event.stopPropagation();
    this.unitMenuOpen = !this.unitMenuOpen;
    this.roomMenuOpen = false;
  }

  addUnit(): void {
    this.unitMenuOpen = false;
    if (this.pendingUnit) {
      const match = this.units.find(u => u.code === this.pendingUnit);
      if (match && !this.selectedUnits.some(u => u.code === match.code)) {
        this.selectedUnits = [...this.selectedUnits, match];
      }
    }
    this.pendingUnit = null;
    this.loadRooms();
  }

  addAllUnits(): void {
    this.unitMenuOpen = false;
    this.selectedUnits = [...this.units];
  }

  removeUnit(unit: any): void {
    this.selectedUnits = this.selectedUnits.filter((u) => u.code !== unit.code);
  }

  toggleRoomMenu(event: Event): void {
    event.stopPropagation();
    this.roomMenuOpen = !this.roomMenuOpen;
    this.unitMenuOpen = false;
  }

  addRoom(): void {
    this.roomMenuOpen = false;
    if (this.pendingRoom) {
      const match = this.rooms.find(r => r.code === this.pendingRoom);
      if (match && !this.selectedRooms.some(r => r.code === match.code)) {
        this.selectedRooms = [...this.selectedRooms, match];
      }
    }
    this.pendingRoom = null;
  }

  addAllRooms(): void {
    this.roomMenuOpen = false;
    this.selectedRooms = [...this.rooms];
  }

  removeRoom(room: any): void {
    this.selectedRooms = this.selectedRooms.filter((r) => r.code !== room.code);
  }

  addPayment(): void {
    this.schedules = [
      ...this.schedules,
      { account: 'Management Fee', amount: 'AED 1000.00', due: '30-06-2026', recurrence: 'Once', paymentVia: 'Cash' }
    ];
  }

  removeSchedule(index: number): void {
    this.schedules = this.schedules.filter((_, i) => i !== index);
  }

  clearSchedules(): void {
    this.schedules = [];
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.unitMenuOpen = false;
    this.roomMenuOpen = false;
  }

  preview(): void {
    this.toastr.info('Preview uses the current form values. No file is generated.');
  }

  goBack(): void {
    void this.router.navigate(['/vendor-contracts']);
  }

  save(): void {
    const errors: string[] = [];
    if (!this.form.vendor) errors.push('Vendor is required.');
    if (!this.form.property) errors.push('Property is required.');
    if (!this.form.name) errors.push('Contract Name is required.');
    if (!this.form.startDate) errors.push('Start Date is required.');
    if (!this.form.endDate) errors.push('End Date is required.');

    if (errors.length > 0) {
      this.toastr.error(errors.join('<br>'), 'Validation', {
        enableHtml: true,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      });
      return;
    }

    const payment_schedules = this.schedules.map(s => ({
      account: s.account || '',
      amount: Number(s.amount.replace(/[^0-9.]/g, '')) || 0,
      due_date: this.parseInputDate(s.due),
      recurrence: s.recurrence || '',
      payment_via: s.paymentVia || ''
    }));

    const currentUser = this.commonService.getCurrentUser();
    const request = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code: this.contractCode || '',
      vendor_code: this.form.vendor || '',
      units_codes: this.selectedUnits.map(u => u.code).join(','),
      rooms_codes: this.selectedRooms.map(r => r.code).join(','),
      property_codes: this.form.property || '',
      common_area: '',
      name: this.form.name,
      contract_cycle: this.form.cycle || 'Monthly',
      start_date: this.parseInputDate(this.form.startDate),
      end_date: this.parseInputDate(this.form.endDate),
      is_per_service_charge: this.form.feeType === 'Per service charge',
      value: Number(this.form.feeValue) || 0,
      no_of_payments: Number(this.form.paymentCount) || 1,
      payment_type: 169, // Default Standard Cheque payment type ID
      notes: this.form.notes || '',
      payment_schedules: payment_schedules
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    this.contractImages.forEach(file => {
      formData.append('contract_uploads', file);
    });

    this.portfolioService.saveVendorContract(formData).subscribe({
      next: (res) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200' || res.isSuccess)) {
          this.toastr.success(res.message || 'Contract saved successfully');
          this.goBack();
        } else {
          this.toastr.error(res.message || 'Failed to save contract');
        }
      },
      error: (err) => {
        console.error('Error saving contract:', err);
        this.toastr.error('An error occurred while saving the contract');
      }
    });
  }
}
