import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CREATE_OVERLAY_CATEGORIES, CreateOverlayCategory, CreateOverlayItem } from './create-overlay.data';

@Component({
  selector: 'app-create-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-overlay.component.html',
  styleUrl: './create-overlay.component.scss'
})
export class CreateOverlayComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  query = '';
  readonly categories = CREATE_OVERLAY_CATEGORIES;

  constructor(private router: Router) {}

  get filteredCategories(): CreateOverlayCategory[] {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      return this.categories;
    }
    return this.categories
      .map((category) => ({
        ...category,
        items: category.title.toLowerCase().includes(q)
          ? category.items
          : category.items.filter((item) => item.label.toLowerCase().includes(q))
      }))
      .filter((category) => category.items.length > 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open']) {
      return;
    }
    if (this.open) {
      this.query = '';
      document.body.style.overflow = 'hidden';
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    } else {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
    this.query = '';
    document.body.style.overflow = '';
  }

  onItemClick(item: CreateOverlayItem): void {
    if (item.route) {
      this.router.navigateByUrl(item.route);
    }
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close();
    }
  }
}
