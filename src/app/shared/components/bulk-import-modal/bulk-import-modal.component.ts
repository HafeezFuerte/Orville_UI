import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { PropertiesService } from '../../../components/portfolio/services/properties.service';
import { PortfolioService } from '../../../components/portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';

export interface ManualPropertyRow {
  propertyName: string;
  propertyType: number | null;
  totalUnits: number | null;
  address1: string;
  community: string;
}

export interface ManualUnitRow {
  propertyId: number | null;
  unitName: string;
  unitNo: string;
  unitType: number | null;
  floor: number | null;
  marketRent: number | null;
}

export interface ManualRoomRow {
  propertyId: number | null;
  unitId: number | null;
  roomName: string;
  roomNo: string;
  roomType: number | null;
  marketRent: number | null;
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
export class BulkImportModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() entityType: 'property' | 'unit' | 'room' = 'property';
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

  // Progress & Execution Counters
  totalToImport = 0;
  propertiesToBeImported = 0;
  propertiesImported = 0;
  failedCount = 0;
  progressPercent = 0;
  currentProcessingName = '';
  errorLog: { row: number; name: string; message: string }[] = [];

  ngOnInit(): void {
    this.initRows();
    this.loadLookups();
  }

  get entityTitle(): string {
    switch (this.entityType) {
      case 'unit':
        return 'Unit';
      case 'room':
        return 'Room';
      case 'property':
      default:
        return 'Property';
    }
  }

  get entityPluralTitle(): string {
    switch (this.entityType) {
      case 'unit':
        return 'Units';
      case 'room':
        return 'Rooms';
      case 'property':
      default:
        return 'Properties';
    }
  }

  initRows(): void {
    if (this.entityType === 'property') {
      this.manualPropertyRows = [this.createEmptyPropertyRow()];
    } else if (this.entityType === 'unit') {
      this.manualUnitRows = [this.createEmptyUnitRow()];
    } else if (this.entityType === 'room') {
      this.manualRoomRows = [this.createEmptyRoomRow()];
    }
    this.updateCounters();
  }

  createEmptyPropertyRow(): ManualPropertyRow {
    return {
      propertyName: '',
      propertyType: this.propertyTypes.length > 0 ? this.propertyTypes[0].id : null,
      totalUnits: null,
      address1: '',
      community: '',
    };
  }

  createEmptyUnitRow(): ManualUnitRow {
    return {
      propertyId: this.propertiesList.length > 0 ? this.propertiesList[0].id : null,
      unitName: '',
      unitNo: '',
      unitType: this.unitTypesList.length > 0 ? this.unitTypesList[0].id : null,
      floor: null,
      marketRent: null,
    };
  }

  createEmptyRoomRow(): ManualRoomRow {
    return {
      propertyId: this.propertiesList.length > 0 ? this.propertiesList[0].id : null,
      unitId: this.unitsList.length > 0 ? this.unitsList[0].id : null,
      roomName: '',
      roomNo: '',
      roomType: this.roomTypesList.length > 0 ? this.roomTypesList[0].id : null,
      marketRent: null,
    };
  }

  loadLookups(): void {
    // Load Property Types (typeId: 2, filterId: 1)
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

    // If unit or room, load properties list
    if (this.entityType === 'unit' || this.entityType === 'room') {
      this.portfolioService
        .getMasterByType({ typeId: 11, filterId: 0, filterText: '', filterText1: '' })
        .subscribe({
          next: (res: any) => {
            if (res?.statusCode === '200' && res?.objResult?.table) {
              this.propertiesList = res.objResult.table;
            }
          },
        });
    }

    // If unit, load unit types (typeId: 2, filterId: 3)
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
    }

