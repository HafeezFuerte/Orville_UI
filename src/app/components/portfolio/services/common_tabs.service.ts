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

export class Common_TabsService {
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

  
loadLookup(typeid :number,filterId: number, targetProperty: string, filterText: string, filterText1: string) {
  this.getMasterByType({
    typeId: typeid,
    filterId: filterId,
    filterText: filterText,
    filterText1: filterText1
  }).subscribe({
    next: (res: any) => {
      if (res.statusCode == 200 && res.objResult && res.objResult.table) {
        (this as any)[targetProperty] = res.objResult.table ;
      }
    },
    error: (err:any) => {
      console.error(`Error fetching lookup ${filterId}:`, err);
    }
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
    environment.apiurl + 'api/Masters/save_commonarea',
    payload
  );
}
saveInventoryItem(payload: any): Observable<any> {
  return this.postAPI(
    environment.apiurl + 'api/Masters/save_update_inventoryitem',
    payload
  );
}
saveParking(payload: any): Observable<any> {
  return this.postAPI(
    environment.apiurl + 'api/Masters/save_update_parkings',
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
getCommonGrid(payload: any): Observable<any> {
  const c = environment.apiurl+'api/Masters/get_masters_by_paging'; 
  return this.http.post(c, payload,  { headers: this.commonService.updateHeaders() });
}
}
