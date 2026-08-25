import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from '../../services/properties.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../services/portfolio.service';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../../services/common.service';
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

  // File attachments state
  roomImageFile: File | null = null;
  roomBroucherFile: File | null = null;
  
  // Master lists
  categories: any[] = [];
  roomTypes: any[] = [];
  bedsOptions: any[] = [];
  rentTypes: any[] = [];
  statusOptions: any[] = [];

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
  currentUser: AuthPayload | null = null;
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
    private route: ActivatedRoute,
    private commonService : CommonService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit() {
    this.currentUser = this.commonService.getCurrentUser();
    this.filteredLandlords = [...this.landlordsList];
    this.initForm();
    this.loadProperties(); 
    this.loadLookup(4, 'categories', 'lookup_name');
    this.loadLookup(3, 'roomTypes', 'lookup_name');
    this.loadLookup(5, 'bedsOptions', 'lookup_name');
    this.loadLookup(6, 'rentTypes', 'lookup_name');
    this.loadLookup(7, 'statusOptions', 'lookup_name');

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
      typeId: 15,
      filterId: 0,
      filterText: id,
      filterText1: "",
      userid: Number(this.currentUser?.userId || localStorage.getItem('userId')) || 1,
      company_id: Number(this.currentUser?.companyId || localStorage.getItem('companyId')) || 1,
      clientId: this.currentUser?.clientId || localStorage.getItem('clientId') || '74BB6922',
    };
    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.statusCode === "200" && response.objResult) {
          let  detail = response.objResult.room[0];  
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
      this.loadUnits(3, propertyCode);
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
  loadUnits(filterId: number,   propertyCode: string) {
    this.portfolioService.getMasterByType({
      typeId: 3,
      filterId: 0,
      filterText: propertyCode,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.unitsList = res.objResult.table;
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  onPropertyChange(event: any) {
    this.roomForm.get('unitCode')?.setValue(null);
    const propertyCode = event?.code || event?.id;
    this.loadUnits(3,  propertyCode);

    // if (propertyCode) {
    //   this.unitsList = this.allUnits.filter(u => u.property_code === propertyCode || u.propertyCode === propertyCode || u.property_id === propertyCode);
    // } else {
    //   this.unitsList = [...this.allUnits];
    // }
  }
 
  initForm() {
    this.roomForm = this.formBuilder.group({
      propertyCode: ['', Validators.required],
      unitCode: [''],
      category: ['', Validators.required],
      roomType: ['', Validators.required],
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
    } else {
      const q = this.landlordSearchQuery.toLowerCase();
      this.filteredLandlords = this.landlordsList.filter(l => l.name.toLowerCase().includes(q));
    }
    this.showLandlordDropdown = true;
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
   window.location.href='/contacts/landlords/add-landlord';
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

    // Gather selected amenities keys
    const selectedAmenitiesArray: string[] = [];
    if (formValue.amenities) {
      Object.keys(formValue.amenities).forEach(key => {
        if (formValue.amenities[key]) {
          selectedAmenitiesArray.push(key);
        }
      });
    }

    const payload: any = {
      userid: Number(this.currentUser?.userId || localStorage.getItem('userId')) || 1,
      company_id: Number(this.currentUser?.companyId || localStorage.getItem('companyId')) || 1,
      clientId: this.currentUser?.clientId || localStorage.getItem('clientId') || '74BB6922',
      source: "web",
      languageid: 1,
      property_code: formValue.propertyCode || '',
      unit_code: formValue.unitCode || '',
      category: formValue.category || '',
      room_type: Number(formValue.roomType) || 0,
      room_status: Number(formValue.status) || 0,
      amenities: selectedAmenitiesArray.join(','),
      code: this.isEditMode ? this.roomId : "",
      id: this.isEditMode ? Number(this.roomId) : 0,
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
      is_landlord_resident: !!formValue.landlordIsResident,
      is_furnished: !!formValue.furnished,
      is_smoking_allowed: !!formValue.smokingAllowed,
      is_guest: !!formValue.guestAllowed,
      is_accomodation: !!formValue.accommodation,
      hide_price: !!formValue.hidePrice,
      security_deposit: !!formValue.securityDepositInWallet,
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
      sale_status: !!formValue.isForSale,
      trakessi_no: formValue.trakessiNumber || '',
      rera_number: formValue.reraNumber || '',
      is_it_verified: !!formValue.isVerified,
      desc: formValue.description || '',
      is_published: !!formValue.publishRoom,
      flag: !!formValue.automationFlag,
      disable_maintenance: !!formValue.automationDisableMaintenance,
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
      formData.append('unitimage', this.roomImageFile);
    }
    
    if (this.roomBroucherFile) {
      formData.append('broucher', this.roomBroucherFile);
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
      }
    });
  }

  loadProperties() {
    this.portfolioService.getMasterByType({
      typeId: 11,
      filterId: 0,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.propertiesList = res.objResult.table;
          const propCode = this.route.snapshot.queryParams['propertyCode'];
          if (propCode) {
            const found = this.propertiesList.find(p => p.code === propCode || p.id === propCode);
            const val = found ? (found.code || found.id) : propCode;
            this.roomForm.get('propertyCode')?.setValue(val);
            this.loadUnits(3, val);
          }
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup :`, err);
      }
    });
  }

  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table;
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
}
