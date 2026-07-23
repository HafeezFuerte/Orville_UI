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
  selector: 'app-add-room',
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
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent implements OnInit {
  public roomForm!: FormGroup;
  public isLoading = false;
  
  // Floating buttons state
  public showScrollToTop = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollToTop = number > 600;
  }
  
  // File attachments state
  roomImageFile: File | null = null;
  roomBroucherFile: File | null = null;
  
  // Master lists
  categories = [
    { id: 1, name: 'Residential' },
    { id: 2, name: 'Commercial' },
    { id: 3, name: 'Industrial' }
  ];

  roomTypes = [
    { id: 1, name: '1 Bedroom' },
    { id: 2, name: '2 Bedroom' },
    { id: 3, name: 'Maid Room' },
    { id: 4, name: 'Private Room' }
  ];

  bedsOptions = [
    { id: 'studio', name: 'Studio' },
    { id: '1', name: '1 Bed' },
    { id: '2', name: '2 Beds' }
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
    { id: 'ensuite_baths', name: 'En-suite bathrooms' }
  ];

  propertiesList: any[] = [];
  allUnits: any[] = [];
  unitsList: any[] = [];

  landlordsList = [
    { id: 1, name: 'Mohammed Al Maktoum' },
    { id: 2, name: 'Sarah Jenkins' },
    { id: 3, name: 'Abdullah Hassan' }
  ];
  filteredLandlords: any[] = [];
  selectedLandlords: any[] = [];
  landlordSearchQuery = '';
  showLandlordDropdown = false;

  public isEditMode = false;
  public roomId: any = null;

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
    this.loadUnits();

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.roomId = id;
        this.loadRoomDetails(id);
      }
    });
  }

  loadRoomDetails(id: string) {
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
          if (response.objResult.room && Array.isArray(response.objResult.room) && response.objResult.room.length > 0) {
            detail = response.objResult.room[0];
          } else if (response.objResult.table && Array.isArray(response.objResult.table) && response.objResult.table.length > 0) {
            detail = response.objResult.table[0];
          } else if (Array.isArray(response.objResult)) {
            detail = response.objResult[0];
          } else {
            detail = response.objResult;
          }

          if (detail) {
            this.patchFormWithRoomData(detail);
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching room details:', err);
        this.toastr.error('Failed to load room details.', 'Error');
      }
    });
  }

  patchFormWithRoomData(detail: any) {
    const propertyCode = detail.property_code || detail.propertyCode || detail.property_id || detail.propertyCode;
    if (propertyCode) {
      this.roomForm.get('propertyCode')?.setValue(propertyCode);
      if (this.allUnits.length > 0) {
        this.unitsList = this.allUnits.filter(u => u.property_code === propertyCode || u.propertyCode === propertyCode || u.property_id === propertyCode);
      }
    }

    this.roomForm.patchValue({
      unitCode: detail.unit_code || detail.unitCode || detail.unit_id || '',
      category: detail.category ? Number(detail.category) : 1,
      roomType: detail.room_type ? Number(detail.room_type) : 1,
      roomCode: detail.room_code || detail.code || '',
      roomNumber: detail.room_no || detail.name || '',
      beds: detail.beds ? String(detail.beds) : '',
      parkingSpaces: detail.no_of_parkings || '',
      floorNumber: detail.floor_no || '',
      reservedAmount: detail.reserved_amt || 0,
      propertyReserveValue: detail.property_reserve_value || 0,
      baths: detail.baths || 0,
      electricityNo: detail.electricity_no || '',
      gasNo: detail.gas_no || '',
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
      status: detail.room_status ? Number(detail.room_status) : 1,
      publishRoom: detail.is_published || false,
      feeType: detail.management_fee_type ? Number(detail.management_fee_type) : '',
      purchaseValue: detail.management_fee || 0,
      estimatedStreetValue: detail.estimate_stree_value || 0,
      estimatedRevenueYear: detail.estimate_revenue_per_year || 0,
      estimatedOpexYear: detail.estimate_opex_per_year || 0,
      automationPublishRoom: detail.is_published || false,
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
        this.roomForm.get('amenities')?.patchValue(amGroup);
      } else {
        this.roomForm.get('amenities')?.patchValue(detail.amenities);
      }
    }

    if (detail.landlord_codes) {
      const landlordIds = String(detail.landlord_codes).split(',').map(id => Number(id.trim()));
      this.selectedLandlords = this.landlordsList.filter(l => landlordIds.includes(l.id));
    }
  }

  loadUnits() {
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
      featureid: 'Units'
    };
    this.propertiesService.getUnits(payload).subscribe({
      next: (response: any) => {
        let apiUnits: any[] = [];
        if (Array.isArray(response)) {
          apiUnits = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) apiUnits = response.objResult;
          else if (response.objResult.unit) apiUnits = response.objResult.unit;
          else if (response.objResult.units) apiUnits = response.objResult.units;
          else if (response.objResult.Unit) apiUnits = response.objResult.Unit;
          else if (response.objResult.Units) apiUnits = response.objResult.Units;
        }

        if (Array.isArray(apiUnits) && apiUnits.length > 0) {
          this.allUnits = apiUnits.map((u: any) => ({
            ...u,
            displayName: `${u.unit_code || u.code || u.id || ''} - ${u.unit_no || u.name || ''}`
          }));
          this.unitsList = [...this.allUnits];
        }
      },
      error: (err: any) => {
        console.error('Error loading units:', err);
      }
    });
  }

  onPropertyChange(event: any) {
    this.roomForm.get('unitCode')?.setValue(null);
    const propertyCode = event?.code || event?.id;
    
    if (propertyCode) {
      this.unitsList = this.allUnits.filter(u => u.property_code === propertyCode || u.propertyCode === propertyCode || u.property_id === propertyCode);
    } else {
      this.unitsList = [...this.allUnits];
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
    this.roomForm = this.formBuilder.group({
      propertyCode: ['', Validators.required],
      unitCode: [''],
      category: [1, Validators.required],
      roomType: [1, Validators.required],
      roomCode: ['', Validators.required],
      roomNumber: ['', Validators.required],
      beds: [''],
      parkingSpaces: [''],
      floorNumber: [''],
      reservedAmount: [0],
      propertyReserveValue: [0],
      baths: [0],
      electricityNo: [''],
      gasNo: [''],
      tags: [''],
      landlordIsResident: [false],
      furnished: [false],
      smokingAllowed: [false],
      guestAllowed: [false],
      accommodation: [false],
      isUnderRenovation: [false],
      hidePrice: [false],
      securityDepositInWallet: [false],
      rentType: [''],
      deposit: [0],
      marketValue: [0],
      thresholdValue: [0],
      agencyFee: [0],
      marketRent: [0],
      rentPerArea: [0],
      serviceChargesPerArea: [0],
      totalServiceCharges: [0],
      leaseCost: [0],
      dewa: [0],
      liftAmc: [0],
      firefighting: [0],
      garbageCharges: [0],
      dcd: [0],
      pestControl: [0],
      cleanerCharges: [0],
      swimmingPoolCost: [0],
      gymCost: [0],
      isForSale: [false],
      trakessiNumber: [''],
      reraNumber: [''],
      isVerified: [false],
      includeAmenities: [false],
      description: [''],
      status: [1, Validators.required],
      publishRoom: [true],
      feeType: [''],
      purchaseValue: [0],
      estimatedStreetValue: [0],
      estimatedRevenueYear: [0],
      estimatedOpexYear: [0],
      automationPublishRoom: [false],
      automationFlag: [false],
      automationDisableMaintenance: [false],
      quickbooksClass: [''],
      amenities: this.formBuilder.group({
        balcony: [false],
        ceiling_windows: [false],
        wardrobes: [false],
        ensuite_baths: [false]
      })
    });
  }

  onRoomImageSelected(files: File[]): void {
    if (files.length > 0) {
      this.roomImageFile = files[0];
    } else {
      this.roomImageFile = null;
    }
  }

  onRoomBroucherSelected(files: File[]): void {
    if (files.length > 0) {
      this.roomBroucherFile = files[0];
    } else {
      this.roomBroucherFile = null;
    }
  }

  searchLandlords() {
    if (!this.landlordSearchQuery.trim()) {
      this.filteredLandlords = [...this.landlordsList];
      return;
    }
    const q = this.landlordSearchQuery.toLowerCase();
    this.filteredLandlords = this.landlordsList.filter(l => l.name.toLowerCase().includes(q));
  }

  selectLandlord(landlord: any) {
    if (!this.selectedLandlords.find(l => l.id === landlord.id)) {
      this.selectedLandlords.push(landlord);
    }
    this.landlordSearchQuery = '';
    this.showLandlordDropdown = false;
  }

  removeLandlord(id: number) {
    this.selectedLandlords = this.selectedLandlords.filter(l => l.id !== id);
  }

  createNewLandlord() {
    this.toastr.info('Create new landlord feature coming soon.', 'Info');
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit() {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      
      // Log invalid fields to help debug
      const invalidFields = [];
      const controls = this.roomForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidFields.push(name);
        }
      }
      console.warn('Invalid fields:', invalidFields);
      
      this.toastr.warning('Please fill in all required fields: ' + invalidFields.join(', '), 'Validation Error');
      return;
    }

    this.isLoading = true;
    const formValue = this.roomForm.value;

    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: "web",
      languageid: 1,
      property_code: formValue.propertyCode || '',
      unit_code: formValue.unitCode || '',
      room_broucher: this.roomBroucherFile ? this.roomBroucherFile.name : "",
      room_image: this.roomImageFile ? this.roomImageFile.name : "",
      category: formValue.category || '',
      room_type: Number(formValue.roomType) || 0,
      room_status: Number(formValue.status) || 0,
      code: "",
      room_code: formValue.roomCode || '',
      beds: parseInt(formValue.beds) || 0,
      no_of_parkings: Number(formValue.parkingSpaces) || 0,
      floor_no: parseInt(formValue.floorNumber) || 0,
      reserved_amt: Number(formValue.reservedAmount) || 0,
      property_reserve_value: Number(formValue.propertyReserveValue) || 0,
      baths: Number(formValue.baths) || 0,
      electricity_no: formValue.electricityNo || '',
      gas_no: formValue.gasNo || '',
      room_no: formValue.roomNumber || '',
      tags: formValue.tags || '',
      is_landlord_resident: formValue.landlordIsResident || false,
      is_furnished: formValue.furnished || false,
      is_smoking_allowed: formValue.smokingAllowed || false,
      is_guest: formValue.guestAllowed || false,
      is_accomodation: formValue.accommodation || false,
      hide_price: formValue.hidePrice || false,
      security_deposit: formValue.securityDepositInWallet || false,
      rent_type: Number(formValue.rentType) || 0,
      deposit_amt: Number(formValue.deposit) || 0,
      market_value: Number(formValue.marketValue) || 0,
      threshold_value: Number(formValue.thresholdValue) || 0,
      agency_fee: Number(formValue.agencyFee) || 0,
      market_rent: Number(formValue.marketRent) || 0,
      area: 0,
      rent_per_area: Number(formValue.rentPerArea) || 0,
      service_charge_per_area: Number(formValue.serviceChargesPerArea) || 0,
      total_service_charge: Number(formValue.totalServiceCharges) || 0,
      lease_cost: Number(formValue.leaseCost) || 0,
      dewa: Number(formValue.dewa) || 0,
      lift_amc: Number(formValue.liftAmc) || 0,
      firefighting: Number(formValue.firefighting) || 0,
      garbage_charge: Number(formValue.garbageCharges) || 0,
      dcd_charge: Number(formValue.dcd) || 0,
      pest_charge: Number(formValue.pestControl) || 0,
      watchman_charge: Number(formValue.cleanerCharges) || 0,
      swimming_pool_charge: Number(formValue.swimmingPoolCost) || 0,
      gym_charge: Number(formValue.gymCost) || 0,
      sale_status: formValue.isForSale || false,
      trakessi_no: formValue.trakessiNumber || '',
      rera_number: formValue.reraNumber || '',
      is_it_verified: formValue.isVerified || false,
      desc: formValue.description || '',
      is_published: formValue.publishRoom || false,
      flag: formValue.automationFlag || false,
      disable_maintenance: formValue.automationDisableMaintenance || false,
      estimate_stree_value: Number(formValue.estimatedStreetValue) || 0,
      estimate_revenue_per_year: Number(formValue.estimatedRevenueYear) || 0,
      estimate_opex_per_year: Number(formValue.estimatedOpexYear) || 0,
      management_fee_type: Number(formValue.feeType) || 0,
      management_fee: Number(formValue.purchaseValue) || 0,
      landlord_codes: this.selectedLandlords.map(l => l.id).join(','),
      quickbooks_account_id: Number(formValue.quickbooksClass) || 0
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(payload));
    
    if (this.roomImageFile) {
      formData.append('room_image', this.roomImageFile);
    }
    
    if (this.roomBroucherFile) {
      formData.append('room_broucher', this.roomBroucherFile);
    }

    this.propertiesService.addRoom(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === "200") {
          this.toastr.success('Room created successfully.', 'Success');
          this.router.navigate(['/rooms']);
        } else {
          this.toastr.error(res?.message || 'Failed to save room', 'Error');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        const errMsg = err.error?.message || err.message || 'Internal Server Error';
        this.toastr.error(errMsg, 'Error');
        console.error('Save room error:', err);
      }
    });
  }
}
