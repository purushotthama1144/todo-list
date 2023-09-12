import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoServiceService {
  baseUrl = "http://192.168.132.225:8000/api/"
  
  constructor(private httpClient: HttpClient) { }

  createListAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-branch/list/` , data)
  }

  getListAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-branch/list/` , data)
  }

  getsubTaskAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-branch/list/` , data)
  }
}
