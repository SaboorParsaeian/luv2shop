import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { Country } from '../common/country';
import { State } from '../common/state';

interface GetResponseCountry{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class Luv2shopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )    
  }

  getStates(theCountryCode: string): Observable<State[]>{
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }

  getCreditCardMonths(startMonth: number):Observable<number[]>{
    let data: number[]=[];

    for(let theMonth= startMonth; theMonth<=12; theMonth++){
      data.push(theMonth)
    }

    return of(data); //data is ana object now with "of" data is an observable and every where in project we can observe it    
  }

  getCreditCardYear():Observable<number[]>{
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number =  startYear + 10;

    for(let theYear=startYear; theYear<=endYear; theYear++){
      data.push(theYear)
    }

    return of(data);
  }
}


