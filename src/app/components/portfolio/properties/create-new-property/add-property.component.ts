import { Component } from '@angular/core';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormArray, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PropertiesService } from '../../services/properties.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
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
  private portfolioService: PortfolioService,
  private toastr:ToastrService,
  private router: Router

){}

ngOnInit(){

  this.initializeForm();
  this.loadMasterDataByType(2,1, 'propertyTypes', '','');
  this.loadMasterDataByType(2,1000, 'countries', '','');
  this.loadMasterDataByType(2,1003, 'accounts', '','');
  this.loadMasterDataByType(2,2, 'amenities', '','');

   this.propertyCode = this.route.snapshot.paramMap.get('code') ?? '';
  if (this.propertyCode) {
    this.loadProperty();
  } else {
    this.initializeForm();
  }
}
initializeForm(){
 this.propertyForm = this.formBuilder.group({

  propertyName: ['', Validators.required],
  prefix: ['', Validators.required],
  reference: ['', Validators.required],

  address1: ['', Validators.required],
  address2: [''],
  country: ['', Validators.required],
  state:['', Validators.required],
  city: ['', Validators.required],

  zipCode: ['', Validators.required],
  latitude: ['', Validators.required],
  longitude: ['', Validators.required],
  community: ['', Validators.required],
  landNo: ['', Validators.required],

  floors: [0, Validators.required],
  totalUnits: [0, Validators.required],
  parkingSpaces: [0, Validators.required],

  tags: ['', Validators.required],
  description: [''],

  // Property Fixed Payments
  selectAccount: ['', Validators.required],
  selectType: ['', Validators.required],
  selectAmount: ['', Validators.required],

  // Right panel
  propertyType: ['', Validators.required],
  purchaseValue: [0, Validators.required],

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
  this.portfolioService.getMasterByType({
    typeId:13,
    filterId: 0,
    filterText: this.propertyCode,
    filterText1: ''
  }).subscribe({next:(res) => {
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
            console.log("country", this.property.country_id);
            this.loadMasterDataByType( 2, 1001, 'states', this.property.country_id.toString(), '', () => { this.propertyForm.patchValue({ state: this.property.state_id }); } );
            this.loadMasterDataByType( 2, 1002, 'cities', this.property.state_id.toString(), '', () => { this.propertyForm.patchValue({ city: this.property.city_id }); } );
          
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

onAmenityChange(event: Event, id: number): void {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) {
    if (!this.selectedAmenities.includes(id)) {
      this.selectedAmenities.push(id);
    }
  } else {
    this.selectedAmenities = this.selectedAmenities.filter(x => x !== id);
  }
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
/*validateForm(): boolean {

  const errors: string[] = [];
  if (this.propertyForm.get('propertyName')?.invalid) {
    errors.push('Property Name is required.');
  }
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
}*/
validateForm(
  form: FormGroup,
  fieldLabels: { [key: string]: string },
  errors: string[]
): void {

  Object.keys(fieldLabels).forEach(controlName => {

    const control = form.get(controlName);

    if (control?.invalid) {
      errors.push(
        `${fieldLabels[controlName]} ${this.translate.instant('web.common.lblIsRequired')}`
      );
    }

  });

  form.markAllAsTouched();
}
validatePayments(errors: string[]): void {
  const payments = this.propertyForm.get('payments') as FormArray;
  payments.controls.forEach((payment, index) => {
    const group = payment as FormGroup;
    if (group.get('selectAccount')?.invalid) {
      errors.push(
        `Payment ${index + 1}: ${this.translate.instant('web.property.lblSelectAccount')} ${this.translate.instant('web.common.lblIsRequired')}`
      );
    }
    if (group.get('selectType')?.invalid) {
      errors.push(
        `Payment ${index + 1}: ${this.translate.instant('web.property.lblType')} ${this.translate.instant('web.common.lblIsRequired')}`
      );
    }
  });
}
onSubmit() { 
  const propertyFormLabels = {
  propertyName: this.translate.instant('web.property.lblPropertyName'),
  propertyType: this.translate.instant('web.property.lblPropertyType'),

  prefix: this.translate.instant('web.property.lblPrefix'),
  reference: this.translate.instant('web.property.lblReference'),

  address1: this.translate.instant('web.property.lblAddress1'),
  address2: this.translate.instant('web.property.lblAddress2'),
  country: this.translate.instant('web.property.lblCountry'),
  state: this.translate.instant('web.property.lblState'),
  city: this.translate.instant('web.property.lblCity'),
  zipCode: this.translate.instant('web.property.lblZipCode'),
  latitude: this.translate.instant('web.property.lblLatitude'),
  longitude: this.translate.instant('web.property.lblLongitude'),
  community: this.translate.instant('web.property.lblCommunity'),
  landNo: this.translate.instant('web.property.lblLandNo'),
  floors: this.translate.instant('web.property.lblFloors'),
  totalUnits: this.translate.instant('web.property.lblTotalUnits'),
  parkingSpaces: this.translate.instant('web.property.lblParkingSpaces'),
  tags: this.translate.instant('web.property.lblTags'),

  description: this.translate.instant('web.property.lblDescription'),

  makaniNo: this.translate.instant('web.property.lblMakaniNo'),

  purchaseValue: this.translate.instant('web.property.lblPurchaseValue'),

  serviceRequest: this.translate.instant('web.property.lblServiceRequest'),

  includeAmenities: this.translate.instant('web.property.lblIncludeAmenities'),

  propertyImage: this.translate.instant('web.property.lblPropertyImage')
};
 const errors: string[] = [];

this.validateForm(this.propertyForm, propertyFormLabels, errors);

this.validatePayments(errors);

if (errors.length > 0) {

  this.toastr.error(
    errors.join('<br>'),
    'Validation',
    {
      enableHtml: true,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }
  );

  return;
}
    const form = this.propertyForm.value;
    
    const request = {
      userid: 1,
      code: this.propertyCode? this.propertyCode : '',
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
onCountryChange(event: Event): void {
  const countryId = (event.target as HTMLSelectElement).value;
  this.loadMasterDataByType(2,1001,'states',countryId.toString(),'');
}
onStateChange(event: Event): void{
 const stateId = (event.target as HTMLSelectElement).value;
  this.loadMasterDataByType(2,1002,"cities",stateId.toString(),'');
}


private loadMasterDataByType(
  typeId: number,
  filterId: number,
  target: 'propertyTypes' | 'accounts' | 'amenities' | 'countries'| 'states' | 'cities',
  filtertext:string ='',
  filterText1:string ='', 
  callback?:()=>void
) {
  this.portfolioService.getMasterByType({
    typeId: typeId,
    filterId,
    filterText: filtertext,
    filterText1: filterText1 
  }).subscribe({
    next: res => {

      if(res['statusCode'] == 200)
        this[target] = res.objResult.table;
      console.log("state", res.objResult.table);
       callback?.();
     
    },
    error: (err) => {
  console.log('Full Error:', err);
}
  });
}
}
