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
import { OvModalPortalService } from '../../services/ov-modal-portal.service';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
})
export class DeleteConfirmationComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Input() title = 'Confirm';
  @Input() message = 'web.common.msgConfirmDelete';
  @Input() confirmText = 'web.common.lblYes';
  @Input() cancelText = 'web.common.lblNo';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly modalPortal = inject(OvModalPortalService);

  ngOnInit(): void {
    this.modalPortal.portalHost(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.modalPortal.releaseHost();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
