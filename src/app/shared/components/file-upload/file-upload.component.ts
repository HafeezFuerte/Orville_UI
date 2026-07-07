import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() accept = 'image/*';
  @Input() multiple = false;
  @Input() buttonText = 'Upload Image';
  @Input() browseText = 'Browse';
  @Input() dropText = 'Drop your image here or';
  @Output() filesChanged = new EventEmitter<File[]>();
  selectedFiles: File[] = [];

  openFileBrowser(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      return;
    }
    this.selectedFiles = Array.from(input.files);
    this.filesChanged.emit(this.selectedFiles);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.filesChanged.emit(this.selectedFiles);
  }

}