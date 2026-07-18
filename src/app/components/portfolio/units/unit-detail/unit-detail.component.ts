import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../../services/properties.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Unit {
  id: number;
  name: string;
  category: 'Residential' | 'Commercial';
  beds: string;
  baths: string;
  area: string;
  floor: string;
  property: string;
  location: string;
  landlord: string;
  tags: string;
  unitType: string;
  managementFee: string;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  addedDate: string;
  imageUrl: string;
  rentStatus: 'For Rent' | 'For Sale';
  furnished?: boolean;
  smoking?: boolean;
  saleStatus?: boolean;
  underDispute?: boolean;
  propertyAddress?: string;
  createdDate?: string;
  lastUpdate?: string;
  isVerified?: boolean;
  marketRent?: string;
  deposit?: string;
  rentType?: string;
  rentPerSqft?: string;
  totalServiceCharges?: string;
  serviceCharges?: string;
  salePrice?: string;
  thresholdValue?: string;
  managementFeeType?: string;
  serviceDisabled?: boolean;
  trakessiNumber?: string;
  reraNumber?: string;
}

@Component({
  selector: 'app-unit-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule, TranslateModule],
  templateUrl: './unit-detail.component.html',
  styleUrl: './unit-detail.component.scss'
})
export class UnitDetailComponent implements OnInit {
  unitId!: number;
  unit: Unit | null = null;
  activeTab: string = 'overview';
  showMoreDetails: boolean = false;

  leases: any[] = [];
  financials: any[] = [];
  workOrders: any[] = [];
  inventoryItems: any[] = [];
  unitAttachments: any[] = [];
  legalCases: any[] = [];
  parkings: any[] = [];
  notes: any[] = [];
  broadcasts: any[] = [];
  inspections: any[] = [];
  allUnits: Unit[] = [];

  tabs: any[] = [];
  mode: 'property' | 'unit' | 'room' | 'parking' = 'unit';
  item: any = null;

