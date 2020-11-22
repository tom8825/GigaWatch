import { Component, OnInit } from '@angular/core';
//import { $ } from 'protractor';
import { OmdbService } from '../omdb.service';
import { FirebaseService } from "../firebase.service";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { ChatService } from '../chat.service';
import { formatDate } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  resultList: any;
  seriesList: any;
  activeMovie: Object;
  activeSeries: Object;
  activeSeason: any;
  activeEpisode: any;
  activeDuration: number;
  popularList: any;

  constructor(private _omdbService: OmdbService, private _firebaseService: FirebaseService, private afs: AngularFirestore, private _chatService: ChatService) {
    this.resultList = [];
    this.seriesList = [];
    //this.activeSeason = [];
  }

  ngOnInit() {
    //this.getSearchResults()
    this.getPopularList();
  }
  getSearchResults() {
    this.activeMovie = null;
    this.activeSeries = null;
    this.activeEpisode = null;
    this.activeSeason = null;
    this.seriesList = [];
    let searchTerm = $("#searchTerm").val();
    this.seriesList = [];
    this._omdbService.getSearchResults(searchTerm).subscribe(data => {
      //console.log(data);
      this.resultList = data["Search"];
    })
  }

  getMovieSeries(id) {
    this.activeMovie = null;
    this.activeSeries = null;
    this.activeEpisode = null;
    this.activeSeason = null;
    this.seriesList = [];
    this._omdbService.getMovieSeries(id).subscribe(data => {
      //console.log(data);
      //this.resultList = data["Search"];
      if (data["Type"] == "series") {
        //this.seriesList = Array(data["totalSeasons"]).fill(0).map((x, i) => i);
        for (let i = 1; i <= data["totalSeasons"]; i++) {
          this.seriesList.push(i);
        }
        this.activeSeries = data;
        this.activeDuration = parseInt(data["Runtime"].toString().split(" ")[0]) * 60;
      } else {
        this.activeMovie = data;
        console.log(data);
        this.activeDuration = parseInt(data["Runtime"].toString().split(" ")[0]) * 60;
        this.setMessageGroup(data["imdbID"]);
        this.addToPopularList(data["imdbID"], data["Title"], data["Year"], data["Poster"]);
      }
    })
    this.resultList = this.resultList.filter(item => item["imdbID"] == id);
  }

  setActiveSeason(int) {
    this.activeEpisode = null;
    this.getSeason(int)
  }

  getSeason(season) {
    this._omdbService.getSeason(season, this.activeSeries["imdbID"]).subscribe(data => {
      this.activeSeason = data["Episodes"];
    })
  }

  setActiveEpisode(episode) {
    this._omdbService.getMovieSeries(episode["imdbID"]).subscribe(data => {
      this.activeEpisode = data;
      console.log(data, this.activeSeries);
      this.setMessageGroup(episode["imdbID"]);
      let title = this.activeSeries;
      this.addToPopularList(episode["imdbID"], this.activeSeries["Title"], this.activeSeries["Year"] + ", " + "S" + this.formatEpisodeSeason(data["Season"]) + "E" + this.formatEpisodeSeason(data["Episode"]), this.activeSeries["Poster"]);
    })
  }

  setMessageGroup(id) {
    //this._firebaseService.getMessageGroup(id);
    this.afs.collection('MessageGroups').doc(id).collection('messages').valueChanges().subscribe(val => {
      console.log(this.activeDuration);
      this._chatService.setMessageGroup(val, id, this.activeDuration);
    });
  }

  getPopularList() {
    //this.messageGroup = this.afs.collection("PopularList").orderBy("LastRequested", "desc").valueChanges().subscribe(val => console.log(val));
    this.afs.collection('PopularList', ref => ref.orderBy('LastRequested', 'desc').limit(3)).valueChanges().subscribe(val => this.popularList = val);;
  }

  addToPopularList(imdbID, title, subtitle, poster) {
    let messageCollections = this.afs.collection('PopularList');
    messageCollections.doc(imdbID).set({ imdbID: imdbID, title: title, subtitle: subtitle, LastRequested: formatDate(new Date(Date.now()), 'dd/MM/yyyy HH:mm:ss', 'en-GB'), poster: poster }, { merge: true });
  }

  formatEpisodeSeason(n) {
    n = parseInt(n);
    return (n < 10) ? ("0" + n) : n;
  }

  homeBtnClick() {
    location.reload();
  }
}
