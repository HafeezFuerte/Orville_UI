import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-guide-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './guide-add.component.html',
  styleUrl: './guide-add.component.scss'
})
export class GuideAddComponent {
  form = {
    name: '',
    property: null as string | null,
    description: ''
  };

  properties = [
    'Dubai Marina, Tower A',
    'Dubai Marina, Tower B',
    'Downtown Residence',
    'Palm Jumeirah West',
    'All Properties'
  ];

  constructor(private router: Router) {}

  cancel(): void {
    void this.router.navigate(['/community/rules-guides']);
  }

  save(): void {
    void this.router.navigate(['/community/rules-guides']);
  }
}
