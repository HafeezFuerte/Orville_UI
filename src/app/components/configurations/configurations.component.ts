import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, SharedModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss'
})
export class ConfigurationsComponent {
  constructor(public translate: TranslateService, private router: Router) { }

  tabs = [
    { label: 'web.payroll.configurations.lblEmpSalaryGroup', link: 'emp-salary-group' },
    { label: 'web.payroll.configurations.lblGroupCTC', link: 'group-ctc' },
    { label: 'web.payroll.configurations.lblCTCWages', link: 'ctc-wages' },
    { label: 'web.payroll.configurations.lblCTCAllowances', link: 'ctc-allowances' },
    { label: 'web.payroll.configurations.lblNonCTC', link: 'non-ctc' },
    { label: 'web.payroll.configurations.lblEmployeeInput', link: 'employee-input' },
    { label: 'web.payroll.configurations.lblCompanyInput', link: 'company-input' },
    { label: 'web.payroll.configurations.lblOT', link: 'ot' },
    { label: 'web.payroll.configurations.lblAttendanceLeaveSettings', link: 'attendance-leave-settings' }
  ];

  goBack() {
    this.router.navigate(['/payroll/dashboard']);
  }

}
