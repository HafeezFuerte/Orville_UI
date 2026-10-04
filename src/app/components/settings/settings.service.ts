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

export class SettingsService {

   loginUserData : any;

  constructor(private http: HttpClient, private store: Store,private commonservice:CommonService) {
     this.store.select(selectCurrentUser).subscribe(user => {
        this.loginUserData = user;
      });
   }
 

  saveUsers(formData: FormData): Observable<any> {
    const url = environment.apiurl+'api/Masters/save_update_users'; 
    return this.http.post(url, formData,  { headers: this.commonservice.updateHeaders() });
  } 
  saveRole(payload: any): Observable<any> {
    const url = environment.apiurl+'api/Masters/save_update_roles'; 
    return this.http.post(url, payload,  { headers: this.commonservice.updateHeaders() });
  } 
  
}