import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormBuilder } from '@angular/forms';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
 
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { AccountingService } from '../accounting.service';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss'
})
export class AddAccountComponent {
  parents:any=[];
  accounts:any=[];
  types: any=[];
  account_code:string='';
  isSubAccount = true;
  parentAccount = '';
  accountSubType = 0;
  currentUser = this.commonservice.getCurrentUser();
  accountType: any | '' = '';
  accountName = '';
  accountNumber = '';
  remoteGlCode = '';
  description = '';

  constructor(private router: Router, private route: ActivatedRoute,  private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService, private fb: FormBuilder,public translate: TranslateService,public accountingService:AccountingService) { }


    ngOnInit(): void {
      
      this.route.paramMap.subscribe(params => { 
        this.account_code = params.get('code') ?? '';
         
      });
      this.getcoamasters(this.account_code);
    }
     
  getcoamasters(acccode:string) {
    this.commontabservice.getMasterByType({
      typeId: 67,
      filterId: 0,
      filterText: acccode,
      filterText1: ''
    }).subscribe({
      next: (res: any) => { 
        if (res.statusCode == 200 && res.objResult) {  
          this.types= res.objResult.account_types || {}; 
          this.accounts = res.objResult.account_sub_types || []; 
          this.parents=res.objResult.parent_accounts || [];   
          if(res.objResult.coa_details){
            const coa=res.objResult.coa_details[0];
            this.accountName=coa.account_name;
            this.accountNumber=coa.account_no;
            this.accountSubType=coa.sub_type;
            this.accountType=coa.account_type;
            this.description=coa.description;
            this.isSubAccount=coa.parent_code!=null ? true:false;
            this.remoteGlCode=coa.remote_gl_code;
            this.parentAccount=coa.parent_code;
          }
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }
  goBack(): void {
    void this.router.navigate(['/accounting/chart-of-accounts']);
  }

  saveAccount(): void {
     if(this.accountNumber==null || this.accountNumber==""){
      this.toastr.error("Invalid account no");
      return;
     }
     else  if(this.accountName==null || this.accountName==""){
      this.toastr.error("Invalid account name");
      return;
     }
     else if(this.accountType==null || this.accountType==0){
      this.toastr.error("Invalid account type");
      return;
     }
     else if(this.accountSubType==null || this.accountSubType==0){
      this.toastr.error("Invalid account sub type");
      return;
     }
     else{
      const payload = {
        userid: this.currentUser?.userId || 1,
        company_id: this.currentUser?.companyId || 1,
        clientId: this.currentUser?.clientId || "74BB6922",
        source: "web",
        languageid: 1,
        code: this.account_code || "", 
        account_no: this.accountNumber,
        account_name: this.accountName,
        description: this.description || "",
        account_type:this.accountType,
        account_subtype: this.accountSubType, //Pending,
        remote_gl_code:this.remoteGlCode,
        isSubAccount: this.isSubAccount, 
        parent_code:this.parentAccount
      };
  
      this.accountingService.save_update_coa(payload).subscribe({
        next: (response: any) => {
          if (response && response.statusCode === "200" && response.objResult) { 
            this.toastr.success("Successfully created")
            this.router.navigate(['/accounting/chart-of-accounts'])
          }
        },
        error: (err: any) => {
          console.error("Error saving broadcast:", err);
        }
      });
   
     }
  }
}
