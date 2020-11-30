import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { catchError, last, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {}

  async upload(file: File, url: string): Promise<any> {
    if (file) {
      const req = new HttpRequest('PUT', url, file, {
        reportProgress: true
      });
      return this.http.request(req).toPromise()
    }
    return
  }
}
