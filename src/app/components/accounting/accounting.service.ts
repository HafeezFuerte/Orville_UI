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

export class AccountingService {

    loginUserData : any;
 
   constructor(private http: HttpClient, private store: Store,private commonservice:CommonService) {
      this.store.select(selectCurrentUser).subscribe(user => {
         this.loginUserData = user;
       });
    }
 
   save_invoice(payload: any): Observable<any> { 
    return this.http.post(environment.apiurl+'api/Accounting/save_update_invoice', payload, { headers: this.commonservice.updateHeaders() });
   }
   save_expense(payload: any): Observable<any> { 
      return this.http.post(environment.apiurl+'api/Accounting/save_update_expense', payload, { headers: this.commonservice.updateHeaders() });
     }
}