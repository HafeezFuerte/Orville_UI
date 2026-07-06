import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  private apiUrl = 'https://orville.pulseadmin.in/api/Masters/get_masters_by_paging';

  constructor(private http: HttpClient) { }

  getProperties(payload: any): Observable<any> {

     const accessToken = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': "74BB6922",
      'LanguageID': 1,
      'source': 'web',
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

   return this.http.post(this.apiUrl, payload, { headers });
  }
}