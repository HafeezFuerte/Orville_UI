import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';

@Component({
  selector: 'app-create-work-order',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './create-work-order.component.html',
  styleUrl: './create-work-order.component.scss'
})
export class CreateWorkOrderComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);

  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1'];

  // Form Models
  title: string = '';
  description: string = '';

  properties = ['Select Property', 'Marina Heights Tower A'];
  selectedProperty: string | null = null;
  units = ['Select Unit', 'Apartment-101-FR'];
  selectedUnit: string | null = null;
  commonAreas = ['Select', 'Lobby'];
  selectedCommonArea: string | null = null;
  floors = ['Select', '1st Floor'];
  selectedFloor: string | null = null;

  responsiblePeople = ['Select', 'Sanul Hameed'];
  selectedResponsiblePerson: string | null = null;
  tenants = ['Select Tenant', 'John Doe'];
  selectedTenant: string | null = null;
  vendors = ['Select Vendor', 'Rahman Mohammad'];
  selectedVendor: string | null = null;

  tags: string[] = ['Error'];
  newTag: string = '';

  categories: any[] = [];
  selectedCategory: any = null;
  subcategories: any[] = [];
  selectedSubcategory: any = null;
  priorities = ['Select', 'High', 'Medium', 'Low'];
  selectedPriority: string | null = null;
  durationTypes = ['Select', 'Hours', 'Days'];
  selectedDurationType: string | null = null;
  duration: string = '';
  visitingHours = ['Select', '9:00 AM - 5:00 PM'];
  selectedVisitingHours: string | null = null;
  dueDate: string = '';
  availableDate: string = '';

  beforeImages: File[] = [];
  afterImages: File[] = [];
  videos: File[] = [];
  attachments: File[] = [];

  ngOnInit() {
    this.loadLookup(30, 'categories', 'lookup_name');
    this.loadLookup(31, 'subcategories', 'lookup_name');
  }

  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item[nameField] || item.lookup_name || item.name || ''
          }));
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/facility/work-orders']);
  }

  saveWorkOrder() {
    // Handle save
    this.goBack();
  }

  addTag(event: Event) {
    event.preventDefault();
    if (this.newTag.trim()) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  // File Handling
  onFileSelected(event: any, type: 'before' | 'after' | 'video' | 'attachment') {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (type === 'before') this.beforeImages.push(files[i]);
        if (type === 'after') this.afterImages.push(files[i]);
        if (type === 'video') this.videos.push(files[i]);
        if (type === 'attachment') this.attachments.push(files[i]);
      }
    }
  }

  removeFile(index: number, type: 'before' | 'after' | 'video' | 'attachment') {
    if (type === 'before') this.beforeImages.splice(index, 1);
    if (type === 'after') this.afterImages.splice(index, 1);
    if (type === 'video') this.videos.splice(index, 1);
    if (type === 'attachment') this.attachments.splice(index, 1);
  }
}
