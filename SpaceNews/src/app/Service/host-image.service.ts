import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HostImageService {
  constructor(private http: HttpClient) { }

  hostImage(dataUrl : File){
    return this.http.post<File>(`https://freeimage.host/api/1/upload`, dataUrl, {headers:{'key':'6d207e02198a847aa98d0a2a901485a5'}})
  }
}
