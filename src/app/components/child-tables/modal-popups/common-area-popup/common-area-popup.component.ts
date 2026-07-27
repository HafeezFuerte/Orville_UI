import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-common-area-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './common-area-popup.component.html',
  styleUrls: ['./common-area-popup.component.scss']
})
export class CommonAreaPopupComponent {

  @Input({ required: true })
  form!: FormGroup;

}
