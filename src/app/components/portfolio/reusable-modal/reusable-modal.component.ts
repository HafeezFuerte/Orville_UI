import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reusable-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './reusable-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ReusableModalComponent implements OnInit, OnDestroy {
  @Input() modalId = '';

  @Input() title = '';

  @Input() subtitle = '';

  @Input() saveText = 'Save';

  @Input() cancelText = 'Close';

  @Output() save = new EventEmitter<void>();

  @Output() close = new EventEmitter<void>();

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    // Render above app-header / sidebar stacking contexts (fixed backdrop
    // otherwise stays trapped under page chrome when opened from detail panels).
    this.renderer.appendChild(document.body, this.host.nativeElement);
    this.renderer.addClass(document.body, 'ov-modal-open');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'ov-modal-open');
  }
}
