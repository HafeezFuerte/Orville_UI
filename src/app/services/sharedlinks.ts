import { environment } from '../../environments/environment';
export class SharedUrlLinks {
  static _baseUrl: string = environment.apiurl;

  static readonly _sidenav: string = this._baseUrl + 'api/Masters/_getMenu'; 
  // Administration Endpoints 
}