import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() messageDate: Date;
  @Input() messageContent: string;
  @Input() messageUserName: string;
  @Input() messageShowTime: number;
  @Input() messageType: string;

  date: Date;
  content: string;
  userName: string;
  showTime: number;
  type: string;

  constructor() {
    this.date = this.messageDate;
    this.content = this.messageContent;
    this.userName = this.messageUserName;
    this.showTime = this.messageShowTime;
    this.type = this.messageType;
  }

  ngOnInit() {
    //console.log("message init - " + this.content);
    $(".rounded-circle").css("background-color", this.randomHSL());
    //console.log($(".rounded-circle").css("background-color"));

    this.checkWelcomeMessage();
  }

  randomHSL() {
    return Math.floor(Math.random() * 16777215).toString(16);
    //return `hsla(${~~(360 * Math.random())},70%,70%)`
  }

  checkWelcomeMessage() {
    if (this.messageType == "welcome") {
      console.log("welcome check");
      this.content = "Welcome. Choose a movie or series from the options on the left, then press the play button above.";
      this.date = new Date(formatDate(new Date(Date.now()), 'dd/MM/yyyy HH:mm:ss', 'en-GB'));
    } else {
      console.log("no welcome check", this.messageType)
    }
  }
}
