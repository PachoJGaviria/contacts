import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/Contact';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  contacts: Contact[] = [];

  constructor(private readonly contactsService: ContactsService) { }

  ngOnInit(): void {
    this.loadContacts()
  }

  async loadContacts(): Promise<void> {
    try {
      this.contacts = await this.contactsService.getAllContacts();
    } catch (error) {
      const message = error?.error || 'Something failed in the backend!! :('
      alert(`${message} - Status: ${error.status}`);
    }
  }

  onView(contact: Contact): void {
  }

  onEdit(contact: Contact): void {

  }

  async onDelete(contact: Contact): Promise<void> {
    try {
      await this.contactsService.deleteContact(contact.contactId);
      this.contacts = this.contacts.filter((oldContact) => oldContact != contact);
      alert(`The contact ${contact.name} was deleted`)
    } catch(error) {
      const message = error?.error || 'Something failed in the backend!! :('
      alert(`${message} - Status: ${error.status}`);
    }

  }
}
