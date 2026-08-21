import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-promotion-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './promotion-add.component.html',
  styleUrl: './promotion-add.component.scss'
})
export class PromotionAddComponent {
  properties = ['Sunset Apartments', 'Marina Heights Tower', 'Orville Plaza'];
  sendableOptions = ['Property', 'All Tenants', 'Selected Units'];
  categories = ['Discount', 'Amenity', 'Gift', 'Event'];
  countries = ['United Arab Emirates', 'Saudi Arabia', 'Qatar'];
  cities = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  selectedImageName: string | null = null;
  form = {
    sendableTo: null as string | null,
    property: null as string | null,
    name: '',
    code: '',
    description: '',
    category: null as string | null,
    order: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    address: '',
    country: 'United Arab Emirates' as string | null,
    city: null as string | null,
    zip: '',
    phone: '',
    link: ''
  };

  constructor(private router: Router) {}

  get previewName(): string {
    return this.form.name.trim() || 'Resident Exclusive Discount';
  }

  get previewCode(): string {
    return this.form.code.trim() || 'MARINA-EXCL-18';
  }

  get previewStart(): string {
    return this.form.startDate.trim() || '15-07-2026';
  }

  get previewEnd(): string {
    return this.form.endDate.trim() || '23-07-2026';
  }

  get previewAddress(): string {
    return this.form.address.trim() || 'Level 18, Marina Heights, Dubai';
  }

  get previewCity(): string {
    return this.form.city || 'Dubai';
  }

  get previewEmail(): string {
    return 'event@mail.com';
  }

  get previewPhone(): string {
    return this.form.phone.trim() || '+971589652235';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImageName = input.files?.[0]?.name ?? null;
  }

  clearImage(): void {
    this.selectedImageName = null;
  }

  cancel(): void {
    void this.router.navigate(['/community/promotions']);
  }

  save(): void {
    void this.router.navigate(['/community/promotions']);
  }
}
