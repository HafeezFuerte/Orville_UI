import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../common/store/login-auth-params/auth.selectors';

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
    const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
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
    const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
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
     const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
    const headers = new HttpHeaders({
    'AccessToken': accessToken || '',
    'clientID': '74BB6922',
    'LanguageID': '1',
    'source': 'web',
    'Accept': '*/*'
  });
   return this.http.post(addPropertyUrl, payload, { headers });
  }

  addUnit(payload: any): Observable<any> {
    const addUnitUrl = "https://orville.pulseadmin.in/api/Masters/save_update_units";
    const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': '74BB6922',
      'LanguageID': '1',
      'source': 'web',
      'Accept': '*/*'
    });
    console.log("add unit --", payload);
    return this.http.post(addUnitUrl, payload, { headers });
  }

  getRooms(payload: any): Observable<any> {
    const getRoomsUrl = 'https://orville.pulseadmin.in/api/Masters/get_masters_by_paging';
    const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': '74BB6922',
      'LanguageID': 1,
      'source': 'web',
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

    return this.http.post(getRoomsUrl, payload, { headers });
  }

  addRoom(payload: any): Observable<any> {
    const addRoomUrl = "https://orville.pulseadmin.in/api/Masters/save_update_rooms";
    const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': '74BB6922',
      'LanguageID': '1',
      'source': 'web',
      'Accept': '*/*'
    });
    console.log("add room --", payload);
    return this.http.post(addRoomUrl, payload, { headers });
  }

  addParking(payload: any): Observable<any> {
    const addParkingUrl = "https://orville.pulseadmin.in/api/Masters/save_update_parkings";
    const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': '74BB6922',
      'LanguageID': '1',
      'source': 'web',
      'Accept': '*/*'
    });
    console.log("add parking --", payload);
    return this.http.post(addParkingUrl, payload, { headers });
  }

  getParkings(payload: any): Observable<any> {
    const getParkingsUrl = 'https://orville.pulseadmin.in/api/Masters/get_masters_by_paging';
    const accessToken = this.loginUserData?.token || localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'AccessToken': accessToken || '',
      'clientID': '74BB6922',
      'LanguageID': 1,
      'source': 'web',
      'Content-Type': 'application/json-patch+json',
      'Accept': '*/*'
    });

    return this.http.post(getParkingsUrl, payload, { headers });
  }
}