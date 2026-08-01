import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../common/store/login-auth-params/auth.selectors';
import { environment } from '../../../../environments/environment';
 import { CommonService } from '../../../services/common.service';
@Injectable({
  providedIn: 'root'
})

export class PropertiesService {

   loginUserData : any;

  constructor(private http: HttpClient, private store: Store,private commonservice:CommonService) {
     this.store.select(selectCurrentUser).subscribe(user => {
        this.loginUserData = user;
      });
   }

  getProperties(payload: any): Observable<any> {
   
  const getPropertiesUrl = environment.apiurl+'api/Masters/get_masters_by_paging'; 
   return this.http.post(getPropertiesUrl, payload, { headers: this.commonservice.updateHeaders() });
  }

  getTenants(payload: any): Observable<any> {
    const url = environment.apiurl+'api/Masters/get_masters_by_paging'; 
    return this.http.post(url, payload,  { headers: this.commonservice.updateHeaders() });
  }

  saveTenant(formData: FormData): Observable<any> {
    const url = environment.apiurl+'api/Masters/save_update_tenants';
     
    return this.http.post(url, formData,  { headers: this.commonservice.updateHeaders() });
  }

  saveLandlord(formData: FormData): Observable<any> {
    const url = environment.apiurl+'api/Masters/save_update_landlords';
    
    return this.http.post(url, formData,  { headers: this.commonservice.updateHeaders() });
  }

  saveVendor(formData: FormData): Observable<any> {
    const url = environment.apiurl+'api/Masters/save_update_vendors';
   
    return this.http.post(url, formData,  { headers: this.commonservice.updateHeaders() });
  }

  saveTechnician(formData: FormData): Observable<any> {
    const url = environment.apiurl+'api/Masters/save_update_technicians';
   
    return this.http.post(url, formData,  { headers: this.commonservice.updateHeaders() });
  }

  getUnits(payload: any): Observable<any> {
    const getUnitsUrl = environment.apiurl+'api/Masters/get_masters_by_paging';
     

    return this.http.post(getUnitsUrl, payload, { headers: this.commonservice.updateHeaders() });
  }

  getMasterDetails(payload: any): Observable<any> {
    const getDetailsUrl = environment.apiurl+'api/Masters/_getMasters';
    
    return this.http.post(getDetailsUrl, payload,  { headers: this.commonservice.updateHeaders() });
  }

  addProperty(payload: any): Observable<any> {
     const addPropertyUrl = environment.apiurl+'api/Masters/save_update_property';
    
   return this.http.post(addPropertyUrl, payload,  { headers: this.commonservice.updateHeaders() });
  }

  addUnit(payload: any): Observable<any> {
    const addUnitUrl = environment.apiurl+'api/Masters/save_update_units';
    
    console.log("add unit --", payload);
    return this.http.post(addUnitUrl, payload,  { headers: this.commonservice.updateHeaders() });
  }

  getRooms(payload: any): Observable<any> {
    const getRoomsUrl = environment.apiurl+'api/Masters/get_masters_by_paging'; 
    return this.http.post(getRoomsUrl, payload,  { headers: this.commonservice.updateHeaders() });
  }

  addRoom(payload: any): Observable<any> {
    const addRoomUrl = environment.apiurl+'api/Masters/save_update_rooms';
     
    return this.http.post(addRoomUrl, payload,  { headers: this.commonservice.updateHeaders() });
  }

  addParking(payload: any): Observable<any> {
    const addParkingUrl = environment.apiurl+'api/Masters/save_update_parkings';
     
    return this.http.post(addParkingUrl, payload,  { headers: this.commonservice.updateHeaders() });
  }

  getParkings(payload: any): Observable<any> {
    const getParkingsUrl = environment.apiurl+'api/Masters/get_masters_by_paging'; 
    return this.http.post(getParkingsUrl, payload,  { headers: this.commonservice.updateHeaders() });
  }
}