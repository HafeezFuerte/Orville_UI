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

export class CommunityService {

    loginUserData : any;
 
   constructor(private http: HttpClient, private store: Store,private commonservice:CommonService) {
      this.store.select(selectCurrentUser).subscribe(user => {
         this.loginUserData = user;
       });
    }
 
   save_event(payload: any): Observable<any> { 
    return this.http.post(environment.apiurl+'api/Application/save_update_events', payload, { headers: this.commonservice.updateHeaders() });
   } 
   save_promotion(payload: any): Observable<any> { 
      return this.http.post(environment.apiurl+'api/Application/save_update_promotions', payload, { headers: this.commonservice.updateHeaders() });
     } 
     save_guide_lines(payload: any): Observable<any> { 
      return this.http.post(environment.apiurl+'api/Application/save_update_guides', payload, { headers: this.commonservice.updateHeaders() });
     } 
}