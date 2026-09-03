import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { OvModalPortalService } from '../../../shared/services/ov-modal-portal.service';

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

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly modalPortal = inject(OvModalPortalService);

  ngOnInit(): void {
    this.modalPortal.portalHost(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.modalPortal.releaseHost();
  }
}
