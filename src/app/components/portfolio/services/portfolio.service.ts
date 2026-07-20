import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';
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

export class PortfolioService {
currentUser: any;
getMasterAPI = environment.apiurl+'api/Masters/_getMasters';

constructor(private http: HttpClient, private commonService: CommonService) {}

private getFormDataHeaders(): HttpHeaders {
  let headers = this.commonService.updateHeaders();
  headers = headers.delete('Content-Type');
  headers = headers.set('Accept', '*/*');
  return headers;
}
private postAPI(url: string, payload: any): Observable<any> {
  const headers = payload instanceof FormData
    ? this.getFormDataHeaders()
    : this.commonService.updateHeaders();
  return this.http.post(url, payload, { headers });
}
saveAttachment(payload: any): Observable<any> {
  return this.postAPI(
    environment.apiurl + 'api/Masters/save_documents',
    payload
  );
}
saveCommonArea(payload: any): Observable<any> {
  return this.postAPI(
    environment.apiurl + 'api/Masters/save_commonarea',
    payload
  );
}
saveNotes(payload: any): Observable<any> {
  return this.postAPI(
    environment.apiurl + 'api/Masters/save_notes',
    payload
  );
}
//get master api calls
private createPayload(options:any) {
  this.currentUser = this.commonService.getCurrentUser();
  return {
    typeId: options.typeId,
    filterId: options.filterId,
    filterText: options.filterText ,
    filterText1: options.filterText1 ,
    userId:options.userId ?? this.currentUser?.userId,
    clientId:options.clientId ?? this.currentUser?.clientId ,
    companyId:options.companyId ?? this.currentUser?.companyId
  };
}
getMasterByType(options: any): Observable<any> {
  return this.postAPI(
    this.getMasterAPI,
    this.createPayload(options)
  );
}
}
