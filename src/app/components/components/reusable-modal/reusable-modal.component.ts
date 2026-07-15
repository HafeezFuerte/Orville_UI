import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reusable-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reusable-modal.component.html'
})
export class ReusableModalComponent {

  @Input() modalId = '';

  @Input() title = '';

  @Input() subtitle = '';

  @Input() saveText = 'Save';

  @Input() cancelText = 'Close';

  @Output() save = new EventEmitter<void>();

  @Output() close = new EventEmitter<void>();

}
