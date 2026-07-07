import { Component } from '@angular/core';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [FileUploadComponent],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss'
})
export class AddPropertyComponent {
propertyImages: File[] = [];
constructor(public translate: TranslateService){}
onPropertyImagesSelected(files: File[]): void {

  this.propertyImages = files;
  
  console.log('Selected Images:', this.propertyImages);

}
}
