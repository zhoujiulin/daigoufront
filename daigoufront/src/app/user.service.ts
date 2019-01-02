import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  inscription(user: any): Observable<any> {
    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.post(environment.baseUrl + "/registration", user, {headers: headers});
  }

  login(user: any): Observable<any> {
    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.post(environment.baseUrl + "/login", user, {headers: headers});
  }

  getAllUsers(token: any): Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/users", {headers: headers});
  }

  getUser(token: any): Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/getuser", {headers: headers});
  }
}
