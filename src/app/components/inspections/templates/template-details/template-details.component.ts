import { Component, OnInit ,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router,ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr'; 
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-template-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './template-details.component.html',
  styleUrl: './template-details.component.scss'
})
export class TemplateDetailsComponent implements OnInit {
  private valueChangesSub?: Subscription;
  private routeSub?: Subscription;
  private commonService = inject(CommonService);
  private router = inject(Router);
  private commontabService = inject(Common_TabsService);
  private toastr = inject(ToastrService);
  public translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  // Area accordions state tracker
  
  inspectionDetails :any={};
  editCode: string | null = null;
  expandedAreas: { [key: number]: boolean } = {
    0: true,
    1: true
  };

  areasList :any=[];

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.editCode = code; 
        this.loadInspectionDetails(code);
      }
    });

  }
  loadInspectionDetails(code: string) { 
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 106,
      filterId: 0,
      filterText: code,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: currentUser?.companyId || 1
    };

    this.commontabService.getMasterByType(payload).subscribe({
      next: (res: any) => { 
        if (res && res.objResult) {
          const details = res.objResult.inspection_dtls || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) { 
            this.inspectionDetails= details[0]
            this.inspectionDetails.modified_date=this.commonService.formatDateForInput(this.inspectionDetails.modified_date) || '';
            this.inspectionDetails.created_date=this.commonService.formatDateForInput(this.inspectionDetails.created_date)
            this.areasList=JSON.parse(this.inspectionDetails.inspection_structure) 
             
          }
        }
      },
      error: (err) => { 
        console.error('Error loading inspection details:', err);
        this.toastr.error('Failed to load inspection details');
      }
    });
  }
  toggleArea(idx: number) {
    this.expandedAreas[idx] = !this.expandedAreas[idx];
  }

  expandAll() {
    this.areasList.forEach((_:any, idx:any) => this.expandedAreas[idx] = true);
  }
}
