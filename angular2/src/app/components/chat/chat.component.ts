import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service'
import { AuthService } from '../../services/auth.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ValidateService, AuthService]
})
export class ChatComponent implements OnInit {
  username1: string;
  username2: string;
  myusers: [String];
  allusers:[String];
  content: String;
  /*
  const message = {
    content: String,
    username1: String,
    date: Date
  }

  messages: [message];
  */
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

}
