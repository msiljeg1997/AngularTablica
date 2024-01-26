import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private salesHeaderUrl = 'http://localhost:5161/api/BCCommunication/api/dohvatiSalesHeadere';
  private salesLineUrl = 'http://localhost:5161/api/BCCommunication/api/dohvatiSalesLines';
  private salesHeaderUrlEDIT = 'http://localhost:5161/api/BCCommunication/api/UpdateSalesHeader';
  private salesHeaderUrlDELETE = 'http://localhost:5161/api/BCCommunication';


  constructor(private http: HttpClient) { }


  getSalesHeader(): Observable<any> {
    var response = this.http.get<JSON>(this.salesHeaderUrl);
    return response;
  

  }

  getSalesLine(): Observable<any> {
    var response = this.http.get<JSON>(this.salesLineUrl);
    return response;
  }

  updateSalesHeader(No: number, salesHeaderWithoutNo: any): Observable<any> {
    return this.http.put(`${this.salesHeaderUrlEDIT}/${No}`, salesHeaderWithoutNo);
  }

  deleteSalesHeader(No: number, DocumentType: string): Observable<any> {
    return this.http.delete(`${this.salesHeaderUrlDELETE}/${No}/${DocumentType}`);
  }

  
  
  }