import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-notes-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './notes-popup.component.html',
  styleUrls: ['./notes-popup.component.scss']
})
export class NotesPopupComponent {

  @Input({ required: true })
  form!: FormGroup;
  communicationChannels: any = [];
  constructor(private portfolioService: PortfolioService){}
  ngOnInit(){
    this.loadMasterDataByType(2,11,'communicationChannels','','')
  }
  private loadMasterDataByType(
   typeId: number,
  filterId: number,
  target: 'communicationChannels',
  filtertext: '',
  filterText1:'', 
) {
  this.portfolioService.getMasterByType({
    typeId: typeId,
    filterId,
     filterText: filtertext,
    filterText1: filterText1 
  }).subscribe({
    next: res => {
      if(res['statusCode'] == 200)
        this[target] = res.objResult.table;
     
    },
    error: console.error
  });
}
}
