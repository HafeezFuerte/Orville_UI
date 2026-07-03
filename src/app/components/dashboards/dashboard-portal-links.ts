import { environment } from '../../../environments/environment';

export class DashboardPortalUrls {
    static _baseUrl: string = environment.apiurl;

    // ✅ Get Dashboard (TypeId = 32)
    static readonly GET_DASHBOARD =
        this._baseUrl + 'api/Masters/_getMasters';
 
    static readonly _getEmployeeMasters = this._baseUrl + 'api/Masters/_getMasters';

}
