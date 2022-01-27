import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://192.168.0.183:8080/";

  constructor(private httpClient: HttpClient) { }

  getAllData(sensorName: string): Observable<any> {
    return this.httpClient.get(this.REST_API_SERVER + 'api/v1/Home/mqtt/values?sensorName='+ sensorName)
  }
}