    // If room, load room types (typeId: 2, filterId: 15)
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
    }
    this.updateCounters();
  }

  onManualFieldChange(): void {
    this.updateCounters();
  }

  updateCounters(): void {
    if (this.activeTab === 'manual') {
      if (this.entityType === 'property') {
        const valid = this.manualPropertyRows.filter(
          (r) => r.propertyName && r.propertyName.trim().length > 0
        );
        this.propertiesToBeImported = valid.length;
        this.totalToImport = valid.length;
      } else if (this.entityType === 'unit') {
        const valid = this.manualUnitRows.filter(
          (r) => r.unitName && r.unitName.trim().length > 0
        );
        this.propertiesToBeImported = valid.length;
        this.totalToImport = valid.length;
      } else if (this.entityType === 'room') {
        const valid = this.manualRoomRows.filter(
          (r) => r.roomName && r.roomName.trim().length > 0
        );
        this.propertiesToBeImported = valid.length;
        this.totalToImport = valid.length;
      }
    } else {
      this.propertiesToBeImported = this.parsedFileRows.length;
      this.totalToImport = this.parsedFileRows.length;
    }
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
          this.filePreviewHeaders = Object.keys(rawJson[0]).slice(0, 6);
          this.filePreviewRows = rawJson.slice(0, 5);
          this.toastr.success(
            `Loaded ${this.parsedFileRows.length} valid ${this.entityPluralTitle.toLowerCase()} from file.`,
            'File Parsed'
          );
        }
        this.updateCounters();
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
      const name = getVal('Unit Name', 'UnitName', 'Name', 'unit_name');
      const unitNo = getVal('Unit No', 'Unit Number', 'UnitNo', 'unit_no') || name;
      return {
        name: String(name).trim(),
        unitNo: String(unitNo).trim(),
        propertyId: Number(getVal('Property ID', 'PropertyId', 'Property')) || (this.propertiesList[0]?.id || 0),
        unitType: Number(getVal('Unit Type', 'UnitType')) || (this.unitTypesList[0]?.id || 1),
        floor: Number(getVal('Floor', 'floor')) || 0,
        marketRent: Number(getVal('Market Rent', 'MarketRent', 'Rent')) || 0,
      };
    } else {
      const name = getVal('Room Name', 'RoomName', 'Name', 'room_name');
      const roomNo = getVal('Room No', 'Room Number', 'RoomNo', 'room_no') || name;
      return {
        name: String(name).trim(),
        roomNo: String(roomNo).trim(),
        propertyId: Number(getVal('Property ID', 'PropertyId', 'Property')) || (this.propertiesList[0]?.id || 0),
        unitId: Number(getVal('Unit ID', 'UnitId', 'Unit')) || (this.unitsList[0]?.id || 0),
        roomType: Number(getVal('Room Type', 'RoomType')) || (this.roomTypesList[0]?.id || 1),
        marketRent: Number(getVal('Market Rent', 'MarketRent', 'Rent')) || 0,
      };
    }
  }

  downloadSampleTemplate(): void {
    let headers: any[] = [];
    let sampleRow: any = {};

    if (this.entityType === 'property') {
      headers = [
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
      headers = ['Unit Name', 'Unit No', 'Property ID', 'Unit Type', 'Floor', 'Market Rent'];
      sampleRow = {
        'Unit Name': 'Flat 101',
        'Unit No': '101',
        'Property ID': this.propertiesList[0]?.id || 1,
        'Unit Type': '2BHK',
        Floor: 1,
        'Market Rent': 65000,
      };
    } else {
      headers = ['Room Name', 'Room No', 'Property ID', 'Unit ID', 'Room Type', 'Market Rent'];
      sampleRow = {
        'Room Name': 'Master Bedroom',
        'Room No': 'MB-01',
        'Property ID': 1,
        'Unit ID': 1,
        'Room Type': 'Master',
        'Market Rent': 2500,
      };
    }

    const ws = XLSX.utils.json_to_sheet([sampleRow], { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${this.entityTitle}s`);
    XLSX.writeFile(wb, `${this.entityTitle}_import_template.xlsx`);
  }

  // --- Start Import Process ---
  async startImport(): Promise<void> {
    const rowsToProcess: any[] = [];

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
          rowsToProcess.push({
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
          rowsToProcess.push({
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
          rowsToProcess.push({
            name: r.roomName.trim(),
            roomNo: r.roomNo || r.roomName.trim(),
            propertyId: r.propertyId || this.propertiesList[0]?.id || 0,
            unitId: r.unitId || this.unitsList[0]?.id || 0,
            roomType: r.roomType || this.roomTypesList[0]?.id || 1,
            marketRent: Number(r.marketRent) || 0,
          });
        }
      }
    } else {
      if (this.parsedFileRows.length === 0) {
        this.toastr.warning('Please select a file with valid records to import.', 'No File Data');
        return;
      }
      rowsToProcess.push(...this.parsedFileRows);
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
      this.currentProcessingName = item.name;

      try {
        if (this.entityType === 'property') {
          await this.savePropertyRow(item, user);
        } else if (this.entityType === 'unit') {
          await this.saveUnitRow(item, user);
        } else if (this.entityType === 'room') {
          await this.saveRoomRow(item, user);
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
      this.toastr.success(
        `Import completed: ${this.propertiesImported} of ${this.totalToImport} ${this.entityPluralTitle.toLowerCase()} imported successfully!`,
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
        code: '',
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
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        source: 'web',
        clientId: user?.clientId || '',
        unit_id: 0,
        property_id: Number(row.propertyId) || 0,
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
      const request = {
        userid: Number(user?.userId) || 1,
        company_id: Number(user?.companyId) || 1,
        source: 'web',
        clientId: user?.clientId || '',
        room_id: 0,
        property_id: Number(row.propertyId) || 0,
        unit_id: Number(row.unitId) || 0,
        room_name: row.name,
        room_no: row.roomNo || row.name,
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
