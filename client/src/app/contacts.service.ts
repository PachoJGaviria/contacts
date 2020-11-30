import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  deleteContact(contactId: string): Promise<object> {
    return this.http.delete<object>(`${environment.apiUrl}contacts/${contactId}`).toPromise();
  }

  saveContact(contact: Contact, newContact: boolean): Promise<object> {
    if (newContact) {
      return this.http.post<object>(`${environment.apiUrl}contacts`, contact).toPromise();
    }
    const { contactId, ...updateContact } = contact
    return this.http.patch<object>(`${environment.apiUrl}contacts/${contactId}`, updateContact).toPromise();
  }
}
