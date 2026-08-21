import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';

@Component({
  selector: 'app-hearings-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    SharedTableComponent, 
    TranslateModule,
    ReusableModalComponent
  ],
  templateUrl: './hearings-table.component.html',
  styleUrls: []
})
export class HearingsTableComponent implements OnInit {
  @Input() selectedTab: any = [];
  isColumnDropdownOpen = false;
  showModal = false;
  selectedHearing: any = null;

  private fb = inject(FormBuilder);
  hearingForm!: FormGroup;

  ngOnInit() {
    this.hearingForm = this.fb.group({
      date: [''],
      description: [''],
      attachment: ['']
    });
  }

  get columns() {
    return this.selectedTab?.columns || [];
  }

  get visibleColumns() {
    return this.columns.filter((c: any) => c.visible !== false);
  }

  toggleColumnDropdown() {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }

  toggleColumn(col: any) {
    col.visible = !(col.visible !== false);
  }

  toggleAllColumns(event: any) {
    const isChecked = event.target.checked;
    this.columns.forEach((c: any) => c.visible = isChecked);
  }

  get allColumnsVisible() {
    if (!this.columns.length) return false;
    return this.columns.every((c: any) => c.visible !== false);
  }

  openAddModal() {
    this.selectedHearing = null;
    this.hearingForm.reset({
      date: '',
      description: '',
      attachment: ''
    });
    this.showModal = true;
  }

  openHearingDetails(row: any) {
    this.selectedHearing = row;
    this.hearingForm.patchValue({
      date: row.date,
      description: row.description,
      attachment: row.attachment
    });
    this.showModal = true;
  }

  saveHearing() {
    if (this.hearingForm.invalid) {
      return;
    }
    const values = this.hearingForm.value;

    if (this.selectedHearing) {
      // Edit mode: update record in the list
      const idx = this.selectedTab.data.findIndex((h: any) => h.id === this.selectedHearing.id);
      if (idx !== -1) {
        this.selectedTab.data[idx] = {
          ...this.selectedHearing,
          date: values.date,
          description: values.description,
          attachment: values.attachment
        };
      }
    } else {
      // Add mode: generate a random new ID and push
      const newId = String(Math.floor(10000 + Math.random() * 90000));
      this.selectedTab.data.push({
        id: newId,
        date: values.date,
        description: values.description,
        attachment: values.attachment || '0 Files'
      });
    }

    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.selectedHearing = null;
  }
}
