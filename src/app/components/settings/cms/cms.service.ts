import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  private buildHeaders(): HttpHeaders {
    let headers = this.commonService.updateHeaders() || new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    const currentUser = this.commonService.getCurrentUser();
    const token = currentUser?.token || '4D6C1223-5D37-41A2-9CCC-DC1898799B9D';
    const clientId = currentUser?.clientId || '74BB6922';

    if (!headers.has('Accesstoken') || !headers.get('Accesstoken')) {
      headers = headers.set('Accesstoken', token);
    }
    if (!headers.has('clientID') || !headers.get('clientID')) {
      headers = headers.set('clientID', clientId);
    }
    return headers;
  }

  /**
   * Fetch CMS page content by type.
   * Note: We call POST api/Masters/_getMasters with typeId: 109 because browser network
   * engines (Fetch/XHR) strip request bodies on GET requests, causing [FromBody] endpoints
   * like get_cms_by_type to fail with 400 'A non-empty request body is required'.
   * api/Masters/_getMasters runs the exact same backend stored procedure via POST and returns objResult.cms.
   */
  getCmsByType(filterText = '', filterText1 = 'en'): Observable<any> {
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 109,
      filterId: 0,
      filterText: filterText,
      filterText1: filterText1,
      userId: user?.userId || 1,
      clientID: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    return this.http.post(`${environment.apiurl}api/Masters/_getMasters`, payload, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Save CMS page content.
   * Calls POST api/Web/save_web_cms with code, str_content, language.
   */
  saveWebCms(code: string, strContent: string, language = 'en'): Observable<any> {
    const user = this.commonService.getCurrentUser();
    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: language === 'ar' ? 2 : 1,
      code: code,
      str_content: strContent,
      language: language,
    };

    return this.http.post(`${environment.apiurl}api/Web/save_web_cms`, payload, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Fetch website global settings (phone, email, socials, address, etc.).
   * Note: We call POST api/Masters/_getMasters with typeId: 110 for the same reason
   * (avoids browser GET body stripping). Returns objResult.settings.
   */
  getSettingsByType(filterText = ''): Observable<any> {
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 110,
      filterId: 0,
      filterText: filterText,
      filterText1: '',
      userId: user?.userId || 1,
      clientID: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    return this.http.post(`${environment.apiurl}api/Masters/_getMasters`, payload, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Save single website setting.
   * Calls POST api/Web/save_settings_by_type with typeId: 90.
   */
  saveSettingsByType(key: string, value: string): Observable<any> {
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1,
      filterText: key,
      filterText1: value,
      userId: user?.userId || 1,
      clientID: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    return this.http.post(`${environment.apiurl}api/Web/save_settings_by_type`, payload, {
      headers: this.buildHeaders(),
    });
  }
}
