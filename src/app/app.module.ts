import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { MessageComponent } from './message/message.component';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { FormsModule } from '@angular/forms';

var firebaseConfig = {
  apiKey: "AIzaSyB3lEDRzHQ9NNZ9p9UNnnFGNX-DjLVnAFo",
  authDomain: "stylefinder-4f8cd.firebaseapp.com",
  databaseURL: "https://stylefinder-4f8cd.firebaseio.com",
  projectId: "stylefinder-4f8cd",
  storageBucket: "stylefinder-4f8cd.appspot.com",
  messagingSenderId: "859504806698",
  appId: "1:859504806698:web:475a6f99f65a7b79706c53"
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatboxComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
