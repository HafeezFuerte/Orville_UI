import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-delete-confirmation',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent {
    @Input() isVisible: boolean = false;
    @Input() message: string = 'web.common.msgConfirmDelete';

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm() {
        this.confirmed.emit();
    }

    onCancel() {
        this.cancelled.emit();
    }
}
