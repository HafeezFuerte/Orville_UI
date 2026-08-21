import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-event-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './event-add.component.html',
  styleUrl: './event-add.component.scss'
})
export class EventAddComponent {
  properties = ['Marina Heights Tower', 'Orville Plaza'];
  sendableOptions = ['Property', 'All Tenants', 'Selected Units'];
  selectedImageName: string | null = null;
  form = {
    name: '',
    location: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    email: '',
    phone: '',
    maxAttendance: '',
    sendableTo: null as string | null,
    property: null as string | null
  };

  constructor(private router: Router) {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedImageName = file?.name ?? null;
  }

  clearImage(): void {
    this.selectedImageName = null;
  }

  cancel(): void {
    void this.router.navigate(['/community/events']);
  }

  save(): void {
    void this.router.navigate(['/community/events']);
  }
}
