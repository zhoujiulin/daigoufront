import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Colis } from '../domain/colis';

@Injectable({
  providedIn: 'root'
})
export class ColisService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  creationColis(colis: Colis, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/colis/create", colis, {headers: headers});
  }

  getColisStatus(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/colis/getcolisstatus", {headers: headers});
  }

  getColisByStatus(status: any, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/colis/getcolisbystatus/" + status, {headers: headers});
  }

  envoyerColis(colis: Colis, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/colis/envoyercolis", colis, {headers: headers});
  }

  arriverColis(colis: Colis, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/colis/arrivercolis", colis, {headers: headers});
  }
}
