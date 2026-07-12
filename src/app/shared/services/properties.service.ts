import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

   

  constructor(private http: HttpClient) { }

  getProperties(payload: any): Observable<any> {
  const getPropertiesUrl = 'https://orville.pulseadmin.in/api/Masters/get_masters_by_paging';
     const accessToken = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': "74BB6922",
      'LanguageID': 1,
      'source': 'web',
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

   return this.http.post(getPropertiesUrl, payload, { headers });
  }

  getUnits(payload: any): Observable<any> {
    const getUnitsUrl = 'https://orville.pulseadmin.in/api/Masters/get_masters_by_paging';
    const accessToken = localStorage.getItem('token');
    
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
    const accessToken = localStorage.getItem('token');
    
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
     const accessToken = localStorage.getItem('token');
    
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