import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnMenuItem {
  key: string;
  label: string;
  visible?: boolean;
}

@Component({
  selector: 'app-column-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-menu.component.html',
  styleUrl: './column-menu.component.scss'
})
export class ColumnMenuComponent {
  @Input() columns: ColumnMenuItem[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() toggleAll = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  get allSelected(): boolean {
    return this.columns.length > 0 && this.columns.every((col) => col.visible !== false);
  }

  onToggleAll(event: Event): void {
    this.toggleAll.emit((event.target as HTMLInputElement).checked);
  }

  onToggle(key: string): void {
    this.toggle.emit(key);
  }

  clear(): void {
    this.toggleAll.emit(false);
  }

  close(): void {
    this.closed.emit();
  }
}
