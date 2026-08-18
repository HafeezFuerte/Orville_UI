import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ACCOUNT_CATEGORIES,
  ACCOUNT_PARENTS,
  ACCOUNT_TYPE_TABS,
  AccountType
} from './chart-of-accounts.data';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss'
})
export class AddAccountComponent {
  parents = ACCOUNT_PARENTS;
  accounts = ACCOUNT_CATEGORIES;
  types: AccountType[] = ACCOUNT_TYPE_TABS.filter((tab): tab is AccountType => tab !== 'All');

  isSubAccount = true;
  parentAccount = '';
  account = '';
  accountType: AccountType | '' = '';
  accountName = '';
  accountNumber = '';
  remoteGlCode = '';
  description = '';

  constructor(private router: Router) {}

  goBack(): void {
    void this.router.navigate(['/accounting/chart-of-accounts']);
  }

  saveAccount(): void {
    this.goBack();
  }
}
