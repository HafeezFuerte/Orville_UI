import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedUrlLinks } from './sharedlinks';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  bearer_token: any;
  pro_headers: any;
  userid: any;
  clientID: any;
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();
  private idSource = new BehaviorSubject<number>(0);
  currentId$ = this.idSource.asObservable();
  featureType: string = '0';

  constructor(private http: HttpClient,) { }
  updateHeaders(): HttpHeaders {
    this.bearer_token = localStorage.getItem('token');
    this.userid = localStorage.getItem("userId");
    this.clientID = "74BB6922" // it is different for everyclient based on link;
    if (this.bearer_token && this.userid) {
      const pro_token = "" + this.bearer_token;
      this.pro_headers = new HttpHeaders()
        .set('Accesstoken', pro_token)
        .set('userId', this.userid)
        .set('languageid', '1')
        .set('portalId', '3')
        .set('source', 'web') 
        .set('clientID', this.clientID)
    } else {
      this.pro_headers = new HttpHeaders();
    }

    return this.pro_headers;
  }
  getSideNav(data: any) {
    return this.http.post(SharedUrlLinks._sidenav, data, { headers: this.updateHeaders() });
  } 
}