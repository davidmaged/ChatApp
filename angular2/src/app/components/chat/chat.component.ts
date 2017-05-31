import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service'
import { AuthService } from '../../services/auth.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ValidateService, AuthService]
})
export class ChatComponent implements OnInit {
  //socket = null;
  username1: String;
  username2: String;
  myusers: [String];
  allusers:[String];
  content: String;
  firstname: String;
  lastname: String;
  dateOfBirth: Date;
  age: Number;
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

    window.scrollTo(0,0)
    this.authService.socket.on('message',(sent) =>
    {

      if(sent.user2 == this.username1)
      {
        this.onChat(sent.user1)
      }
    });
    console.log(this.authService.socket + 'dh el socket');
    this.authService.socket.on('sallusers' , function(){
      console.log('hnak');
      this.ngOnInit();
    });
    this.authService.socket.on('allusers' , function(){
      console.log('hnak');
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.onAllUsers();


  }
  onAllUsers(){
    this.authService.getAllUsers().subscribe(data =>
    {
      if(data.success)
      {

        this.allusers = data.allusers;
        this.username1 = data.user1.username;
        this.firstname = data.user1.firstname;
        this.lastname = data.user1.lastname;
        this.dateOfBirth = data.user1.dateOfBirth;
        if (this.dateOfBirth) {
          this.dateOfBirth = new Date(this.dateOfBirth);
          var today = new Date();
          var thisYear = 0;
          if (today.getMonth() < this.dateOfBirth.getMonth()) {
            thisYear = 1;
          } else if ((today.getMonth() == this.dateOfBirth.getMonth()) && today.getDate() < this.dateOfBirth.getDate()) {
            thisYear = 1;
          }
          this.age = today.getFullYear() - this.dateOfBirth.getFullYear() - thisYear;
        }


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

  onChat(username2)
  {
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
          //
          this.messages = data.newChat.message;
          this.authService.socket.emit('send-message',{user1:this.username1,user2:this.username2});
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
  logout()
  {
    this.authService.logout().subscribe(data =>
    {
      if(data.success)
      {
        this.authService.socket.emit('disconnect');
        this.flashMessage.show(data.message, { cssClass: 'alert-dang', timeout: 4000 });
        this.router.navigate(['/home']);
      }else
      {
        this.flashMessage.show(data.message, { cssClass: 'alert-dang', timeout: 4000 });
      }
    });
  }


}
