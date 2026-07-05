
import { Component, ContentChild, ElementRef, EventEmitter, input, Input, output, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
interface column {
  tableHeadColumn?: string;
  header:        string;
}
@Component({
  selector: 'spk-reusable-tables',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './spk-reusable-tables.component.html',
  styleUrl: './spk-reusable-tables.component.scss'
})
export class SpkReusableTables {
  columns = input<column[]>([])
  tableClass = input<string>('');
  tableHead = input<string>('');
  trHeadClass = input<string>('');
  tableFooter = input<string>('');
  tableBody = input<string>('');
  trClass = input<string>('');
  checkboxClass = input<string>('');
  CheckboxText = input<string>('');
  tableFoot = input<string>('');
  tableHeadColumn = input<string>('');
  data = input<any[]>([]);
  title = input<any[]>([]);
  footerData = input<any[]>([]);
  showFooter = input<boolean>(false);
  showCheckbox = input<boolean>(false);

  headercaption = input<boolean>(false);
  footercaption = input<boolean>(false);
  captionheaderclass = input<string>();
  captionfooterclass = input<string>();
  captionheaderContent = input<string>();
  captionfooterContent = input<string>();






  rows = input<{ checked: boolean;[key: string]: any }[]>([]);
  allTasksChecked!: boolean;

  // Converted output signals
  toggleSelectAll = output<boolean>();
  openDetails = output<any>();

  // Toggle select/deselect all checkboxes
  onToggleSelectAll(event: any) {
    this.toggleSelectAll.emit(event.target.checked);
  }
  toggleRowChecked(row: any) {
    row.checked = !row.checked;
    this.allTasksChecked = this.data().every(row => row.checked);
  }

  // Update the "Select All" checkbox based on row selections
  updateSelectAllCheckbox(): void {
    this.allTasksChecked = this.data().every(row => row.checked); // Check if all rows are selected
  }
}
