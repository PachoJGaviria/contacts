import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Contact } from './models/Contact.models';

export interface SignedUrl {
  uploadUrl: string
}

export interface BackendMessage {
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) { }

  getSignedUrl(contactId: string): Promise<SignedUrl> {
    return this.http.post<SignedUrl>(`${environment.apiUrl}contacts/${contactId}/attachment`, null)
      .toPromise();
  }

  getAllContacts(): Promise<Contact[]> {
    return this.http.get<Contact[]>(`${environment.apiUrl}contacts`).toPromise();
  }

  deleteContact(contactId: string): Promise<BackendMessage> {
    return this.http.delete<BackendMessage>(`${environment.apiUrl}contacts/${contactId}`).toPromise();
  }

  saveContact(contact: Contact, newContact: boolean): Promise<BackendMessage> {
    if (newContact) {
      return this.http.post<BackendMessage>(`${environment.apiUrl}contacts`, contact).toPromise();
    }
    const { contactId, ...updateContact } = contact
    return this.http.patch<BackendMessage>(`${environment.apiUrl}contacts/${contactId}`, updateContact).toPromise();
  }
}
