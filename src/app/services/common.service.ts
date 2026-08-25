import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedUrlLinks } from './sharedlinks';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../components/common/store/login-auth-params/auth.selectors';
import { AuthPayload } from '../components/common/store/login-auth-params/auth.models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  bearer_token: any;
  pro_headers: any;
  userid: any;
  clientID: any;
  private userDataSubject = this.store.select(selectCurrentUser);
  //userData$ = this.userDataSubject.asObservable();
  private idSource = new BehaviorSubject<number>(0);
  currentId$ = this.idSource.asObservable();
  featureType: string = '0';
  private currentUser: AuthPayload | null = null;

  setCurrentUser(user: AuthPayload) {
    this.currentUser = user;
  }
  constructor(private http: HttpClient,private store: Store) {
  this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });
 }
 getCurrentUser(): AuthPayload | null {
    return this.currentUser;
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  updateHeaders(): HttpHeaders {
  
  if (!this.currentUser) {
    return new HttpHeaders();
  }
  return new HttpHeaders({
    Accesstoken: this.currentUser.token,
    userId: String(this.currentUser.userId),
    languageid: '1',
    portalId: '3',
    source: 'web',
    clientID: this.currentUser.clientId
  });
}
  getSideNav(data: any) {
    return this.http.post(SharedUrlLinks._sidenav, data, { headers: this.updateHeaders() });
  } 
  saveLegalCases(payload: any): Observable<any> {
    return this.postAPI(
      environment.apiurl + 'api/Masters/save_update_legal_cases',
      payload
    );
  }
  saveLegalHearing(payload: any): Observable<any> {
    return this.postAPI(
      environment.apiurl + 'api/Masters/save_update_legal_hearing',
      payload
    );
  }
  private postAPI(url: string, payload: any): Observable<any> {
    const headers = this.updateHeaders();
    return this.http.post(url, payload, { headers });
  }
    commonPayload() {
    return {
      userId: this.currentUser?.userId,
      clientId: this.currentUser?.clientId,
      company_id: this.currentUser?.companyId,
      source: 'web',
      languageid: 1
    };
  }
}