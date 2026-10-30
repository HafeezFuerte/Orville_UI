import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getReservationDetail, ReservationRow } from '../reservations.data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
})
export class ReservationDetailComponent implements OnInit {
  detail: ReservationRow = getReservationDetail('31658');
  showMore = true;
  showActionMenu = false;
  actionOptions = [
    { label: 'web.bookings.reservations.editReservation', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'web.bookings.reservations.deleteReservation', asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getReservationDetail(params.get('id'));
    });
  }

  goBack(): void {
    void this.router.navigate(['/bookings/reservations']);
  }

  goToEdit(): void {
    this.showActionMenu = false;
    void this.router.navigate(['/bookings/reservations/new']);
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
