import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-template',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-template.component.html',
  styleUrls: []
})
export class CreateTemplateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  templateForm!: FormGroup;

  ngOnInit() {
    this.templateForm = this.fb.group({
      templateName: ['', Validators.required],
      areas: this.fb.array([])
    });

    // Add initial area and section by default
    this.addArea();
  }

  get areasFormArray() {
    return this.templateForm.get('areas') as FormArray;
  }

  get totalAreas() {
    return this.areasFormArray.length;
  }

  get totalSections() {
    let count = 0;
    this.areasFormArray.controls.forEach(control => {
      const sections = control.get('sections') as FormArray;
      count += sections.length;
    });
    return count;
  }

  get completionPercentage(): number {
    let filledFields = 0;
    let totalFields = 1; // Template name is 1

    if (this.templateForm.value.templateName) {
      filledFields++;
    }

    this.areasFormArray.controls.forEach(areaCtrl => {
      totalFields += 2; // Area name, Area order
      if (areaCtrl.get('areaName')?.value) filledFields++;
      if (areaCtrl.get('order')?.value) filledFields++;

      const sections = areaCtrl.get('sections') as FormArray;
      sections.controls.forEach(secCtrl => {
        totalFields += 2; // Section name, Section order
        if (secCtrl.get('sectionName')?.value) filledFields++;
        if (secCtrl.get('order')?.value) filledFields++;
      });
    });

    if (totalFields === 0) return 0;
    return Math.round((filledFields / totalFields) * 100);
  }

  createAreaGroup(): FormGroup {
    return this.fb.group({
      areaName: ['', Validators.required],
      order: [this.areasFormArray ? this.areasFormArray.length + 1 : 1, Validators.required],
      sections: this.fb.array([this.createSectionGroup(1)])
    });
  }

  createSectionGroup(orderNum: number): FormGroup {
    return this.fb.group({
      sectionName: ['', Validators.required],
      order: [orderNum, Validators.required]
    });
  }

  addArea() {
    this.areasFormArray.push(this.createAreaGroup());
  }

  removeArea(index: number) {
    this.areasFormArray.removeAt(index);
  }

  getSectionsArray(areaIndex: number): FormArray {
    return this.areasFormArray.at(areaIndex).get('sections') as FormArray;
  }

  addSection(areaIndex: number) {
    const sections = this.getSectionsArray(areaIndex);
    sections.push(this.createSectionGroup(sections.length + 1));
  }

  removeSection(areaIndex: number, sectionIndex: number) {
    const sections = this.getSectionsArray(areaIndex);
    sections.removeAt(sectionIndex);
  }

  onSubmit() {
    if (this.templateForm.valid) {
      console.log('Template Saved', this.templateForm.value);
      this.router.navigate(['/inspections/templates']);
    } else {
      this.templateForm.markAllAsTouched();
    }
  }
}
