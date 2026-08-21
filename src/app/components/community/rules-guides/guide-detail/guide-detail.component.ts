import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GuideRow, getGuideById } from '../rules-guides.data';

@Component({
  selector: 'app-guide-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guide-detail.component.html',
  styleUrl: './guide-detail.component.scss'
})
export class GuideDetailComponent implements OnInit {
  detail: GuideRow = getGuideById('RG-101');
  showActionMenu = false;

  actionOptions = [
    { label: 'Edit Guide', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Publish', asset: 'assets/images/action-menu/files.svg', danger: false },
    { label: 'Delete', asset: 'assets/images/action-menu/trash.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getGuideById(params.get('id'));
    });
  }

  goBack(): void {
    void this.router.navigate(['/community/rules-guides']);
  }

  goToEdit(): void {
    void this.router.navigate(['/community/rules-guides/new']);
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Guide') {
      this.goToEdit();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
