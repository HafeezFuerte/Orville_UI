import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'; 
import { selectCurrentUser } from '../common/store/login-auth-params/auth.selectors';
import { environment } from '../../../environments/environment';
 import { CommonService } from '../../services/common.service';
@Injectable({
  providedIn: 'root'
})

export class FacilityService {

    loginUserData : any;
 
   constructor(private http: HttpClient, private store: Store,private commonservice:CommonService) {
      this.store.select(selectCurrentUser).subscribe(user => {
         this.loginUserData = user;
       });
    }
 
   save_update_quotation(payload: any): Observable<any> { 
    return this.http.post(environment.apiurl+'api/Accounting/save_update_quotation', payload, { headers: this.commonservice.updateHeaders() });
   }
   saveWorkOrder(payload: any): Observable<any> { 
    return this.http.post(environment.apiurl+'api/Application/save_update_workorder', payload, { headers: this.commonservice.updateHeaders() });
   }
}