import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getReservationDetail, ReservationRow } from '../reservations.data';
import { TranslateModule } from '@ngx-translate/core';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
})
export class ReservationDetailComponent implements OnInit {
  detail: any=[];
  showMore = true;
  showActionMenu = false;
  actionOptions = [
    { label: 'web.bookings.reservations.editReservation', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'web.bookings.reservations.deleteReservation', asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commontabservice: Common_TabsService,
    private toastr: ToastrService,
    private commonservice: CommonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any) => { 
      this.loadLookup(70,8,'',params.get('code'))
    });
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {  
          if(Typeid==74){
            this.toastr.success("Successfully marked as inactive");  
        }
        else if(Typeid==70){
           this.detail=res.objResult.table[0];
        }
      
        }
        
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/bookings/reservations']);
  }

  goToEdit(): void {
    this.showActionMenu = false;
    void this.router.navigate(['/bookings/reservations/edit',this.detail.code]);
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Reservation' || label === 'web.bookings.reservations.editReservation') {
      this.goToEdit();
    }
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
