import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BlankFormsService {
    private baseUrl = environment.apiurl;

    constructor(private http: HttpClient) { }

    /**
     * Get Categories List
     * API: /api/blank-docs/GetCategoriesList
     */
    getCategoriesList(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}api/blank-docs/GetCategoriesList`);
    }

    /**
     * Search Blank Forms
     * API: /api/blank-docs/search
     */
    searchBlankForms(payload: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}api/blank-docs/search`, payload);
    }

    /**
     * View Blank Form Details
     * API: /api/blank-docs/view/{docId}
     */
    viewBlankForm(docId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}api/blank-docs/view/${docId}`);
    }

    /**
     * Download Blank Form
     * API: /api/blank-docs/download/{docId}
     */
    downloadBlankForm(docId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}api/blank-docs/download/${docId}`, { responseType: 'blob' as 'json' });
    }

    /**
     * Save or Update Blank Form
     * API: /api/blank-docs/save
     * Note: Send DocId=0 or null for create, and actual ID for update.
     * Payload should be FormData.
     */
    saveBlankForm(payload: FormData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}api/blank-docs/save`, payload);
    }
}
