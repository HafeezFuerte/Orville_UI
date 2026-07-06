import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpkReusableTables } from '../../../shared/components/spk-reusable-tables/spk-reusable-tables.component';
import { PropertiesService } from '../../../shared/services/properties.service';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [FormsModule, CommonModule, SpkReusableTables, SharedModule],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.scss'
})
export class PropertiesListComponent implements OnInit {

  constructor(public translate: TranslateService, private propertiesService: PropertiesService) {}

  columns = [
    { header: 'web.common.lblID'},
    { header: 'web.common.lblName' },
    { header: 'web.Property.lblType'},
    { header: 'web.Property.lblInternalStatus' },
    { header: 'web.Property.lblTags' },
    { header: 'web.Property.lblLeases' },
    { header: 'web.Property.lblContracts' },
    { header: 'web.Property.lblOccupiedTotalUnits' },
    { header: 'web.Property.lblOccupancyRate' },
    { header: 'web.Property.lblAction'}
  ];

  properties: any[] = [];

    pageNo = 1;
    pageSize = 5;
    totalPages = 0;
    totalRecords = 0;
    pageSizeOptions = [5, 10, 25, 50, 100];
  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {

console.log(this.pageSize);
  const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: '',
      pagecount: this.pageSize,
      filter_by: '',
      featureid: 'Property'
    };
  


    this.propertiesService.getProperties(payload).subscribe({

      next: (response: any) => {

        console.log(response);

        this.properties = response.objResult.property;
        console.log(this.properties)
        this.totalPages = response.objResult.rows_info[0].noofpages;
        //this.pageNo = response.objResult.rows_info[0].currentpage;
        this.totalRecords = response.objResult.rows_info[0].totalrecords;
      },

      error: err => {
        console.error(err);
      }

    });

  }

 
get startRecord(): number {
  if (this.totalRecords === 0) return 0;
  return (this.pageNo - 1) * this.pageSize + 1;
}

get endRecord(): number {
  const end = this.pageNo * this.pageSize;
  return end > this.totalRecords ? this.totalRecords : end;
}

get pages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

onPageSizeChange() {
  this.pageNo = 1;
  this.loadProperties();
}

goToPage(page: number) {
  if (page === this.pageNo) return;

  this.pageNo = page;
  this.loadProperties();
}

previousPage() {
  if (this.pageNo > 1) {
    this.pageNo--;
    this.loadProperties();
  }
}

nextPage() {
  if (this.pageNo < this.totalPages) {
    this.pageNo++;
    this.loadProperties();
  }
}


}
