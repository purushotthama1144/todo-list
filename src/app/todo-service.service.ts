import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoServiceService {
  baseUrl = "http://192.168.132.225:8000/api/"
  
  constructor(private httpClient: HttpClient) { }

  createListAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-task/create/` , data)
  }

  getParentListAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-task/get-parent-task-list/` , data)
  }

  getChildListAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-task/get-sub-task-list/` , data)
  }

  getsubTaskAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-branch/list/` , data)
  }
  
  getTaskTypeAPI(data:any) {
    return this.httpClient.post(`${this.baseUrl}micro-task/task-type/list/` , data)
  }
}
