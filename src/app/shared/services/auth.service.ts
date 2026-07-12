import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { clearAuthProps, setAuthPropsData } from '../../components/common/store/login-auth-params/auth.actions';
import { selectCurrentUser } from '../../components/common/store/login-auth-params/auth.selectors';
import { Observable, throwError } from 'rxjs';

export interface User {
  userName: string;
  roleName: string;
  token: string;
  userId?: any;
  companyId?: any;
  userCode?: string;
  clientID?: string;
  currencyCode?: string;
  
}

// ✅ UPDATED: Fix the interface to match actual API response
export interface EmployeeSearchResponse {
  employees?: any[];
  data?: any[];
  totalRecords?: number;
  totalCount?: number;
  total?: number;
  // Allow any other properties since API response structure might vary
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://orville.pulseadmin.in/api/UnAuthorized/login';
  baseUrl: string = environment.apiurl
  public currentUser$ = this.store.select(selectCurrentUser);
  commonData: any;

  constructor(private http: HttpClient, private router: Router, private store: Store) { }
 
  loginWithApi(userName: string, password: string): Observable<any> {
    const body:any = {};
    body.userName= userName;
    body.password=password ;
    body.userid= 1,
    body.company_id= 1,
    body.clientId= "74BB6922",
    body.source= "web",
    body.languageid= 1;
    return this.http.post<any>(this.apiUrl, body).pipe(
      tap((res) => {
        if (res["statusCode"] == "200") {
         
          debugger;
          const user: User = {
            userName: res.objResult.username,
            roleName: res.objResult.roleName,
            token: res.objResult.access_token,
            companyId: res.objResult.company_id  || 1,
            clientID: res.objResult.clientID || 1,
            userId: res.objResult.userId,
            userCode:res.objResult.user_Codem,
            currencyCode: res.objResult.currencyCode
          }; 
          this.store.dispatch(
                setAuthPropsData({
                  userId: user.userId,
                  companyId: user.companyId,
                  clientId: user?.clientID?.toString() || '',
                  currencyCode: user?.currencyCode ?? '',
                  userName: user.userName,
                  roleName: user.roleName,
                  userCode: user.userCode ?? '',
                  token: user.token
                })
    
                );
        }
      }),
      catchError((err) => {
        console.error('API login error:', err);
        return throwError(() => err);
      })
    );
  }
  // ✅ LOGOUT
  signOut(): void {
     this.store.dispatch(clearAuthProps());
      this.router.navigate(['/login']);
  }

  private loadUserFromStorage(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      if (!user) {
        return;
      }
    
  this.commonData = user;

  const token = user.token;
  const userName = user.userName;
  const roleName = user.roleName;
  const userId = user.userId;
  const companyId = user.companyId;
  const userCode = user.userCode;
    
    return token && userName && roleName ? { userName, roleName, token, userId: userId ? +userId : 0, companyId: companyId ? +companyId : 1, userCode: userCode || '' } : null;
  });
}

  searchGratuity(payload: any): Observable<any> {
    return this.http.post<any>('https://orville.pulseadmin.in/api/gratuity/search', payload);
  }

  getYears(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'api/EmployeeBenefits/GetYearWise');
  }
}
