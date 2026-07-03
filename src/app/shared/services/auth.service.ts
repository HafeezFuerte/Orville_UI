import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  userName: string;
  roleName: string;
  token: string;
  userId?: any;
  companyId?: any;
  userCode?: string;
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
  // ✅ BehaviorSubject to store the current user
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  get currentUserId(): number | null {
    const user = this.currentUserSubject.value;
    return user?.userId || null;
  }
 

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
            userId: res.objResult.userId,
            userCode:res.objResult.user_Code
          }; 
          this.saveUserToStorage(user);
          this.currentUserSubject.next(user);
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
    this.clearStorage();
    this.currentUserSubject.next(null); // 🔥 notify subscribers
    this.router.navigate(['/login']);
  }

  // ✅ HELPERS
  private saveUserToStorage(user: User): void {
    localStorage.setItem('token', user.token);
    localStorage.setItem('userName', user.userName);
    localStorage.setItem('roleName', user.roleName);
    if (user.userId) localStorage.setItem('userId', user.userId.toString());
    if (user.companyId) localStorage.setItem('companyId', user.companyId.toString());
    if (user.userCode) localStorage.setItem('userCode', user.userCode);
  }

  private loadUserFromStorage(): User | null {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const roleName = localStorage.getItem('roleName');
    const userId = localStorage.getItem('userId');
    const companyId = localStorage.getItem('companyId');
    const userCode = localStorage.getItem('userCode');
    return token && userName && roleName ? { userName, roleName, token, userId: userId ? +userId : 0, companyId: companyId ? +companyId : 1, userCode: userCode || '' } : null;
  }

  setCurrentUser(user: any) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('userName', user.userName);
    localStorage.setItem('roleName', user.roleName);

    if (user.userId) {
      localStorage.setItem('userId', user.userId.toString());
    }

    if (user.companyId) {
      localStorage.setItem('companyId', user.companyId.toString());
    }

    if (user.userCode) {
      localStorage.setItem('userCode', user.userCode);
    }

    this.currentUserSubject.next(user);
  }

  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('roleName');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyId');
    localStorage.removeItem('userCode');
  }


  searchGratuity(payload: any): Observable<any> {
    return this.http.post<any>('https://orville.pulseadmin.in/api/gratuity/search', payload);
  }

  getYears(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'api/EmployeeBenefits/GetYearWise');
  }
}
