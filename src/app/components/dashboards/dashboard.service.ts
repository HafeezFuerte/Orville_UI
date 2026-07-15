import { Injectable } from "@angular/core";
import { DashboardPortalUrls } from "./dashboard-portal-links";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CommonService } from "../../services/common.service";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

    // ✅ CORRECT (POST with payload)
    getDashboard(data: any) {
        const headers = this.commonService.updateHeaders();

    console.log('Dashboard Payload:', data);
    console.log('Dashboard Headers:', headers);
        return this.http.post(
            DashboardPortalUrls.GET_DASHBOARD,
            data,
            { headers: this.commonService.updateHeaders() }
        );
    }
     

    getLeaveBalances(empCode: string): Observable<any> {
        const payload = {
            typeId: 32,
            filterId: 0,
            filterText: empCode,
            filterText1: "",
            userId: 120,
            companyId: 1
        };
        return this.getDashboard(payload);
    }
 
}


