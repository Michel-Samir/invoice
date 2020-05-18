import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Invoice } from '../models/invoice';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  //baseUrl = "assets/invoice.json";
  // we must open json-server first
  baseUrl = "http://localhost:3000/invoice";

  constructor(private http: HttpClient) { }

  // export inputs value to json file
  exportDataToJsonFile(invoice: any) {
    return this.http.post(this.baseUrl, invoice);
  }

  // get inputs value from json file
  importDataFromJsonFile() {
    return this.http.get(this.baseUrl);
  }

}
