import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-template-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './template-details.component.html',
  styleUrls: []
})
export class TemplateDetailsComponent implements OnInit {
  // Area accordions state tracker
  expandedAreas: { [key: number]: boolean } = {
    0: true,
    1: true
  };

  areasList = [
    {
      name: 'Marina Heights',
      label: 'Area 1',
      sections: [
        { name: 'Marina', orderLabel: 'Section #1' }
      ]
    },
    {
      name: 'Marina Height 2',
      label: 'Area 2',
      sections: [
        { name: 'Marina tower', orderLabel: 'Section #3' }
      ]
    }
  ];

  ngOnInit() {}

  toggleArea(idx: number) {
    this.expandedAreas[idx] = !this.expandedAreas[idx];
  }

  expandAll() {
    this.areasList.forEach((_, idx) => this.expandedAreas[idx] = true);
  }
}
