import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { parseString } from 'xml2js';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }


  async getData() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/xml');
  
    try {
      const res = await firstValueFrom(this.http.get('http://localhost:5161/api/BCCommunication/api/dohvatiSve', { headers, responseType: 'text' }));
      let result: any;
      parseString(res, { explicitArray: false }, (error: Error | null, json: any) => {
        if (error) {
          throw new Error(error.message);
        } else {
          result = json;
        }
      });
      return result.root.SalesHeader;
    } catch (error) {
      console.error('Error occurred:', error);
      throw error;
    }
  }
}