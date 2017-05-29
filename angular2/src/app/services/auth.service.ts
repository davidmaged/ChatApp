import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
//import { localVersion } from '../global';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isDev: boolean;
  rootURL: String;
  constructor(private http: Http) {
    this.isDev = false;
  }

  registerUser(user) {
    let headers = new Headers();
    let ep = this.prepEndpoint('signup');
    console.log("ra7")
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }

  loginUser(user) {
    let headers = new Headers();
    let ep = this.prepEndpoint('login');
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired() && this.user != null;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  prepEndpoint(ep) {
    if (this.isDev) {

      return ep;
    } else {
      return 'http://localhost:8080/' + ep;
      //return 'http://localhost:8080/' + ep;
    }
  }
}
