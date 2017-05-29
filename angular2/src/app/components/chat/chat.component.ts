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
  //time:[Date];
  //messages:[String];
  //sender:[String];
  messages:[{
    content: String,
    time: Date,
    sender: String
  }]
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
    this.authService.getAllUsers().subscribe(data =>
    {
      if(data.success)
      {
        this.allusers = data.allusers;
        this.username1 = data.username1;
      }else {
        console.log(data.allusers);
        this.flashMessage.show('Something went wrong', { cssClass: 'alert-dang', timeout: 4000 });
        //this.router.navigate(['/chat']);
      }
    },
      err => {
        this.flashMessage.show("You are not authorized,Please log in", { cssClass: 'alert-dang', timeout: 3000 });
        this.router.navigate(['/home']);
        return false;
      });
  }

  onMyUsers(){
      this.authService.getChats().subscribe(data =>
      {
        if(data.success)
        {
          this.myusers = data.chats;
        }else {
          console.log(data.chats);
          this.flashMessage.show('Something went wrong', { cssClass: 'alert-dang', timeout: 4000 });
          //this.router.navigate(['/chat']);
        }
      },
        err => {
          this.flashMessage.show("You are not authorized,Please log in", { cssClass: 'alert-dang', timeout: 3000 });
          this.router.navigate(['/home']);
          return false;
        });
  }

  onChat(username2){
    this.username2 = username2;
    this.authService.getChat(this.username1,username2).subscribe(data =>
    {
      if(data.success)
      {
          console.log(data)
          this.messages = data.chat.message;
          //this.time.push(data.chat[i].message.date);
          //this.messages.push(data.chat[i].message.content);
      }else {
        console.log(data.chat);
        this.flashMessage.show('Something went wrong', { cssClass: 'alert-dang', timeout: 4000 });
        //this.router.navigate(['/chat']);
      }
    },
      err => {
        this.flashMessage.show("You are not authorized,Please log in", { cssClass: 'alert-dang', timeout: 3000 });
        this.router.navigate(['/home']);
        return false;
      });
  }
  onSend()
  {
    if(this.content)
    {
      const message = {
        username1: this.username1,
        username2: this.username2,
        content: this.content
      }
      this.content = "";

      this.authService.sendmesg(message).subscribe(data =>
      {
        if(data.success)
        {
          this.messages = data.newChat.message;
        }else {
          console.log(message);
          this.flashMessage.show('Something went wrong', { cssClass: 'alert-dang', timeout: 4000 });
          //this.router.navigate(['/chat']);
        }
      },
        err => {
          this.flashMessage.show("You are not authorized,Please log in", { cssClass: 'alert-dang', timeout: 3000 });
          this.router.navigate(['/home']);
          return false;
        });

      }
  }


}
