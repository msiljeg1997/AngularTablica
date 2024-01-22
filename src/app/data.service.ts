import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private salesHeaderUrl = 'http://localhost:5161/api/BCCommunication/api/dohvatiSalesHeadere';
  private salesLineUrl = 'http://localhost:5161/api/BCCommunication/api/dohvatiSalesLines';

  constructor(private http: HttpClient) { }


  getSalesHeader(): Observable<any> {
    var response = this.http.get<JSON>(this.salesHeaderUrl);
    return response;
  

  }

  getSalesLine(): Observable<any> {
    var response = this.http.get<JSON>(this.salesLineUrl);
    return response;
  }
  
  }