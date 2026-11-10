import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedUrlLinks } from './sharedlinks';
import { BehaviorSubject, Observable } from 'rxjs';
import { formatDate } from '@angular/common';
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
    if (!this.currentUser) {
      try {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          this.currentUser = JSON.parse(stored);
        }
      } catch (e) {}
    }
    return this.currentUser;
  }
  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
    }
  }
  parseInputDate(dateStr: string): string {
    if (!dateStr) return formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    const parts = dateStr.split(/[\/-]/);
    if (parts.length === 3) {
      const d = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const y = Number(parts[2]); 
      return formatDate(new Date(y, m, d), 'yyyy-MM-dd', 'en-US');
    }
    return formatDate(new Date(dateStr), 'yyyy-MM-dd', 'en-US');
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  updateHeaders(): HttpHeaders {
    if (!this.currentUser) {
      this.getCurrentUser();
    }
    if (!this.currentUser) {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Accesstoken: this.currentUser.token || '',
      userId: String(this.currentUser.userId || ''),
      languageid: '1',
      portalId: '3',
      source: 'web',
      clientID: this.currentUser.clientId || ''
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
  saveAttachment(payload: any): Observable<any> {
    return this.postAPI(
      environment.apiurl + 'api/Masters/save_documents',
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

  getExtraFields(feature: string): Observable<any> {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const user = this.getCurrentUser();
    const normalizedFeature = (feature || '').toLowerCase() === 'workorder' ? 'Work Orders' : feature;
    const payload = {
      typeId: -8,
      filterId: 0,
      filterText: normalizedFeature,
      filterText1: '',
      userId: Number(user?.userId) || 1,
      companyId: Number(user?.companyId) || 1,
      clientId: user?.clientId || '74BB6922'
    };
    return this.http.post(url, payload, { headers: this.updateHeaders() });
  }

  getExtraFieldsData(entity: string, entityCode: string): Observable<any> {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const user = this.getCurrentUser();
    const normalizedEntity = (entity || '').toLowerCase() === 'workorder' ? 'Work Orders' : entity;
    const payload = {
      typeId: 9,
      filterId: 0,
      filterText: normalizedEntity,
      filterText1: entityCode,
      userId: Number(user?.userId) || 1,
      companyId: Number(user?.companyId) || 1,
      clientId: user?.clientId || '74BB6922'
    };
    return this.http.post(url, payload, { headers: this.updateHeaders() });
  }

  saveExtraFieldData(payload: any): Observable<any> {
    const url = environment.apiurl + 'api/Masters/save_extra_field_data';
    return this.http.post(url, payload, { headers: this.updateHeaders() });
  }

  getLookupOptions(typeId: number): Observable<any> {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const user = this.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: typeId,
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      companyId: Number(user?.companyId) || 1,
      clientId: user?.clientId || '74BB6922'
    };
    return this.http.post(url, payload, { headers: this.updateHeaders() });
  }

}
