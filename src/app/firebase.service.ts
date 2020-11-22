import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  messageGroupsCollection: AngularFirestoreCollection;
  messageGroups = this.firestore.collection('messageGroups').snapshotChanges();
  public messageGroups$ = new BehaviorSubject<any>(this.messageGroups);


  constructor(private firestore: AngularFirestore) {

  }

  getMessageGroup(id): Observable<any> {
    let msg = this.firestore.collection('MessageGroups').doc('tt0848228').collection('messages').valueChanges();

    this.messageGroups$ = new BehaviorSubject<any>(msg);
    console.log(msg);
    return this.messageGroups$.asObservable();
  }
}
