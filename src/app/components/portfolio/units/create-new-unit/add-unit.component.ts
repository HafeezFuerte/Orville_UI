import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from '../../services/properties.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-unit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    FileUploadComponent,
    NgSelectModule
  ],
  templateUrl: './add-unit.component.html',
  styleUrl: './add-unit.component.scss'
})
export class AddUnitComponent implements OnInit {
  public unitForm!: FormGroup;
  public isLoading = false;
  
  // Floating buttons state
  public showScrollToTop = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollToTop = number > 600;
  }
  
  // File attachments state
  unitImageFile: File | null = null;
  unitBroucherFile: File | null = null;
  
  // Master lists
  categories = [
    { id: 1, name: 'Residential' },
    { id: 2, name: 'Commercial' },
    { id: 3, name: 'Industrial' }
  ];

  unitTypes = [
    { id: 1, name: 'Apartment' },
    { id: 2, name: 'Villa' },
    { id: 3, name: 'Office' },
    { id: 4, name: 'Warehouse' },
    { id: 5, name: 'Retail Store' }
  ];

  bedsOptions = [
    { id: 'studio', name: 'Studio' },
    { id: '1', name: '1 Bed' },
    { id: '2', name: '2 Beds' },
    { id: '3', name: '3 Beds' },
    { id: '4', name: '4 Beds' },
    { id: '5+', name: '5+ Beds' }
  ];

  rentTypes = [
    { id: 1, name: 'Monthly' },
    { id: 2, name: 'Quarterly' },
    { id: 3, name: 'Bi-Annually' },
    { id: 4, name: 'Yearly' }
  ];

  statusOptions = [
    { id: 1, name: 'Available' },
    { id: 2, name: 'Rented' },
    { id: 3, name: 'Under Maintenance' },
    { id: 4, name: 'Reserved' }
  ];

  feeTypes = [
    { id: 1, name: 'Percentage' },
    { id: 2, name: 'Fixed Amount' }
  ];

  amenitiesList = [
    { id: 'balcony', name: 'Balcony' },
    { id: 'ceiling_windows', name: 'Floor-to-ceiling windows' },
    { id: 'wardrobes', name: 'Built-in wardrobes' },
    { id: 'closet', name: 'Walk-in closet' },
    { id: 'ensuite_baths', name: 'En-suite bathrooms' },
    { id: 'powder_room', name: 'Guest powder room' },
    { id: 'fitted_kitchen', name: 'Fully fitted kitchen' },
    { id: 'kitchen_appliances', name: 'Built-in kitchen appliances' },
    { id: 'smart_home', name: 'Smart-home controls' },
    { id: 'digital_lock', name: 'Digital door lock' },
    { id: 'central_ac', name: 'Central air conditioning' },
    { id: 'temp_controls', name: 'Individual temperature controls' },
    { id: 'internet_ready', name: 'High-speed internet readiness' },
    { id: 'storage', name: 'Storage room' },
    { id: 'maids_room', name: 'Maid\'s room' },
    { id: 'maids_bath', name: 'Maid\'s bathroom' },
    { id: 'private_entrance', name: 'Private entrance' },
    { id: 'private_lift', name: 'Private lift access' },
    { id: 'private_pool', name: 'Private swimming pool' },
    { id: 'private_garden', name: 'Private garden' },
    { id: 'private_rooftop', name: 'Private rooftop terrace' },
    { id: 'bathtub', name: 'Bathtub' },
    { id: 'soundproof_windows', name: 'Soundproof windows' },
    { id: 'fire_alarm', name: 'Fire-alarm system' }
  ];

  // Properties list state
  propertiesList: any[] = [];

  // Landlord Search State
  landlordsList = [
    { id: 1, name: 'Mohammed Al Maktoum' },
    { id: 2, name: 'Sarah Jenkins' },
    { id: 3, name: 'Abdullah Hassan' },
    { id: 4, name: 'John Doe' }
  ];
  filteredLandlords: any[] = [];
  selectedLandlords: any[] = [];
  landlordSearchQuery = '';
  showLandlordDropdown = false;

  public isEditMode = false;
  public unitId: any = null;

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filteredLandlords = [...this.landlordsList];
    this.initForm();
    this.loadProperties();

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.unitId = id;
        this.loadUnitDetails(id);
      }
    });
  }

  loadUnitDetails(id: string) {
    this.isLoading = true;
    const payload = {
      typeId: 14,
      filterId: 0,
      filterText: id,
      filterText1: "",
      userId: 1,
      clientId: "74BB6922",
      companyId: 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.statusCode === "200" && response.objResult) {
          let detail = null;
          if (response.objResult.unit && Array.isArray(response.objResult.unit) && response.objResult.unit.length > 0) {
            detail = response.objResult.unit[0];
          } else if (response.objResult.table && Array.isArray(response.objResult.table) && response.objResult.table.length > 0) {
            detail = response.objResult.table[0];
          } else if (Array.isArray(response.objResult)) {
            detail = response.objResult[0];
          } else {
            detail = response.objResult;
          }

          if (detail) {
            this.patchFormWithUnitData(detail);
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching unit details:', err);
        this.toastr.error('Failed to load unit details.', 'Error');
      }
    });
  }

  patchFormWithUnitData(detail: any) {
    const propertyCode = detail.property_code || detail.propertyCode || detail.property_id;
    if (propertyCode) {
      // Find property to verify
      const prop = this.propertiesList.find(p => p.code === propertyCode || p.id === propertyCode);
      if (prop) {
        this.unitForm.get('propertyCode')?.setValue(prop.code || prop.id);
      } else {
        // Fallback: add a control for propertyCode since it is on the form but maybe under a nested group, wait, in initForm is propertyCode a top level control or under Unit Details? Let's check initForm or add propertyCode control
        if (!this.unitForm.get('propertyCode')) {
          this.unitForm.addControl('propertyCode', this.formBuilder.control(propertyCode));
        } else {
          this.unitForm.get('propertyCode')?.setValue(propertyCode);
        }
      }
    }

    this.unitForm.patchValue({
      category: detail.category ? Number(detail.category) : '',
      unitType: detail.unit_type ? Number(detail.unit_type) : '',
      unitCode: detail.unit_code || detail.code || '',
      unitNumber: detail.unit_no || detail.name || '',
      beds: detail.beds ? String(detail.beds) : '',
      parkingSpaces: detail.no_of_parkings || '',
      floorNumber: detail.floor_no || '',
      reservedAmount: detail.reserved_amt || 0,
      propertyReserveValue: detail.property_reserve_value || 0,
      baths: detail.baths || 0,
      electricityNo: detail.electricity_no || '',
      gasNo: detail.gas_no || '',
      roomNo: detail.room_no || '',
      tags: detail.tags || '',
      landlordIsResident: detail.is_landlord_resident || false,
      furnished: detail.is_furnished || false,
      smokingAllowed: detail.is_smoking_allowed || false,
      guestAllowed: detail.is_guest || false,
      accommodation: detail.is_accomodation || false,
      isUnderRenovation: detail.is_under_renovation || false,
      hidePrice: detail.hide_price || false,
      securityDepositInWallet: detail.security_deposit || false,
      rentType: detail.rent_type ? Number(detail.rent_type) : '',
      deposit: detail.deposit_amt || 0,
      marketValue: detail.market_value || 0,
      thresholdValue: detail.threshold_value || 0,
      agencyFee: detail.agency_fee || 0,
      marketRent: detail.market_rent || 0,
      rentPerArea: detail.rent_per_area || 0,
      serviceChargesPerArea: detail.service_charge_per_area || 0,
      totalServiceCharges: detail.total_service_charge || 0,
      leaseCost: detail.lease_cost || 0,
      dewa: detail.dewa || 0,
      liftAmc: detail.lift_amc || 0,
      firefighting: detail.firefighting || 0,
      garbageCharges: detail.garbage_charge || 0,
      dcd: detail.dcd_charge || 0,
      pestControl: detail.pest_charge || 0,
      cleanerCharges: detail.watchman_charge || 0,
      swimmingPoolCost: detail.swimming_pool_charge || 0,
      gymCost: detail.gym_charge || 0,
      isForSale: detail.sale_status === 'Yes' || detail.sale_status === true,
      trakessiNumber: detail.trakessi_no || '',
      reraNumber: detail.rera_number || '',
      isVerified: detail.is_it_verified || false,
      includeAmenities: detail.include_amenities || false,
      description: detail.desc || '',
      status: detail.unit_status ? Number(detail.unit_status) : 1,
      publishUnit: detail.is_published || false,
      feeType: detail.management_fee_type ? Number(detail.management_fee_type) : 1,
      purchaseValue: detail.management_fee || 0,
      estimatedStreetValue: detail.estimate_stree_value || 0,
      estimatedRevenueYear: detail.estimate_revenue_per_year || 0,
      estimatedOpexYear: detail.estimate_opex_per_year || 0,
      automationPublishUnit: detail.is_published || false,
      automationFlag: detail.flag || '',
      automationDisableMaintenance: detail.disable_maintenance || false,
      quickbooksClass: detail.quickbooks_account_id || ''
    });

    if (detail.amenities) {
      if (typeof detail.amenities === 'string') {
        const amenitiesArr = detail.amenities.split(',');
        const amGroup: any = {};
        this.amenitiesList.forEach(am => {
          amGroup[am.id] = amenitiesArr.includes(am.id);
        });
        this.unitForm.get('amenities')?.patchValue(amGroup);
      } else {
        this.unitForm.get('amenities')?.patchValue(detail.amenities);
      }
    }

    if (detail.landlord_codes) {
      const landlordIds = String(detail.landlord_codes).split(',').map(id => Number(id.trim()));
      this.selectedLandlords = this.landlordsList.filter(l => landlordIds.includes(l.id));
    }
  }

  loadProperties() {
    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      filter_by: '',
      featureid: 'Property'
    };
    this.propertiesService.getProperties(payload).subscribe({
      next: (response: any) => {
        let apiProps: any[] = [];
        if (Array.isArray(response)) {
          apiProps = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) apiProps = response.objResult;
          else if (response.objResult.property) apiProps = response.objResult.property;
          else if (response.objResult.properties) apiProps = response.objResult.properties;
          else if (response.objResult.Property) apiProps = response.objResult.Property;
          else if (response.objResult.Properties) apiProps = response.objResult.Properties;
        }

        if (Array.isArray(apiProps) && apiProps.length > 0) {
          this.propertiesList = apiProps.map((p: any) => ({
            ...p,
            _safeCode: p.code || String(p.id),
            displayName: `${p.code || p.id} - ${p.name}`
          }));
        }
      },
      error: (err: any) => {
        console.error('Error loading properties:', err);
      }
    });
  }

  initForm() {
    this.unitForm = this.formBuilder.group({
      // Unit Details
      category: ['', Validators.required],
      propertyCode: ['', Validators.required],
      unitType: ['', Validators.required],
      unitCode: ['', Validators.required],
      unitNumber: ['', Validators.required],
      beds: [''],
      parkingSpaces: [''],
      floorNumber: [''],
      reservedAmount: [0],
      propertyReserveValue: [0],
      baths: [0],
      electricityNo: [''],
      gasNo: [''],
      roomNo: [''],
      tags: [''],

      // Checkboxes / Switches
      landlordIsResident: [false],
      furnished: [false],
      smokingAllowed: [false],
      guestAllowed: [false],
      accommodation: [false],
      isUnderRenovation: [false],
      hidePrice: [false],
      securityDepositInWallet: [false],

      // Rent & Service Charges
      rentType: [''],
      deposit: [0],
      marketValue: [0],
      thresholdValue: [0],
      agencyFee: [0],
      marketRent: [0],
      rentPerArea: [0],
      serviceChargesPerArea: [0],
      totalServiceCharges: [0],

      // Cost
      leaseCost: [''],
      dewa: [0],
      liftAmc: [0],
      firefighting: [0],
      garbageCharges: [0],
      dcd: [0],
      pestControl: [0],
      cleanerCharges: [0],
      swimmingPoolCost: [0],
      gymCost: [0],

      // Sale Status
      isForSale: [false],

      // Permit & Compliance
      trakessiNumber: [''],
      reraNumber: [''],
      isVerified: [false],

      // Unit Amenities Toggle & Values
      includeAmenities: [false],
      amenities: this.formBuilder.group(this.buildAmenitiesGroup()),

      // Description & Image
      description: [''],

      // Sidebar Quick Settings
      status: [1, Validators.required],
      publishUnit: [true],
      feeType: [1],
      purchaseValue: [0],
      estimatedStreetValue: [0],
      estimatedRevenueYear: [0],
      estimatedOpexYear: [0],

      // Automation Section
      automationPublishUnit: [true],
      automationFlag: [false],
      automationDisableMaintenance: [false],

      // QuickBooks Class Mapping
      quickbooksClass: ['']
    });
  }

  buildAmenitiesGroup() {
    const group: any = {};
    this.amenitiesList.forEach(amenity => {
      group[amenity.id] = [false];
    });
    return group;
  }

  // Landlord Search logic
  searchLandlords() {
    if (!this.landlordSearchQuery.trim()) {
      this.filteredLandlords = [...this.landlordsList];
    } else {
      this.filteredLandlords = this.landlordsList.filter(l =>
        l.name.toLowerCase().includes(this.landlordSearchQuery.toLowerCase())
      );
    }
    this.showLandlordDropdown = true;
  }

  selectLandlord(landlord: any) {
    if (!this.selectedLandlords.some(l => l.id === landlord.id)) {
      this.selectedLandlords.push(landlord);
    }
    this.landlordSearchQuery = '';
    this.showLandlordDropdown = false;
  }

  removeLandlord(id: number) {
    this.selectedLandlords = this.selectedLandlords.filter(l => l.id !== id);
  }

  createNewLandlord() {
    this.toastr.info('Feature to create new landlord clicked!', 'Info');
  }

  onUnitImageSelected(files: File[]): void {
    if (files.length > 0) {
      this.unitImageFile = files[0];
    } else {
      this.unitImageFile = null;
    }
  }

  onUnitBroucherSelected(files: File[]): void {
    if (files.length > 0) {
      this.unitBroucherFile = files[0];
    } else {
      this.unitBroucherFile = null;
    }
  }

  onSubmit() {
    if (this.unitForm.invalid) {
      this.toastr.error('Please fill in all required fields.', 'Error');
      this.unitForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    const form = this.unitForm.value;

    // Gather selected amenities keys
    const selectedAmenitiesArray: string[] = [];
    if (form.includeAmenities && form.amenities) {
      Object.keys(form.amenities).forEach(key => {
        if (form.amenities[key]) {
          selectedAmenitiesArray.push(key);
        }
      });
    }

    const requestBody = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: '74BB6922',
      source: 'web',
      languageid: 1,
      property_code: form.propertyCode || '',
      unit_broucher: '',
      unit_image: '',
      category: form.category || '',
      unit_type: Number(form.unitType) || 0,
      amenities: selectedAmenitiesArray.join(','),
      unit_status: Number(form.status) || 0,
      code: this.isEditMode ? this.unitId : '',
      id: this.isEditMode ? Number(this.unitId) : 0,
      name: form.unitNumber || '',
      unit_no: form.unitNumber || '',
      unit_code: form.unitCode || '',
      beds: parseInt(form.beds) || 0,
      no_of_parkings: Number(form.parkingSpaces) || 0,
      floor_no: parseInt(form.floorNumber) || 0,
      reserved_amt: Number(form.reservedAmount) || 0,
      property_reserve_value: Number(form.propertyReserveValue) || 0,
      baths: Number(form.baths) || 0,
      electricity_no: form.electricityNo || '',
      gas_no: form.gasNo || '',
      room_no: form.roomNo || '',
      tags: form.tags || '',
      is_landlord_resident: form.landlordIsResident,
      is_furnished: form.furnished,
      is_smoking_allowed: form.smokingAllowed,
      is_guest: form.guestAllowed,
      is_accomodation: form.accommodation,
      hide_price: form.hidePrice,
      security_deposit: form.securityDepositInWallet,
      rent_type: Number(form.rentType) || 0,
      deposit_amt: Number(form.deposit) || 0,
      market_value: Number(form.marketValue) || 0,
      threshold_value: Number(form.thresholdValue) || 0,
      area: 0,
      agency_fee: Number(form.agencyFee) || 0,
      market_rent: Number(form.marketRent) || 0,
      rent_per_area: Number(form.rentPerArea) || 0,
      service_charge_per_area: Number(form.serviceChargesPerArea) || 0,
      total_service_charge: Number(form.totalServiceCharges) || 0,
      lease_cost: Number(form.leaseCost) || 0,
      dewa: Number(form.dewa) || 0,
      lift_amc: Number(form.liftAmc) || 0,
      firefighting: Number(form.firefighting) || 0,
      garbage_charge: Number(form.garbageCharges) || 0,
      dcd_charge: Number(form.dcd) || 0,
      pest_charge: Number(form.pestControl) || 0,
      watchman_charge: Number(form.cleanerCharges) || 0,
      swimming_pool_charge: Number(form.swimmingPoolCost) || 0,
      gym_charge: Number(form.gymCost) || 0,
      sale_status: form.isForSale,
      trakessi_no: form.trakessiNumber || '',
      rera_number: form.reraNumber || '',
      is_it_verified: form.isVerified,
      desc: form.description || '',
      is_published: form.publishUnit,
      flag: form.automationFlag,
      disable_maintenance: form.automationDisableMaintenance,
      estimate_stree_value: Number(form.estimatedStreetValue) || 0,
      estimate_revenue_per_year: Number(form.estimatedRevenueYear) || 0,
      estimate_opex_per_year: Number(form.estimatedOpexYear) || 0,
      management_fee_type: Number(form.feeType) || 0,
      management_fee: Number(form.purchaseValue) || 0,
      landlord_codes: this.selectedLandlords.map(l => l.id).join(','),
      quickbooks_account_id: Number(form.quickbooksClass) || 0
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestBody));
    
    if (this.unitImageFile) {
      formData.append('unit_image', this.unitImageFile);
    }
    
    if (this.unitBroucherFile) {
      formData.append('unit_broucher', this.unitBroucherFile);
    }

    this.propertiesService.addUnit(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === "200") {
          this.toastr.success('Unit created successfully!', 'Success');
          this.router.navigate(['/units']);
        } else {
          this.toastr.error(res?.message || 'Failed to save unit', 'Error');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error saving unit:', err);
        const errMsg = err.error?.message || err.message || 'Internal Server Error';
        this.toastr.error(errMsg, 'Error');
      }
    });
  }
}
