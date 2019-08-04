import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Commande } from '../domain/commande';

@Injectable()
export class CommandeService {

  constructor(private http: HttpClient) { 
    this.http = http;
  }

  getCommandeStatus(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/commandes/commandestatus", {headers: headers});
  }

  getTypeCommande(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/commandes/gettypecommande", {headers: headers});
  }

  getCommandeStatusGroup(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/commandes/commandestatusgroup", {headers: headers});
  }

  creationCommande(commande: any, token: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/commandes/creationcommande", commande, {headers: headers});
  }

  getCommandesByStatus(token: any, statusList: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    let params = new HttpParams().set("status", statusList);
    console.log(statusList);
    return this.http.get(environment.baseUrl + "/commandes/status", {headers: headers, params: params});
  }

  getArticleStatus(token: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/commandes/articlestatus", {headers: headers});
  }


  updateCommande(token: any, commande: Commande){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/commandes/updatecommande", commande, {headers: headers});
  }

  supprimerCommande(token: any, commande: Commande){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    let params = new HttpParams().set("idCommande", commande.id + "");
    return this.http.delete(environment.baseUrl + "/commandes/deletecommande", {headers: headers, params: params});
  }
}
