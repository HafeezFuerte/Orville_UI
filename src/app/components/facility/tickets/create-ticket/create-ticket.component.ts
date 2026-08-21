import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss'
})
export class CreateTicketComponent {
  private router = inject(Router);

  titleOptions = [
    'Select escalation',
    'Water leakage under kitchen sink',
    'Kitchen Full of Cockroaches',
    'AC not cooling',
    'Elevator issue'
  ];
  selectedTitle: string | null = null;
  description = '';

  properties = ['Marina Heights Tower A', 'Sunset Villa', 'Palm Residence'];
  selectedProperty: string | null = null;
  units = ['Apartment-101-PR', 'Apartment-204', 'Villa-12', 'Lobby'];
  selectedUnit: string | null = null;
  commonAreas = ['Lobby', 'Parking', 'Pool Deck', 'Roof'];
  selectedCommonArea: string | null = null;
  contacts = ['Sahul Hameed', 'Sarah Jenkins', 'Omar Ali', 'Maya Chen'];
  selectedContact: string | null = null;

  sources = ['Email', 'Enter Manually', 'Contact Form', 'Tenant Portal'];
  selectedSource: string | null = null;
  dateValue = '';
  visitingSlots = ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'];
  selectedVisitingSlot: string | null = null;
  priorities = ['Low', 'Medium', 'High', 'Emergency'];
  selectedPriority: string | null = null;

  departments = ['Facility Group', 'Accounting Group', 'Lease Group', 'Security Group'];
  selectedDepartment: string | null = null;
  users = ['Sarah Jenkins', 'Omar Ali', 'Maya Chen', 'Ravi Kumar'];
  selectedUser: string | null = null;

  categories = ['Plumbing', 'HVAC', 'Electrical', 'Pest Control', 'Access', 'General'];
  selectedCategory: string | null = null;
  subCategories = ['Leak', 'Installation', 'Repair', 'Inspection', 'Other'];
  selectedSubCategory: string | null = null;

  tags: string[] = ['Error'];
  newTag = '';

  goBack(): void {
    this.router.navigate(['/facility/tickets']);
  }

  createTicket(): void {
    this.router.navigate(['/facility/tickets']);
  }

  addTag(): void {
    const value = this.newTag.trim().replace(/,$/, '');
    if (!value) {
      return;
    }
    if (!this.tags.includes(value)) {
      this.tags.push(value);
    }
    this.newTag = '';
  }

  onTagInputKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  onMediaSelected(_event: Event, _kind: 'photos' | 'videos' | 'other'): void {
    // Frontend-only upload chrome
  }
}
