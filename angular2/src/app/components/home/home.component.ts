import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service'
import { AuthService } from '../../services/auth.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ValidateService, AuthService]
})
export class HomeComponent implements OnInit {
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  username: string;
  password: string;

  constructor(
    private ValidateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) {
    window.scrollTo(0,0);
  }

  ngOnInit() {
  }

  onSignUpSubmit()
  {
    const user = {
      firstname: this.firstname,
      lastname: this.lastname,
      dateOfBirth: this.dateOfBirth,
      username: this.username,
      password: this.password
    }
    console.log(user);
    if(!this.ValidateService.validateRegister(user))
    {
      this.flashMessage.show('Please enter all data to signup', { cssClass: 'alert-dang', timeout: 3000 });
      window.scrollTo(0, 0);
      return false;
    }
    if(!this.ValidateService.validatePassword(user.password))
    {
      this.flashMessage.show('Please enter valid password to signup', { cssClass: 'alert-dang', timeout: 3000 });
      window.scrollTo(0, 0);
      return false;
    }
    console.log("valid");
    this.authService.registerUser(user).subscribe(data =>
    {
      console.log("auth");
      if (data.success) {
        this.flashMessage.show('welcome to ChatApp', { cssClass: 'alert-sucs', timeout: 4000 });
        this.router.navigate(['/chat']);
      } else {
        this.flashMessage.show('Something went wrong , try again later', { cssClass: 'alert-dang', timeout: 4000 });
        this.router.navigate(['/home']);
      }
    },
      err => {
        this.flashMessage.show("Internal Server Error", { cssClass: 'alert-dang', timeout: 3000 });
        this.router.navigate(['/home']);
        return false;
      });

  }
}
