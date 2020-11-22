import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Observable, of, BehaviorSubject } from "rxjs";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatMessages: Message[] = [];
  userName: string;
  activeMovieSeries: string;
  activeMessageGroup: any[] = [];
  activeDuration: number;
  public activeMessageGroup$ = new BehaviorSubject<any>(this.activeMessageGroup);

  constructor(private firestore: AngularFirestore) {
    this.userName = "";
  }

  getChatMessages() {
    //console.log(this.activeMessageGroup.length);
    this.chatMessages = [];
    for (let i = 0; i < this.activeMessageGroup.length; i++) {
      let message = new Message();
      message.messageContent = this.activeMessageGroup[i]["messageContent"];
      message.messageDate = this.activeMessageGroup[i]["messageDate"];
      message.messageShowTime = this.activeMessageGroup[i]["messageShowTime"];
      message.messageUserName = this.activeMessageGroup[i]["messageUserName"];
      message.messageType = this.activeMessageGroup[i]["messageType"];
      this.chatMessages.push(message);
    }
    //console.log(this.activeMessageGroup.length);
    return this.chatMessages;

  }

  getDuration() {
    return this.activeDuration;
  }

  setMessageGroup(group, imdbID, duration) {
    this.activeMessageGroup = group;
    this.activeMovieSeries = imdbID;
    this.activeDuration = duration;
    //console.log(this.activeMessageGroup);
  }

  getUserName() {
    if (this.userName == "") {
      var adj = ['Aggressive', 'Agreeable', 'Ambitious', 'Brave', 'Calm', 'Delightful', 'Eager', 'Faithful', 'Gentle', 'Happy', 'Jolly', 'Kind', 'Lively', 'Nice', 'Obedient', 'Polite', 'Proud', 'Silly', 'Thankful', 'Victorious', 'Witty', 'Wonderful', 'Zealous'];
      var animals = ['Aardvark', 'Alligator', 'Alpaca', 'Anaconda', 'Ant', 'Antelope', 'Ape', 'Aphid', 'Armadillo', 'Asp', 'Ass', 'Baboon', 'Badger', 'Bald Eagle', 'Cow', 'Coyote', 'Crab', 'Crane', 'Cricket', 'Crocodile', 'Crow', 'Cuckoo', 'Deer', 'Dinosaur', 'Dog', 'Dolphin', 'Donkey', 'Dove', 'Dragonfly', 'Husky', 'Iguana', 'Impala', 'Kangaroo', 'Ladybug', 'Leopard', 'Lion', 'Lizard', 'Llama', 'Lobster', 'Mongoose'];
      this.userName = adj[Math.floor(Math.random() * adj.length)] + animals[Math.floor(Math.random() * animals.length)];

      return this.userName;
    } else {
      return this.userName;
    }

  }

  getMessageGroup(): Observable<any> {
    return this.activeMessageGroup$.asObservable();
  }

  postUserMessage(message) {
    console.log(message.messageDate);
    //this.firestore.collection('MessageGroups').add(this.activeMovieSeries);
    let messageCollections = this.firestore.collection('MessageGroups').doc(this.activeMovieSeries).collection('messages');
    messageCollections.add({ messageDate: message.messageDate, messageContent: message.messageContent, messageUserName: message.messageUserName, messageShowTime: message.messageShowTime, messageType: 1 });
  }
}
