import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { 
  MOCK_NEXT_PAYMENT, 
  MOCK_TENANT_KPIS,
  MOCK_MAINTENANCE_REQUESTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_PAYMENT_SCHEDULE, 
  NextPayment, 
  TenantKpi,
  MaintenanceRequestItem,
  AnnouncementItem,
  PaymentScheduleItem,
} from './t-dashboard.data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-t-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './t-dashboard.component.html',
  styleUrls: ['./t-dashboard.component.scss'],
})
export class TDashboardComponent {
  public tenant:any= [];
  public availableUnits:any=[];
  public selectedLease: any='';
  currentUser = this.commonservice.getCurrentUser();
  public nextPayment: NextPayment = MOCK_NEXT_PAYMENT;
  public active_lease: any={};
  public lease_list: any=[];
  public receipt_dtls: any=[];
  public total_receipts: number=0;//=[];
  public active_rcp_dtls: any={};
  public paid_rcp_dtls: any=[]; 
  public kpis:any=[];
  public maintenanceRequests:any=[];
  public announcements: any=[];
  public paymentSchedule: any=[];

  public isUnitDropdownOpen = false;

  constructor( 
    private router: Router,
    private translate: TranslateService,
    private commontabservice:Common_TabsService,
    private commonservice:CommonService
  ) {
     this.loadLookup(117,0,this.currentUser?.userCode,'');
  }
  loadLookup(typeId:number,filterId: number, filterText?: string, filterText1?: string) {
    this.commontabservice.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {   
          this.tenant=res.objResult.tenant_dtls[0] || {};
          this.lease_list=res.objResult.lease_dtls || [];
          this.receipt_dtls=res.objResult.receipt_dtls || [];
          this.paid_rcp_dtls=res.objResult.paid_summary || [];
          this.active_rcp_dtls=res.objResult.next_payment_dtls[0] || {};
          this.maintenanceRequests=res.objResult.workorders || [];

          this.total_receipts=this.receipt_dtls.filter((item:any)=>item.isSecurityDeposit==0)?.length;
          this.active_lease=this.lease_list.filter((item:any)=>item.status==177)[0] ||{};
          this.selectedLease = this.active_lease.active_lease;


          this.kpis.push({
            id: "Paid",
            title: "Paid till now",
            value: this.paid_rcp_dtls[0].amt,
            subtext: this.paid_rcp_dtls[0]?.total_installments + ' of ' + this.total_receipts + ' cleared',
            iconType: 'paid'
          })
          this.kpis.push({
            id: "Outstanding",
            title: "Outstanding",
            value: this.paid_rcp_dtls[1].amt,
            subtext: "Due " +  this.commonservice.formatDateForInput(this.active_rcp_dtls.due_date),
            iconType: 'outstanding'
          })
          this.kpis.push({
            id: "open-requests",
            title: "Open Requests",
            value: this.paid_rcp_dtls[2]?.amt.split('.')[0],
            subtext:'',
            iconType: 'requests'
          })
          this.kpis.push({
            id: "saved-bookings",
            title: "Saved bookings",
            value: 0,
            subtext:'',
            iconType: 'bookings'
          })

          // this.active_invoice=this.receipt_dtls.filter((item:any)=>item.lease_id==this.selectedLease 
          // && item.bill_to==this.active_lease.tenant_code)[0] || [];
        }
        
      },
      error: (err) => {
        //console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  public toggleUnitDropdown(): void {
    this.isUnitDropdownOpen = !this.isUnitDropdownOpen;
  }

  public selectUnit(unit: any): void {
    this.selectedLease = unit.active_lease;
    this.active_lease=this.lease_list.filter((item:any)=>item.active_lease==unit.active_lease)[0] ||{};
    this.isUnitDropdownOpen = false;
  }

  public get leaseProgressPercentage(): number {
    if (!this.active_lease.totalDays || this.active_lease.totalDays === 0) {
      return 0;
    }
    const pct = (this.active_lease.currentDay / this.active_lease.totalDays) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }

  public getMaintenanceStatusClass(status: string): string {
    switch (status) {
      case 'In progress':
      case 'Open':
      case 'Pending':
        return 't-badge--info';
      case 'Rejected':
        return 't-badge--warning';
      case 'Resolved':
      case 'Approved':
        return 't-badge--success';
      default:
        return 't-badge--neutral';
    }
  }

  public getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'Cleared':
      case 'Deposited':
        return 't-badge--success';
      case 'Pending':
      case 'Upcoming':
        return 't-badge--warning';
      case 'Scheduled':
        return 't-badge--neutral';
      default:
        return 't-badge--neutral';
    }
  }

  public getAnnouncementBadgeClass(badge: string): string {
    switch (badge) {
      case 'Building':
        return 't-badge--neutral';
      case 'Amenities':
        return 't-badge--indigo';
      case 'Safety':
        return 't-badge--orange';
      default:
        return 't-badge--neutral';
    }
  }
}
