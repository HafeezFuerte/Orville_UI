import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  /**
   * Resolves the active base URL for CMS endpoints.
   * Note: stageapi and appapi backends return 'Invalid cms type' because their backend stored
   * procedures have not been updated yet by the backend team. The working, active CMS stored
   * procedure is hosted on http://development.orvillerealestate.com/.
   */
  private getBaseUrl(): string {
    const raw = environment.apiurl || 'http://development.orvillerealestate.com/';
    if (raw.includes('stageapi') || raw.includes('appapi')) {
      return 'http://development.orvillerealestate.com/';
    }
    return raw.endsWith('/') ? raw : `${raw}/`;
  }

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

    const baseUrl = this.getBaseUrl();
    return this.http.post(`${baseUrl}api/Masters/_getMasters`, payload, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Save CMS page content.
   * Calls POST api/Web/save_web_cms with code, str_content, language.
   */
  saveWebCms(code: string, strContent: string, language = 'en', pageType = ''): Observable<any> {
    const user = this.commonService.getCurrentUser();
    const cleanCode = (code || '').trim().toUpperCase();
    const payload: any = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: language === 'ar' ? 2 : 1,
      code: cleanCode,
      str_content: strContent,
      language: language,
    };
    if (pageType) {
      payload.type = pageType;
    }

    const baseUrl = this.getBaseUrl();
    const headers = this.buildHeaders();

    return this.http.post<any>(`${baseUrl}api/Web/save_web_cms`, payload, { headers }).pipe(
      switchMap((res: any) => {
        // If current server returns 'Invalid cms type' and wasn't already development, retry against development
        if (
          (res?.message === 'Invalid cms type' || res?.statusCode === '-100') &&
          !baseUrl.includes('development.orvillerealestate.com')
        ) {
          const devUrl = 'http://development.orvillerealestate.com/';
          return this.http.post<any>(`${devUrl}api/Web/save_web_cms`, payload, { headers });
        }
        return of(res);
      })
    );
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

    const baseUrl = this.getBaseUrl();
    return this.http.post(`${baseUrl}api/Masters/_getMasters`, payload, {
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

    const baseUrl = this.getBaseUrl();
    return this.http.post(`${baseUrl}api/Web/save_settings_by_type`, payload, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Builds headers for multipart/form-data upload.
   * Omits Content-Type so the browser sets the boundary automatically.
   */
  private buildMultipartHeaders(): HttpHeaders {
    let headers = this.commonService.updateHeaders() || new HttpHeaders();
    headers = headers.delete('Content-Type');

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
   * Fetch website news items.
   * Calls POST api/Masters/_getMasters with typeId: 112.
   * Returns objResult.news array.
   */
  getWebsiteNews(filterText = '', filterText1 = ''): Observable<any> {
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 112,
      filterId: 0,
      filterText: filterText,
      filterText1: filterText1,
      userId: user?.userId || 1,
      clientID: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const baseUrl = this.getBaseUrl();
    return this.http.post(`${baseUrl}api/Masters/_getMasters`, payload, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Save website news item (Add or Edit).
   * Calls POST api/Web/save_website_news with multipart/form-data.
   * Payload format:
   * {
   *   "thumbnail_img": File,
   *   "reqObject": JSON string,
   *   "news_img": File
   * }
   */
  saveWebsiteNews(
    reqObject: any,
    thumbnailFile?: File | null,
    newsFile?: File | null
  ): Observable<any> {
    const user = this.commonService.getCurrentUser();
    const fullReqObj = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: reqObject.language === 'ar' ? 2 : 1,
      code: reqObject.code || '',
      title: reqObject.title || '',
      author: reqObject.author || '',
      short_desc: reqObject.short_desc || '',
      long_desc: reqObject.long_desc || reqObject.description || '',
      slug_url: reqObject.slug_url || '',
      hide_on_end_date: reqObject.hide_on_end_date ? 1 : 0,
      is_visible: reqObject.is_visible ? 1 : 0,
      end_date: reqObject.end_date || '',
      start_date: reqObject.start_date || '',
      language: reqObject.language || 'en',
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(fullReqObj));
    if (thumbnailFile) {
      formData.append('thumbnail_img', thumbnailFile);
    }
    if (newsFile) {
      formData.append('news_img', newsFile);
    }

    const baseUrl = this.getBaseUrl();
    const headers = this.buildMultipartHeaders();
    return this.http.post<any>(`${baseUrl}api/Web/save_website_news`, formData, { headers });
  }
}
