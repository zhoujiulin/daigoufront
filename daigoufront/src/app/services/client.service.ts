import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class ClientService {

  constructor(private http: HttpClient) { 
    this.http = http;
  }

  getClientHasCommandeEnCours(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/clients/getclienthascommandeencours", {headers: headers});
  }
}
