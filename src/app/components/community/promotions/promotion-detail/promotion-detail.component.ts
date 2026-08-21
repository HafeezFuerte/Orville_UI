import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PromotionRow, getPromotionById } from '../promotions.data';

@Component({
  selector: 'app-promotion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './promotion-detail.component.html',
  styleUrl: './promotion-detail.component.scss'
})
export class PromotionDetailComponent implements OnInit, OnDestroy {
  detail: PromotionRow = getPromotionById('658');
  showActionMenu = false;
  showPreview = false;
  codeCopied = false;

  actionOptions = [
    { label: 'Edit Promotion', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Preview', asset: 'assets/images/broadcasts/eye.svg', danger: false },
    { label: 'Delete', asset: 'assets/images/action-menu/trash.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getPromotionById(params.get('id'));
    });
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('preview') === '1') {
        this.openPreview();
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { preview: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.closePreview();
  }

  get statusLabel(): string {
    return this.detail.status === 'Published' ? 'Active' : this.detail.status;
  }

  get previewStatusLabel(): string {
    return this.detail.status === 'Published' ? 'Active Promotion' : 'Draft Promotion';
  }

  goBack(): void {
    void this.router.navigate(['/community/promotions']);
  }

  goToEdit(): void {
    void this.router.navigate(['/community/promotions/new']);
  }

  openPreview(): void {
    this.showActionMenu = false;
    this.codeCopied = false;
    this.showPreview = true;
    document.body.classList.add('promo-preview-open');
    document.body.style.overflow = 'hidden';
  }

  closePreview(): void {
    this.showPreview = false;
    this.codeCopied = false;
    document.body.classList.remove('promo-preview-open');
    document.body.style.overflow = '';
  }

  copyPromotionCode(event: Event): void {
    event.stopPropagation();
    const code = this.detail.code || '';
    if (!code) {
      return;
    }
    void navigator.clipboard.writeText(code).then(() => {
      this.codeCopied = true;
      window.setTimeout(() => {
        this.codeCopied = false;
      }, 1500);
    });
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Promotion') {
      this.goToEdit();
    } else if (label === 'Preview') {
      this.openPreview();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showPreview) {
      this.closePreview();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
