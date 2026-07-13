import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../components/common/store/login-auth-params/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class GetAllTypes {
loginUserData: any;
getAllAPI = 'https://orville.pulseadmin.in/api/Masters/_getMasters';
headers: any;
  constructor(private http: HttpClient, private store: Store) {
     this.store.select(selectCurrentUser).subscribe(user => {
            this.loginUserData = user;
          });
   }
getHeaders(): Observable<HttpHeaders> {

  return this.store.select(selectCurrentUser).pipe(
    take(1),
    map(user => new HttpHeaders({
      AccessToken: user?.token ?? '',
      clientID: user?.clientId ?? '',
      'Content-Type': 'application/json-patch+json',
      Accept: '*/*',
      LanguageID: '1',
      source: 'web'
    }))
  );

}
  getPropertyTypes(payload: any): Observable<any>{
   return this.getHeaders().pipe(
    switchMap(headers =>
      this.http.post(this.getAllAPI, payload, {
        headers
      })
    )
  );
  }

  getCountries(payload: any): Observable<any>{
    return this.getHeaders().pipe(
    switchMap(headers =>
      this.http.post(this.getAllAPI, payload, {
        headers
      })
    )
  );
  }
  getStates(payload: any): Observable<any>{
   return this.getHeaders().pipe(
    switchMap(headers =>
      this.http.post(this.getAllAPI, payload, {
        headers
      })
    )
  );
  }

  getCities(payload: any): Observable<any>{
    return this.getHeaders().pipe(
    switchMap(headers =>
      this.http.post(this.getAllAPI, payload, {
        headers
      })
    )
  );
  }
getAccounts(payload: any): Observable<any> {
    return this.getHeaders().pipe(
    switchMap(headers =>
      this.http.post(this.getAllAPI, payload, {
        headers
      })
    )
  );
  }
  getPropertyByCode(payload: any): Observable<any> {

  return this.getHeaders().pipe(
    switchMap(headers =>
      this.http.post(this.getAllAPI, payload, {
        headers
      })
    )
  );

}

}