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
  selector: 'app-create-landlord-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FileUploadComponent],
  templateUrl: './create-landlord-contract.component.html',
  styleUrl: './create-landlord-contract.component.scss'
})
export class CreateLandlordContractComponent implements OnInit {
  landlords: any[] = [];
  properties: any[] = [];
  units: any[] = [];
  rooms: any[] = [];
  cycles = [
    { id: 1, name: 'Monthly' },
    { id: 2, name: 'Quarterly' },
    { id: 3, name: 'Yearly' },
    { id: 4, name: 'Auto Renewal' }
  ];
  feeTypes = [
    { id: 1, name: 'Standard' },
    { id: 2, name: 'Percentage' },
    { id: 3, name: 'Per service charge' }
  ];
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
  contractDbId: number = 0;

  form = {
    landlord: null as string | null,
    property: null as string | null,
    name: '',
    cycle: 1 as number | null,
    startDate: '',
    endDate: '',
    feeType: 1 as number | null,
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
    this.loadLandlords();
    this.loadRooms();
    this.loadPaymentMethods();

    this.route.queryParams.subscribe(params => {
      const code = params['code'] || params['id'];
      if (code) {
        this.isEdit = true;
        this.contractCode = code;
        this.loadContractDetails();
      }
    });
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

  loadLandlords(): void {
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
      featureid: 'LANDLORDS'
    }).subscribe({
      next: (res: any) => {
        if (res && res.objResult && res.objResult.landlords) {
          this.landlords = res.objResult.landlords.map((l: any) => {
            const displayName = l.landlord ||
              (l.first_name ? `${l.first_name} ${l.last_name || ''}`.trim() : '') ||
              l.name ||
              l.contact_name ||
              l.company_name ||
              l.code || '-';
            return {
              code: l.code || l.id,
              name: displayName
            };
          });
        }
      },
      error: (err) => console.error('Error loading landlords:', err)
    });
  }

  loadRooms(unitCodeOverride?: string, callback?: () => void): void {
    const propertyCode = this.form.property || '';
    const selectedUnitCodes = this.selectedUnits.map(u => u.code).join(',');
    const unitCode = unitCodeOverride || this.pendingUnit || selectedUnitCodes || '';
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
            name: r.room_name || r.room_no || r.name || r.room_type || r.code
          }));
        } else {
          this.rooms = [];
        }
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.rooms = [];
        if (callback) callback();
      }
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
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 23,
      filterId: 0,
      filterText: this.contractCode,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult) {
          const detail = res.objResult.contract_dtls?.[0] || res.objResult.contract?.[0] || res.objResult.table?.[0] || {};
          this.contractDbId = Number(detail.id || detail.contract_id) || 0;
          
          const landlordCode = detail.landlord_code || detail.landlord || detail.landlord_id || null;
          const propertyCode = detail.property_codes || detail.property_code || detail.property || null;

          this.form = {
            landlord: landlordCode ? String(landlordCode) : null,
            property: propertyCode ? String(propertyCode) : null,
            name: detail.name || detail.contract_name || '',
            cycle: this.parseCycleId(detail.contract_cycle || detail.cycle),
            startDate: this.formatDateForInput(detail.start_date || detail.startDate),
            endDate: this.formatDateForInput(detail.end_date || detail.endDate),
            feeType: this.parseFeeTypeId(detail.management_fee_type || detail.fee_type),
            feeValue: String(detail.value !== undefined && detail.value !== null ? detail.value : (detail.fee_value || detail.contract_value || '0.00')),
            paymentCount: String(detail.no_of_payments || detail.payment_count || ''),
            pmaType: detail.pma_type_nm || detail.pma_type || null,
            paymentVia: detail.payment_type_nm || detail.payment_via || detail.payment_type || null,
            taxProfile: this.parseTaxProfile(detail.tax_profile_id || detail.tax_profile),
            chargePayments: String(detail.commission_no_of_payments || ''),
            chargePercent: String(detail.commission_percentage || '0.00'),
            chargeCommission: String(detail.commission_value || '0.00'),
            chargeFixed: String(detail.commission_fixed_value || '0.00'),
            chargeBalance: String(detail.commission_balance || '0.00'),
            notes: detail.notes || detail.remark || detail.remarks || ''
          };

          if (this.form.property) {
            this.loadUnitsForProperty(this.form.property, () => {
              if (res.objResult.units || res.objResult.table2) {
                const rawUnits = res.objResult.units || res.objResult.table2 || [];
                this.selectedUnits = rawUnits.map((u: any) => {
                  const uCode = String(u.code || u.unit_code || u.id);
                  const match = this.units.find(x => String(x.code) === uCode);
                  return {
                    code: uCode,
                    name: match ? match.name : (u.unit_code || u.code || uCode)
                  };
                });
              } else if (detail.units_codes || detail.units) {
                const codesStr = String(detail.units_codes || detail.units);
                const codesArr = codesStr.split(',').map(s => s.trim()).filter(Boolean);
                this.selectedUnits = codesArr.map(c => {
                  const match = this.units.find(x => String(x.code) === c);
                  return {
                    code: c,
                    name: match ? match.name : c
                  };
                });
              }
            });

            this.loadRooms(undefined, () => {
              if (res.objResult.rooms || res.objResult.table3) {
                const rawRooms = res.objResult.rooms || res.objResult.table3 || [];
                this.selectedRooms = rawRooms.map((r: any) => {
                  const rCode = String(r.code || r.room_code || r.id);
                  const match = this.rooms.find(x => String(x.code) === rCode);
                  return {
                    code: rCode,
                    name: match ? match.name : (r.room_name || r.room_no || r.code || rCode)
                  };
                });
              } else if (detail.rooms_codes || detail.rooms) {
                const codesStr = String(detail.rooms_codes || detail.rooms);
                const codesArr = codesStr.split(',').map(s => s.trim()).filter(Boolean);
                this.selectedRooms = codesArr.map(c => {
                  const match = this.rooms.find(x => String(x.code) === c);
                  return {
                    code: c,
                    name: match ? match.name : c
                  };
                });
              }
            });
          }

          if (res.objResult.payment_schedules || res.objResult.table5) {
            const schedules = res.objResult.payment_schedules || res.objResult.table5 || [];
            this.schedules = schedules.map((s: any) => ({
              account: s.account || s.account_name || 'Management Fee',
              amount: typeof s.amount === 'number' ? `AED ${s.amount.toFixed(2)}` : String(s.amount || 'AED 0.00'),
              due: this.formatDateForInput(s.due_date || s.due),
              recurrence: s.recurrence || 'Once',
              paymentVia: s.payment_via || s.payment_type_nm || ''
            }));
          }
        }
      },
      error: (err) => console.error("Error loading landlord contract details:", err)
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
    if (!dateStr || !dateStr.trim()) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    try {
      const cleanStr = dateStr.trim();
      const parts = cleanStr.split(/[\/\-\.]/);
      if (parts.length === 3) {
        let d = Number(parts[0]);
        let m = Number(parts[1]);
        let y = Number(parts[2]);
        if (parts[0].length === 4) {
          y = Number(parts[0]);
          m = Number(parts[1]);
          d = Number(parts[2]);
        }
        const yStr = String(y);
        const mStr = String(m).padStart(2, '0');
        const dStr = String(d).padStart(2, '0');
        return `${yStr}-${mStr}-${dStr}`;
      }
      const dt = new Date(cleanStr);
      if (!isNaN(dt.getTime())) {
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    } catch {
      // Fallback
    }
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
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
    const currentUnit = this.pendingUnit;
    if (this.pendingUnit) {
      const match = this.units.find(u => u.code === this.pendingUnit);
      if (match && !this.selectedUnits.some(u => u.code === match.code)) {
        this.selectedUnits = [...this.selectedUnits, match];
      }
    }
    this.pendingUnit = null;
    this.loadRooms(currentUnit || undefined);
  }

  addAllUnits(): void {
    this.unitMenuOpen = false;
    this.selectedUnits = [...this.units];
    this.loadRooms();
  }

  removeUnit(unit: any): void {
    this.selectedUnits = this.selectedUnits.filter((u) => u.code !== unit.code);
    this.loadRooms();
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
    void this.router.navigate(['/landlord-contracts']);
  }

  get selectedLandlordName(): string {
    if (!this.form.landlord) return '—';
    const match = this.landlords.find(l => l.code === this.form.landlord);
    return match ? match.name : this.form.landlord;
  }

  get selectedPropertyName(): string {
    if (!this.form.property) return '—';
    const match = this.properties.find(p => p.code === this.form.property);
    return match ? match.name : this.form.property;
  }

  parseCycleId(val: any): number {
    if (typeof val === 'number' && !isNaN(val) && val > 0) return val;
    if (!val) return 1;
    const s = String(val).toLowerCase();
    if (s === '1' || s.includes('month')) return 1;
    if (s === '2' || s.includes('quarter')) return 2;
    if (s === '3' || s.includes('year')) return 3;
    if (s === '4' || s.includes('auto') || s.includes('renew')) return 4;
    return Number(val) || 1;
  }

  parseFeeTypeId(val: any): number {
    if (typeof val === 'number' && !isNaN(val) && val > 0) return val;
    if (!val) return 1;
    const s = String(val).toLowerCase();
    if (s === '1' || s.includes('standard')) return 1;
    if (s === '2' || s.includes('percent')) return 2;
    if (s === '3' || s.includes('service')) return 3;
    return Number(val) || 1;
  }

  parseTaxProfile(val: any): string | null {
    if (!val) return null;
    const s = String(val).trim();
    if (s === '1' || s.toLowerCase().includes('standard')) return 'Standard rated';
    if (s === '2' || s.toLowerCase().includes('zero')) return 'Zero rated';
    if (s === '3' || s.toLowerCase().includes('exempt')) return 'Exempt';
    return s;
  }

  save(): void {
    const errors: string[] = [];
    if (!this.form.landlord) errors.push('Landlord is required.');
    if (!this.form.property) errors.push('Property is required.');

    if (!this.form.name && this.form.landlord) {
      this.form.name = `${this.selectedLandlordName} - Contract`;
    }

    if (errors.length > 0) {
      this.toastr.error(errors.join('<br>'), 'Validation', {
        enableHtml: true,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      });
      return;
    }

    const payment_schedules = this.schedules.map(s => ({
      amt: Number(String(s.amount).replace(/[^0-9.]/g, '')) || 0,
      account_id: 1,
      due_date: this.parseInputDate(s.due),
      invoice_no: '',
      code: '',
      recurring_cycle: 1,
      tax_profile: 1,
      payment_type: 169,
      on_interval_of: 1,
      advance_days: 0,
      memo: '',
      inclusive_tax: false,
      file_paths: ''
    }));

    const commission = {
      no_of_payments: Number(this.form.chargePayments) || 0,
      commission_type: 'Percentage',
      percentage: Number(this.form.chargePercent) || 0,
      commission: Number(this.form.chargeCommission) || 0,
      fixed_amt: Number(this.form.chargeFixed) || 0,
      balance: Number(this.form.chargeBalance) || 0
    };

    const currentUser = this.commonService.getCurrentUser();
    const userIdVal = Number(localStorage.getItem('userId')) || currentUser?.userId || 1;
    const companyIdVal = Number(localStorage.getItem('companyId')) || currentUser?.companyId || 1;
    const propertyVal = this.form.property || '';
    const landlordVal = this.form.landlord || '';
    const unitsVal = this.selectedUnits.map(u => u.code).join(',');
    const roomsVal = this.selectedRooms.map(r => r.code).join(',');

    const request = {
      code: this.contractCode || '',
      landlord_code: landlordVal,
      property_codes: propertyVal,
      units_codes: unitsVal,
      rooms_codes: roomsVal,
      name: this.form.name || '',
      contract_cycle: this.parseCycleId(this.form.cycle),
      start_date: this.parseInputDate(this.form.startDate),
      end_date: this.parseInputDate(this.form.endDate),
      management_fee_type: String(this.parseFeeTypeId(this.form.feeType)),
      annual_rent: 0,
      value: Number(this.form.feeValue) || 0,
      percentage: this.parseFeeTypeId(this.form.feeType) === 2 ? Number(this.form.feeValue) : 0,
      no_of_payments: Number(this.form.paymentCount) || 1,
      pma_type: 226,
      payment_type: 169,
      tax_profile_id: 1,
      notes: this.form.notes || '',
      contract_uploads: '',
      payment_uploads: '',
      payment_schedules: payment_schedules,
      clsC_Commission: commission,
      userid: userIdVal,
      company_id: companyIdVal,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1
    };

    console.log('Sending saveLandlordContract payload:', request);

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    this.contractImages.forEach(file => {
      formData.append('contract_uploads', file);
    });

    this.portfolioService.saveLandlordContract(formData).subscribe({
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