  constructor(private route: ActivatedRoute, private propertiesService: PropertiesService) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments[0]?.path;
      if (path === 'properties') {
        this.mode = 'property';
      } else if (path === 'units') {
        this.mode = 'unit';
      } else if (path === 'rooms') {
        this.mode = 'room';
      } else if (path === 'parkings') {
        this.mode = 'parking';
      }

      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.unitId = isNaN(+idParam) ? 31658 : +idParam;
          this.initModeData();
          this.fetchDetails(idParam);
        }
      });
    });
  }

  fetchDetails(rawId: string): void {
    const payload = {
      typeId: 14,
      filterId: 0,
      filterText: rawId,
      filterText1: "",
      userId: 1,
      clientId: "74BB6922",
      companyId: 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) {
          let detail = null;
          if (response.objResult.unit && Array.isArray(response.objResult.unit) && response.objResult.unit.length > 0) {
            detail = response.objResult.unit[0];
          } else if (response.objResult.room && Array.isArray(response.objResult.room) && response.objResult.room.length > 0) {
            detail = response.objResult.room[0];
          } else if (response.objResult.parking && Array.isArray(response.objResult.parking) && response.objResult.parking.length > 0) {
            detail = response.objResult.parking[0];
          } else if (response.objResult.property && Array.isArray(response.objResult.property) && response.objResult.property.length > 0) {
            detail = response.objResult.property[0];
          } else if (response.objResult.table && Array.isArray(response.objResult.table) && response.objResult.table.length > 0) {
            detail = response.objResult.table[0];
          } else if (Array.isArray(response.objResult)) {
            detail = response.objResult[0];
          } else {
            detail = response.objResult;
          }
          if (detail) {
            this.unit = {
              id: detail.code || detail.id || this.unitId,
              name: detail.unit_no || detail.name || this.unit?.name || 'Apartment 209',
              category: detail.category || this.unit?.category || 'Residential',
              beds: detail.beds || this.unit?.beds || '1 Bed',
              baths: detail.baths || this.unit?.baths || '1 Bath',
              area: detail.area || this.unit?.area || '1200 Sqft',
              floor: detail.floor_no || detail.floor || this.unit?.floor || '1 Floor',
              property: detail.property_code || detail.property || this.unit?.property || 'Marina Height Towers',
              location: detail.location || this.unit?.location || 'Dubai Marina, Tower A, Dubai',
              landlord: detail.landlord_codes || detail.landlord || this.unit?.landlord || 'Orville Real Estate',
              tags: detail.tags || this.unit?.tags || 'Premium',
              unitType: detail.unit_type_name || detail.unit_type || this.unit?.unitType || 'Apartment',
              managementFee: detail.management_fee ? `AED ${detail.management_fee}` : this.unit?.managementFee || 'AED 600',
              status: detail.unit_status_name || detail.unit_status || detail.status || this.unit?.status || 'Occupied',
              addedDate: detail.created || this.unit?.addedDate || 'May 26, 2026',
              imageUrl: detail.unit_image || this.unit?.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
              rentStatus: detail.rent_type || this.unit?.rentStatus || 'For Rent',
              furnished: detail.is_furnished || false,
              smoking: detail.is_smoking_allowed || false,
              saleStatus: detail.sale_status || false,
              underDispute: (response.objResult.legal_cases && response.objResult.legal_cases.length > 0),
              propertyAddress: detail['property Name'] || detail.property_name || 'Dubai Marina, Tower A, Dubai',
              createdDate: detail.created_date ? new Date(detail.created_date).toLocaleDateString() : '07-22-2025',
              lastUpdate: detail.modified_date ? new Date(detail.modified_date).toLocaleDateString() : (detail.created_date ? new Date(detail.created_date).toLocaleDateString() : '23-06-2026'),
              isVerified: detail.is_it_verified || false,
              marketRent: detail.market_rent ? `AED ${detail.market_rent}` : 'AED 36500.0',
              deposit: detail.rent_deposit ? `AED ${detail.rent_deposit}` : 'AED 3000.0',
              rentType: detail.rent_type_name || (detail.rent_type === 50 ? 'Per Year' : 'Per Year'),
              rentPerSqft: detail.rent_per_area ? `AED ${detail.rent_per_area}` : 'AED 250.00',
              totalServiceCharges: detail.total_service_charges ? `AED ${detail.total_service_charges}` : '0.00',
              serviceCharges: detail.service_charge_per_area ? `AED ${detail.service_charge_per_area}` : '0.00',
              salePrice: detail.market_value ? `AED ${detail.market_value}` : '-',
              thresholdValue: detail.threshold_value ? `AED ${detail.threshold_value}` : '-',
              managementFeeType: detail.management_fee_type || 'Percentage',
              serviceDisabled: detail.disable_maintainence || false,
              trakessiNumber: detail.trakessi_number || '-',
              reraNumber: detail.rera_number || '-'
            };
            this.item = this.unit;
          }

          // 📋 1. Leases/Overview Tab
          const leasesList = response.objResult.leases || response.objResult.lease || response.objResult.table1 || [];
          if (Array.isArray(leasesList) && leasesList.length > 0) {
            this.leases = leasesList.map((u: any) => ({
              id: u.id || u.code || 31658,
              legalCase: u.legal_case || u.legalCase || 'No',
              unit: u.unit_no || u.unit || 'Apartment 205-PR-4',
              property: u.property_code || u.property || 'Marina Heights Tower',
              status: u.status || 'Active',
              rent: u.rent ? `AED ${u.rent}` : 'AED 24,000.00',
              startDate: u.start_date || u.startDate || '07-01-2026',
              endDate: u.end_date || u.endDate || '06-01-2028',
              renewed: u.renewed || 'No',
              multiUnit: u.multi_unit || 'No',
              created: u.created || '07-01-2026',
              remarks: u.remarks || 'Lease agreement',
              createdBy: u.created_by || u.createdBy || 'Admin',
              internalStatus: u.internal_status || u.internalStatus || 'Approved'
            }));
          }

          // 📋 2. Financials/Invoices Tab
          const financialsList = response.objResult.financials || response.objResult.invoices || response.objResult.table2 || [];
          if (Array.isArray(financialsList) && financialsList.length > 0) {
            this.financials = financialsList.map((fin: any) => ({
              id: fin.id || 1817909,
              status: fin.status || 'Unpaid',
              to: fin.to || 'Atif Shahzad',
              unitCommonArea: fin.unit_common_area || fin.unitCommonArea || '103-PR-10',
              invoiceNumber: fin.invoice_number || fin.invoiceNumber || 'INV-26-00067223',
              chequeNo: fin.cheque_no || fin.chequeNo || '67223',
              invoiceDate: fin.invoice_date || fin.invoiceDate || '06-07-2026',
              invoiceType: fin.invoice_type || fin.invoiceType || 'Charge',
              account: fin.account || 'Rental Income',
              currency: fin.currency || 'AED',
              propertyName: fin.property_name || fin.propertyName || 'Marina Heights Tower',
              propertyId: fin.property_id || fin.propertyId || 12534,
              leaseId: fin.lease_id || fin.leaseId || 53443,
              leaseStatus: fin.lease_status || fin.leaseStatus || 'Active',
              note: fin.note || 'Lease financial entry',
              workOrder: fin.work_order || fin.workOrder || 'Repair Water Leak',
              amount: fin.amount ? `AED ${fin.amount}` : 'AED 1,000.00',
              grossAmount: fin.gross_amount ? `AED ${fin.gross_amount}` : 'AED 1,000.00',
              paid: fin.paid ? `AED ${fin.paid}` : 'AED 500.00',
              paymentVia: fin.payment_via || fin.paymentVia || 'Cash',
              moneyHeldBy: fin.money_held_by || fin.moneyHeldBy || 'Company',
              ddRefNo: fin.dd_ref_no || fin.ddRefNo || 'DF2512689',
              bankName: fin.bank_name || fin.bankName || 'ENBD Bank',
              internalStatus: fin.internal_status || fin.internalStatus || 'All',
              archived: fin.archived || '-',
              dueDate: fin.due_date || fin.dueDate || '10-06-2026',
              paidDate: fin.paid_date || fin.paidDate || '09-07-2026',
              cheques: fin.cheques || '-',
              days: fin.days || '20 Days',
              writeAmountOff: fin.write_amount_off ? `AED ${fin.write_amount_off}` : 'AED 0.00',
              createdBy: fin.created_by || fin.createdBy || 'Manager'
            }));
          }

          // 📋 3. Inventory Tab
          const inventoryList = response.objResult.inventory || response.objResult.inventories || response.objResult.table3 || [];
          if (Array.isArray(inventoryList) && inventoryList.length > 0) {
            this.inventoryItems = inventoryList.map((item: any) => ({
              id: item.id || 31658,
              itemName: item.item_name || item.itemName || 'Fire Extinguisher',
              itemSub: item.item_sub || item.itemSub || 'Inventory item',
              itemLocation: item.item_location || item.itemLocation || 'Kitchen Area',
              qty: item.qty || 2,
              expiry: item.expiry || '05-06-2026',
              createdAt: item.created_at || item.createdAt || '09-06-2026',
              attachments: item.attachments || '1 file'
            }));
          }

          // 📋 4. Work Orders Tab
          const woList = response.objResult.workOrders || response.objResult.workorders || response.objResult.table4 || [];
          if (Array.isArray(woList) && woList.length > 0) {
            this.workOrders = woList.map((wo: any) => ({
              id: wo.id || 'WO-1001',
              title: wo.title || 'Repair Water Leak',
              status: wo.status || 'Open',
              closingStatus: wo.closing_status || wo.closingStatus || 'Pending',
              internalStatus: wo.internal_status || wo.internalStatus || 'Assigned',
              dueDate: wo.due_date || wo.dueDate || '15-07-2026',
              priority: wo.priority || 'High',
              property: wo.property || 'Sunrise Apartments',
              vendor: wo.vendor || 'ABC Plumbing',
              user: wo.user || 'John Smith',
              tags: wo.tags || 'Plumbing, Emergency',
              maintenanceCategory: wo.maintenance_category || wo.maintenanceCategory || 'Plumbing',
              responsiblePersons: wo.responsible_persons || wo.responsiblePersons || 'Michael Brown',
              updatedAt: wo.updated_at || wo.updatedAt || '10-07-2026 09:15 AM',
              createdAt: wo.created_at || wo.createdAt || '09-07-2026 10:00 AM'
            }));
          }

          // 📋 5. Attachments Tab
          const attList = response.objResult.attachments || response.objResult.table5 || [];
          if (Array.isArray(attList) && attList.length > 0) {
            this.unitAttachments = attList.map((att: any) => ({
              id: att.id || 'ATT-1001',
              fileType: att.file_type || att.fileType || 'Inspection Report',
              docId: att.doc_id || att.docId || 'DOC-1001',
              status: att.status || 'Active',
              issueDate: att.issue_date || att.issueDate || '12-01-2026',
              expiryDate: att.expiry_date || att.expiryDate || '12-01-2026',
              files: att.files || '1 file'
            }));
          }

          // 📋 6. Legal Tab
          const legalList = response.objResult.legal || response.objResult.legalCases || response.objResult.table6 || [];
          if (Array.isArray(legalList) && legalList.length > 0) {
            this.legalCases = legalList.map((lc: any) => ({
              id: lc.id || 'LC-1001',
              name: lc.name || 'Rent Recovery Case',
              details: lc.details || 'Tenant has 3 months overdue rent.',
              legalFirm: lc.legal_firm || lc.legalFirm || 'Smith & Partners',
              caseDate: lc.case_date || lc.caseDate || '15-07-2026',
              status: lc.status || 'Open'
            }));
          }

          // 📋 7. Parkings Tab
          const parkingList = response.objResult.parkings || response.objResult.table7 || [];
          if (Array.isArray(parkingList) && parkingList.length > 0) {
            this.parkings = parkingList.map((pk: any) => ({
              id: pk.id || 31658,
              parkingNo: pk.parking_no || pk.parkingNo || 'P-004',
              propertyName: pk.property_name || pk.propertyName || 'Marina Height Towers',
              unitName: pk.unit_name || pk.unitName || 'Apartment 209',
              type: pk.type || 'Free',
              fee: pk.fee || 'AED 100.00',
              cycle: pk.cycle || 'Fixed',
              remarks: pk.remarks || 'Parking created',
              created: pk.created || '07-01-2026',
              updated: pk.updated || '07-01-2026'
            }));
          }

          // 📋 8. Notes Tab
          const notesList = response.objResult.notes || response.objResult.table8 || [];
          if (Array.isArray(notesList) && notesList.length > 0) {
            this.notes = notesList.map((nt: any) => ({
              id: nt.id || 31658,
              subject: nt.subject || 'Move-in condition',
              content: nt.content || 'Tenant reported minor paint marks.',
              via: nt.via || 'Portal',
              noteDate: nt.note_date || nt.noteDate || '12-01-2026',
              createdBy: nt.created_by || nt.createdBy || 'Admin User',
              files: nt.files || '1 file',
              createdAt: nt.created_at || nt.createdAt || '12-01-2026',
              updatedAt: nt.updated_at || nt.updatedAt || '12-01-2026'
            }));
          }

          // 📋 9. Broadcasts Tab
          const broadcastsList = response.objResult.broadcasts || response.objResult.table9 || [];
          if (Array.isArray(broadcastsList) && broadcastsList.length > 0) {
            this.broadcasts = broadcastsList.map((bc: any) => ({
              id: bc.id || 31658,
              subject: bc.subject || 'Water maintenance notice',
              preview: bc.preview || 'Water supply will be interrupted...',
              status: bc.status || 'Sent',
              type: bc.type || 'Email + SMS',
              sendable: bc.sendable || 'Yes',
              peopleCount: bc.people_count || bc.peopleCount || 421,
              scheduled: bc.scheduled || 'No',
              date: bc.date || '12-01-2026',
              createdAt: bc.created_at || bc.createdAt || '10-01-2026, 09:14',
              updatedAt: bc.updated_at || bc.updatedAt || '12-01-2026, 13:06'
            }));
          }

          // 📋 10. Inspections Tab
          const inspectionsList = response.objResult.inspections || response.objResult.table10 || [];
          if (Array.isArray(inspectionsList) && inspectionsList.length > 0) {
            this.inspections = inspectionsList.map((ins: any) => ({
              inspectionId: ins.inspection_id || ins.inspectionId || 31658,
              companyId: ins.company_id || ins.companyId || 118,
              name: ins.name || 'Move Out',
              status: ins.status || 'Pending',
              type: ins.type || 'Move Out',
              unit: ins.unit || '215-PR-1',
              scheduled: ins.scheduled || 'Yes',
              dateTime: ins.date_time || ins.dateTime || '10-01-2026, 09:14',
              userId: ins.user_id || ins.userId || 59838,
              environment: ins.environment || 'localhost:3000'
            }));
          }
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  initModeData(): void {
    if (this.mode === 'property') {
      this.tabs = [
        { key: 'overview', label: 'web.Unit.lblOverview' },
        { key: 'units', label: 'web.Unit.lblUnits' },
        { key: 'rooms', label: 'web.Unit.lblRooms' },
        { key: 'tenantshistory', label: 'web.Unit.lblTenantsHistory' },
        { key: 'commonarea', label: 'web.Unit.lblCommonArea' },
        { key: 'broadcasts', label: 'web.Unit.lblBroadcasts' },
        { key: 'attachments', label: 'web.Unit.lblAttachments' },
        { key: 'notes', label: 'web.Unit.lblNotes' },
        { key: 'parkings', label: 'web.Unit.lblParkings' },
        { key: 'assets', label: 'web.Unit.lblAssets' }
      ];
      this.item = {
        id: this.unitId,
        name: 'Marina Heights Towers',
        type_name: 'Residential',
        location: 'Dubai Marina, Tower A, Dubai',
        occupancy: '85%',
        unitsCount: '412 of 421 units occupied',
        category: 'Home'
      };
      this.unit = {
        id: this.unitId,
        name: 'Marina Heights Towers',
        category: 'Residential',
        beds: 'N/A',
        baths: 'N/A',
        area: 'N/A',
        floor: 'N/A',
        property: 'Marina Heights Towers',
        location: 'Dubai Marina, Tower A, Dubai',
        landlord: 'Orville Real Estate',
        tags: 'Premium',
        unitType: 'Building',
        managementFee: 'N/A',
        status: 'Occupied',
        addedDate: 'Jan 01, 2026',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
        rentStatus: 'For Rent'
      };
    } else if (this.mode === 'unit') {
      this.tabs = [
        { key: 'overview', label: 'web.Unit.lblOverview' },
        { key: 'financials', label: 'web.Unit.lblFinancials' },
        { key: 'inventory', label: 'web.Unit.lblInventory' },
        { key: 'workorders', label: 'web.Unit.lblWorkOrders' },
        { key: 'attachments', label: 'web.Unit.lblAttachments' },
        { key: 'legal', label: 'web.Unit.lblLegal' },
        { key: 'parkings', label: 'web.Unit.lblParkings' },
        { key: 'notes', label: 'web.Unit.lblNotes' },
        { key: 'broadcasts', label: 'web.Unit.lblBroadcasts' },
        { key: 'inspections', label: 'web.Unit.lblInspections' }
      ];
      this.unit = this.allUnits.find(u => u.id === this.unitId) || this.allUnits[0];
      this.item = this.unit;
    } else if (this.mode === 'room') {
      this.tabs = [
        { key: 'overview', label: 'web.Unit.lblOverview' },
        { key: 'financials', label: 'web.Unit.lblFinancials' },
        { key: 'inventory', label: 'web.Unit.lblInventory' },
        { key: 'workorders', label: 'web.Unit.lblWorkOrders' },
        { key: 'attachments', label: 'web.Unit.lblAttachments' },
        { key: 'legal', label: 'web.Unit.lblLegal' },
        { key: 'parkings', label: 'web.Unit.lblParkings' },
        { key: 'notes', label: 'web.Unit.lblNotes' },
        { key: 'broadcasts', label: 'web.Unit.lblBroadcasts' },
        { key: 'inspections', label: 'web.Unit.lblInspections' }
      ];
      this.item = {
        id: this.unitId,
        name: 'Room 101-PR-3',
        type_name: 'Studio Room',
        location: 'Marina Heights Towers, Floor 1',
        occupancy: '100%',
        unitsCount: '1 of 1 room occupied',
        category: 'Room'
      };
      this.unit = {
        id: this.unitId,
        name: 'Room 101-PR-3',
        category: 'Residential',
        beds: 'Studio',
        baths: '1 Bath',
        area: '500 Sqft',
        floor: '1 Floor',
        property: 'Marina Heights Towers',
        location: 'Dubai Marina, Tower A, Dubai',
        landlord: 'Orville Real Estate',
        tags: 'Standard',
        unitType: 'Room',
        managementFee: 'AED 300',
        status: 'Occupied',
        addedDate: 'Jan 05, 2026',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
        rentStatus: 'For Rent'
      };
    } else if (this.mode === 'parking') {
      this.tabs = [
        { key: 'overview', label: 'web.Unit.lblOverview' },
        { key: 'allocations', label: 'web.Unit.lblAllocations' },
        { key: 'fees', label: 'web.Unit.lblFees' },
        { key: 'history', label: 'web.Unit.lblHistory' }
      ];
      this.item = {
        id: this.unitId,
        name: 'Parking Bay P-004',
        type_name: 'Chargeable Parking',
        location: 'Marina Heights Towers, Basement 1',
        occupancy: 'Allocated',
        unitsCount: 'Allocated to Apt 209',
        category: 'Parking'
      };
      this.unit = {
        id: this.unitId,
        name: 'Parking Bay P-004',
        category: 'Commercial',
        beds: 'N/A',
        baths: 'N/A',
        area: '150 Sqft',
        floor: 'Basement 1',
        property: 'Marina Heights Towers',
        location: 'Dubai Marina, Tower A, Dubai',
        landlord: 'Orville Real Estate',
        tags: 'Standard',
        unitType: 'Parking',
        managementFee: 'N/A',
        status: 'Occupied',
        addedDate: 'Jan 10, 2026',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
        rentStatus: 'For Rent'
      };
    }
  }

  get unitNo(): string {
    if (this.unit && this.unit.name) {
      const parts = this.unit.name.split(' ');
      return parts[1] || '209';
    }
    return '209';
  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }
}
