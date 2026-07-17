import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../components/common/store/login-auth-params/auth.selectors';
import { environment } from '../../../environments/environment';
export interface LookupPayload {
  filterId: number;
  typeId?: number;
  filterText?: string;
  filterText1?: string;
  userId: number;
  clientId: string;
  companyId: string;
}
@Injectable({
  providedIn: 'root'
})

export class PortfolioTypes {
loginUserData: any;
getMasterAPI = environment.apiurl+'api/Masters/_getMasters';
constructor(private http: HttpClient, private store: Store) {
  this.store.select(selectCurrentUser).subscribe(user => {
    this.loginUserData = user;
  });
}
private getHeaders(): HttpHeaders {
  return new HttpHeaders({
    AccessToken: this.loginUserData?.token ?? '',
    clientID: this.loginUserData?.clientId ?? '',
    'Content-Type': 'application/json-patch+json',
    Accept: '*/*',
    LanguageID: '1',
    source: 'web'
  });
}
private postAPI(url: string, payload: any): Observable<any> {
  console.log('URL:', url);
  console.log('Payload:', payload);

  return this.http.post(url, payload, {
    headers: this.getHeaders()
  });
}
saveAttachment(payload: any): Observable<any> {
  return this.postAPI(
    environment.apiurl + 'api/Masters/save_documents',
    payload
  );
}
saveCommonArea(payload: any): Observable<any> {
  return this.postAPI(
    environment.apiurl + '/api/Masters/save_commonarea',
    payload
  );
}
//get master api calls
private createPayload(options:any) {
  console.log(options.filterText, options.target);
  return {
    typeId: options.typeId,
    filterId: options.filterId,
    filterText: options.filterText ,
    filterText1: options.filterText1 ,
    userId:options.userId ?? this.loginUserData?.userId,
    clientId:options.clientId ?? this.loginUserData?.clientId ,
    companyId:options.companyId ?? this.loginUserData?.companyId
  };
}
getMasterByType(options: any): Observable<any> {
  return this.postAPI(
    this.getMasterAPI,
    this.createPayload(options)
  );
}
}
