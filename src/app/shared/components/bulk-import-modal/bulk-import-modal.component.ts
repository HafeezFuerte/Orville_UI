import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { PropertiesService } from '../../../components/portfolio/services/properties.service';
import { PortfolioService } from '../../../components/portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';

export interface ManualPropertyRow {
  code?: string;
  propertyName: string;
  propertyType: number | null;
  totalUnits: number | null;
  address1: string;
  community: string;
}

export interface ManualUnitRow {
  propertyId: any;
  unitName: string;
  unitNo: string;
  unitType: number | null;
  floor: number | null;
  marketRent: number | null;
}

export interface ManualRoomRow {
  propertyId: any;
  unitId: any;
  roomName: string;
  roomNo: string;
  roomType: number | null;
  marketRent: number | null;
}

export interface ManualContactRow {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  companyName: string;
}

export interface ImportResultSummary {
  total: number;
  imported: number;
  failed: number;
  errors: { row: number; name: string; message: string }[];
}

@Component({
  selector: 'app-bulk-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './bulk-import-modal.component.html',
  styleUrls: ['./bulk-import-modal.component.scss'],
})
export class BulkImportModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() entityType: 'property' | 'unit' | 'room' | 'tenant' | 'landlord' | 'technician' | 'vendor' = 'property';
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() importCompleted = new EventEmitter<ImportResultSummary>();

  private propertiesService = inject(PropertiesService);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);
  private toastr = inject(ToastrService);
  public translate = inject(TranslateService);

  activeTab: 'file' | 'manual' = 'manual';
  currentStep: 'input' | 'importing' | 'completed' = 'input';

  // Master Dropdown Data
  propertyTypes: any[] = [];
  propertiesList: any[] = [];
  unitsList: any[] = [];
  unitTypesList: any[] = [];
  roomTypesList: any[] = [];
  unitsByProperty: { [propertyCode: string]: any[] } = {};
  existingDbRecords: any[] = [];

  // File Upload State
  selectedFile: File | null = null;
  fileName = '';
  fileSize = '';
  isDragOver = false;
  parsedFileRows: any[] = [];
  filePreviewHeaders: string[] = [];
  filePreviewRows: any[] = [];

  // Manual Entry Rows
  manualPropertyRows: ManualPropertyRow[] = [];
  manualUnitRows: ManualUnitRow[] = [];
  manualRoomRows: ManualRoomRow[] = [];
  manualContactRows: ManualContactRow[] = [];

  // Progress & Execution Counters
  totalToImport = 0;
  propertiesToBeImported = 0;
  propertiesImported = 0;
  failedCount = 0;
  progressPercent = 0;
  currentProcessingName = '';
  errorLog: { row: number; name: string; message: string }[] = [];
  duplicateCount = 0;
  duplicateSkippedCount = 0;
  duplicateDbCount = 0;
  duplicateFileCount = 0;
  duplicateLogs: { row: number; name: string; code: string; reason: string; type: 'db' | 'batch' }[] = [];

  ngOnInit(): void {
    this.initRows();
    this.loadLookups();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      this.currentStep = 'input';
      this.initRows();
      this.loadLookups();
    }
  }

  get isContactEntity(): boolean {
    return ['tenant', 'landlord', 'technician', 'vendor'].includes(this.entityType);
  }

  get entityTitle(): string {
    switch (this.entityType) {
      case 'unit':
        return this.translate.instant('web.bulkImport.entityUnit');
      case 'room':
        return this.translate.instant('web.bulkImport.entityRoom');
      case 'tenant':
        return this.translate.instant('web.bulkImport.entityTenant');
      case 'landlord':
        return this.translate.instant('web.bulkImport.entityLandlord');
      case 'technician':
        return this.translate.instant('web.bulkImport.entityTechnician');
      case 'vendor':
        return this.translate.instant('web.bulkImport.entityVendor');
      case 'property':
      default:
        return this.translate.instant('web.bulkImport.entityProperty');
    }
  }

  get entityPluralTitle(): string {
    switch (this.entityType) {
      case 'unit':
        return this.translate.instant('web.bulkImport.entityUnits');
      case 'room':
        return this.translate.instant('web.bulkImport.entityRooms');
      case 'tenant':
        return this.translate.instant('web.bulkImport.entityTenants');
      case 'landlord':
        return this.translate.instant('web.bulkImport.entityLandlords');
      case 'technician':
        return this.translate.instant('web.bulkImport.entityTechnicians');
      case 'vendor':
        return this.translate.instant('web.bulkImport.entityVendors');
      case 'property':
      default:
        return this.translate.instant('web.bulkImport.entityProperties');
    }
  }

  initRows(): void {
    if (this.entityType === 'property') {
      this.manualPropertyRows = [this.createEmptyPropertyRow()];
    } else if (this.entityType === 'unit') {
      this.manualUnitRows = [this.createEmptyUnitRow()];
    } else if (this.entityType === 'room') {
      this.manualRoomRows = [this.createEmptyRoomRow()];
    } else if (this.isContactEntity) {
      this.manualContactRows = [this.createEmptyContactRow()];
    }
    this.updateCounters();
  }

  createEmptyPropertyRow(): ManualPropertyRow {
    return {
      code: '',
      propertyName: '',
      propertyType: this.propertyTypes.length > 0 ? this.propertyTypes[0].id : null,
      totalUnits: null,
      address1: '',
      community: '',
    };
  }

  createEmptyUnitRow(): ManualUnitRow {
    const defaultProp = this.propertiesList.length > 0 ? (this.propertiesList[0].code || this.propertiesList[0].id) : null;
    return {
      propertyId: defaultProp,
      unitName: '',
      unitNo: '',
      unitType: this.unitTypesList.length > 0 ? this.unitTypesList[0].id : null,
      floor: null,
      marketRent: null,
    };
  }

  createEmptyRoomRow(): ManualRoomRow {
    const defaultProp = this.propertiesList.length > 0 ? (this.propertiesList[0].code || this.propertiesList[0].id) : null;
    const defaultUnits = defaultProp ? this.getUnitsForProperty(defaultProp) : [];
    return {
      propertyId: defaultProp,
      unitId: defaultUnits.length > 0 ? (defaultUnits[0].code || defaultUnits[0].unit_code || defaultUnits[0].id) : null,
      roomName: '',
      roomNo: '',
      roomType: this.roomTypesList.length > 0 ? this.roomTypesList[0].id : null,
      marketRent: null,
    };
  }

  createEmptyContactRow(): ManualContactRow {
    return {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      companyName: '',
    };
  }

  getUnitsForProperty(propertyId: any): any[] {
    if (!propertyId) return [];
    const propKey = String(propertyId);
    if (!this.unitsByProperty[propKey]) {
      this.unitsByProperty[propKey] = [];
      const prop = this.propertiesList.find((p) => p.code === propertyId || p.id === propertyId);
      const propCode = prop?.code || prop?.property_code || propKey;
      this.portfolioService
        .getMasterByType({
          typeId: 3,
          filterId: 0,
          filterText: propCode,
          filterText1: '',
        })
        .subscribe({
          next: (res: any) => {
            if ((res?.statusCode == 200 || res?.statusCode === '200') && res?.objResult?.table) {
              this.unitsByProperty[propKey] = res.objResult.table;
              this.manualRoomRows.forEach((r) => {
                if (String(r.propertyId) === propKey && !r.unitId && res.objResult.table.length > 0) {
                  r.unitId = res.objResult.table[0].code || res.objResult.table[0].unit_code || res.objResult.table[0].id;
                }
              });
            }
          },
          error: (err: any) => {
            console.error('Error fetching units for property:', propCode, err);
          }
        });
    }
    return this.unitsByProperty[propKey] || [];
  }

  onRoomPropertyChange(row: ManualRoomRow): void {
    row.unitId = null;
    if (row.propertyId) {
      const units = this.getUnitsForProperty(row.propertyId);
      if (units && units.length > 0) {
        row.unitId = units[0].code || units[0].unit_code || units[0].id;
      }
    }
    this.onManualFieldChange();
  }

  loadLookups(): void {
    // Load Property Types (typeId: 2, filterId: 1)
    if (this.entityType === 'property') {
      this.portfolioService
        .getMasterByType({ typeId: 2, filterId: 1, filterText: '', filterText1: '' })
        .subscribe({
          next: (res: any) => {
            if (res?.statusCode === '200' && res?.objResult?.table) {
              this.propertyTypes = res.objResult.table;
              if (this.manualPropertyRows.length > 0 && !this.manualPropertyRows[0].propertyType) {
                this.manualPropertyRows[0].propertyType = this.propertyTypes[0]?.id || null;
              }
            }
          },
        });
    }

    // Load properties list for duplicate checking in properties and dropdowns in units/rooms
    this.portfolioService
      .getMasterByType({ typeId: 11, filterId: 0, filterText: '', filterText1: '' })
      .subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' && res?.objResult?.table) {
            this.propertiesList = res.objResult.table;
            if (this.propertiesList.length > 0) {
              const firstPropCode = this.propertiesList[0].code || this.propertiesList[0].id;
              if (this.entityType === 'unit') {
                this.manualUnitRows.forEach((r) => {
                  if (!r.propertyId) r.propertyId = firstPropCode;
                });
              }
              if (this.entityType === 'room') {
                this.manualRoomRows.forEach((r) => {
                  if (!r.propertyId) r.propertyId = firstPropCode;
                });
                this.getUnitsForProperty(firstPropCode);
              }
            }
            this.updateCounters();
          }
        },
      });

    // Also fetch full properties list for comprehensive duplicate code coverage
    if (this.entityType === 'property') {
      const user = this.commonService.getCurrentUser();
      this.propertiesService
        .getProperties({
          userid: user?.userId || 1,
          company_id: user?.companyId || 1,
          clientId: user?.clientId || '',
          source: 'web',
          languageid: 1,
          page_no: 1,
          seqno: 0,
          search_keyword: '',
          pagecount: 5000,
          filter_by: '',
          filter_list: '[]',
          featureid: 'Property'
        })
        .subscribe({
          next: (res: any) => {
            if (res?.statusCode === '200' && Array.isArray(res.objResult?.property)) {
              const list = res.objResult.property;
              const currentList = [...this.propertiesList];
              for (const p of list) {
                const code = p.code || p.property_code;
                const name = p.name || p.property_name;
                if (
                  !currentList.some(
                    (ex) =>
                      (code && (ex.code === code || ex.property_code === code)) ||
                      (name && ex.name?.toLowerCase() === name?.toLowerCase())
                  )
                ) {
                  currentList.push(p);
                }
              }
              this.propertiesList = currentList;
              this.updateCounters();
            }
          },
          error: () => {}
        });
    }

    // If unit, load unit types and existing DB units for duplicate detection
    if (this.entityType === 'unit') {
      this.portfolioService
        .getMasterByType({ typeId: 2, filterId: 3, filterText: '', filterText1: '' })
        .subscribe({
          next: (res: any) => {
            if (res?.statusCode === '200' && res?.objResult?.table) {
              this.unitTypesList = res.objResult.table;
            }
          },
        });

      const user = this.commonService.getCurrentUser();
      this.propertiesService
        .getUnits({
          userid: user?.userId || 1,
          company_id: user?.companyId || 1,
          clientId: user?.clientId || '',
          source: 'web',
          languageid: 1,
          page_no: 1,
          seqno: 0,
          search_keyword: '',
          pagecount: 5000,
          filter_by: '',
          filter_list: '[]',
          featureid: 'Units'
        })
        .subscribe({
          next: (res: any) => {
            if (res?.statusCode === '200' && Array.isArray(res.objResult?.units)) {
              this.existingDbRecords = res.objResult.units;
              this.updateCounters();
            }
          },
          error: () => {}
        });
    }

    // If room, load room types and existing DB rooms for duplicate detection
    if (this.entityType === 'room') {
      this.portfolioService
        .getMasterByType({ typeId: 2, filterId: 15, filterText: '', filterText1: '' })
        .subscribe({
          next: (res: any) => {
            if (res?.statusCode === '200' && res?.objResult?.table) {
              this.roomTypesList = res.objResult.table;
            }
          },
        });

      const user = this.commonService.getCurrentUser();
      this.propertiesService
        .getUnits({
          userid: user?.userId || 1,
          company_id: user?.companyId || 1,
          clientId: user?.clientId || '',
          source: 'web',
          languageid: 1,
          page_no: 1,
          seqno: 0,
          search_keyword: '',
          pagecount: 5000,
          filter_by: '',
          filter_list: '[]',
          featureid: 'Rooms'
        })
        .subscribe({
          next: (res: any) => {
            if (res?.statusCode === '200' && Array.isArray(res.objResult?.units)) {
              this.existingDbRecords = res.objResult.units;
              this.updateCounters();
            }
          },
          error: () => {}
        });
    }

    // Contact entities (tenants, landlords, vendors, technicians)
    if (this.isContactEntity) {
      const featMap: Record<string, string> = {
        tenant: 'Tenants',
        landlord: 'Landlords',
        vendor: 'Vendors',
        technician: 'Technicians'
      };
      const feat = featMap[this.entityType] || 'Tenants';
      const user = this.commonService.getCurrentUser();

      this.propertiesService
        .getTenants({
          userid: user?.userId || 1,
          company_id: user?.companyId || 1,
          clientId: user?.clientId || '',
          source: 'web',
          languageid: 1,
          page_no: 1,
          seqno: 0,
          search_keyword: '',
          pagecount: 5000,
          filter_by: '',
          filter_list: '[]',
          featureid: feat
        })
        .subscribe({
          next: (res: any) => {
            const list = res?.objResult?.tenants || res?.objResult?.table || res?.objResult?.data;
            if (res?.statusCode === '200' && Array.isArray(list)) {
              this.existingDbRecords = list;
              this.updateCounters();
            }
          },
          error: () => {}
        });
    }
  }

  switchTab(tab: 'file' | 'manual'): void {
    if (this.currentStep === 'importing') return;
    this.activeTab = tab;
    this.updateCounters();
  }

  // --- Manual Row Operations ---
  addManualRow(): void {
    if (this.entityType === 'property') {
      this.manualPropertyRows.push(this.createEmptyPropertyRow());
    } else if (this.entityType === 'unit') {
      this.manualUnitRows.push(this.createEmptyUnitRow());
    } else if (this.entityType === 'room') {
      this.manualRoomRows.push(this.createEmptyRoomRow());
    } else if (this.isContactEntity) {
      this.manualContactRows.push(this.createEmptyContactRow());
    }
    this.updateCounters();
  }

  removeManualRow(index: number): void {
    if (this.entityType === 'property') {
      if (this.manualPropertyRows.length > 1) {
        this.manualPropertyRows.splice(index, 1);
      } else {
        this.manualPropertyRows[0] = this.createEmptyPropertyRow();
      }
    } else if (this.entityType === 'unit') {
      if (this.manualUnitRows.length > 1) {
        this.manualUnitRows.splice(index, 1);
      } else {
        this.manualUnitRows[0] = this.createEmptyUnitRow();
      }
    } else if (this.entityType === 'room') {
      if (this.manualRoomRows.length > 1) {
        this.manualRoomRows.splice(index, 1);
      } else {
        this.manualRoomRows[0] = this.createEmptyRoomRow();
      }
    } else if (this.isContactEntity) {
      if (this.manualContactRows.length > 1) {
        this.manualContactRows.splice(index, 1);
      } else {
        this.manualContactRows[0] = this.createEmptyContactRow();
      }
    }
    this.updateCounters();
  }

  onManualFieldChange(): void {
    this.updateCounters();
  }

  getExistingDbIdentifiers(): {
    codes: Set<string>;
    names: Set<string>;
    emails: Set<string>;
    mobiles: Set<string>;
    unitKeys: Set<string>;
    roomKeys: Set<string>;
  } {
    const codes = new Set<string>();
    const names = new Set<string>();
    const emails = new Set<string>();
    const mobiles = new Set<string>();
    const unitKeys = new Set<string>();
    const roomKeys = new Set<string>();

    if (this.entityType === 'property') {
      if (Array.isArray(this.propertiesList)) {
        for (const p of this.propertiesList) {
          const c = (p.code || p.property_code || '').toString().trim().toUpperCase();
          if (c) codes.add(c);
          const n = (p.name || p.property_name || p.property || '').toString().trim().toUpperCase();
          if (n) names.add(n);
        }
      }
    } else if (this.entityType === 'unit') {
      if (Array.isArray(this.existingDbRecords)) {
        for (const u of this.existingDbRecords) {
          const pId = (u.property_id || u.propertyId || u.property_code || '').toString().trim().toUpperCase();
          const uNo = (u.unit_no || u.unitNo || u.name || u.unit_name || '').toString().trim().toUpperCase();
          const c = (u.code || u.unit_code || '').toString().trim().toUpperCase();
          if (c) codes.add(c);
          if (uNo) names.add(uNo);
          if (uNo) unitKeys.add(`${pId}:${uNo}`);
        }
      }
    } else if (this.entityType === 'room') {
      if (Array.isArray(this.existingDbRecords)) {
        for (const r of this.existingDbRecords) {
          const uId = (r.unit_id || r.unitId || r.unit_code || '').toString().trim().toUpperCase();
          const rNo = (r.room_no || r.roomNo || r.name || r.room_name || '').toString().trim().toUpperCase();
          const c = (r.code || r.room_code || '').toString().trim().toUpperCase();
          if (c) codes.add(c);
          if (rNo) names.add(rNo);
          if (rNo) roomKeys.add(`${uId}:${rNo}`);
        }
      }
    } else if (this.isContactEntity) {
      if (Array.isArray(this.existingDbRecords)) {
        for (const c of this.existingDbRecords) {
          const em = (c.email || c.email_address || '').toString().trim().toUpperCase();
          if (em) emails.add(em);
          const mob = (c.mobile || c.mobile_no || c.phone || '').toString().trim().replace(/[^0-9]/g, '');
          if (mob) mobiles.add(mob);
          const cd = (c.code || c.contact_code || '').toString().trim().toUpperCase();
          if (cd) codes.add(cd);
          const fn = (c.name || `${c.first_name || ''} ${c.last_name || ''}`).toString().trim().toUpperCase();
          if (fn) names.add(fn);
        }
      }
    }

    return { codes, names, emails, mobiles, unitKeys, roomKeys };
  }

  analyzeDuplicates(rawRows: any[]): {
    uniqueRows: any[];
    duplicateCount: number;
    duplicateSkippedCount: number;
    duplicateDbCount: number;
    duplicateFileCount: number;
    duplicateLogs: { row: number; name: string; code: string; reason: string; type: 'db' | 'batch' }[];
  } {
    const { codes: dbCodes, names: dbNames, emails: dbEmails, mobiles: dbMobiles, unitKeys, roomKeys } = this.getExistingDbIdentifiers();
    const seenBatchKeys = new Map<string, { firstIndex: number; count: number; row: any }>();
    const duplicateLogs: { row: number; name: string; code: string; reason: string; type: 'db' | 'batch' }[] = [];
    const uniqueRows: any[] = [];

    let duplicateDbCount = 0;
    let duplicateFileCount = 0;

    const getRowKey = (r: any): string => {
      if (this.entityType === 'property') {
        const c = (r.code || '').toString().trim().toUpperCase();
        if (c) return `CODE:${c}`;
        return `NAME:${(r.name || '').toString().trim().toUpperCase()}`;
      } else if (this.entityType === 'unit') {
        const pId = String(r.propertyId || '');
        const uNo = (r.unitNo || r.name || '').toString().trim().toUpperCase();
        return `UNIT:${pId}:${uNo}`;
      } else if (this.entityType === 'room') {
        const pId = String(r.propertyId || '');
        const uId = String(r.unitId || '');
        const rNo = (r.roomNo || r.name || '').toString().trim().toUpperCase();
        return `ROOM:${pId}:${uId}:${rNo}`;
      } else {
        const email = (r.email || '').toString().trim().toUpperCase();
        const mobile = (r.mobile || '').toString().trim().toUpperCase();
        if (email) return `EMAIL:${email}`;
        if (mobile) return `MOBILE:${mobile}`;
        return `CONTACT:${(r.name || '').toString().trim().toUpperCase()}`;
      }
    };

    for (let i = 0; i < rawRows.length; i++) {
      const r = rawRows[i];
      const rowNum = i + 1;
      const key = getRowKey(r);
      const codeVal = (r.code || '').toString().trim();
      const nameVal = (r.name || '').toString().trim();

      // Check DB duplication vs Update mode:
      // If code is provided and exists in DB -> API performs an UPDATE (do not block)
      // If code is NOT provided and name already exists in DB -> Block as accidental duplicate
      let isDbDup = false;
      let dbReason = '';

      if (this.entityType === 'property') {
        const normCode = codeVal.toUpperCase();
        const normName = nameVal.toUpperCase();
        if (normCode && dbCodes.has(normCode)) {
          // Existing property code provided -> Update mode (send to API)
          r.isUpdate = true;
        } else if (!normCode && normName && dbNames.has(normName)) {
          isDbDup = true;
          dbReason = `Property with name '${nameVal}' already exists in database. To update it, please include the Property Code.`;
        }
      } else if (this.entityType === 'unit') {
        const normCode = codeVal.toUpperCase();
        const normUnitNo = (r.unitNo || nameVal).toString().trim().toUpperCase();
        const pKey = String(r.propertyId || '').trim().toUpperCase();
        if (normCode && dbCodes.has(normCode)) {
          r.isUpdate = true;
        } else if (!normCode && normUnitNo && unitKeys.has(`${pKey}:${normUnitNo}`)) {
          isDbDup = true;
          dbReason = `Unit '${normUnitNo}' already exists under this property. To update it, please include the Unit Code.`;
        }
      } else if (this.entityType === 'room') {
        const normCode = codeVal.toUpperCase();
        const normRoomNo = (r.roomNo || nameVal).toString().trim().toUpperCase();
        const uKey = String(r.unitId || '').trim().toUpperCase();
        if (normCode && dbCodes.has(normCode)) {
          r.isUpdate = true;
        } else if (!normCode && normRoomNo && roomKeys.has(`${uKey}:${normRoomNo}`)) {
          isDbDup = true;
          dbReason = `Room '${normRoomNo}' already exists under this unit. To update it, please include the Room Code.`;
        }
      } else if (this.isContactEntity) {
        const normCode = codeVal.toUpperCase();
        const normEmail = (r.email || '').toString().trim().toUpperCase();
        const normMobile = (r.mobile || '').toString().trim().replace(/[^0-9]/g, '');
        if (normCode && dbCodes.has(normCode)) {
          r.isUpdate = true;
        } else if (!normCode && normEmail && dbEmails.has(normEmail)) {
          isDbDup = true;
          dbReason = `${this.entityTitle} with email '${r.email}' already exists. To update it, please include the Code.`;
        } else if (!normCode && normMobile && dbMobiles.has(normMobile)) {
          isDbDup = true;
          dbReason = `${this.entityTitle} with mobile '${r.mobile}' already exists. To update it, please include the Code.`;
        }
      }

      if (isDbDup) {
        duplicateDbCount++;
        duplicateLogs.push({
          row: rowNum,
          name: nameVal,
          code: codeVal,
          reason: dbReason,
          type: 'db'
        });
        r.isDuplicate = true;
        r.duplicateReason = dbReason;
        continue;
      }

      // Check intra-batch duplicate (e.g. 4 identical rows in the file)
      if (seenBatchKeys.has(key)) {
        const prev = seenBatchKeys.get(key)!;
        prev.count++;
        duplicateFileCount++;
        const actionLabel = r.isUpdate ? 'update' : 'import';
        const reason = `Duplicate row in file (matches row #${prev.firstIndex} with ${codeVal ? "code: '" + codeVal + "'" : "name: '" + nameVal + "'"}). Only first row will be ${actionLabel}d.`;
        duplicateLogs.push({
          row: rowNum,
          name: nameVal,
          code: codeVal,
          reason,
          type: 'batch'
        });
        r.isDuplicate = true;
        r.duplicateReason = reason;
      } else {
        seenBatchKeys.set(key, { firstIndex: rowNum, count: 1, row: r });
        r.isDuplicate = false;
        r.duplicateReason = '';
        uniqueRows.push(r);
      }
    }

    // Total duplicate identified count
    let groupedBatchDups = 0;
    seenBatchKeys.forEach((val) => {
      if (val.count > 1) {
        groupedBatchDups += val.count;
      }
    });

    const totalDuplicatesIdentified = duplicateDbCount + (groupedBatchDups > 0 ? groupedBatchDups : duplicateFileCount);
    const duplicateSkippedCount = duplicateDbCount + duplicateFileCount;

    return {
      uniqueRows,
      duplicateCount: totalDuplicatesIdentified,
      duplicateSkippedCount,
      duplicateDbCount,
      duplicateFileCount,
      duplicateLogs
    };
  }

  updateCounters(): void {
    let rawList: any[] = [];

    if (this.activeTab === 'manual') {
      if (this.entityType === 'property') {
        const valid = this.manualPropertyRows.filter(
          (r) => r.propertyName && r.propertyName.trim().length > 0
        );
        rawList = valid.map((r) => ({
          code: (r.code || '').trim(),
          name: r.propertyName.trim(),
          propertyType: r.propertyType || this.propertyTypes[0]?.id || 1,
          totalUnits: Number(r.totalUnits) || 0,
          address1: r.address1 || '',
          community: r.community || '',
          prefix: '',
          reference: '',
          landNo: '',
          floors: 0,
          parkingSpaces: 0,
        }));
      } else if (this.entityType === 'unit') {
        const valid = this.manualUnitRows.filter(
          (r) => r.unitName && r.unitName.trim().length > 0
        );
        rawList = valid.map((r) => ({
          name: r.unitName.trim(),
          unitNo: r.unitNo || r.unitName.trim(),
          propertyId: r.propertyId || this.propertiesList[0]?.id || 0,
          unitType: r.unitType || this.unitTypesList[0]?.id || 1,
          floor: Number(r.floor) || 0,
          marketRent: Number(r.marketRent) || 0,
        }));
      } else if (this.entityType === 'room') {
        const valid = this.manualRoomRows.filter(
          (r) => r.roomName && r.roomName.trim().length > 0
        );
        rawList = valid.map((r) => ({
          name: r.roomName.trim(),
          roomNo: r.roomNo || r.roomName.trim(),
          propertyId: r.propertyId || this.propertiesList[0]?.id || 0,
          unitId: r.unitId || this.unitsList[0]?.id || 0,
          roomType: r.roomType || this.roomTypesList[0]?.id || 1,
          marketRent: Number(r.marketRent) || 0,
        }));
      } else if (this.isContactEntity) {
        const valid = this.manualContactRows.filter(
          (r) => (r.firstName && r.firstName.trim().length > 0) || (r.lastName && r.lastName.trim().length > 0)
        );
        rawList = valid.map((r) => ({
          name: `${r.firstName} ${r.lastName}`.trim() || r.companyName || 'Contact',
          firstName: r.firstName?.trim() || '',
          lastName: r.lastName?.trim() || '',
          email: r.email?.trim() || '',
          mobile: r.mobile?.trim() || '',
          companyName: r.companyName?.trim() || '',
        }));
      }
    } else {
      rawList = [...this.parsedFileRows];
    }

    const dupResult = this.analyzeDuplicates(rawList);
    this.duplicateCount = dupResult.duplicateCount;
    this.duplicateSkippedCount = dupResult.duplicateSkippedCount;
    this.duplicateDbCount = dupResult.duplicateDbCount;
    this.duplicateFileCount = dupResult.duplicateFileCount;
    this.duplicateLogs = dupResult.duplicateLogs;

    this.propertiesToBeImported = dupResult.uniqueRows.length;
    this.totalToImport = dupResult.uniqueRows.length;
  }

  // --- File Upload & Parsing ---
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File): void {
    const validExts = ['.xlsx', '.xls', '.csv'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExts.some((ext) => lowerName.endsWith(ext));
    if (!isValid) {
      this.toastr.error('Please upload a valid Excel (.xlsx, .xls) or CSV file.', 'Invalid File');
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.fileSize = `${(file.size / 1024).toFixed(1)} KB`;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!Array.isArray(rawJson) || rawJson.length === 0) {
          this.toastr.warning('The uploaded sheet is empty.', 'Empty File');
          this.parsedFileRows = [];
          this.updateCounters();
          return;
        }

        // Map sheet columns to normalized fields
        this.parsedFileRows = rawJson
          .map((row) => this.normalizeFileRow(row))
          .filter((row) => row && row.name && row.name.trim().length > 0);

        if (this.parsedFileRows.length === 0) {
          this.toastr.warning(
            'No valid records found in the sheet. Ensure the file contains the Property Name column.',
            'Warning'
          );
        } else {
          this.filePreviewHeaders = Object.keys(rawJson[0]).slice(0, 8);
          this.filePreviewRows = rawJson.slice(0, 10);
          this.updateCounters();

          if (this.duplicateCount > 0) {
            this.toastr.info(
              `Loaded ${this.parsedFileRows.length} records. Identified ${this.duplicateCount} duplicate(s) (${this.propertiesToBeImported} unique to import).`,
              'Duplicates Identified'
            );
          } else {
            this.toastr.success(
              `Loaded ${this.parsedFileRows.length} valid ${this.entityPluralTitle.toLowerCase()} from file.`,
              'File Parsed'
            );
          }
        }
      } catch (err) {
        console.error('Error parsing sheet:', err);
        this.toastr.error('Failed to parse file. Please verify file format.', 'Error');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  normalizeFileRow(row: any): any {
    // Normalizes row fields across case variations
    const getVal = (...keys: string[]): any => {
      for (const k of keys) {
        const match = Object.keys(row).find((rk) => rk.trim().toLowerCase() === k.toLowerCase());
        if (match && row[match] !== undefined && row[match] !== '') {
          return row[match];
        }
      }
      return '';
    };

    if (this.entityType === 'property') {
      const code = getVal('Property Code', 'PropertyCode', 'Code', 'code', 'property_code', 'Property_Code');
      const name = getVal('Property Name', 'PropertyName', 'Name', 'property_name', 'Property');
      const typeRaw = getVal('Property Type', 'PropertyType', 'Type', 'property_type');
      let typeId = 0;
      if (typeRaw) {
        const found = this.propertyTypes.find(
          (t) =>
            String(t.id) === String(typeRaw) ||
            (t.name && t.name.toLowerCase() === String(typeRaw).toLowerCase())
        );
        typeId = found ? found.id : Number(typeRaw) || (this.propertyTypes[0]?.id || 1);
      } else {
        typeId = this.propertyTypes[0]?.id || 1;
      }

      return {
        code: String(code || '').trim(),
        name: String(name).trim(),
        propertyType: typeId,
        totalUnits: Number(getVal('Total Units', 'TotalUnits', 'Units', 'total_units')) || 0,
        address1: getVal('Address', 'Address 1', 'Address1', 'address1'),
        community: getVal('Community', 'community'),
        prefix: getVal('Prefix', 'prefix'),
        reference: getVal('Reference', 'reference'),
        landNo: getVal('Makani No', 'Makani', 'Land No', 'land_no', 'makaniNo'),
        floors: Number(getVal('Floors', 'No of Floors', 'floors')) || 0,
        parkingSpaces: Number(getVal('Parking Spaces', 'Parkings', 'parkingSpaces')) || 0,
      };
    } else if (this.entityType === 'unit') {
      const code = getVal('Unit Code', 'UnitCode', 'Code', 'code', 'unit_code');
      const name = getVal('Unit Name', 'UnitName', 'Name', 'unit_name');
      const unitNo = getVal('Unit No', 'Unit Number', 'UnitNo', 'unit_no') || name;
      return {
        code: String(code || '').trim(),
        name: String(name).trim(),
        unitNo: String(unitNo).trim(),
        propertyId: Number(getVal('Property ID', 'PropertyId', 'Property')) || (this.propertiesList[0]?.id || 0),
        unitType: Number(getVal('Unit Type', 'UnitType')) || (this.unitTypesList[0]?.id || 1),
        floor: Number(getVal('Floor', 'floor')) || 0,
        marketRent: Number(getVal('Market Rent', 'MarketRent', 'Rent')) || 0,
      };
    } else if (this.entityType === 'room') {
      const code = getVal('Room Code', 'RoomCode', 'Code', 'code', 'room_code');
      const name = getVal('Room Name', 'RoomName', 'Name', 'room_name');
      const roomNo = getVal('Room No', 'Room Number', 'RoomNo', 'room_no') || name;
      return {
        code: String(code || '').trim(),
        name: String(name).trim(),
        roomNo: String(roomNo).trim(),
        propertyId: Number(getVal('Property ID', 'PropertyId', 'Property')) || (this.propertiesList[0]?.id || 0),
        unitId: Number(getVal('Unit ID', 'UnitId', 'Unit')) || (this.unitsList[0]?.id || 0),
        roomType: Number(getVal('Room Type', 'RoomType')) || (this.roomTypesList[0]?.id || 1),
        marketRent: Number(getVal('Market Rent', 'MarketRent', 'Rent')) || 0,
      };
    } else {
      const code = getVal('Code', 'Tenant Code', 'Landlord Code', 'Vendor Code', 'Technician Code', 'code');
      const firstName = getVal('First Name', 'FirstName', 'First_Name', 'first_name');
      const lastName = getVal('Last Name', 'LastName', 'Last_Name', 'last_name');
      const email = getVal('Email', 'Email Address', 'email', 'email_address');
      const mobile = getVal('Mobile', 'Phone', 'mobile_no', 'mobile', 'Phone Number', 'phone');
      const company = getVal('Company Name', 'Company', 'company_name');
      return {
        code: String(code || '').trim(),
        name: `${firstName} ${lastName}`.trim() || String(company).trim(),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim(),
        mobile: String(mobile).trim(),
        companyName: String(company).trim(),
      };
    }
  }

  downloadSampleTemplate(): void {
    let headers: any[] = [];
    let sampleRow: any = {};

    if (this.entityType === 'property') {
      headers = [
        'Property Code',
        'Property Name',
        'Property Type',
        'Total Units',
        'Address',
        'Community',
        'Prefix',
        'Reference',
        'Makani No',
      ];
      sampleRow = {
        'Property Code': 'PR-101',
        'Property Name': 'Marina Horizon Tower',
        'Property Type': this.propertyTypes[0]?.name || 'Residential',
        'Total Units': 45,
        Address: 'Dubai Marina Walk',
        Community: 'Dubai Marina',
        Prefix: 'MHT',
        Reference: 'REF-2026-001',
        'Makani No': '12345 67890',
      };
    } else if (this.entityType === 'unit') {
      headers = ['Unit Code', 'Unit Name', 'Unit No', 'Property ID', 'Unit Type', 'Floor', 'Market Rent'];
      sampleRow = {
        'Unit Code': 'U-101',
        'Unit Name': 'Flat 101',
        'Unit No': '101',
        'Property ID': this.propertiesList[0]?.id || 1,
        'Unit Type': '2BHK',
        Floor: 1,
        'Market Rent': 65000,
      };
    } else if (this.entityType === 'room') {
      headers = ['Room Code', 'Room Name', 'Room No', 'Property ID', 'Unit ID', 'Room Type', 'Market Rent'];
      sampleRow = {
        'Room Code': 'R-101',
        'Room Name': 'Master Bedroom',
        'Room No': 'MB-01',
        'Property ID': this.propertiesList[0]?.id || 1,
        'Unit ID': 1,
        'Room Type': 'Master',
        'Market Rent': 2500,
      };
    } else if (this.entityType === 'tenant') {
      headers = ['Tenant Code', 'First Name', 'Last Name', 'Email', 'Mobile', 'Company Name'];
      sampleRow = {
        'Tenant Code': 'TEN-001',
        'First Name': 'Ahmed',
        'Last Name': 'Ali',
        Email: 'ahmed.ali@example.com',
        Mobile: '+971501234567',
        'Company Name': 'Al Futtaim LLC',
      };
    } else if (this.entityType === 'landlord') {
      headers = ['Landlord Code', 'First Name', 'Last Name', 'Email', 'Mobile', 'Company Name'];
      sampleRow = {
        'Landlord Code': 'LL-001',
        'First Name': 'Mohammed',
        'Last Name': 'Al Maktoum',
        Email: 'mohammed.m@example.com',
        Mobile: '+971509876543',
        'Company Name': 'Emaar Properties',
      };
    } else if (this.entityType === 'technician') {
      headers = ['Technician Code', 'First Name', 'Last Name', 'Email', 'Mobile'];
      sampleRow = {
        'Technician Code': 'TECH-001',
        'First Name': 'Suresh',
        'Last Name': 'Kumar',
        Email: 'suresh.k@example.com',
        Mobile: '+971505551234',
      };
    } else if (this.entityType === 'vendor') {
      headers = ['Vendor Code', 'Company Name', 'First Name', 'Last Name', 'Email', 'Mobile'];
      sampleRow = {
        'Vendor Code': 'VEN-001',
        'Company Name': 'Rapid AC Maintenance',
        'First Name': 'Tariq',
        'Last Name': 'Mansoor',
        Email: 'tariq@rapidfms.com',
        Mobile: '+971504449876',
      };
    }

    const ws = XLSX.utils.json_to_sheet([sampleRow], { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${this.entityTitle}s`);
    XLSX.writeFile(wb, `${this.entityTitle}_import_template.xlsx`);
  }

  // --- Start Import Process ---
  async startImport(): Promise<void> {
    const rawList: any[] = [];

    if (this.activeTab === 'manual') {
      if (this.entityType === 'property') {
        const valid = this.manualPropertyRows.filter(
          (r) => r.propertyName && r.propertyName.trim().length > 0
        );
        if (valid.length === 0) {
          this.toastr.warning('Please enter at least one Property Name.', 'Validation Warning');
          return;
        }
        for (const r of valid) {
          rawList.push({
            code: (r.code || '').trim(),
            name: r.propertyName.trim(),
            propertyType: r.propertyType || this.propertyTypes[0]?.id || 1,
            totalUnits: Number(r.totalUnits) || 0,
            address1: r.address1 || '',
            community: r.community || '',
            prefix: '',
            reference: '',
            landNo: '',
            floors: 0,
            parkingSpaces: 0,
          });
        }
      } else if (this.entityType === 'unit') {
        const valid = this.manualUnitRows.filter(
          (r) => r.unitName && r.unitName.trim().length > 0
        );
        if (valid.length === 0) {
          this.toastr.warning('Please enter at least one Unit Name.', 'Validation Warning');
          return;
        }
        for (const r of valid) {
          rawList.push({
            name: r.unitName.trim(),
            unitNo: r.unitNo || r.unitName.trim(),
            propertyId: r.propertyId || this.propertiesList[0]?.id || 0,
            unitType: r.unitType || this.unitTypesList[0]?.id || 1,
            floor: Number(r.floor) || 0,
            marketRent: Number(r.marketRent) || 0,
          });
        }
      } else if (this.entityType === 'room') {
        const valid = this.manualRoomRows.filter(
          (r) => r.roomName && r.roomName.trim().length > 0
        );
        if (valid.length === 0) {
          this.toastr.warning('Please enter at least one Room Name.', 'Validation Warning');
          return;
        }
        for (const r of valid) {
          rawList.push({
            name: r.roomName.trim(),
            roomNo: r.roomNo || r.roomName.trim(),
            propertyId: r.propertyId || this.propertiesList[0]?.id || 0,
            unitId: r.unitId || this.unitsList[0]?.id || 0,
            roomType: r.roomType || this.roomTypesList[0]?.id || 1,
            marketRent: Number(r.marketRent) || 0,
          });
        }
      } else if (this.isContactEntity) {
        const valid = this.manualContactRows.filter(
          (r) => (r.firstName && r.firstName.trim().length > 0) || (r.lastName && r.lastName.trim().length > 0)
        );
        if (valid.length === 0) {
          this.toastr.warning(`Please enter at least one ${this.entityTitle}.`, 'Validation Warning');
          return;
        }
        for (const r of valid) {
          rawList.push({
            name: `${r.firstName} ${r.lastName}`.trim() || r.companyName || 'Contact',
            firstName: r.firstName?.trim() || '',
            lastName: r.lastName?.trim() || '',
            email: r.email?.trim() || '',
            mobile: r.mobile?.trim() || '',
            companyName: r.companyName?.trim() || '',
          });
        }
      }
    } else {
      if (this.parsedFileRows.length === 0) {
        this.toastr.warning('Please select a file with valid records to import.', 'No File Data');
        return;
      }
      rawList.push(...this.parsedFileRows);
    }

    // Run duplicate identification and filter unique records
    const dupResult = this.analyzeDuplicates(rawList);
    this.duplicateCount = dupResult.duplicateCount;
    this.duplicateSkippedCount = dupResult.duplicateSkippedCount;
    this.duplicateDbCount = dupResult.duplicateDbCount;
    this.duplicateFileCount = dupResult.duplicateFileCount;
    this.duplicateLogs = dupResult.duplicateLogs;

    const rowsToProcess = dupResult.uniqueRows;

    if (rowsToProcess.length === 0) {
      if (this.duplicateCount > 0) {
        this.toastr.warning(
          `All ${this.duplicateCount} record(s) are duplicates (already exist in system or duplicated in file). No records to import.`,
          'Duplicates Detected'
        );
      } else {
        this.toastr.warning('No valid records to import.', 'Validation');
      }
      return;
    }

    this.totalToImport = rowsToProcess.length;
    this.propertiesToBeImported = rowsToProcess.length;
    this.propertiesImported = 0;
    this.failedCount = 0;
    this.progressPercent = 0;
    this.errorLog = [];
    this.currentStep = 'importing';

    const user = this.commonService.getCurrentUser();

    for (let i = 0; i < rowsToProcess.length; i++) {
      const item = rowsToProcess[i];
      const rowNum = i + 1;
      this.currentProcessingName = item.code ? `${item.name} (${item.code})` : item.name;

      try {
        if (this.entityType === 'property') {
          await this.savePropertyRow(item, user);
        } else if (this.entityType === 'unit') {
          await this.saveUnitRow(item, user);
        } else if (this.entityType === 'room') {
          await this.saveRoomRow(item, user);
        } else if (this.entityType === 'tenant') {
          await this.saveTenantRow(item, user);
        } else if (this.entityType === 'landlord') {
          await this.saveLandlordRow(item, user);
        } else if (this.entityType === 'technician') {
          await this.saveTechnicianRow(item, user);
        } else if (this.entityType === 'vendor') {
          await this.saveVendorRow(item, user);
        }
        this.propertiesImported++;
        this.propertiesToBeImported = Math.max(0, this.totalToImport - this.propertiesImported - this.failedCount);
      } catch (err: any) {
        console.error(`Error importing row ${rowNum}:`, err);
        this.failedCount++;
        this.propertiesToBeImported = Math.max(0, this.totalToImport - this.propertiesImported - this.failedCount);
        const errMsg = err?.message || err?.error?.message || 'Failed to save';
        this.errorLog.push({ row: rowNum, name: item.name, message: errMsg });
      }

      this.progressPercent = Math.round(
        ((this.propertiesImported + this.failedCount) / this.totalToImport) * 100
      );
    }

    this.currentStep = 'completed';

    if (this.propertiesImported > 0) {
      const dupInfo = this.duplicateCount > 0 ? ` (${this.duplicateCount} duplicates identified, ${this.duplicateSkippedCount} skipped)` : '';
      this.toastr.success(
        `Import completed: ${this.propertiesImported} of ${this.totalToImport} ${this.entityPluralTitle.toLowerCase()} imported successfully!${dupInfo}`,
        'Import Complete'
      );
    } else {
      this.toastr.error('Import failed. Please check the error log.', 'Import Failed');
    }

    this.importCompleted.emit({
      total: this.totalToImport,
      imported: this.propertiesImported,
      failed: this.failedCount,
      errors: this.errorLog,
    });
  }

  // --- Entity Save Handlers (Calling Exact Same Add Endpoints) ---
  private savePropertyRow(row: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = {
        userid: Number(user?.userId) || 1,
        code: row.code || '',
        source: 'web',
        company_id: Number(user?.companyId) || 1,
        tenantId: '',
        clientId: user?.clientId || '',
        name: row.name,
        prefix: row.prefix || '',
        reference: row.reference || '',
        address1: row.address1 || '',
        address2: '',
        country_id: Number(row.country_id) || 0,
        state_id: Number(row.state_id) || 0,
        city_id: Number(row.city_id) || 0,
        total_units: Number(row.totalUnits) || 0,
        totalUnits: Number(row.totalUnits) || 0,
        zipcode: row.zipcode || '',
        community: row.community || '',
        land_no: row.landNo || '',
        no_of_floors: Number(row.floors) || 0,
        floors: Number(row.floors) || 0,
        parking_floors: Number(row.parkingSpaces) || 0,
        parking_spaces: Number(row.parkingSpaces) || 0,
        tags: '',
        desc: row.description || '',
        property_type: Number(row.propertyType) || 0,
        purchage_value: 0,
        purchase_value: 0,
        amenities: '',
        id: 0,
        fixedPayments: [],
      };

      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));

      this.propertiesService.addProperty(formData).subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' || res?.status === 200 || !res?.isError) {
            const newCode = row.code || res?.objResult?.code || '';
            if (newCode || row.name) {
              this.propertiesList.push({ code: newCode, name: row.name });
            }
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to save property'));
          }
        },
        error: (err: any) => reject(err),
      });
    });
  }

  private saveUnitRow(row: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const propCode = String(row.propertyId || '');
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        source: 'web',
        clientId: user?.clientId || '',
        unit_id: 0,
        code: row.code || '',
        unit_code: row.code || '',
        property_id: Number(row.propertyId) || 0,
        property_code: propCode,
        unit_name: row.name,
        unit_no: row.unitNo || row.name,
        unit_type: Number(row.unitType) || 1,
        floor: Number(row.floor) || 0,
        lookup_category: 2,
        market_rent: Number(row.marketRent) || 0,
        desc: '',
      };

      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));

      this.propertiesService.addUnit(formData).subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' || res?.status === 200) {
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to save unit'));
          }
        },
        error: (err: any) => reject(err),
      });
    });
  }

  private saveRoomRow(row: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const propCode = String(row.propertyId || '');
      const unitCode = String(row.unitId || '');
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        source: 'web',
        clientId: user?.clientId || '',
        room_id: 0,
        code: row.code || '',
        property_id: Number(row.propertyId) || 0,
        unit_id: Number(row.unitId) || 0,
        property_code: propCode,
        unit_code: unitCode,
        category: 1,
        room_status: 1,
        room_name: row.name,
        room_no: row.roomNo || row.name,
        room_code: row.code || row.roomNo || row.name,
        room_type: Number(row.roomType) || 1,
        market_rent: Number(row.marketRent) || 0,
        desc: '',
      };

      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));

      this.propertiesService.addRoom(formData).subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' || res?.status === 200) {
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to save room'));
          }
        },
        error: (err: any) => reject(err),
      });
    });
  }

  private saveTenantRow(row: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        clientId: user?.clientId || '',
        source: 'web',
        languageid: 1,
        email_address: row.email || '',
        code: row.code || '',
        id: 0,
        username: '',
        profileImage_path: '',
        honorific: '',
        tenant: `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || '',
        first_name: row.firstName || '',
        last_name: row.lastName || '',
        middle_name: '',
        mobile_no: row.mobile || '',
        gender: '',
        dob: '1900-01-01T00:00:00',
        status: 'Active',
        address1: '',
        address2: '',
        nationality: 0,
        country_id: 0,
        stateid: 0,
        city: 0,
        zipcode: '',
        addionalphone1: '',
        addionalphone2: '',
        landline_no: '',
        name_on_lease: `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || '',
        email_on_lease: row.email || '',
        phone_on_lease: row.mobile || '',
        notes: '',
        is_auto_schedule: false,
        schedule_day: 1,
        signature_path: '',
        is_auto_sign_leases: false,
        disabled_property_listing: false,
        company_name: row.companyName || '',
        tax_registration_no: '',
        trade_license: '',
        display_as_company: !!(row.companyName && !row.firstName),
        fax_no: '',
      };

      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));

      this.propertiesService.saveTenant(formData).subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' || res?.status === 200 || res?.message === 'Success') {
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to save tenant'));
          }
        },
        error: (err: any) => reject(err),
      });
    });
  }

  private saveLandlordRow(row: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        clientId: user?.clientId || '',
        source: 'web',
        languageid: 1,
        email_address: row.email || '',
        code: row.code || '',
        id: 0,
        username: '',
        profileImage_path: '',
        honorific: '',
        landlord: `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || '',
        first_name: row.firstName || '',
        last_name: row.lastName || '',
        middle_name: '',
        mobile_no: row.mobile || '',
        gender: '',
        dob: '1900-01-01T00:00:00',
        reference: '',
        tags: '',
        status: 'Active',
        address1: '',
        address2: '',
        nationality: 0,
        country_id: 0,
        stateid: 0,
        city: 0,
        name_on_contract: `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || '',
        email_on_contract: row.email || '',
        phone_on_contract: row.mobile || '',
        lessor_name: '',
        notes: '',
        signature_path: '',
        is_auto_sign_leases: false,
        company_name: row.companyName || '',
        tax_registration_no: '',
        display_as_company: !!(row.companyName && !row.firstName),
        negative_balances: false,
        security_deposit_leases: false,
        security_deposit_non_leases: false,
        landlord_contribution: false,
        send_push_notifications: false,
        send_email_notifications: false,
        auto_hold_amount_in_wallet: false,
        emergencydtls: [],
        bankdtls: {
          bank_name: '',
          bank_address: '',
          iban: '',
          account_no: '',
          sort_code: '',
          code_swift: '',
        },
      };

      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));

      this.propertiesService.saveLandlord(formData).subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' || res?.status === 200 || res?.message === 'Success') {
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to save landlord'));
          }
        },
        error: (err: any) => reject(err),
      });
    });
  }

  private saveTechnicianRow(row: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        clientId: user?.clientId || '',
        source: 'web',
        languageid: 1,
        email: row.email || '',
        email_address: row.email || '',
        email_id: row.email || '',
        emailid: row.email || '',
        emailId: row.email || '',
        code: row.code || '',
        id: 0,
        username: '',
        profileImage_path: '',
        password: '',
        technician_name: `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || '',
        first_name: row.firstName || '',
        last_name: row.lastName || '',
        mobile_no: row.mobile || '',
        phone: row.mobile || '',
        phone_number: row.mobile || '',
        country_id: 0,
        role_id: 0,
        department: 0,
        display_all_tenants: false,
        technician_actions: '',
        spoken_languages: '',
        time_zone: '',
      };

      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));

      this.propertiesService.saveTechnician(formData).subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' || res?.status === 200 || res?.message === 'Success') {
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to save technician'));
          }
        },
        error: (err: any) => reject(err),
      });
    });
  }

  private saveVendorRow(row: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        clientId: user?.clientId || '',
        source: 'web',
        languageid: 1,
        email_address: row.email || '',
        code: row.code || '',
        id: 0,
        username: '',
        profileImage_path: '',
        honorific: '',
        company_name: row.companyName || '',
        contact_name: `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || '',
        mobile_no: row.mobile || '',
        gender: '',
        dob: '1900-01-01T00:00:00',
        address1: '',
        address2: '',
        nationality: 0,
        country_id: 0,
        stateid: 0,
        city: 0,
        tax_registration_no: '',
        notes: '',
        signature_path: '',
        display_as_company: true,
        vendor_type: 0,
        auto_assign_assignment: false,
        allow_create_work_order: false,
        allow_create_quotation: false,
        maintainance_categories: '',
      };

      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));

      this.propertiesService.saveVendor(formData).subscribe({
        next: (res: any) => {
          if (res?.statusCode === '200' || res?.status === 200 || res?.message === 'Success') {
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to save vendor'));
          }
        },
        error: (err: any) => reject(err),
      });
    });
  }

  closeModal(): void {
    if (this.currentStep === 'importing') {
      if (!confirm('Import is currently in progress. Are you sure you want to cancel?')) {
        return;
      }
    }
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.currentStep = 'input';
    this.initRows();
    this.selectedFile = null;
    this.fileName = '';
    this.parsedFileRows = [];
  }
}
