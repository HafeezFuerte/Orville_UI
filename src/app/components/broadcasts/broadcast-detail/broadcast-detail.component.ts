import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-broadcast-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './broadcast-detail.component.html',
  styleUrl: './broadcast-detail.component.scss'
})
export class BroadcastDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  broadcastId: string = '';
  previewMode: 'desktop' | 'mobile' = 'desktop';

  broadcastData = {
    id: '31659',
    subject: 'Lease Agreement',
    status: 'Sent',
    type: 'Docs',
    scheduled: true,
    createdAt: '06-06-2026',
    lastUpdated: '06-06-2026',
    sendTo: 'Tenant',
    scheduleTime: '13:01 (GMT +04:00) Abu Dhabi',
    recipientName: 'TENANT FULL NAME',
    recipientEmail: 'TENANT EMAIL',
    recipientPhone: 'TENANT PHONE WITH COUNTRY CODE',
    property: 'PROPERTY',
    propertyNo: 'UNIT NO',
    location: 'PROPERTY FULL ADDRESS',
    contractPeriod: 'LEASE START DATE to LEASE START DATE',
    moveInDate: 'UNIT NO',
    contractValue: 'LEASE RENT',
    rent: 'LEASE RENT',
    rentKeyWords: 'LEASE KEY WORDS',
    securityDeposit: 'LEASE DEPOSIT (LEASE DEPOSIT IN WORDS)',
    modeOfPayment: 'MODE OF PAYMENT',
    tenantSignature: 'TENANT SIGNATURE'
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.broadcastId = params['id'];
    });
  }

  setPreviewMode(mode: 'desktop' | 'mobile') {
    this.previewMode = mode;
  }

  goBack() {
    this.router.navigate(['/broadcasts']);
  }

  sendNow() {}
  editBroadcast() {}
}
