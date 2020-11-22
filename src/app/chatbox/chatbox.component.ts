import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../message.model';
import { ChatService } from '../chat.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { FirebaseService } from "../firebase.service";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  userName: string;
  chatDuration: number;
  chatPosition: number;
  play: boolean;
  chatMessages: Message[];
  adminMessages: Message[];
  messageBody: HTMLElement;
  fsService: FirebaseService;
  messageGroup;
  activeMessageGroup: any;
  messages: any;
  sliderValue: number;
  timer: string;

  messageGroupsCollection: AngularFirestoreCollection;
  item$: Observable<any[]>;
  constructor(private _chatService: ChatService, private _firebaseService: FirebaseService, private changeDetection: ChangeDetectorRef, private afs: AngularFirestore) {
    this.userName = _chatService.getUserName();
    this.chatDuration = 10;
    this.chatPosition = 0;
    this.chatMessages = [];
    this.adminMessages = [];


    this.activeMessageGroup = _chatService.getMessageGroup().subscribe(val => console.log(val));
  }

  ngOnInit() {
    $(document).ready(function () {
      $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
      });
    });
  }

  async playChat() {
    if (this.chatPosition <= this.chatDuration && this.play == true) {

      this.getNextMessages();
      this.chatPosition++;
      this.timer = new Date(this.chatPosition * 1000).toISOString().substr(11, 8)
      this.sliderValue = parseFloat(((this.chatPosition / this.chatDuration) * 100).toFixed(2));
      console.log(this.chatPosition, this.chatDuration, this.sliderValue);
      this.changeDetection.markForCheck();
      await this.sleep(1000);
      this.playChat();
    } else {
      console.log("paused");
    }
  }

  setMessagesPlayChat() {
    this.play = true;
    this.chatDuration = this._chatService.getDuration();
    this.messages = this._chatService.getChatMessages();
    this.sendAdminMessage();
    this.playChat();
  }

  getNextMessages = function () {
    //console.log("getNextMessages");
    console.log(this.messages);
    var filteredMessages = this.messages.filter(message => message.messageShowTime == this.chatPosition);
    //console.log(filteredMessages);
    if (filteredMessages.length > 0) {
      for (let i = 0; i < filteredMessages.length; i++) {
        this.chatMessages.push(filteredMessages[i]);
        //this.scrollChat();
        //console.log(filteredMessages[i]);
      }
    }
  }

  sendUserMessage() {
    if ($("#message_input").val() != null && $("#message_input").val() != "") {
      let message = new Message();
      message.messageContent = $("#message_input").val().toString();
      message.messageDate = formatDate(new Date(Date.now()), 'dd/MM/yyyy HH:mm:ss', 'en-GB');
      message.messageShowTime = this.chatPosition;
      message.messageUserName = this._chatService.getUserName();
      message.messageType = 0;
      console.log(message);
      this.chatMessages.push(message);
      this._chatService.postUserMessage(message);
      $("#message_input").val("");

      var height: any = 0;
      $('app-message').each(function (i, value) {
        height += $(this).height();
      });

      height += '';

      $('.msg_card_body').animate({ scrollTop: height });
    }
  }

  sendAdminMessage() {
    let message = new Message();
    message.messageContent = "There are currently " + this.messages.length + " messages in this chat. Voice your opinions, and share your views.";
    message.messageDate = formatDate(new Date(Date.now()), 'dd/MM/yyyy HH:mm:ss', 'en-GB');
    message.messageShowTime = 0;
    message.messageUserName = "Admin";
    message.messageType = 1;
    console.log(message);
    this.adminMessages.push(message);
    $("#message_input").val("");

  }

  scrollChat() {
    this.messageBody = document.getElementById("msg_card_body");
    var list = document.getElementsByTagName("app-message");
    var lastElement = list[list.length];
    lastElement.scrollIntoView();
    //this.messageBody.scrollTo(lastElement.yPosition);
    console.log(lastElement)
  }

  getMessageGroup(id) {
    this.messageGroup = this.afs.collection('MessageGroups').doc(id).collection('messages').valueChanges().subscribe(val => console.log(val));
  }

  getPopulstLidy() {
    //this.messageGroup = this.afs.collection("PopularList").orderBy("LastRequested", "desc").valueChanges().subscribe(val => console.log(val));
    let poplist = this.afs.collection('PopularList', ref => ref.orderBy('LastRequested', 'desc')).valueChanges().subscribe(val => console.log(val));;
  }

  pause() {
    this.play = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  restart() {
    this.pause();
    this.chatPosition = 0;
    this.timer = new Date(this.chatPosition * 1000).toISOString().substr(11, 8)
    this.sliderValue = parseFloat(((this.chatPosition / this.chatDuration) * 100).toFixed(2));
    this.chatMessages = [];
    this.adminMessages = [];
    console.log("restart", this.play);
  }
}
