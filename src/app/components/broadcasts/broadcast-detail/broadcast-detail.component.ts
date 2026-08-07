import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';

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
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  broadcastId: string = '';
  previewMode: 'desktop' | 'mobile' = 'desktop';

  broadcastData: any = {};

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.broadcastId = params['id'];
      if (this.broadcastId) {
        this.getBroadcastDetails();
      }
    });
  }

  getBroadcastDetails() {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: this.broadcastId,
      pagecount: 1,
      filter_by: "",
      filter_list: "",
      featureid: "BROADCASTS"
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult && res.objResult.broadcasts && res.objResult.broadcasts.length > 0) {
          const item = res.objResult.broadcasts[0];
          this.broadcastData = {
            id: item.id || '',
            subject: item.subject || '',
            status: item.status_text || 'Draft',
            type: item.type || '',
            scheduled: item.scheduled || false,
            createdAt: item.created_date || '',
            lastUpdated: item.modified_date || '',
            sendTo: item.contact || 'All',
            scheduleTime: item.scheduled_date || '',
            recipientName: item.contact_name || '',
            recipientEmail: item.email_address || '',
            recipientPhone: item.mobile || '',
            property: item.property_name || '',
            propertyNo: item.unit_no || '',
            location: item.location || '',
            contractPeriod: '',
            moveInDate: '',
            contractValue: '',
            rent: '',
            rentKeyWords: '',
            securityDeposit: '',
            modeOfPayment: '',
            tenantSignature: ''
          };
        }
      }
    });
  }

  setPreviewMode(mode: 'desktop' | 'mobile') {
    this.previewMode = mode;
  }

  goBack() {
    this.router.navigate(['/broadcasts']);
  }

  sendNow() {}

  editBroadcast() {
    // Navigate to create-broadcast component in edit mode by passing route query param or route
    this.router.navigate(['/broadcasts/create'], { queryParams: { editId: this.broadcastId } });
  }
}
