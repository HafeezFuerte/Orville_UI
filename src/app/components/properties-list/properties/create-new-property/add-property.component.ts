import { Component } from '@angular/core';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormArray, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PropertiesService } from '../../../../shared/services/properties.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAllTypes } from '../../../../shared/services/get-all-types.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { selectCommonData } from '../../../common/store/common-payload/common.selectors';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [FileUploadComponent, TranslateModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss'
})
export class AddPropertyComponent {
public propertyForm!: FormGroup;
propertyImages: File[] = [];
public isLoading = false;
propertyTypes: any[] = [];
countries: any[] = [];
states: any[] = [];
cities: any = [];
amenities: any = [];
accounts: any = [];
selectedAmenities: number[] = [];
selectAllAmenities = false;
propertyCode: string = '';
commonData: any = [];
property: any = [];
constructor(public translate: TranslateService, 
  private formBuilder: FormBuilder,
  private propertiesService: PropertiesService,
  private route: ActivatedRoute,
  private store: Store,
  private getAllTypes: GetAllTypes,
  private toastr:ToastrService,
  private router: Router

){}

ngOnInit(){
  this.initializeForm();
  this.loadPropertyTypes();
  this.loadCountries();
  this.loadAmenities();
  this.loadAccounts();
   this.propertyCode = this.route.snapshot.paramMap.get('code') ?? '';

  if (this.propertyCode) {
    // Edit mode
    this.loadProperty();
    console.log(1234)
  } else {
    // Add mode
    this.initializeForm();
  }
  
  
 
}
initializeForm(){
 this.propertyForm = this.formBuilder.group({

  propertyName: ['', Validators.required],
  prefix: [''],
  reference: [''],

  address1: [''],
  address2: [''],
  country: [''],
  state:[''],
  city: [''],

  zipCode: [''],
  latitude: [''],
  longitude: [''],
  community: [''],
  landNo: [''],

  floors: [0],
  totalUnits: [0],
  parkingSpaces: [0],

  tags: [''],
  description: [''],

  // Property Fixed Payments
  selectAccount: ['', Validators.required],
  selectType: ['', Validators.required],
  selectAmount: [''],

  // Right panel
  propertyType: ['', Validators.required],
  purchaseValue: [0],

  serviceRequest: [true],
  includeAmenities: [false],

  makaniNo: [''],
  payments: this.formBuilder.array([
    this.createPaymentRow()
  ])

});
}
createPaymentRow(): FormGroup {
  return this.formBuilder.group({
    selectAccount: ['', Validators.required],
    selectType: ['', Validators.required],
    selectAmount: ['']
  });
}
loadProperty(){
  this.store.select(selectCommonData).subscribe((data: any) => {
      this.commonData = data;
    });
    console.log(this.commonData);
    const payload = {
      typeId:this.commonData.typeId,
      filterId: this.commonData.filterId,
      filterText: this.propertyCode,
      filterText1: "0",
      userId: this.commonData.userId,
      clientId: this.commonData.clientId,
      companyId: this.commonData.companyId
    };
   this.getAllTypes.
   getPropertyByCode(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res["statusCode"] == "200") {
             this.property = res.objResult.property[0];
             this.propertyForm.patchValue({
                propertyName: this.property.name,
                prefix: this.property.prefix,
                reference: this.property.reference,
                address1: this.property.address_1,
                address2: this.property.address_2,
                country: this.property.country_id,
                state: this.property.state_id,
                city: this.property.city_id,
                zipCode: this.property.zip_code,
                latitude: this.property.lat,
                longitude: this.property.long,
                community: this.property.community,
                landNo: this.property.land_no,
                floors: this.property.floors,
                totalUnits: this.property.total_units,
                parkingSpaces: this.property.parking_spaces,
                tags: this.property.tags,
                description: this.property.strdesc,
                propertyType: this.property.property_type,
                purchaseValue: this.property.purchase_value
            });
            this.getStates(this.property.country_id);
             this.propertyForm.patchValue({
        state: this.property.state_id
      });

      this.getCities(this.property.state_id);
            const amenities = res.objResult.amenities || [];

this.selectedAmenities = amenities.map((item: any) => item.id);

// Enable the switch if there is at least one amenity
this.propertyForm.patchValue({
  includeAmenities: amenities.length > 0
});
            
const fixedPayments = res.objResult.fixedpayments;

const paymentsArray = this.propertyForm.get('payments') as FormArray;

// Clear existing rows
paymentsArray.clear();

// Add one FormGroup per payment
fixedPayments.forEach((payment: any) => {
  paymentsArray.push(
    this.formBuilder.group({
      selectAccount: [payment.account_id],
      selectType: [payment.payment_type],
      selectAmount: [payment.amount]
    })
  );
});
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }


get payments(): FormArray {
  return this.propertyForm.get('payments') as FormArray;
}

addPayment(): void {
  this.payments.push(this.createPaymentRow());
}

removePayment(index: number): void {
  if (this.payments.length > 1) {
    this.payments.removeAt(index);
  }
}
loadPropertyTypes() {
  const payload = {
      typeId:2,
      filterId: 1,
      filterText: "",
      filterText1: "",
      userId: 0,
      clientId: "74BB6922",
      companyId: 1
  };

  this.getAllTypes.getPropertyTypes(payload).subscribe({
    next: (response) => {
      this.propertyTypes = response.objResult.table;
      console.log("propertyTypes ", this.propertyTypes)
    },
    error: (err) => {
      console.error(err);
    }
  });
}
loadAmenities(){
   const payload = {
  typeId:2,
  filterId: 2,
  "filterText": "",
  "filterText1": "",
  userId: 0,
  clientId: "74BB6922",
  companyId: 1
  };

  this.getAllTypes.getCountries(payload).subscribe({
    next: (response: any) => {
      this.amenities = response.objResult.table;
      console.log("amenities... ", this.amenities);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
loadAccounts(){
  const payload = {
  typeId:2,
  filterId: 1003,
  "filterText": "",
  "filterText1": "",
  userId: 0,
  clientId: "74BB6922",
  companyId: 1
  };

  this.getAllTypes.getAccounts(payload).subscribe({
    next: (response: any) => {
      this.accounts = response.objResult.table;
      console.log("accounts... ", this.accounts);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
loadCountries(){
  const payload = {
  typeId:2,
  filterId: 1000,
  "filterText": "",
  "filterText1": "",
  userId: 0,
  clientId: "74BB6922",
  companyId: 1
  };

  this.getAllTypes.getCountries(payload).subscribe({
    next: (response: any) => {
      this.countries = response.objResult.table;
      console.log("countries ", this.countries);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
onCountryChange(event: Event): void {
  const countryId = (event.target as HTMLSelectElement).value;

  this.getStates(countryId);
}
getStates(countryId: any){
   const payload = {
    "typeId":2,
    "filterId": 1001,
    "filterText": countryId,
    "filterText1": "",
    "userId": 0,
    "clientId": "74BB6922",
    "companyId": 1
  };

  this.getAllTypes.getStates(payload).subscribe({
    next: (response: any) => {
      this.states = response.objResult.table;
      if (this.propertyCode) {
      this.propertyForm.patchValue({
        state: this.property.state_id
      });

      this.getCities(this.property.state_id);
    }
      console.log("this states ...", this.states);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
onStateChange(event: Event): void{
 const stateId = (event.target as HTMLSelectElement).value;

  this.getCities(stateId); 
}
getCities(stateId: any){
   const payload = {
    "typeId":2,
    "filterId": 1002,
    "filterText": stateId,
    "filterText1": "",
    "userId": 0,
    "clientId": "74BB6922",
    "companyId": 1
  };

  this.getAllTypes.getCities(payload).subscribe({
    next: (response: any) => {
      this.cities = response.objResult.table;
    // Edit mode
    if (this.propertyCode) {
      this.propertyForm.patchValue({
        city: this.property.city_id
      });
    }      
      console.log("this cities ...", this.cities);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
onAmenityChange(event: Event, id: number): void {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) {
    if (!this.selectedAmenities.includes(id)) {
      this.selectedAmenities.push(id);
    }
  } else {
    this.selectedAmenities = this.selectedAmenities.filter(x => x !== id);
  }

  // Update Select All checkbox state
  this.selectAllAmenities =
    this.selectedAmenities.length === this.amenities.length;

  console.log(this.selectedAmenities.join(','));
}
onSelectAllAmenities(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  this.selectAllAmenities = checked;

  if (checked) {
    this.selectedAmenities = this.amenities.map((x: { id: any; }) => x.id);
  } else {
    this.selectedAmenities = [];
  }

  console.log(this.selectedAmenities.join(','));
}

isAmenitySelected(id: number): boolean {
  return this.selectedAmenities.includes(id);
}
showValidationError(message: string): void {
  this.toastr.error(message, 'Validation', {
    timeOut: 3000,
    positionClass: 'toast-top-right'
  });
}
validateForm(): boolean {

  const errors: string[] = [];

  // Property Name
  if (this.propertyForm.get('propertyName')?.invalid) {
    errors.push('Property Name is required.');
  }

  // Property Type
  if (this.propertyForm.get('propertyType')?.invalid) {
    errors.push('Property Type is required.');
  }

  // Payments
  const payments = this.propertyForm.get('payments') as FormArray;

  payments.controls.forEach((payment, index) => {
    const group = payment as FormGroup;

    if (group.get('selectAccount')?.invalid) {
      errors.push(`Payment ${index + 1}: Select Account is required.`);
    }

    if (group.get('selectType')?.invalid) {
      errors.push(`Payment ${index + 1}: Select Type is required.`);
    }
  });

  if (errors.length > 0) {

    this.toastr.error(
      errors.join('<br>'),
      'Validation',
      {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        enableHtml: true
      }
    );

    return false;
  }

  return true;
}
onSubmit() {   
    //console.log(this.propertyForm.value)
    if (!this.validateForm()) {
    return;
    }
    const form = this.propertyForm.value;
    
const request = {
  userid: 1,
  code: '',
  source: 'web',
  company_id: 1,
  tenantId: '',

  name: form.propertyName,
  prefix: form.prefix,
  reference: form.reference,

  address1: form.address1,
  address2: form.address2,

  country_id: Number(form.country),
  state_id: Number(form.state),
  city_id: form.city,
  total_units: Number(form.totalUnits),
  zipcode: form.zipCode,
  lat: form.latitude,
  lon: form.longitude,

  community: form.community,
  land_no: form.landNo,
  no_of_floors: Number(form.floors),
  parking_floors: Number(form.parkingSpaces),
  tags: form.tags,
  desc: form.description,

  property_type:Number(form.propertyType) ,
  purchage_value: Number(form.purchaseValue),

  amenities: this.selectedAmenities.join(','),

  id: 0,

  fixedPayments: form.payments.map((payment: any) => ({
    account_id: Number(payment.selectAccount),
    payment_type: payment.selectType,
    amount: Number(payment.selectAmount)
  }))
};

const formData = new FormData();

// JSON goes as ONE field
formData.append('reqObject', JSON.stringify(request));
if (this.propertyImages.length > 0) {
  formData.append('property_image', this.propertyImages[0]);
}

  console.log(formData);
   this.propertiesService.addProperty(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res["statusCode"] == "200") {
            
          this.isLoading = false;
          this.router.navigate(['/properties']); 
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  

    // API call here
}

/*
onPropertyImagesSelected(files: File[]): void {

  this.propertyImages = files;
  
  console.log('Selected Images:', this.propertyImages);

}*/

}
