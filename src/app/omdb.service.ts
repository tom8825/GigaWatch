import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  omdbKey: string;
  omdbUrl: string;

  constructor(private _http: HttpClient,) {
    this.omdbKey = environment.OMDB_KEY;
    this.omdbUrl = "http://www.omdbapi.com/?apikey=" + this.omdbKey + "&plot=full";
  }

  getSearchResults(searchTerm) {
    let term = this.omdbUrl + "&s=" + searchTerm;
    return this._http.get(term);
  }

  getMovieSeries(imdbId) {
    let term = this.omdbUrl + "&i=" + imdbId;
    return this._http.get(term);
  }

  getSeason(season, imdbId) {
    let term = this.omdbUrl + "&i=" + imdbId + "&season=" + season;
    return this._http.get(term);
  }
}
