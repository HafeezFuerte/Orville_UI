import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { CommonModule } from '@angular/common';
import { selectCommonData } from "../../common/store/common-payload/common.selectors";
import { CommonState } from "../../common/store/common-payload/common.state";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAllTypes } from "../../../shared/services/get-all-types.service";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-property',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './view-property.component.html',
  styleUrl: './view-property.component.scss'
})

export class ViewPropertyComponent {
  commonData!: CommonState;
  propertyCode: string = '';
  public isLoading = false;
  property: any = [];
  constructor(private propertiesService: GetAllTypes, private router: Router, private store: Store, public translate: TranslateService, private route: ActivatedRoute) {}

  ngOnInit() {
  this.propertyCode = this.route.snapshot.paramMap.get('code') ?? '';
  console.log(this.propertyCode);
  this.loadPropertyData();
}
loadPropertyData(){
this.store.select(selectCommonData).subscribe(data => {
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
 this.propertiesService.
 getPropertyByCode(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res["statusCode"] == "200") {
           this.property = res.objResult.property[0];
           this.property.amenities = res.objResult.amenities;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
}

}