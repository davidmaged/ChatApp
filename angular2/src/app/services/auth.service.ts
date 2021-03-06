import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import * as io from 'socket.io-client';
//import { localVersion } from '../global';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  username:string;
  isDev: boolean;
  rootURL: String;
  socket= io('http://localhost:8180');
  constructor(private http: Http) {
    this.isDev = false;
    //this.socket =
  }
  sendmesg(message){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let ep = this.prepEndpoint('send');
    return this.http.post(ep, message,{ headers: headers })
      .map(res => res.json());
  }
  getChat(username1,username2) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let ep = this.prepEndpoint('chat/'+ username1 +'/'+ username2);
    return this.http.get(ep, { headers: headers })
      .map(res => res.json());
  }
  getChats()
  {
    this.username = localStorage.getItem('storedUsername');
    console.log(this.username);
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let ep = this.prepEndpoint('chats/'+ this.username);
    return this.http.get(ep, { headers: headers })
      .map(res => res.json());
  }
  getAllUsers() {
    this.username = localStorage.getItem('storedUsername');
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let ep = this.prepEndpoint('allusers/' + this.username);
    return this.http.get(ep, { headers: headers })
      .map(res => res.json());
  }
  registerUser(user) {
    let headers = new Headers();
    let ep = this.prepEndpoint('signup');
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }

  loginUser(user)
  {
    let headers = new Headers();
    let ep = this.prepEndpoint('login');
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }

  storeData(data)
  {
    localStorage.setItem('storedUsername', data.user.username);
    localStorage.setItem('id_token', data.token);
    //localstorage.setItem('socket',data.socket);
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired() && this.user != null;
  }
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout() {
    var username1 = localStorage.getItem('storedUsername');
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    let headers = new Headers();
    let ep = this.prepEndpoint('logout');
    return this.http.post(ep, {username: username1}, { headers: headers })
      .map(res => res.json());
  }

  prepEndpoint(ep) {
    if (this.isDev) {

      return ep;
    } else {
      return 'http://chatapp.ga:8080/' + ep;
      //return 'http://localhost:8080/' + ep;
    }
  }
}
