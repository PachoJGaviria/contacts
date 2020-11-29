import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Contact } from './models/Contact';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private http: HttpClient) { }

  getAllContacts(): Promise<Contact[]> {
    return this.http.get<Contact[]>(`${environment.apiUrl}contacts`).toPromise();
  }

  saveContact(contact: Contact): Promise<object> {
    return this.http.post<object>(`${environment.apiUrl}contacts`, contact).toPromise();
  }
}
