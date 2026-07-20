import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms'; 
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { TranslateModule } from '@ngx-translate/core'; 
@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  
    TranslateModule
  ],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss']
})
export class ConfirmPopupComponent {
 
  constructor(){}
  ngOnInit(){
     
  }
 
 
}
