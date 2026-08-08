import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-inventory-item-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,FileUploadComponent,
    TranslateModule
  ],
  templateUrl: './inventory-item-popup.component.html',
  styleUrls: ['./inventory-item-popup.component.scss']
})
export class InventoryItemPopupComponent {

  @Input({ required: true })
  form!: FormGroup;
  @Output() fileSelected = new EventEmitter<File[]>();
  onFilesSelected(files: File[]) {
    if (files.length > 0) {
      this.form.patchValue({
        propertyAttachment: files[0]
      });
    } else {
      this.form.patchValue({
        propertyAttachment: null
      });
    }
  }
}
