import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CollectionRequestDetail, getCollectionRequestDetail } from '../collection-requests.data';

@Component({
  selector: 'app-collection-request-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-request-detail.component.html'
})
export class CollectionRequestDetailComponent implements OnInit {
  detail: CollectionRequestDetail = getCollectionRequestDetail('31');

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getCollectionRequestDetail(params.get('id'));
    });
  }

  goBack(): void {
    void this.router.navigate(['/collection-requests']);
  }
}
