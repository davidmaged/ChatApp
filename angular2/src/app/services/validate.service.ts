import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if (user.firstname == undefined || user.lastname == undefined || user.username == undefined || user.password == undefined) {
      return false;
    } else {
      return true;
    }
  }

  validatePassword(password) {
    const pass = /^([a-zA-Z0-9@*#]{8,15})$/;
    return pass.test(password);
  }

}
