import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAllTypes {

  constructor(private http: HttpClient) { }
   getAllAPI = 'https://orville.pulseadmin.in/api/Masters/_getMasters';
   accessToken = localStorage.getItem('token');
   headers = new HttpHeaders({
      'AccessToken': this.accessToken || '',
      'clientID': "74BB6922",
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

  getPropertyTypes(payload: any): Observable<any> {
    
   const headers = this.headers;
   return this.http.post(this.getAllAPI, payload, { headers });
  }

  getCountries(payload: any): Observable<any>{

    const headers = this.headers;
    return this.http.post(this.getAllAPI, payload, { headers });

  }
  getStates(payload: any): Observable<any>{
    const headers = this.headers;
    return this.http.post(this.getAllAPI, payload, { headers });
  }

  getCities(payload: any): Observable<any>{
    const headers = this.headers;
    return this.http.post(this.getAllAPI, payload, { headers });
  }
  getAccounts(payload: any): Observable<any>{
    const headers = this.headers;
    return this.http.post(this.getAllAPI, payload, { headers });
  }

}