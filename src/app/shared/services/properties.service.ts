import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../components/common/store/login-auth-params/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

   loginUserData : any;

  constructor(private http: HttpClient, private store: Store) {
     this.store.select(selectCurrentUser).subscribe(user => {
        this.loginUserData = user;
      });
   }

  getProperties(payload: any): Observable<any> {
   
  const getPropertiesUrl = 'https://orville.pulseadmin.in/api/Masters/get_masters_by_paging';
     const accessToken = this.loginUserData.token;
     const clientID = this.loginUserData.clientId;
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': clientID,
      'LanguageID': 1,
      'source': 'web',
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

   return this.http.post(getPropertiesUrl, payload, { headers });
  }

  getUnits(payload: any): Observable<any> {
    const getUnitsUrl = 'https://orville.pulseadmin.in/api/Masters/get_masters_by_paging';
    const accessToken = this.loginUserData.clientId;
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': '74BB6922',
      'LanguageID': 1,
      'source': 'web',
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

    return this.http.post(getUnitsUrl, payload, { headers });
  }

  getMasterDetails(payload: any): Observable<any> {
    const getDetailsUrl = 'https://orville.pulseadmin.in/api/Masters/_getMasters';
    const accessToken = this.loginUserData.clientId;
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': '74BB6922',
      'LanguageID': 1,
      'source': 'web',
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

    return this.http.post(getDetailsUrl, payload, { headers });
  }

  addProperty(payload: any): Observable<any> {
     const addPropertyUrl = "https://orville.pulseadmin.in/api/Masters/save_update_property";
     const accessToken =this.loginUserData.clientId;
    
    const headers = new HttpHeaders({
    'AccessToken': accessToken || '',
    'clientID': '74BB6922',
    'LanguageID': '1',
    'source': 'web',
    'Accept': '*/*'
  });
console.log("add property --", payload);
   return this.http.post(addPropertyUrl, payload, { headers });
  }
}