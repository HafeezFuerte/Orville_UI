import { Component, OnInit } from '@angular/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../shared/services/properties.service';
import { SpkReusableTables } from '../../../shared/components/spk-reusable-tables/spk-reusable-tables.component';

@Component({
  selector: 'app-create-new-property',
  standalone: true,
  imports: [SpkReusableTables],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.scss'
})
export class PropertiesListComponent implements OnInit {
constructor(private propertiesService: PropertiesService) {}

columns = [
  { header: 'ID', width: '70px' },
  { header: 'Name' },
  { header: 'Type' },
  { header: 'Status' },
  { header: 'Tags' },
  { header: 'Leases' },
  { header: 'Contacts' },
  { header: 'Total Units' },
  { header: 'Occ Rate' },
  { header: 'Actions', width: '120px' }
];

rows = [
  {
    id: 1,
    name: 'Green Valley',
    type: 'Residential',
    status: 'Active',
    tags: 'Premium',
    leases: 15,
    contacts: 8,
    totalUnits: 22,
    occRate: '82%'
  },
  {
    id: 2,
    name: 'Skyline',
    type: 'Commercial',
    status: 'Inactive',
    tags: 'Retail',
    leases: 10,
    contacts: 4,
    totalUnits: 14,
    occRate: '70%'
  },
  {
    id: 3,
    name: 'Sunrise',
    type: 'Residential',
    status: 'Pending',
    tags: 'Luxury',
    leases: 18,
    contacts: 9,
    totalUnits: 25,
    occRate: '90%'
  }
];
ngOnInit(): void {
    
    const payload = {
  userid: 1,
  company_id: 1,
  clientId: "74BB6922",
  source: "web",
  languageid: 1,
  page_no: 0,
  seqno: 0,
  search_keyword: "",
  filter_by: "",
  "pagecount": 0,
  "featureid": "properties"
}

    this.propertiesService.getProperties(payload).subscribe({
      next: (response) => {
        console.log('Success', response);
      },
      error: (error) => {
        console.error('Error', error);
      }
    });
}
}
